import { ApplicationSubmitButton } from "@/components/application-submit-button";
import { Reveal } from "@/components/reveal";

import { submitMembershipApplication } from "./actions";

type ApplyPageProps = {
  searchParams?: {
    status?: string;
  };
};

function StatusBanner({ status }: { status?: string }) {
  if (status === "success") {
    return (
      <div className="surface-card border-botanical/40 bg-botanical/10 p-4 text-sm text-cream/85">
        Your application has been received and routed for review.
      </div>
    );
  }

  if (status === "demo") {
    return (
      <div className="surface-card border-rose/40 bg-rose/10 p-4 text-sm text-cream/85">
        MVP note: configure <code>MEMBERSHIP_WEBHOOK_URL</code> before launch to
        route submissions beyond this on-site confirmation flow.
      </div>
    );
  }

  if (status === "missing") {
    return (
      <div className="surface-card border-rose/40 bg-rose/10 p-4 text-sm text-cream/85">
        Please complete every field and acknowledgement before submitting.
      </div>
    );
  }

  return null;
}

export default function ApplyPage({ searchParams }: ApplyPageProps) {
  return (
    <div className="section-shell max-w-4xl">
      <Reveal className="max-w-3xl">
        <p className="eyebrow">Membership Application</p>
        <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
          Apply for private access.
        </h1>
        <p className="mt-5 text-base md:text-lg">
          Share a brief introduction so the team can review alignment, hospitality
          fit, and community intent before extending membership consideration.
        </p>
      </Reveal>

      <div className="mt-8">
        <StatusBanner status={searchParams?.status} />
      </div>

      <form action={submitMembershipApplication} className="mt-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal className="space-y-2">
            <label htmlFor="name" className="text-sm uppercase tracking-[0.24em] text-cream/70">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
            />
          </Reveal>

          <Reveal className="space-y-2" delay={0.04}>
            <label htmlFor="dob" className="text-sm uppercase tracking-[0.24em] text-cream/70">
              DOB
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              autoComplete="bday"
              required
              className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
            />
          </Reveal>

          <Reveal className="space-y-2" delay={0.08}>
            <label htmlFor="email" className="text-sm uppercase tracking-[0.24em] text-cream/70">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
            />
          </Reveal>

          <Reveal className="space-y-2" delay={0.12}>
            <label htmlFor="phone" className="text-sm uppercase tracking-[0.24em] text-cream/70">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
            />
          </Reveal>
        </div>

        <Reveal className="space-y-2" delay={0.16}>
          <label htmlFor="social" className="text-sm uppercase tracking-[0.24em] text-cream/70">
            Social Handle
          </label>
          <input
            id="social"
            name="social"
            type="text"
            autoComplete="off"
            required
            className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
          />
        </Reveal>

        <Reveal className="space-y-2" delay={0.2}>
          <label htmlFor="draw" className="text-sm uppercase tracking-[0.24em] text-cream/70">
            What draws you to an alcohol-free, fine-dining experience?
          </label>
          <textarea
            id="draw"
            name="draw"
            rows={5}
            required
            className="w-full rounded-[24px] border border-white/12 bg-white/[0.03] px-4 py-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
          />
        </Reveal>

        <Reveal className="space-y-2" delay={0.24}>
          <label
            htmlFor="community"
            className="text-sm uppercase tracking-[0.24em] text-cream/70"
          >
            How do you align with community-driven initiatives?
          </label>
          <textarea
            id="community"
            name="community"
            rows={5}
            required
            className="w-full rounded-[24px] border border-white/12 bg-white/[0.03] px-4 py-4 text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
          />
        </Reveal>

        <Reveal className="space-y-4" delay={0.28}>
          <p className="text-sm uppercase tracking-[0.24em] text-cream/70">
            Compliance acknowledgements
          </p>

          <label className="surface-card flex min-h-[64px] cursor-pointer items-start gap-4 px-4 py-4">
            <input
              type="checkbox"
              name="age"
              required
              className="mt-1 h-6 w-6 shrink-0 rounded border border-white/20 bg-transparent accent-rose"
            />
            <span className="text-base text-cream/86">
              I certify I am 21+ years of age.
            </span>
          </label>

          <label className="surface-card flex min-h-[64px] cursor-pointer items-start gap-4 px-4 py-4">
            <input
              type="checkbox"
              name="alcoholFree"
              required
              className="mt-1 h-6 w-6 shrink-0 rounded border border-white/20 bg-transparent accent-rose"
            />
            <span className="text-base text-cream/86">
              I acknowledge The Velvet Root is an alcohol-free environment.
            </span>
          </label>

          <label className="surface-card flex min-h-[64px] cursor-pointer items-start gap-4 px-4 py-4">
            <input
              type="checkbox"
              name="rideshare"
              required
              className="mt-1 h-6 w-6 shrink-0 rounded border border-white/20 bg-transparent accent-rose"
            />
            <span className="text-base text-cream/86">
              I agree to the No-Drive rideshare policy.
            </span>
          </label>
        </Reveal>

        <div className="sticky bottom-4 z-30 pt-4">
          <div className="surface-card border-white/12 bg-neutral-950/88 p-3 backdrop-blur">
            <ApplicationSubmitButton />
          </div>
        </div>
      </form>
    </div>
  );
}
