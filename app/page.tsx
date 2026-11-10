import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { getHeroVideoUrl } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const FALLBACK_HERO_VIDEO_URL = "/brand/velvet-root-hero.mp4.mp4";

export default async function HomePage() {
  const heroVideoUrl = await getHeroVideoUrl();
  const activeHeroVideoUrl = heroVideoUrl || FALLBACK_HERO_VIDEO_URL;

  return (
    <div className="relative overflow-hidden">
      <section className="relative flex min-h-[100dvh] items-center md:min-h-[calc(100dvh-5rem)]">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/brand/hero-video-poster.svg"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            src={activeHeroVideoUrl}
          />
          <div className="absolute inset-0 bg-velvet-gradient" />
          <div className="absolute inset-0 bg-obsidian/60" />
        </div>

        <div className="section-shell relative z-10 flex flex-col items-center justify-center text-center">
          <Reveal className="max-w-3xl">
            <Image
              src="/brand/vlvt-root-logo.svg"
              alt=""
              width={200}
              height={200}
              className="mx-auto mb-6 h-32 w-32 rounded-3xl border border-line bg-obsidian/50 object-contain p-2 shadow-glow backdrop-blur-sm sm:h-40 sm:w-40"
              priority
            />
            <p className="eyebrow">Phoenix · Scottsdale</p>
            <h1 className="mt-5 text-5xl leading-none sm:text-6xl md:text-8xl">The VLVT Root</h1>
            <p className="mx-auto mt-6 max-w-2xl font-serif text-2xl text-gold-soft sm:text-3xl">
              Private culinary evenings in the Arizona desert.
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg">
              Four-course tasting menus, zero-proof pairings and a lounge built for lingering,
              inspired by Arizona&apos;s cannabis culture.
            </p>
          </Reveal>

          <Reveal className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row" delay={0.15}>
            <Link href="/apply" className="button-solid min-h-[52px] flex-1">
              Join the guest list
            </Link>
            <Link href="/experience" className="button-outline min-h-[52px] flex-1">
              The experience
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
          <Reveal>
            <p className="eyebrow">February 2027</p>
            <h2 className="mt-4 text-4xl md:text-5xl">The Velvetyn Gala</h2>
            <p className="mt-5 text-base md:text-lg">
              Our flagship evening arrives during Phoenix&apos;s biggest basketball weekend,
              February 2027. Two dinner seatings, a vendor village and a headline DJ to be
              announced. Details go first to the guest list.
            </p>
            <Link href="/apply" className="button-outline mt-8">
              Join the guest list
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-line">
              <Image
                src="/images/pitch/dinner.webp"
                alt="A candlelit long table set for dinner in the desert at dusk"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
          <Reveal className="md:order-2">
            <p className="eyebrow">This winter</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Pop-up dinners</h2>
            <p className="mt-5 text-base md:text-lg">
              Small dinners this winter, ahead of the gala. Limited seats; guest list first.
            </p>
          </Reveal>

          <Reveal className="md:order-1" delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-line">
              <Image
                src="/images/pitch/tables.webp"
                alt="Dinner tables dressed with candles and glassware"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
