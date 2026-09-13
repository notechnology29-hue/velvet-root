import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export type ProfileStatus = "pending" | "approved" | "rejected" | "active";
export type ProfileRole = "member" | "admin";

export type AppProfile = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  social_handle: string | null;
  vetting_answers: Record<string, unknown>;
  status: ProfileStatus;
  role: ProfileRole;
  created_at: string;
  updated_at: string;
};

export function createSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}

export function createSupabaseAnonClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function createSupabaseServerClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export async function syncAuthenticatedProfile(
  session: Pick<Session, "access_token"> | null
) {
  if (!session?.access_token) {
    return null;
  }

  const response = await fetch("/api/supabase/link-profile", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(payload?.error ?? "Unable to synchronize the signed-in profile.");
  }

  const payload = (await response.json()) as {
    profile: AppProfile | null;
  };

  return payload.profile;
}

export async function getHeroVideoUrl() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "hero_video_url")
      .maybeSingle();

    if (error) {
      console.error("Hero video settings lookup failed:", error.message);
      return null;
    }

    return data?.value ?? null;
  } catch (error) {
    console.error("Hero video settings lookup failed:", error);
    return null;
  }
}
