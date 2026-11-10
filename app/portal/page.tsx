import type { Metadata } from "next";
import Link from "next/link";

import { PortalLogin, PortalSignOut } from "@/components/portal-login";
import { hasSession, isLoginConfigured } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guest portal | The VLVT Root",
  robots: { index: false, follow: false }
};

const upcoming = [
  {
    when: "This winter",
    name: "Pop-up dinners",
    text: "Small dinners ahead of the gala. Seats are limited and offered to the guest list first."
  },
  {
    when: "February 2027",
    name: "The Velvetyn Gala",
    text: "Two dinner seatings, a vendor village and a headline DJ to be announced."
  }
];

// The passcode is checked on the server. Nothing below the login form is sent
// to a browser that has not signed in.
export default function PortalPage() {
  if (!hasSession("member")) {
    return <PortalLogin open={isLoginConfigured("member")} />;
  }

  return (
    <div className="section-shell max-w-4xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow">Guest portal</p>
          <h1 className="mt-4 text-5xl md:text-6xl">You&apos;re in.</h1>
          <p className="mt-5 max-w-xl text-lg">
            Event details and ticket access will appear here as each evening is confirmed.
            Tickets are not on sale yet.
          </p>
        </div>
        <PortalSignOut />
      </div>

      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {upcoming.map((item) => (
          <li key={item.name} className="surface-card p-6 md:p-8">
            <p className="eyebrow">{item.when}</p>
            <h2 className="mt-3 text-3xl text-gold-soft">{item.name}</h2>
            <p className="mt-3 text-base">{item.text}</p>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-sage">
        Want a friend to hear first too? Send them to the{" "}
        <Link href="/apply" className="text-cream underline underline-offset-4 hover:text-gold-soft">
          guest list
        </Link>
        .
      </p>
    </div>
  );
}
