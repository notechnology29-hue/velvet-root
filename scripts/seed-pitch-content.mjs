// Uploads the pitch page copy from private/pitch/*.json to the pitch_content table.
// The private/ folder is gitignored: the copy stays on this machine and in the database only.
//
//   node --env-file=.env.local scripts/seed-pitch-content.mjs
//
import { readFile } from "node:fs/promises";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

for (const audience of ["sponsors", "dispensary"]) {
  const file = new URL(`../private/pitch/${audience}.json`, import.meta.url);
  const content = JSON.parse(await readFile(file, "utf8"));

  if (!Array.isArray(content.sections) || content.sections.length === 0) {
    throw new Error(`${audience}.json has no sections.`);
  }

  const { error } = await supabase
    .from("pitch_content")
    .upsert({ audience, content }, { onConflict: "audience" });

  if (error) {
    throw new Error(`Unable to save ${audience} content: ${error.message}`);
  }

  console.log(`Saved ${audience}: ${content.sections.length} sections.`);
}
