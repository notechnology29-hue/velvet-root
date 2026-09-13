"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const menuOptions = [
  {
    id: "vip",
    label: "7-Course VIP Tasting",
    courses: [
      "Amuse of smoked heirloom tomato and green strawberry.",
      "Crisp chicory salad with preserved citrus and pistachio.",
      "Charred lion's mane skewer with velvet pepper glaze.",
      "Silken sweet corn agnolotti with saffron botanical cream.",
      "Wood-fired market catch with roasted fennel jus.",
      "Bittersweet cacao intermezzo with mint vapor.",
      "Rose-poached stone fruit with toasted almond lace."
    ]
  },
  {
    id: "ga",
    label: "5-Course GA Showcase",
    courses: [
      "Welcome bite of cucumber, herbs, and sea salt.",
      "Baby gem salad with avocado and sesame crunch.",
      "Crispy maitake over celery root puree.",
      "Slow-roasted market protein with ember vegetables.",
      "Dark chocolate cremeux with candied orange."
    ]
  }
];

export function MemberMenuTabs() {
  const [activeTab, setActiveTab] = useState(menuOptions[0].id);
  const activeMenu = menuOptions.find((item) => item.id === activeTab) ?? menuOptions[0];

  return (
    <div className="surface-card p-4 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {menuOptions.map((item) => {
          const active = item.id === activeTab;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative min-h-[52px] rounded-2xl border px-4 py-3 text-left text-sm uppercase tracking-[0.24em] transition focus:outline-none focus:ring-2 focus:ring-rose/60 ${
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
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>

      <motion.ol
        key={activeMenu.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-6 space-y-3"
      >
        {activeMenu.courses.map((course, index) => (
          <li
            key={course}
            className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-4"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rose/50 text-xs font-medium text-rose">
              {index + 1}
            </span>
            <p className="text-sm text-cream/82">{course}</p>
          </li>
        ))}
      </motion.ol>
    </div>
  );
}
