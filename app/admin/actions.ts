"use server";

import { allowRequest } from "@/lib/rate-limit";
import { endSession, hasSession, isLoginConfigured, startSession, verifyPasscode } from "@/lib/session";
import {
  createSupabaseServerClient,
  type AppProfile,
  type ProfileStatus
} from "@/lib/supabase";

const PROFILE_STATUSES: ProfileStatus[] = ["pending", "approved", "rejected", "active"];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function loginWithPasscode(passcode: string) {
  if (!isLoginConfigured("admin")) {
    return { error: "Admin passcode login is not configured." };
  }

  if (!allowRequest("admin-login", 8, 15 * 60 * 1000)) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }

  if (typeof passcode !== "string" || !verifyPasscode("admin", passcode)) {
    return { error: "Invalid admin passcode." };
  }

  startSession("admin");
  return { success: true };
}

export async function checkAdminSession() {
  return hasSession("admin");
}

export async function adminSignOut() {
  endSession("admin");
  return { success: true };
}

export async function getAdminDashboardData() {
  if (!hasSession("admin")) {
    return { error: "Unauthorized" };
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase server client is not configured." };
  }

  const [{ data: profileRows, error: profilesError }, { data: settingRow, error: settingsError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .neq("role", "admin")
        .order("created_at", { ascending: false }),
      supabase
        .from("settings")
        .select("value")
        .eq("key", "hero_video_url")
        .maybeSingle()
    ]);

  if (profilesError) {
    return { error: profilesError.message };
  }

  if (settingsError) {
    return { error: settingsError.message };
  }

  return {
    profiles: (profileRows as AppProfile[]) ?? [],
    heroVideoUrl: settingRow?.value ?? ""
  };
}

export async function adminUpdateStatuses(ids: string[], nextStatus: ProfileStatus) {
  if (!hasSession("admin")) {
    return { error: "Unauthorized" };
  }

  if (!Array.isArray(ids) || !ids.length) {
    return { error: "No member profiles selected." };
  }

  if (ids.length > 500 || !ids.every((id) => typeof id === "string" && UUID_PATTERN.test(id))) {
    return { error: "Invalid profile selection." };
  }

  if (!PROFILE_STATUSES.includes(nextStatus)) {
    return { error: "Invalid status." };
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase server client is not configured." };
  }

  // Admin rows are never changed from the dashboard.
  const { error } = await supabase
    .from("profiles")
    .update({ status: nextStatus })
    .in("id", ids)
    .neq("role", "admin");

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function adminSaveSettings(heroVideoUrl: string) {
  if (!hasSession("admin")) {
    return { error: "Unauthorized" };
  }

  const value = typeof heroVideoUrl === "string" ? heroVideoUrl.trim() : "";

  if (value.length > 2000 || (value && !value.startsWith("https://") && !value.startsWith("/"))) {
    return { error: "Use an https:// address or a path that starts with /." };
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase server client is not configured." };
  }

  const { error } = await supabase.from("settings").upsert(
    {
      key: "hero_video_url",
      value
    },
    { onConflict: "key" }
  );

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
