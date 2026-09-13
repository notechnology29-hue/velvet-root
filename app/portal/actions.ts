"use server";

import { redirect } from "next/navigation";

import { getSiteUrl } from "@/lib/site-url";
import { getStripeClient } from "@/lib/stripe";

export async function beginRsvpCheckout(formData: FormData) {
  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const phone = formData.get("phone");

  if (
    typeof fullName !== "string" ||
    fullName.trim().length === 0 ||
    typeof email !== "string" ||
    email.trim().length === 0 ||
    typeof phone !== "string" ||
    phone.trim().length === 0
  ) {
    redirect("/portal?checkout=missing");
  }

  const stripe = getStripeClient();
  const siteUrl = getSiteUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${siteUrl}/portal?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/portal?checkout=cancel`,
    customer_email: email,
    phone_number_collection: {
      enabled: true
    },
    billing_address_collection: "auto",
    submit_type: "book",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: 25000,
          product_data: {
            name: "Smoke & Blush October Assessment",
            description: "Single-seat RSVP for The Velvet Root member portal event."
          }
        }
      }
    ],
    metadata: {
      eventName: "Smoke & Blush October Assessment",
      fullName,
      phone
    },
    custom_text: {
      submit: {
        message:
          "Your seat will be confirmed immediately after successful payment."
      }
    }
  });

  if (!session.url) {
    throw new Error("Stripe Checkout did not return a redirect URL.");
  }

  redirect(session.url);
}
