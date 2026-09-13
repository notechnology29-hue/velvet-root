"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { loginWithPasscode } from "@/app/admin/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [passcode, setPasscode] = useState("");
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"passcode" | "magic-link">("passcode");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;

    const loadSession = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (active && session) {
        router.replace("/admin");
      }
    };

    loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session) {
        router.replace("/admin");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  async function handlePasscodeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const result = await loginWithPasscode(passcode);
    setSubmitting(false);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    router.push("/admin");
  }

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
        emailRedirectTo: `${window.location.origin}/admin`
      }
    });

    setSubmitting(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage("Magic link sent. Check your inbox to continue.");
  }

  return (
    <div className="section-shell flex min-h-[100dvh] items-center justify-center">
      <div className="surface-card w-full max-w-md p-6 sm:p-8">
        <p className="eyebrow">Staff Access</p>
        <h1 className="mt-4 text-3xl md:text-4xl">Admin login</h1>
        <p className="mt-4 text-base text-cream/80">
          Enter the admin passcode for instant access or use your staff email.
        </p>

        <div className="mt-6 flex rounded-2xl border border-white/10 bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => {
              setMode("passcode");
              setMessage(null);
            }}
            className={`flex-1 rounded-xl py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              mode === "passcode"
                ? "bg-rose text-obsidian shadow-glow"
                : "text-cream/60 hover:text-cream"
            }`}
          >
            Admin Passcode
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("magic-link");
              setMessage(null);
            }}
            className={`flex-1 rounded-xl py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              mode === "magic-link"
                ? "bg-rose text-obsidian shadow-glow"
                : "text-cream/60 hover:text-cream"
            }`}
          >
            Magic Link
          </button>
        </div>

        {message ? (
          <div className="mt-6 rounded-2xl border border-botanical/35 bg-botanical/10 px-4 py-3 text-sm text-cream/85">
            {message}
          </div>
        ) : null}

        {mode === "passcode" ? (
          <form onSubmit={handlePasscodeSubmit} className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm uppercase tracking-[0.24em] text-cream/70">
                Admin Passcode
              </span>
              <input
                type="password"
                value={passcode}
                onChange={(event) => setPasscode(event.target.value)}
                placeholder="Enter passcode"
                required
                className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="button-solid w-full min-h-[52px] rounded-2xl disabled:opacity-70"
            >
              {submitting ? "Verifying..." : "Enter Admin Panel"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink} className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm uppercase tracking-[0.24em] text-cream/70">
                Staff Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="button-solid w-full min-h-[52px] rounded-2xl disabled:opacity-70"
            >
              {submitting ? "Sending link..." : "Send Magic Link"}
            </button>
          </form>
        )}

        <Link href="/admin" className="button-outline mt-4 w-full min-h-[52px] rounded-2xl">
          Back to Admin
        </Link>
      </div>
    </div>
  );
}
