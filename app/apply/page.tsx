import type { Metadata } from "next";

import { ApplicationSubmitButton } from "@/components/application-submit-button";
import { Reveal } from "@/components/reveal";

import { joinGuestList } from "./actions";

export const metadata: Metadata = {
  title: "Join the guest list | The VLVT Root"
};

type ApplyPageProps = {
  searchParams?: {
    status?: string;
  };
};

const notices: Record<string, string> = {
  missing: "Add your name, a valid email and your city, and confirm you are 21 or older.",
  slow: "That was a lot of sign-ups from one place. Wait a few minutes, then try again.",
  error: "We couldn't save your details just now. Try again in a moment."
};

export default function ApplyPage({ searchParams }: ApplyPageProps) {
  const status = searchParams?.status;

  if (status === "success") {
    return (
      <div className="section-shell flex min-h-[70dvh] max-w-2xl items-center">
        <Reveal className="surface-card w-full p-8 text-center md:p-12">
          <p className="eyebrow">Guest list</p>
          <h1 className="mt-4 text-5xl md:text-6xl">You&apos;re on the list.</h1>
          <p className="mt-5 text-lg">We&apos;ll be in touch before tickets open.</p>
        </Reveal>
      </div>
    );
  }

  const notice = status ? notices[status] : undefined;

  return (
    <div className="section-shell max-w-2xl">
      <Reveal>
        <p className="eyebrow">Guest list</p>
        <h1 className="mt-4 text-5xl md:text-6xl">Join the guest list</h1>
        <p className="mt-5 text-lg">
          Be first to hear about pop-up dinners and gala tickets.
        </p>
      </Reveal>

      {notice ? (
        <div role="alert" className="mt-8 rounded-2xl border border-rose/60 bg-rose/10 p-4 text-sm text-cream">
          {notice}
        </div>
      ) : null}

      <Reveal delay={0.08}>
        <form action={joinGuestList} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="field-label">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={120}
                required
                className="field-input"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={200}
                required
                className="field-input"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="field-label">
                Phone <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={40}
                className="field-input"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="field-label">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                maxLength={120}
                required
                className="field-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="heard" className="field-label">
              How did you hear about us? <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input id="heard" name="heard" type="text" maxLength={300} className="field-input" />
          </div>

          {/* Honeypot: hidden from people, tempting to bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <label className="surface-card flex min-h-[64px] cursor-pointer items-center gap-4 px-5 py-4 transition hover:border-gold/50">
            <input
              type="checkbox"
              name="cert_age"
              required
              className="h-6 w-6 shrink-0 rounded border border-line bg-transparent accent-gold"
            />
            <span className="text-base leading-snug text-cream">I am 21 or older.</span>
          </label>

          <ApplicationSubmitButton />
        </form>
      </Reveal>
    </div>
  );
}
