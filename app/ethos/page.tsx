import Image from "next/image";

import { Reveal } from "@/components/reveal";

const leaders = [
  {
    name: "Kemya Mathews",
    role: "CEO",
    bio: "Kemya shapes the brand standard, member journey, and hospitality vision with a focus on intimate luxury, operational discretion, and memorable guest care."
  },
  {
    name: "Keaton Elliott",
    role: "COO",
    bio: "Keaton leads systems, partnerships, and execution, translating the society's long-range ambitions into disciplined growth, strong logistics, and scalable service."
  }
];

const milestones = [
  {
    phase: "Years 1-3",
    title: "Local Pop-Ups",
    description:
      "Refine the signature service model through intimate city-based events and trusted community partnerships."
  },
  {
    phase: "Years 4-8",
    title: "Regional Expansion",
    description:
      "Establish recurring activations, deepen leadership pipelines, and build a replicable private-club playbook."
  },
  {
    phase: "Years 9-15",
    title: "Lifestyle Conglomerate",
    description:
      "Scale into a multi-state hospitality and wellness portfolio spanning dining, education, and member-focused experiences."
  }
];

export default function EthosPage() {
  return (
    <div>
      <section className="section-shell">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Ethos &amp; Leadership</p>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
            Building a private club with purpose beyond the plate.
          </h1>
          <p className="mt-5 text-base md:text-lg">
            The Velvet Root is guided by hospitality operators who believe premium
            experiences should also create mobility, mentorship, and sustainable
            opportunity.
          </p>
        </Reveal>
      </section>

      <section className="section-shell pt-0">
        <Reveal>
          <p className="eyebrow">Leadership</p>
          <div className="mt-6 grid gap-4">
            {leaders.map((leader, index) => (
              <Reveal key={leader.name} className="surface-card p-6" delay={index * 0.08}>
                <p className="text-xs uppercase tracking-[0.3em] text-botanical/90">
                  {leader.role}
                </p>
                <h2 className="mt-3 text-2xl md:text-3xl">{leader.name}</h2>
                <p className="mt-4 text-sm md:text-base">{leader.bio}</p>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="section-shell pt-0">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="surface-card p-6 md:p-8">
            <p className="eyebrow">The Mission</p>
            <h2 className="mt-3 text-2xl md:text-4xl">Hospitality as a workforce engine.</h2>
            <p className="mt-5 text-base">
              The society invests in workforce development by creating pathways into
              culinary arts, guest experience, event operations, and creative
              production. The long-term objective is simple: premium hospitality that
              develops people as intentionally as it serves members.
            </p>
          </Reveal>

          <Reveal className="surface-card overflow-hidden" delay={0.08}>
            <Image
              src="/brand/ethos-studio.svg"
              alt="The Velvet Root workforce development artwork"
              width={1200}
              height={900}
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="section-shell pt-0">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Future Vision</p>
          <h2 className="mt-3 text-2xl md:text-4xl">15-Year trajectory</h2>
        </Reveal>

        <div className="relative mt-8 space-y-6 border-l border-white/10 pl-6">
          {milestones.map((item, index) => (
            <Reveal key={item.title} className="relative" delay={index * 0.08}>
              <span className="absolute -left-[33px] top-8 h-3 w-3 rounded-full border border-rose/60 bg-obsidian" />
              <div className="surface-card p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-rose/85">
                  {item.phase}
                </p>
                <h3 className="mt-3 text-2xl">{item.title}</h3>
                <p className="mt-4 text-sm md:text-base">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
