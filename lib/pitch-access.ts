import "server-only";
import { timingSafeEqual } from "crypto";

export type PitchAudience = "sponsors" | "dispensary";

const ENV_KEYS: Record<PitchAudience, string> = {
  sponsors: "PITCH_SPONSORS_TOKEN",
  dispensary: "PITCH_DISPENSARY_TOKEN"
};

/** True only when the URL token matches the secret for this audience (timing-safe). */
export function isValidPitchToken(audience: PitchAudience, token: string | undefined): boolean {
  const expected = process.env[ENV_KEYS[audience]];
  if (!expected || expected.length < 32 || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
