import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { signMemberWaiver } from "../actions";

type WaiverPageProps = {
  searchParams?: {
    status?: string;
  };
};

export default function WaiverPage({ searchParams }: WaiverPageProps) {
  return (
    <div className="section-shell max-w-4xl">
      <Reveal className="max-w-3xl">
        <p className="eyebrow">Legal Firewall &amp; Member Agreement</p>
        <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl text-cream">
          THE VELVET ROOT PRIVATE CLUB — MEMBER WAIVER &amp; ASSUMPTION OF RISK
        </h1>
        <p className="mt-5 text-base md:text-lg text-cream/80">
          This binding legal agreement must be digitally executed by all approved members prior to reserving seats, attending events, or accessing protected venue logistics.
        </p>
      </Reveal>

      {searchParams?.status === "missing" ? (
        <div className="mt-6 surface-card border-rose/50 bg-rose/10 p-4 text-sm text-cream">
          Please provide your typed full legal name and date to complete digital execution.
        </div>
      ) : null}

      <div className="mt-8 space-y-6">
        {/* Legal Shield Container */}
        <Reveal className="surface-card p-6 sm:p-8 space-y-8 border-rose/20 bg-neutral-950/80">
          {/* Clause 1 */}
          <div className="space-y-2 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-rose/50 text-xs font-semibold text-rose shrink-0">
                01
              </span>
              <h2 className="font-serif text-xl md:text-2xl text-cream">
                Private Club Status &amp; Age Certification
              </h2>
            </div>
            <p className="text-sm sm:text-base text-cream/82 leading-relaxed pl-11">
              By entering this agreement, the undersigned certifies that they are at least twenty-one (21) years of age. The member acknowledges that all events organized by The Velvet Root LLC are strictly closed, private gatherings restricted exclusively to verified members and their authorized guests by advance invitation.
            </p>
          </div>

          {/* Clause 2 */}
          <div className="space-y-2 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-rose/50 text-xs font-semibold text-rose shrink-0">
                02
              </span>
              <h2 className="font-serif text-xl md:text-2xl text-cream">
                B.Y.O.C. &amp; Zero Distribution Policy
              </h2>
            </div>
            <p className="text-sm sm:text-base text-cream/82 leading-relaxed pl-11">
              The member explicitly agrees and understands that The Velvet Root LLC, its officers, executives (including Kemya Mathews and Keaton Elliott), employees, culinary staff, and venue hosts do NOT sell, supply, distribute, or gift cannabis or THC products in any form. Guests maintain complete physical control and possession of their legally acquired personal botanical products at all times. Service guidance provided by on-site Cannabis Sommeliers is strictly educational and advisory.
            </p>
          </div>

          {/* Clause 3 */}
          <div className="space-y-2 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-rose/50 text-xs font-semibold text-rose shrink-0">
                03
              </span>
              <h2 className="font-serif text-xl md:text-2xl text-cream">
                Assumption of Risk &amp; Dosing Cap
              </h2>
            </div>
            <p className="text-sm sm:text-base text-cream/82 leading-relaxed pl-11">
              The member knowingly assumes all risks associated with personal cannabis consumption. The member agrees to strictly observe the society’s mandatory 15 milligram (15mg THC) cumulative educational dosing cap per event. The member hereby releases, waives, and forever discharges The Velvet Root LLC, venue owners, and event partners from any liability, illness, or injury resulting from individual consumption choices.
            </p>
          </div>

          {/* Clause 4 */}
          <div className="space-y-2 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-rose/50 text-xs font-semibold text-rose shrink-0">
                04
              </span>
              <h2 className="font-serif text-xl md:text-2xl text-cream">
                Binding No-Drive &amp; Transportation Agreement
              </h2>
            </div>
            <p className="text-sm sm:text-base text-cream/82 leading-relaxed pl-11">
              Safety is paramount. Member agrees never to operate a motor vehicle following attendance at any Velvet Root assessment or dinner. Member binds themselves to utilize commercial rideshare services (Uber, Lyft), licensed taxis, or a verified non-consuming designated driver upon departure. Venue security reserves the right to arrange rideshare transport on the member&apos;s behalf if deemed necessary.
            </p>
          </div>

          {/* Clause 5 */}
          <div className="space-y-2 pb-2">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-rose/50 text-xs font-semibold text-rose shrink-0">
                05
              </span>
              <h2 className="font-serif text-xl md:text-2xl text-cream">
                Strict Alcohol-Free Premises &amp; Confidentiality
              </h2>
            </div>
            <p className="text-sm sm:text-base text-cream/82 leading-relaxed pl-11">
              Alcohol strictly is forbidden on all venue premises. Bringing, consuming, or distributing alcohol will result in immediate expulsion from the event without refund and permanent revocation of membership status. Members further agree to maintain strict confidentiality regarding private estate locations and guest privacy.
            </p>
          </div>
        </Reveal>

        {/* Digital Execution Form */}
        <Reveal className="surface-card p-6 sm:p-8" delay={0.12}>
          <h3 className="font-serif text-xl text-cream">Digital Execution &amp; Signature</h3>
          <p className="mt-2 text-sm text-cream/70">
            By typing your name below and submitting, you acknowledge that you have read, understood, and agreed to all terms of The Velvet Root Private Club Member Waiver.
          </p>

          <form action={signMemberWaiver} className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.24em] text-cream/70">
                  Typed Full Legal Name <span className="text-rose">*</span>
                </span>
                <input
                  name="typedName"
                  type="text"
                  placeholder="e.g. Kemya Mathews"
                  required
                  className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-[16px] md:text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.24em] text-cream/70">
                  Date of Execution <span className="text-rose">*</span>
                </span>
                <input
                  name="signatureDate"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full min-h-[52px] rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-[16px] md:text-base text-cream outline-none transition focus:border-rose/60 focus:ring-2 focus:ring-rose/40"
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="button-solid flex-1 min-h-[52px] rounded-2xl text-center"
              >
                Accept &amp; Unlock Portal
              </button>

              <Link
                href="/portal"
                className="button-outline flex-1 min-h-[52px] rounded-2xl text-center flex items-center justify-center"
              >
                Return to Portal
              </Link>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}