import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { SiteNavigation } from "@/components/site-navigation";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://velvet-root.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The Velvet Root",
  description:
    "A private culinary society exploring the intersection of fine dining and botanical wellness.",
  applicationName: "The Velvet Root"
};

export const viewport: Viewport = {
  themeColor: "#121212"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} bg-obsidian text-cream`}
      >
        <SiteNavigation />
        <main className="min-h-screen pb-24 md:pb-0 md:pt-20">{children}</main>
      </body>
    </html>
  );
}
