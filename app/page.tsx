import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { getHeroVideoUrl } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const FALLBACK_HERO_VIDEO_URL = "/brand/velvet-root-hero.mp4.mp4";

export default async function HomePage() {
  const heroVideoUrl = await getHeroVideoUrl();
  const activeHeroVideoUrl = heroVideoUrl ?? FALLBACK_HERO_VIDEO_URL;

  return (
    <div className="relative overflow-hidden">
      <section className="relative flex min-h-[100dvh] items-center">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/brand/hero-video-poster.svg"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            src={activeHeroVideoUrl}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cpath fill=%22none%22 stroke=%22rgba(245,245,240,0.05)%22 stroke-width=%221%22 d=%22M0 20h40M20 0v40%22/%3E%3C/svg%3E')] opacity-20" />
          <div className="absolute inset-0 bg-velvet-gradient" />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="section-shell relative z-10 flex flex-col items-center justify-center text-center">
          <Reveal className="max-w-3xl">
            <Image
              src="/brand/velvet-root-logo.png"
              alt="The Velvet Root logo"
              width={200}
              height={200}
              className="mx-auto mb-6 h-36 w-36 sm:h-44 sm:w-44 object-contain rounded-3xl border border-white/10 shadow-glow bg-black/40 p-2 backdrop-blur-sm"
              priority
            />
            <p className="eyebrow">Private Culinary Society</p>
            <h1 className="mt-5 text-4xl leading-none text-cream sm:text-5xl md:text-7xl">
              THE VELVET ROOT
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-cream/80 sm:text-lg">
              Redefining High-End Hospitality. A private culinary society exploring
              the intersection of fine dining and botanical wellness.
            </p>
          </Reveal>

          <Reveal className="mt-10 w-full max-w-sm" delay={0.15}>
            <Link href="/apply" className="button-outline w-full min-h-[52px]">
              Apply for Membership
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section-shell pt-0">
        <Reveal className="surface-card grid gap-6 p-6 md:grid-cols-3 md:p-8">
          <div>
            <p className="eyebrow">By Invitation</p>
            <h2 className="mt-3 text-2xl md:text-3xl">Quietly intentional.</h2>
          </div>
          <p className="text-sm md:text-base">
            Every evening is designed for intimate scale, elevated service, and a
            calm atmosphere where conversation and cuisine take center stage.
          </p>
          <p className="text-sm md:text-base">
            Explore the public experience, learn the mission, and request access
            through a membership pathway built for thoughtful alignment.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
