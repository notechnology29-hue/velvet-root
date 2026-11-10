"use server";

import { allowRequest } from "@/lib/rate-limit";
import { endSession, isLoginConfigured, startSession, verifyPasscode } from "@/lib/session";

export async function loginMemberWithPasscode(passcode: string) {
  if (!isLoginConfigured("member")) {
    return { error: "Portal access is not open yet." };
  }

  if (!allowRequest("portal-login", 8, 15 * 60 * 1000)) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  if (typeof passcode !== "string" || !verifyPasscode("member", passcode)) {
    return { error: "That passcode is not right." };
  }

  startSession("member");
  return { success: true };
}

export async function memberSignOut() {
  endSession("member");
  return { success: true };
}
