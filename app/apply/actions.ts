"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase";

const requiredFields = [
  "name",
  "dob",
  "email",
  "phone",
  "draw",
  "community",
  "allergies",
  "cert_age",
  "cert_byoc",
  "cert_alcohol_free",
  "cert_no_drive",
  "cert_confidentiality"
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
  const dob = String(formData.get("dob") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const socialHandle = String(formData.get("social") ?? "").trim();
  const draw = String(formData.get("draw") ?? "").trim();
  const community = String(formData.get("community") ?? "").trim();
  const allergies = String(formData.get("allergies") ?? "").trim();

  const certifications = {
    age: formData.get("cert_age") === "on",
    byoc: formData.get("cert_byoc") === "on",
    alcoholFree: formData.get("cert_alcohol_free") === "on",
    noDrive: formData.get("cert_no_drive") === "on",
    confidentiality: formData.get("cert_confidentiality") === "on"
  };

  const payload = {
    submittedAt: new Date().toISOString(),
    name,
    dob,
    email,
    phone,
    social: socialHandle,
    draw,
    community,
    allergies,
    certifications
  };

  const supabase = createSupabaseServerClient();

  if (supabase) {
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        email,
        name,
        phone,
        social_handle: socialHandle || null,
        vetting_answers: {
          dob,
          draw,
          community,
          allergies,
          certifications
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

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        cache: "no-store"
      });
    } catch (err) {
      console.error("Webhook notification error:", err);
    }
  }

  redirect("/apply?status=success");
}
