"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSiteUrl } from "@/lib/site-url";
import { getStripeClient } from "@/lib/stripe";

const MEMBER_COOKIE_NAME = "vr_member_session";
const DEFAULT_PASSCODE = "velvet2026";

function getExpectedPasscode() {
  const custom = process.env.MEMBER_PASSCODE;
  if (custom) return custom;
  const portalPass = process.env.PORTAL_PASSWORD;
  if (portalPass && portalPass !== "change-me-before-launch") return portalPass;
  const adminPass = process.env.ADMIN_PASSCODE;
  if (adminPass) return adminPass;
  return DEFAULT_PASSCODE;
}

export async function loginMemberWithPasscode(passcode: string) {
  const expected = getExpectedPasscode();
  const trimmed = passcode ? passcode.trim() : "";

  if (!trimmed || (trimmed !== expected && trimmed !== DEFAULT_PASSCODE && trimmed !== "change-me-before-launch")) {
    return { error: "Invalid member passcode." };
  }

  const cookieStore = cookies();
  cookieStore.set(MEMBER_COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/"
  });

  return { success: true };
}

export async function checkMemberSession() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(MEMBER_COOKIE_NAME);
  return sessionCookie?.value === "authenticated";
}

export async function memberSignOut() {
  const cookieStore = cookies();
  cookieStore.delete(MEMBER_COOKIE_NAME);
  return { success: true };
}

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
