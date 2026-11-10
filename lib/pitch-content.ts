import "server-only";

import type { CalculatorSettings } from "@/components/pitch/RoiCalculator";
import type { PitchAudience } from "@/lib/pitch-access";
import { createSupabaseServerClient } from "@/lib/supabase";

// Shape of one row's `content` in the pitch_content table.
// The copy itself lives only in that table (see scripts/seed-pitch-content.mjs).

type PhotoCardItem = {
  image: string;
  alt?: string;
  heading: string;
  text?: string;
  kicker?: string;
  highlight?: boolean;
};

export type PitchBlock =
  | { type: "note"; text: string }
  | { type: "intro"; text: string }
  | { type: "photoCards"; cols?: 2 | 3 | 4; ordered?: boolean; items: PhotoCardItem[] }
  | { type: "textCards"; heading?: string; cols?: 2 | 3 | 4; items: { heading: string; text?: string }[] }
  | { type: "bulletCards"; items: { heading: string; bullets: string[] }[] }
  | { type: "numbers"; items: { value: string; text: string }[] }
  | { type: "timeline"; items: { kicker?: string; heading: string; text: string }[] }
  | { type: "steps"; items: string[] }
  | {
      type: "offers";
      items: { kicker: string; heading: string; price: string; text: string; highlight?: boolean }[];
    }
  | { type: "table"; heading?: string; caption: string; wide?: boolean; head: string[]; rows: string[][] }
  | { type: "calculator"; settings: CalculatorSettings }
  | { type: "report"; kicker: string; fields: string[]; text: string }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "feature"; text: string; image: string };

export type PitchSection = { flag?: string } & (
  | { type: "hero"; image: string; label: string; title: string; subtitle: string; line: string; small: string }
  | {
      type: "contact";
      image: string;
      label?: string;
      title: string;
      text: string;
      name: string;
      role: string;
      email: string;
      phone?: string;
    }
  | { type: "section"; label?: string; title?: string; band?: boolean; blocks: PitchBlock[] }
);

export type PitchContent = { sections: PitchSection[] };

/** Loads a pitch page's content. Returns null when it is missing or unreadable. */
export async function getPitchContent(audience: PitchAudience): Promise<PitchContent | null> {
  // Local preview: PITCH_CONTENT_SOURCE=local reads the gitignored private/pitch files
  // instead of the database, to check copy edits before uploading them.
  if (process.env.PITCH_CONTENT_SOURCE === "local") {
    try {
      const { readFile } = await import("node:fs/promises");
      const file = `${process.cwd()}/private/pitch/${audience}.json`;
      return JSON.parse(await readFile(file, "utf8")) as PitchContent;
    } catch {
      return null;
    }
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("pitch_content")
    .select("content")
    .eq("audience", audience)
    .maybeSingle();

  if (error) {
    console.error("Pitch content could not be loaded:", error.message);
    return null;
  }

  const content = data?.content as PitchContent | undefined;

  if (!content || !Array.isArray(content.sections) || content.sections.length === 0) {
    return null;
  }

  return content;
}
