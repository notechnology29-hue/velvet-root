"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navigationItems = [
  { href: "/", label: "Home", shortLabel: "Home" },
  { href: "/experience", label: "Experience", shortLabel: "Taste" },
  { href: "/ethos", label: "Ethos", shortLabel: "Ethos" },
  { href: "/apply", label: "Apply", shortLabel: "Apply" },
  { href: "/portal", label: "Portal", shortLabel: "Portal" }
];

export function SiteNavigation() {
  const pathname = usePathname();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 hidden border-b border-white/10 bg-obsidian/80 backdrop-blur md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="min-h-[44px] rounded-full px-4 py-2 font-serif text-lg tracking-[0.24em] text-cream transition hover:text-rose focus:outline-none focus:ring-2 focus:ring-rose/60"
          >
            THE VELVET ROOT
          </Link>

          <nav className="flex items-center gap-2">
            {navigationItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative inline-flex min-h-[44px] items-center justify-center rounded-full px-4 py-2 text-sm uppercase tracking-[0.24em] transition focus:outline-none focus:ring-2 focus:ring-rose/60 ${
                    active ? "text-cream" : "text-cream/65 hover:text-cream"
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="desktop-nav-pill"
                      className="absolute inset-0 rounded-full border border-rose/50 bg-rose/10"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  ) : null}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <nav className="fixed inset-x-4 bottom-4 z-50 rounded-full border border-white/10 bg-neutral-950/90 p-2 shadow-glow backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navigationItems.map((item) => {
            const active =
              item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative inline-flex min-h-[52px] items-center justify-center rounded-full px-2 text-[11px] uppercase tracking-[0.18em] transition focus:outline-none focus:ring-2 focus:ring-rose/60 ${
                  active ? "text-cream" : "text-cream/60"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 rounded-full bg-rose/15"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                ) : null}
                <span className="relative z-10">{item.shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
