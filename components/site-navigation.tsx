"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navigationItems = [
  { href: "/", label: "Home", shortLabel: "Home" },
  { href: "/experience", label: "Experience", shortLabel: "Taste" },
  { href: "/ethos", label: "Ethos", shortLabel: "Ethos" },
  { href: "/apply", label: "Guest List", shortLabel: "List" },
  { href: "/portal", label: "Portal", shortLabel: "Portal" }
];

export function SiteNavigation() {
  const pathname = usePathname();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 hidden border-b border-line bg-obsidian/85 backdrop-blur md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="flex min-h-[44px] items-center gap-3 rounded-full px-3 py-1 font-serif text-xl tracking-[0.2em] text-cream transition hover:text-gold-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            <Image
              src="/brand/vlvt-root-monogram.svg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg border border-line object-contain"
            />
            <span>THE VLVT ROOT</span>
          </Link>

          <nav aria-label="Main" className="flex items-center gap-2">
            {navigationItems.map((item) => {
              const active =
                item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex min-h-[44px] items-center justify-center rounded-full px-4 py-2 text-sm uppercase tracking-[0.2em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
                    active ? "text-cream" : "text-cream/70 hover:text-cream"
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="desktop-nav-pill"
                      className="absolute inset-0 rounded-full border border-gold/50 bg-gold/10"
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

      <nav
        aria-label="Main"
        className="fixed inset-x-4 bottom-4 z-50 rounded-full border border-line bg-obsidian/95 p-2 shadow-glow backdrop-blur md:hidden"
      >
        <div className="grid grid-cols-5 gap-1">
          {navigationItems.map((item) => {
            const active =
              item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex min-h-[52px] items-center justify-center rounded-full px-2 text-[11px] uppercase tracking-[0.16em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
                  active ? "text-cream" : "text-cream/70"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 rounded-full bg-gold/15"
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
