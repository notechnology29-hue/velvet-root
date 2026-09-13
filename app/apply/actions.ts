"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase";

const requiredFields = [
  "name",
  "dob",
  "email",
  "phone",
  "social",
  "draw",
  "community",
  "age",
  "alcoholFree",
  "rideshare"
] as const;

export async function submitMembershipApplication(formData: FormData) {
  const missingField = requiredFields.find((field) => {
    const value = formData.get(field);
    return typeof value !== "string" || value.trim().length === 0;
  });

  if (missingField) {
    redirect("/apply?status=missing");
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const socialHandle = String(formData.get("social") ?? "").trim();
  const payload = {
    submittedAt: new Date().toISOString(),
    name,
    dob: String(formData.get("dob") ?? "").trim(),
    email,
    phone,
    social: socialHandle,
    draw: String(formData.get("draw") ?? "").trim(),
    community: String(formData.get("community") ?? "").trim(),
    certifications: {
      age: formData.get("age") === "on",
      alcoholFree: formData.get("alcoholFree") === "on",
      rideshare: formData.get("rideshare") === "on"
    }
  };

  const supabase = createSupabaseServerClient();

  if (supabase) {
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        email,
        name,
        phone,
        social_handle: socialHandle,
        vetting_answers: {
          dob: payload.dob,
          draw: payload.draw,
          community: payload.community,
          certifications: payload.certifications
        },
        status: "pending",
        role: "member"
      },
      {
        onConflict: "email"
      }
    );

    if (profileError) {
      console.error("Unable to save membership application to Supabase:", profileError.message);
    }
  }

  const webhookUrl = process.env.MEMBERSHIP_WEBHOOK_URL;

  if (!webhookUrl) {
    redirect("/apply?status=demo");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to deliver membership application to the configured intake endpoint.");
  }

  redirect("/apply?status=success");
}
