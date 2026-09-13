import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminName = process.env.ADMIN_NAME ?? "Velvet Root Admin";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
  );
}

if (!adminEmail) {
  throw new Error("Missing ADMIN_EMAIL.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const { error } = await supabase.from("profiles").upsert(
  {
    name: adminName,
    email: adminEmail.trim().toLowerCase(),
    status: "active",
    role: "admin",
    social_handle: "@thevelvetroot",
    vetting_answers: {
      seeded: true,
      source: "scripts/seed-admin.mjs"
    }
  },
  {
    onConflict: "email"
  }
);

if (error) {
  throw new Error(`Unable to seed admin profile: ${error.message}`);
}

console.log(`Seeded admin profile for ${adminEmail.trim().toLowerCase()}.`);
