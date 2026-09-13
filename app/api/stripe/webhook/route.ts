import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET." },
      { status: 500 }
    );
  }

  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  const stripe = getStripeClient();
  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to validate Stripe webhook.";

    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const intakeWebhook = process.env.RSVP_WEBHOOK_URL;
    const metadata = session.metadata ?? {};

    if (intakeWebhook) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 10
      });

      const response = await fetch(intakeWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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
        return NextResponse.json(
          { error: "Unable to forward RSVP confirmation to the intake endpoint." },
          { status: 502 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
