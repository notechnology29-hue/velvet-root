import Link from "next/link";

import { MemberMenuTabs } from "@/components/member-menu-tabs";
import { Reveal } from "@/components/reveal";

export default function MenusPage() {
  return (
    <div className="section-shell max-w-5xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Gated Menus Dashboard</p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl text-cream">
            Private Culinary &amp; Infusion Progressions
          </h1>
          <p className="mt-5 text-base md:text-lg text-cream/80">
            Explore the structured VIP 7-course tasting menu and GA 5-course showcase menu, complete with dosing metrics, botanical infusions, and terpene pairing notes.
          </p>
        </Reveal>

        <Reveal className="flex flex-wrap gap-3 shrink-0" delay={0.08}>
          <Link
            href="/portal"
            className="button-solid min-h-[48px] rounded-2xl text-center flex items-center justify-center px-5 text-xs font-semibold"
          >
            RSVP for Assessment ($250)
          </Link>
          <Link
            href="/portal/waiver"
            className="button-outline min-h-[48px] rounded-2xl text-center flex items-center justify-center px-5 text-xs font-semibold"
          >
            Member Waiver
          </Link>
        </Reveal>
      </div>

      <div className="mt-10">
        <MemberMenuTabs />
      </div>
    </div>
  );
}
