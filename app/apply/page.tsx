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
      <div className="surface-card border-rose/50 bg-rose/10 p-6 text-center text-cream">
        <p className="eyebrow">Application Received</p>
        <p className="mt-2 font-serif text-xl sm:text-2xl text-cream">
          Application submitted. Our board will review your profile for the October 2026 launch.
        </p>
      </div>
    );
  }

  if (status === "missing") {
    return (
      <div className="surface-card border-rose/40 bg-rose/10 p-4 text-sm text-cream/85">
        Please complete all required fields and mandatory compliance acknowledgements before submitting.
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
        <p className="mt-5 text-base md:text-lg text-cream/80">
          Share a brief introduction so the admissions committee can review alignment, hospitality
          fit, and community intent before extending membership consideration for The Velvet Root.
        </p>
      </Reveal>

      <div className="mt-8">
        <StatusBanner status={searchParams?.status} />
      </div>

      <form action={submitMembershipApplication} className="mt-8 space-y-6">
        {/* Contact & Demographic Info */}
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="space-y-2">
            <label htmlFor="name" className="text-xs uppercase tracking-[0.24em] text-cream/70">
              First &amp; Last Name <span className="text-rose">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Full Legal Name"
              autoComplete="name"
              required
              className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-[16px] md:text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
            />
          </Reveal>

          <Reveal className="space-y-2" delay={0.04}>
            <label htmlFor="dob" className="text-xs uppercase tracking-[0.24em] text-cream/70">
              Date of Birth (21+ Required) <span className="text-rose">*</span>
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              autoComplete="bday"
              required
              className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-[16px] md:text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
            />
          </Reveal>

          <Reveal className="space-y-2" delay={0.08}>
            <label htmlFor="email" className="text-xs uppercase tracking-[0.24em] text-cream/70">
              Email Address <span className="text-rose">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@domain.com"
              autoComplete="email"
              required
              className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-[16px] md:text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
            />
          </Reveal>

          <Reveal className="space-y-2" delay={0.12}>
            <label htmlFor="phone" className="text-xs uppercase tracking-[0.24em] text-cream/70">
              Phone Number <span className="text-rose">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(555) 000-0000"
              autoComplete="tel"
              required
              className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-[16px] md:text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
            />
          </Reveal>
        </div>

        <Reveal className="space-y-2" delay={0.16}>
          <label htmlFor="social" className="text-xs uppercase tracking-[0.24em] text-cream/70">
            Social Handle (Instagram / LinkedIn) <span className="text-cream/40">(Optional)</span>
          </label>
          <input
            id="social"
            name="social"
            type="text"
            placeholder="@username or profile link"
            autoComplete="off"
            className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-[16px] md:text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
          />
        </Reveal>

        {/* Vetting Textareas */}
        <Reveal className="space-y-2" delay={0.2}>
          <label htmlFor="draw" className="text-xs uppercase tracking-[0.24em] text-cream/70 block">
            What draws you to this specific type of alcohol-free, fine-dining experience? <span className="text-rose">*</span>
          </label>
          <textarea
            id="draw"
            name="draw"
            rows={4}
            placeholder="Share your perspective on high-end alcohol-free hospitality…"
            required
            className="w-full rounded-[24px] border border-white/12 bg-white/[0.03] px-4 py-4 text-[16px] md:text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
          />
        </Reveal>

        <Reveal className="space-y-2" delay={0.24}>
          <label
            htmlFor="community"
            className="text-xs uppercase tracking-[0.24em] text-cream/70 block"
          >
            How do you align with or support community-driven initiatives (e.g., workforce development)? <span className="text-rose">*</span>
          </label>
          <textarea
            id="community"
            name="community"
            rows={4}
            placeholder="Tell us about your background or community involvement…"
            required
            className="w-full rounded-[24px] border border-white/12 bg-white/[0.03] px-4 py-4 text-[16px] md:text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
          />
        </Reveal>

        <Reveal className="space-y-2" delay={0.28}>
          <label htmlFor="allergies" className="text-xs uppercase tracking-[0.24em] text-cream/70 block">
            Do you have any food allergies? <span className="text-cream/50">(Our kitchen is inherently 100% Gluten-Free, Pork-Free, and Nut-Free)</span> <span className="text-rose">*</span>
          </label>
          <textarea
            id="allergies"
            name="allergies"
            rows={3}
            placeholder="List any specific dietary restrictions or confirm none…"
            required
            className="w-full rounded-[24px] border border-white/12 bg-white/[0.03] px-4 py-4 text-[16px] md:text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
          />
        </Reveal>

        {/* Mandatory Compliance Checkboxes (Oversized for mobile thumbs) */}
        <Reveal className="space-y-3 pt-4" delay={0.32}>
          <p className="text-xs uppercase tracking-[0.28em] text-rose font-semibold">
            Mandatory Compliance Acknowledgements
          </p>

          <label className="surface-card flex min-h-[64px] cursor-pointer items-center gap-4 px-5 py-4 transition hover:border-rose/40">
            <input
              type="checkbox"
              name="cert_age"
              required
              className="h-6 w-6 shrink-0 rounded border border-white/20 bg-transparent accent-rose focus:ring-rose/50"
            />
            <span className="text-sm md:text-base text-cream/90 leading-snug">
              I certify I am at least 21 years of age.
            </span>
          </label>

          <label className="surface-card flex min-h-[64px] cursor-pointer items-center gap-4 px-5 py-4 transition hover:border-rose/40">
            <input
              type="checkbox"
              name="cert_byoc"
              required
              className="h-6 w-6 shrink-0 rounded border border-white/20 bg-transparent accent-rose focus:ring-rose/50"
            />
            <span className="text-sm md:text-base text-cream/90 leading-snug">
              I understand The Velvet Root operates a strict B.Y.O.C. (Bring-Your-Own-Cannabis) model and does not sell or distribute cannabis on-site.
            </span>
          </label>

          <label className="surface-card flex min-h-[64px] cursor-pointer items-center gap-4 px-5 py-4 transition hover:border-rose/40">
            <input
              type="checkbox"
              name="cert_alcohol_free"
              required
              className="h-6 w-6 shrink-0 rounded border border-white/20 bg-transparent accent-rose focus:ring-rose/50"
            />
            <span className="text-sm md:text-base text-cream/90 leading-snug">
              I acknowledge the premises are strictly alcohol-free.
            </span>
          </label>

          <label className="surface-card flex min-h-[64px] cursor-pointer items-center gap-4 px-5 py-4 transition hover:border-rose/40">
            <input
              type="checkbox"
              name="cert_no_drive"
              required
              className="h-6 w-6 shrink-0 rounded border border-white/20 bg-transparent accent-rose focus:ring-rose/50"
            />
            <span className="text-sm md:text-base text-cream/90 leading-snug">
              I agree to the No-Drive rideshare transportation policy.
            </span>
          </label>

          <label className="surface-card flex min-h-[64px] cursor-pointer items-center gap-4 px-5 py-4 transition hover:border-rose/40">
            <input
              type="checkbox"
              name="cert_confidentiality"
              required
              className="h-6 w-6 shrink-0 rounded border border-white/20 bg-transparent accent-rose focus:ring-rose/50"
            />
            <span className="text-sm md:text-base text-cream/90 leading-snug">
              I agree to respect private property confidentiality and venue locations.
            </span>
          </label>
        </Reveal>

        {/* Sticky Submit Button */}
        <div className="sticky bottom-4 z-30 pt-4">
          <div className="surface-card border-white/12 bg-neutral-950/90 p-3 backdrop-blur shadow-glow">
            <ApplicationSubmitButton />
          </div>
        </div>
      </form>
    </div>
  );
}
