import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { SiteChrome } from "@/components/site-chrome";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://velvet-root.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The VLVT Root",
  description:
    "Private culinary evenings in the Arizona desert: four-course tasting menus, zero-proof pairings and a lounge built for lingering.",
  applicationName: "The VLVT Root"
};

export const viewport: Viewport = {
  themeColor: "#0E1411"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-obsidian text-cream">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
