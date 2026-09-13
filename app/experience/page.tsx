import Image from "next/image";

import { Reveal } from "@/components/reveal";

const rescueMenu = [
  {
    name: "The Reset",
    notes: "Bright citrus, cucumber, and sea minerals crafted to refresh the palate."
  },
  {
    name: "The Anchor",
    notes: "Botanical tea, tart cherry, and grounding spice for a slow exhale moment."
  },
  {
    name: "The Clear",
    notes: "Herbal tonic, white peach, and mint designed for a crisp, lucid finish."
  }
];

export default function ExperiencePage() {
  return (
    <div>
      <section className="section-shell">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">The Experience</p>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
            Culinary precision with a restorative rhythm.
          </h1>
          <p className="mt-5 text-base md:text-lg">
            The Velvet Root balances immersive hospitality with a grounded service
            model that keeps every course elegant, intentional, and welcoming.
          </p>
        </Reveal>
      </section>

      <section className="section-shell pt-0">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <Reveal className="order-2 md:order-1">
            <p className="eyebrow">Culinary Excellence</p>
            <h2 className="mt-3 text-2xl md:text-4xl">An uncompromising kitchen.</h2>
            <p className="mt-5 text-base">
              Our culinary program is 100% gluten-free, pork-free, and maintained
              as an uninfused kitchen for pristine consistency, ingredient integrity,
              and confidence across every guest touchpoint.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-cream/78 md:text-base">
              <li className="surface-card px-4 py-4">
                Seasonal sourcing with chef-led tasting progression.
              </li>
              <li className="surface-card px-4 py-4">
                Refined plating calibrated for intimate salon-style service.
              </li>
              <li className="surface-card px-4 py-4">
                Hospitality standards shaped for comfort, discretion, and warmth.
              </li>
            </ul>
          </Reveal>

          <Reveal className="order-1 md:order-2" delay={0.1}>
            <div className="surface-card overflow-hidden">
              <Image
                src="/brand/culinary-room.svg"
                alt="The Velvet Root culinary salon artwork"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell pt-0">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Botanical Mixology</p>
          <h2 className="mt-3 text-2xl md:text-4xl">The Rescue Menu</h2>
          <p className="mt-5 text-base">
            A calm, curated trio of non-alcoholic serves built to support pacing
            and comfort throughout the evening.
          </p>
        </Reveal>

        <div className="mask-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
          {rescueMenu.map((drink, index) => (
            <Reveal
              key={drink.name}
              className="surface-card min-w-[82%] snap-center p-6 sm:min-w-[360px]"
              delay={index * 0.08}
            >
              <p className="eyebrow">Signature Pour {index + 1}</p>
              <h3 className="mt-3 text-2xl">{drink.name}</h3>
              <p className="mt-4 text-sm md:text-base">{drink.notes}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
