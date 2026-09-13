import { NextResponse } from "next/server";

import {
  createSupabaseAnonClient,
  createSupabaseServerClient
} from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing bearer token." },
      { status: 401 }
    );
  }

  const accessToken = authorization.slice("Bearer ".length).trim();
  const authClient = createSupabaseAnonClient();
  const serviceClient = createSupabaseServerClient();

  if (!authClient || !serviceClient) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 500 }
    );
  }

  const {
    data: { user },
    error: userError
  } = await authClient.auth.getUser(accessToken);

  if (userError || !user?.email) {
    return NextResponse.json(
      { error: userError?.message ?? "Unable to resolve the signed-in user." },
      { status: 401 }
    );
  }

  const normalizedEmail = user.email.toLowerCase();
  const { data: existingProfile, error: existingProfileError } = await serviceClient
    .from("profiles")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existingProfileError) {
    return NextResponse.json(
      { error: existingProfileError.message },
      { status: 500 }
    );
  }

  if (!existingProfile) {
    return NextResponse.json(
      { error: "No membership profile exists for this email." },
      { status: 404 }
    );
  }

  if (existingProfile.user_id && existingProfile.user_id !== user.id) {
    return NextResponse.json(
      { error: "This profile is already linked to a different account." },
      { status: 409 }
    );
  }

  if (!existingProfile.user_id) {
    const { error: updateError } = await serviceClient
      .from("profiles")
      .update({ user_id: user.id })
      .eq("id", existingProfile.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }
  }

  const { data: linkedProfile, error: linkedProfileError } = await serviceClient
    .from("profiles")
    .select("*")
    .eq("id", existingProfile.id)
    .maybeSingle();

  if (linkedProfileError) {
    return NextResponse.json(
      { error: linkedProfileError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ profile: linkedProfile });
}
