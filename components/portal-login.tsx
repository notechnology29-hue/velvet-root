"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginMemberWithPasscode, memberSignOut } from "@/app/portal/actions";

export function PortalLogin({ open }: { open: boolean }) {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const result = await loginMemberWithPasscode(passcode);

    if (result.error) {
      setSubmitting(false);
      setMessage(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <div className="section-shell flex min-h-[80dvh] items-center justify-center">
      <div className="surface-card w-full max-w-md p-6 text-center sm:p-8">
        <p className="eyebrow">Guest portal</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Enter your passcode</h1>

        {open ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
            <div className="space-y-2">
              <label htmlFor="portal-passcode" className="field-label">
                Passcode
              </label>
              <input
                id="portal-passcode"
                type="password"
                autoComplete="current-password"
                value={passcode}
                onChange={(event) => setPasscode(event.target.value)}
                required
                aria-describedby={message ? "portal-message" : undefined}
                className="field-input"
              />
            </div>

            {message ? (
              <p id="portal-message" role="alert" className="rounded-2xl border border-rose/60 bg-rose/10 px-4 py-3 text-sm text-cream">
                {message}
              </p>
            ) : null}

            <button type="submit" disabled={submitting} className="button-solid min-h-[52px] w-full disabled:opacity-70">
              {submitting ? "Checking…" : "Enter"}
            </button>
          </form>
        ) : (
          <p className="mt-5 text-base">
            The portal is not open yet.
          </p>
        )}
      </div>
    </div>
  );
}

export function PortalSignOut() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await memberSignOut();
        router.refresh();
      }}
      className="button-outline shrink-0 self-start"
    >
      Sign out
    </button>
  );
}
