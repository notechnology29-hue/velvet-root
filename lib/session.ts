import "server-only";

import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export type SessionRole = "admin" | "member";

const ROLE_CONFIG: Record<SessionRole, { cookie: string; env: string }> = {
  admin: { cookie: "vr_admin_session", env: "ADMIN_PASSCODE" },
  member: { cookie: "vr_member_session", env: "PORTAL_PASSWORD" }
};

const SESSION_SECONDS = 60 * 60 * 24 * 7;

// Values that ship in example files. They never count as a real passcode.
const PLACEHOLDER_PASSCODES = new Set([
  "change-me-before-launch",
  "generate-a-long-random-value",
  "velvet2026"
]);

/** The configured passcode for a role, or null when it is unset or still a placeholder. */
function getPasscode(role: SessionRole): string | null {
  const value = process.env[ROLE_CONFIG[role].env]?.trim();

  if (!value || PLACEHOLDER_PASSCODES.has(value)) {
    return null;
  }

  return value;
}

/** Constant-time string comparison that does not leak length. */
function safeEqual(a: string, b: string) {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

// The cookie is signed with the passcode itself, so it cannot be forged without
// knowing the passcode, and changing the passcode signs everyone out.
function sign(role: SessionRole, expires: number, passcode: string) {
  const key = `${process.env.SESSION_SECRET ?? ""}:${passcode}`;
  return createHmac("sha256", key).update(`${role}.${expires}`).digest("base64url");
}

export function isLoginConfigured(role: SessionRole) {
  return getPasscode(role) !== null;
}

export function verifyPasscode(role: SessionRole, input: string) {
  const expected = getPasscode(role);
  const candidate = input.trim();

  if (!expected || !candidate) {
    return false;
  }

  return safeEqual(candidate, expected);
}

export function startSession(role: SessionRole) {
  const passcode = getPasscode(role);

  if (!passcode) {
    return false;
  }

  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;

  cookies().set(ROLE_CONFIG[role].cookie, `${expires}.${sign(role, expires, passcode)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_SECONDS,
    path: "/"
  });

  return true;
}

export function hasSession(role: SessionRole) {
  const passcode = getPasscode(role);
  const value = cookies().get(ROLE_CONFIG[role].cookie)?.value;

  if (!passcode || !value) {
    return false;
  }

  const separator = value.indexOf(".");

  if (separator < 1) {
    return false;
  }

  const expires = Number(value.slice(0, separator));
  const signature = value.slice(separator + 1);

  if (!Number.isInteger(expires) || expires < Math.floor(Date.now() / 1000)) {
    return false;
  }

  return safeEqual(signature, sign(role, expires, passcode));
}

export function endSession(role: SessionRole) {
  cookies().delete(ROLE_CONFIG[role].cookie);
}
