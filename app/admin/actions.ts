"use server";

import { cookies } from "next/headers";

import {
  createSupabaseServerClient,
  type AppProfile,
  type ProfileStatus
} from "@/lib/supabase";

const ADMIN_COOKIE_NAME = "vr_admin_session";
const DEFAULT_PASSCODE = "velvet2026";

function getExpectedPasscode() {
  return process.env.ADMIN_PASSCODE || DEFAULT_PASSCODE;
}

export async function loginWithPasscode(passcode: string) {
  const expected = getExpectedPasscode();

  if (!passcode || passcode.trim() !== expected) {
    return { error: "Invalid admin passcode." };
  }

  const cookieStore = cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/"
  });

  return { success: true };
}

export async function checkAdminSession() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  return sessionCookie?.value === "authenticated";
}

export async function adminSignOut() {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return { success: true };
}

export async function getAdminDashboardData() {
  const isAuthorized = await checkAdminSession();

  if (!isAuthorized) {
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
  const isAuthorized = await checkAdminSession();

  if (!isAuthorized) {
    return { error: "Unauthorized" };
  }

  if (!ids.length) {
    return { error: "No member profiles selected." };
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase server client is not configured." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ status: nextStatus })
    .in("id", ids);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function adminSaveSettings(heroVideoUrl: string) {
  const isAuthorized = await checkAdminSession();

  if (!isAuthorized) {
    return { error: "Unauthorized" };
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase server client is not configured." };
  }

  const { error } = await supabase.from("settings").upsert(
    {
      key: "hero_video_url",
      value: heroVideoUrl.trim()
    },
    { onConflict: "key" }
  );

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
