"use client";

import { usePathname } from "next/navigation";

import { SiteNavigation } from "@/components/site-navigation";

/**
 * Wraps public pages in the site navigation and footer.
 * Link-only pitch pages (/p/...) render bare, with no links into or out of the public site.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/p/")) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <SiteNavigation />
      <main className="min-h-screen md:pt-20">{children}</main>
      <footer className="border-t border-line px-4 pb-32 pt-10 text-center sm:px-6 md:pb-10">
        <p className="mx-auto max-w-2xl text-sm text-sage">
          No cannabis is sold, served, sampled or given away at our events. 21+.
        </p>
        <p className="mt-3 text-xs text-sage/80">© {new Date().getFullYear()} Vlvt Root LLC</p>
      </footer>
    </>
  );
}
