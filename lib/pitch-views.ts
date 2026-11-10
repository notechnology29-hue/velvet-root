import "server-only";

import type { PitchAudience } from "@/lib/pitch-access";
import { createSupabaseServerClient } from "@/lib/supabase";

/**
 * Notes that a pitch link was opened: audience and time only, no IP or visitor details.
 * Never blocks or breaks the page if the database is unavailable.
 */
export async function recordPitchView(audience: PitchAudience) {
  try {
    const supabase = createSupabaseServerClient();
    const { error } = (await supabase?.from("pitch_views").insert({ audience })) ?? {};

    if (error) {
      console.error("Pitch view could not be recorded:", error.message);
    }
  } catch (error) {
    console.error("Pitch view could not be recorded:", error);
  }
}
