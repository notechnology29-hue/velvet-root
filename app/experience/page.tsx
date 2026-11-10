import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "The experience | The VLVT Root"
};

const evening = [
  {
    name: "The Dinner",
    image: "/images/pitch/dinner.webp",
    alt: "A long candlelit dinner table set in the desert",
    text: "Timed seatings of a four-course tasting menu, run like a restaurant, built around one hero course. Zero-proof pairings with every course."
  },
  {
    name: "The Village",
    image: "/images/pitch/village.webp",
    alt: "An outdoor lounge with warm lighting at night",
    text: "A lounge and vendor village with a DJ, partner activations and a zero-proof bar. Every dinner seating ends here."
  }
];

const sampleMenu = [
  {
    course: "First",
    dish: "Kampachi crudo with yuzu and blood orange",
    image: "/images/pitch/crudo.webp"
  },
  {
    course: "Second",
    dish: "Mango and thyme lacquered quail",
    image: "/images/pitch/quail.webp"
  },
  {
    course: "Hero course",
    dish: "Mesquite Wagyu ribeye cap",
    image: "/images/pitch/steak.webp"
  },
  {
    course: "Dessert",
    dish: "Sonoran cacao and pine nut torte",
    image: "/images/pitch/cake.webp"
  }
];

const tables = ["Dinner", "Legends Table", "Founders' Table"];

export default function ExperiencePage() {
  return (
    <div>
      <section className="section-shell pb-10 md:pb-14">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">One evening, two rooms</p>
          <h1 className="mt-4 text-5xl md:text-7xl">The experience</h1>
        </Reveal>
      </section>

      <section className="section-shell pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          {evening.map((item, index) => (
            <Reveal key={item.name} className="surface-card overflow-hidden" delay={index * 0.08}>
              <div className="relative aspect-[3/2]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-3xl text-gold-soft md:text-4xl">{item.name}</h2>
                <p className="mt-4 text-base">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell pt-0">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Sample menu</p>
          <h2 className="mt-4 text-4xl md:text-5xl">Four courses, one hero dish</h2>
          <p className="mt-4 text-base">The final menu is set by our chef.</p>
        </Reveal>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sampleMenu.map((item, index) => (
            <li key={item.course}>
              <Reveal className="surface-card h-full overflow-hidden" delay={index * 0.06}>
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="eyebrow">{item.course}</p>
                  <p className="mt-3 font-serif text-2xl leading-snug text-cream">{item.dish}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-sm text-sage">
          Menus will list allergens; the sample includes nuts. Photos are illustrative.
        </p>
      </section>

      <section className="section-shell pt-0">
        <Reveal className="surface-card grid gap-8 p-6 md:grid-cols-[1fr_1.2fr] md:items-center md:p-10">
          <div>
            <p className="eyebrow">Planned tables</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Three ways to sit down</h2>
            <p className="mt-4 text-base">Pricing is announced to the guest list first.</p>
            <Link href="/apply" className="button-solid mt-8">
              Join the guest list
            </Link>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {tables.map((table) => (
              <li key={table} className="py-5 font-serif text-3xl text-gold-soft">
                {table}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </div>
  );
}
