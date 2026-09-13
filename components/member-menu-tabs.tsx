"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type CourseItem = {
  id: string;
  section: string;
  name: string;
  description: string;
  infusion: string;
  terpenes: string;
};

type MenuOption = {
  id: string;
  label: string;
  subtitle: string;
  courses: CourseItem[];
};

const menuOptions: MenuOption[] = [
  {
    id: "vip",
    label: "VIP 7-Course Tasting Menu",
    subtitle: "Day 1 — October Launch Assessment",
    courses: [
      {
        id: "v1",
        section: "I. [THE AWAKENING]",
        name: "Smoked Hamachi Crudo",
        description: "Yellowtail, pickled watermelon radish, ruby red grapefruit, hibiscus oil.",
        infusion: "2mg THC (Citrus Olive Oil)",
        terpenes: "Pinene, Limonene"
      },
      {
        id: "v2",
        section: "II. [THE HARVEST]",
        name: "Ember-Roasted Candy Stripe Beets",
        description: "Whipped chèvre, burnt honey, crispy puffed quinoa, micro arugula.",
        infusion: "2mg THC (Herb-Infused Agave)",
        terpenes: "Caryophyllene, Pinene"
      },
      {
        id: "v3",
        section: "III. [THE EARTH]",
        name: "Smoked Tomato & Saffron Consommé",
        description: "Delicate squash blossom, heirloom cherry tomatoes, basil oil.",
        infusion: "1mg THC (Savory Tincture)",
        terpenes: "Limonene, Caryophyllene"
      },
      {
        id: "v4",
        section: "IV. [THE SEA]",
        name: "Pan-Seared Diver Scallop",
        description: "Vanilla bean & pink peppercorn beurre blanc, charred Romanesco.",
        infusion: "4mg THC (Brown Butter Oil)",
        terpenes: "Myrcene, Humulene"
      },
      {
        id: "v5",
        section: "V. [THE FIRE]",
        name: "A5 Wagyu Beef Filet",
        description: "Smoked black cherry demi-glace, parsnip silk, charred asparagus.",
        infusion: "4mg THC (Cherry Wine Reduction)",
        terpenes: "Caryophyllene, Myrcene"
      },
      {
        id: "v6",
        section: "VI. [THE CLEANSE]",
        name: "Blood Orange & Basil Granita",
        description: "Shaved botanical ice, zero-proof gin botanical spray.",
        infusion: "0mg THC (Sober Pause / Metabolic Break)",
        terpenes: "Pinene, Limonene"
      },
      {
        id: "v7",
        section: "VII. [THE SWEET]",
        name: "Dark Chocolate & Ruby Cacao Entremet",
        description: "Cacao mousse, raspberry coulis center, toasted pepitas, flaked sea salt.",
        infusion: "2mg THC (Dark Chocolate Emulsion)",
        terpenes: "Linalool, Myrcene"
      }
    ]
  },
  {
    id: "ga",
    label: "GA 5-Course Showcase Menu",
    subtitle: "Day 2 — October Culinary Showcase",
    courses: [
      {
        id: "g1",
        section: "I. [THE BITE]",
        name: "Smoked Beetroot Tartare",
        description: "Crisp tapioca, capers, whole grain mustard.",
        infusion: "2mg THC",
        terpenes: "Pinene"
      },
      {
        id: "g2",
        section: "II. [THE SIP]",
        name: "Charred Cauliflower Velouté",
        description: "Toasted allium, hibiscus & chili oil emulsion.",
        infusion: "2mg THC",
        terpenes: "Caryophyllene"
      },
      {
        id: "g3",
        section: "III. [THE EARTH]",
        name: "“Midnight” Mushroom Risotto",
        description: "Arborio rice, dark vegetable broth, high-heat cremini, red wine reduction.",
        infusion: "4mg THC",
        terpenes: "Myrcene"
      },
      {
        id: "g4",
        section: "IV. [THE SWEET]",
        name: "Glass-Seared Chicken Thigh",
        description: "Silky parsnip purée, dark cherry & peppercorn gastrique.",
        infusion: "4mg THC",
        terpenes: "Humulene"
      },
      {
        id: "g5",
        section: "V. [THE FINISH]",
        name: "Coconut Milk Panna Cotta",
        description: "Rich coconut cream, smoked blackberry compote, flaked sea salt.",
        infusion: "3mg THC",
        terpenes: "Linalool"
      }
    ]
  }
];

export function MemberMenuTabs() {
  const [activeTab, setActiveTab] = useState(menuOptions[0].id);
  const activeMenu = menuOptions.find((item) => item.id === activeTab) ?? menuOptions[0];

  return (
    <div className="surface-card p-4 sm:p-8 space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {menuOptions.map((item) => {
          const active = item.id === activeTab;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative min-h-[56px] rounded-2xl border px-5 py-3.5 text-left transition focus:outline-none focus:ring-2 focus:ring-rose/60 ${
                active
                  ? "border-rose/60 text-cream"
                  : "border-white/10 text-cream/65 hover:text-cream"
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="menu-tab"
                  className="absolute inset-0 rounded-2xl bg-rose/12"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              ) : null}
              <div className="relative z-10 flex flex-col">
                <span className="font-serif text-base tracking-wider text-cream">
                  {item.label}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-rose/80 mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <motion.div
        key={activeMenu.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 pt-2"
      >
        {activeMenu.courses.map((course) => (
          <div
            key={course.id}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 transition hover:border-rose/40 hover:bg-white/[0.04]"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1.5 max-w-2xl">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-rose">
                  {course.section}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-cream tracking-wide">
                  {course.name}
                </h3>
                <p className="text-sm sm:text-base text-cream/80 leading-relaxed pt-0.5">
                  {course.description}
                </p>
              </div>

              <div className="mt-3 md:mt-0 flex flex-wrap gap-2 shrink-0 md:flex-col md:items-end">
                <span className="inline-flex items-center rounded-full border border-rose/40 bg-rose/10 px-3 py-1 text-xs text-cream tracking-wide">
                  {course.infusion}
                </span>
                <span className="inline-flex items-center rounded-full border border-botanical/40 bg-botanical/20 px-3 py-1 text-xs text-cream/80 tracking-wide">
                  Terpenes: {course.terpenes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Footer Disclaimers */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-950/60 p-5 sm:p-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-rose font-semibold">
          Culinary &amp; Dosing Transparency
        </p>
        <ul className="space-y-1.5 text-xs sm:text-sm text-cream/75 list-disc list-inside">
          <li>Total cannabis infusion across the experience is strictly capped at 15 milligrams.</li>
          <li>Our kitchen is proudly 100% Gluten-Free, Pork-Free, and Nut-Free.</li>
          <li>Completely uninfused portions are available at every course upon request.</li>
        </ul>
      </div>
    </div>
  );
}
