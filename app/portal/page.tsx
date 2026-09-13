"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { CheckoutSubmitButton } from "@/components/checkout-submit-button";
import { MemberMenuTabs } from "@/components/member-menu-tabs";
import { Reveal } from "@/components/reveal";
import {
  createSupabaseBrowserClient,
  type AppProfile,
  syncAuthenticatedProfile
} from "@/lib/supabase";

import { beginRsvpCheckout } from "./actions";

type PortalPageProps = {
  searchParams?: {
    checkout?: string;
    session_id?: string;
  };
};

function CheckoutBanner({
  checkout,
  sessionId
}: {
  checkout?: string;
  sessionId?: string;
}) {
  if (checkout === "success") {
    return (
      <div className="surface-card border-botanical/40 bg-botanical/10 p-4 text-sm text-cream/85">
        Payment received. Your RSVP is confirmed through Stripe
        {sessionId ? ` (${sessionId}).` : "."}
      </div>
    );
  }

  if (checkout === "cancel") {
    return (
      <div className="surface-card border-rose/40 bg-rose/10 p-4 text-sm text-cream/85">
        Checkout was canceled. Your seat is not reserved until payment is completed.
      </div>
    );
  }

  if (checkout === "missing") {
    return (
      <div className="surface-card border-rose/40 bg-rose/10 p-4 text-sm text-cream/85">
        Please complete your RSVP details before continuing to payment.
      </div>
    );
  }

  return null;
}

export default function PortalPage({ searchParams }: PortalPageProps) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;

    const hydrateAuthState = async (nextSession: Session | null) => {
      if (!active) {
        return;
      }

      setSession(nextSession);

      if (!nextSession) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const syncedProfile = await syncAuthenticatedProfile(nextSession);

        if (!active) {
          return;
        }

        setProfile(syncedProfile);
      } catch (error) {
        if (!active) {
          return;
        }

        setProfile(null);
        setMessage(error instanceof Error ? error.message : "Unable to load your profile.");
      }

      setLoading(false);
    };

    const loadSession = async () => {
      const {
        data: { session: currentSession }
      } = await supabase.auth.getSession();

      await hydrateAuthState(currentSession);
    };

    loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      await hydrateAuthState(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const result = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/portal`
      }
    });

    setSubmitting(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage("Magic link sent. Check your inbox to access the portal.");
  }

  async function handleSignOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setMessage(null);
  }

  if (!supabase) {
    return (
      <div className="section-shell flex min-h-[100dvh] items-center justify-center">
        <div className="surface-card w-full max-w-md p-6 text-center">
          <p className="eyebrow">Member Portal</p>
          <h1 className="mt-4 text-3xl">Supabase is not configured</h1>
          <p className="mt-4 text-base text-cream/80">
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to continue.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="section-shell flex min-h-[100dvh] items-center justify-center">
        <div className="surface-card w-full max-w-md p-6 text-center">
          <p className="eyebrow">Member Portal</p>
          <h1 className="mt-4 text-3xl">Loading…</h1>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="section-shell flex min-h-[100dvh] items-center justify-center">
        <div className="surface-card w-full max-w-md p-6 sm:p-8">
          <p className="eyebrow">Member Portal</p>
          <h1 className="mt-4 text-3xl md:text-4xl">Protected access</h1>
          <p className="mt-4 text-base text-cream/80">
            Enter your email to receive a secure magic link with portal access.
          </p>

          {message ? (
            <div className="mt-6 rounded-2xl border border-botanical/35 bg-botanical/10 px-4 py-3 text-sm text-cream/85">
              {message}
            </div>
          ) : null}

          <form onSubmit={handleMagicLink} className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm uppercase tracking-[0.24em] text-cream/70">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
              />
            </label>

            <button type="submit" disabled={submitting} className="button-solid w-full min-h-[52px] rounded-2xl disabled:opacity-70">
              {submitting ? "Sending link…" : "Send Magic Link"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!profile || profile.status !== "active") {
    return (
      <div className="section-shell flex min-h-[100dvh] items-center justify-center">
        <div className="surface-card w-full max-w-md p-6 sm:p-8">
          <p className="eyebrow">Member Portal</p>
          <h1 className="mt-4 text-3xl md:text-4xl">Access pending</h1>
          <p className="mt-4 text-base text-cream/80">
            Your membership status is not active yet. Check back after approval.
          </p>
          <button onClick={handleSignOut} className="button-outline mt-6 w-full min-h-[52px] rounded-2xl">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="section-shell">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Member Portal</p>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
              Event access and private service notes.
            </h1>
            <p className="mt-5 text-base md:text-lg">
              Review the current assessment event, compare the menu tracks, and
              complete your pre-arrival pairing steps before check-in.
            </p>
          </Reveal>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/12 px-4 py-2 text-sm uppercase tracking-[0.24em] text-cream/70 transition hover:text-cream focus:outline-none focus:ring-2 focus:ring-rose/60"
          >
            Sign out
          </button>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="surface-card p-6 md:p-8">
            <p className="eyebrow">RSVP</p>
            <h2 className="mt-4 text-3xl md:text-4xl">
              Secure Your Seat: Smoke &amp; Blush October Assessment ($250)
            </h2>
            <p className="mt-5 max-w-3xl text-base">
              Reserve your place for the next private assessment evening. Seating is
              intentionally limited to preserve pacing, chef access, and guided
              service flow.
            </p>

            <div className="mt-6">
              <CheckoutBanner
                checkout={searchParams?.checkout}
                sessionId={searchParams?.session_id}
              />
            </div>

            <form action={beginRsvpCheckout} className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm uppercase tracking-[0.24em] text-cream/70">
                  Full Name
                </span>
                <input
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm uppercase tracking-[0.24em] text-cream/70">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm uppercase tracking-[0.24em] text-cream/70">
                  Phone
                </span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
                />
              </label>

              <CheckoutSubmitButton />
            </form>
          </Reveal>

          <Reveal className="surface-card overflow-hidden" delay={0.08}>
            <Image
              src="/brand/hero-poster.svg"
              alt="The Velvet Root branded event artwork"
              width={1600}
              height={900}
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="section-shell pt-0">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">The Menus</p>
          <h2 className="mt-3 text-2xl md:text-4xl">Compare your service track</h2>
        </Reveal>
        <div className="mt-8">
          <MemberMenuTabs />
        </div>
      </section>

      <section className="section-shell pt-0">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">The Sommelier Guide</p>
          <h2 className="mt-3 text-2xl md:text-4xl">Pre-arrival pairing checklist</h2>
        </Reveal>

        <Reveal className="mt-8 space-y-4">
          {[
            "Visit Tier 1 Dispensary Sponsor no later than 48 hours before the event.",
            'Request the "15mg Pairing Kit" prepared for The Velvet Root assessment experience.',
            "Confirm your rideshare plan before departure and arrive with your RSVP confirmation ready for check-in.",
            "Store the kit securely and wait for on-site service guidance before beginning the pairing progression."
          ].map((step, index) => (
            <div key={step} className="surface-card flex gap-4 px-4 py-5 sm:px-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose/50 text-sm text-rose">
                {index + 1}
              </div>
              <p className="pt-1 text-sm md:text-base">{step}</p>
            </div>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
