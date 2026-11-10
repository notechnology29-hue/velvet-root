import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { SHOW_COMMUNITY_PROGRAM } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Our ethos | The VLVT Root"
};

const principles = [
  {
    name: "Hospitality first",
    text: "Chef-driven food, zero-proof drinks, thoughtful service."
  },
  {
    name: "Safety",
    text: "21+, licensed security, an EMT on site, a departure plan for every guest."
  },
  ...(SHOW_COMMUNITY_PROGRAM
    ? [
        {
          name: "Community",
          text: "We plan to train and hire people from communities affected by cannabis prohibition, starting with paid roles at our events."
        }
      ]
    : [])
];

export default function EthosPage() {
  return (
    <div>
      <section className="section-shell">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
          <Reveal>
            <p className="eyebrow">What we stand for</p>
            <h1 className="mt-4 text-5xl md:text-7xl">Our ethos</h1>
            <p className="mt-6 max-w-xl text-lg md:text-xl">
              The VLVT Root brings fine dining and Arizona&apos;s cannabis culture into the same
              room, with care for every guest&apos;s experience and safety.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line">
              <Image
                src="/images/pitch/desert.webp"
                alt="Saguaro cactus against a desert sunset"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell pt-0">
        <dl className="grid gap-4 md:grid-cols-2">
          {principles.map((item, index) => (
            <Reveal key={item.name} className="surface-card p-6 md:p-8" delay={index * 0.08}>
              <dt className="font-serif text-3xl text-gold-soft">{item.name}</dt>
              <dd className="mt-3 text-base text-cream/80">{item.text}</dd>
            </Reveal>
          ))}
        </dl>
      </section>
    </div>
  );
}
