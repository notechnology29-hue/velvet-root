"use server";

import { redirect } from "next/navigation";

import { allowRequest } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function field(formData: FormData, name: string, maxLength: number) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function joinGuestList(formData: FormData) {
  // Honeypot: real visitors never see or fill this field.
  if (field(formData, "company", 200)) {
    redirect("/apply?status=success");
  }

  if (!allowRequest("guest-list", 5, 10 * 60 * 1000)) {
    redirect("/apply?status=slow");
  }

  const name = field(formData, "name", 120);
  const email = field(formData, "email", 200).toLowerCase();
  const phone = field(formData, "phone", 40);
  const city = field(formData, "city", 120);
  const heard = field(formData, "heard", 300);
  const isAdult = formData.get("cert_age") === "on";

  if (name.length < 2 || !EMAIL_PATTERN.test(email) || !city || !isAdult) {
    redirect("/apply?status=missing");
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    console.error("Guest list sign-up could not be saved: Supabase is not configured.");
    redirect("/apply?status=error");
  }

  // Insert only. An existing profile with this email is left untouched, so a
  // sign-up can never overwrite or downgrade a profile that already exists.
  const { error } = await supabase.from("profiles").upsert(
    {
      email,
      name,
      phone: phone || null,
      vetting_answers: {
        source: "guest-list",
        city,
        heard,
        age_confirmed: true
      },
      status: "pending",
      role: "member"
    },
    { onConflict: "email", ignoreDuplicates: true }
  );

  if (error) {
    console.error("Guest list sign-up could not be saved:", error.message);
    redirect("/apply?status=error");
  }

  const webhookUrl = process.env.MEMBERSHIP_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "guest-list",
          submittedAt: new Date().toISOString(),
          name,
          email,
          phone,
          city,
          heard
        }),
        cache: "no-store"
      });
    } catch (err) {
      console.error("Guest list webhook error:", err);
    }
  }

  redirect("/apply?status=success");
}
