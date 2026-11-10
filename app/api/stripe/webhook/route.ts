import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getStripeClient } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UNIQUE_VIOLATION = "23505";

/**
 * Records the event id so a redelivered event is handled only once.
 * Returns false when this event was already processed.
 */
async function claimEvent(eventId: string, eventType: string) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return true;
  }

  const { error } = await supabase.from("stripe_events").insert({ id: eventId, type: eventType });

  if (!error) {
    return true;
  }

  if (error.code === UNIQUE_VIOLATION) {
    return false;
  }

  // Table missing or database unreachable: process the event rather than drop a payment.
  console.error("Stripe event could not be recorded:", error.message);
  return true;
}

async function releaseEvent(eventId: string) {
  const supabase = createSupabaseServerClient();
  await supabase?.from("stripe_events").delete().eq("id", eventId);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 500 });
  }

  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const stripe = getStripeClient();
  // The signature is checked against the raw, unparsed body.
  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  if (!(await claimEvent(event.id, event.type))) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  const intakeWebhook = process.env.RSVP_WEBHOOK_URL;

  if (intakeWebhook) {
    const metadata = session.metadata ?? {};

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });

      const response = await fetch(intakeWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: event.type,
          eventId: event.id,
          created: event.created,
          checkoutSessionId: session.id,
          amountTotal: session.amount_total,
          currency: session.currency,
          customerEmail: session.customer_details?.email ?? session.customer_email,
          customerName: session.customer_details?.name ?? metadata.fullName,
          customerPhone: session.customer_details?.phone ?? metadata.phone,
          eventName: metadata.eventName,
          lineItems: lineItems.data.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            amountSubtotal: item.amount_subtotal,
            amountTotal: item.amount_total
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Intake endpoint answered ${response.status}`);
      }
    } catch (error) {
      console.error("Unable to forward checkout confirmation:", error);
      // Let Stripe retry: forget the claim so the retry is not treated as a duplicate.
      await releaseEvent(event.id);
      return NextResponse.json({ error: "Unable to forward confirmation." }, { status: 502 });
    }
  }

  return NextResponse.json({ received: true });
}
