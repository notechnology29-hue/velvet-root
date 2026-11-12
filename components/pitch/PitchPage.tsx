import Image from "next/image";

import { SHOW_HEADLINE_DJ, SHOW_PITCH_OPERATIONS } from "@/lib/flags";
import type { PitchBlock, PitchContent, PitchSection } from "@/lib/pitch-content";

import RoiCalculator from "./RoiCalculator";
import { BigNumbers, Card, DataTable, Faq, Note, Photo, PhotoCard, Section, TextCard } from "./ui";

// This file only knows how to lay a pitch page out. The words, prices and
// contacts come from the pitch_content table and are never stored in the repo.

const FLAGS: Record<string, boolean> = {
  SHOW_HEADLINE_DJ,
  SHOW_PITCH_OPERATIONS
};

const COLUMNS: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4"
};

const PHOTO_SIZES: Record<number, string> = {
  2: "(min-width: 768px) 50vw, 100vw",
  3: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  4: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
};

function BlockHeading({ text }: { text?: string }) {
  return text ? (
    <h3 className="mb-6 mt-14 font-serif text-3xl text-gold-soft first:mt-0 md:text-4xl">{text}</h3>
  ) : null;
}

function Block({ block }: { block: PitchBlock }) {
  switch (block.type) {
    case "note":
      return <Note>{block.text}</Note>;

    case "intro":
      return <p className="-mt-4 mb-10 max-w-3xl text-lg">{block.text}</p>;

    case "photoCards": {
      const cols = block.cols ?? 3;
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className={`grid gap-4 ${cols === 3 ? "md:grid-cols-3" : COLUMNS[cols]}`}>
          {block.items.map((item) => (
            <li key={item.heading}>
              <PhotoCard {...item} sizes={PHOTO_SIZES[cols]} />
            </li>
          ))}
        </List>
      );
    }

    case "textCards":
      return (
        <>
          <BlockHeading text={block.heading} />
          <ul className={`grid gap-4 ${COLUMNS[block.cols ?? 3]}`}>
            {block.items.map((item) => (
              <li key={item.heading}>
                <TextCard heading={item.heading} text={item.text} />
              </li>
            ))}
          </ul>
        </>
      );

    case "bulletCards":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {block.items.map((group) => (
            <Card key={group.heading} className="p-6 sm:p-8">
              <h3 className="font-serif text-3xl text-gold-soft">{group.heading}</h3>
              <ul className="mt-5 space-y-3">
                {group.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-base text-cream/80">
                    <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      );

    case "numbers":
      return <BigNumbers items={block.items} />;

    case "timeline":
      return (
        <ol className="grid gap-4 md:grid-cols-5">
          {block.items.map((item) => (
            <li
              key={item.heading}
              className="border-l-2 border-gold/60 pl-4 md:border-l-0 md:border-t-2 md:pl-0 md:pt-4"
            >
              {item.kicker ? <p className="eyebrow mb-2">{item.kicker}</p> : null}
              <p className="font-serif text-3xl text-gold-soft">{item.heading}</p>
              <p className="mt-1 text-base">{item.text}</p>
            </li>
          ))}
        </ol>
      );

    case "steps":
      return (
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((step, index) => (
            <li key={step}>
              <Card className="h-full p-5 sm:p-6">
                <span className="font-serif text-5xl leading-none text-gold">{index + 1}</span>
                <p className="mt-4 text-base text-cream">{step}</p>
              </Card>
            </li>
          ))}
        </ol>
      );

    case "offers":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {block.items.map((offer) => (
            <Card key={offer.heading} highlight={offer.highlight} className="p-6 sm:p-8">
              <p className="eyebrow">{offer.kicker}</p>
              <h3 className="mt-3 font-serif text-3xl text-gold-soft sm:text-4xl">{offer.heading}</h3>
              <p className="mt-2 font-serif text-5xl text-cream">{offer.price}</p>
              <p className="mt-4 text-base">{offer.text}</p>
            </Card>
          ))}
        </div>
      );

    case "table":
      return (
        <>
          <BlockHeading text={block.heading} />
          <DataTable
            caption={block.caption}
            head={block.head}
            rows={block.rows}
            minWidth={block.wide ? "min-w-[760px]" : "min-w-[620px]"}
          />
        </>
      );

    case "calculator":
      return <RoiCalculator settings={block.settings} />;

    case "report":
      return (
        <Card className="p-6 sm:p-8">
          <p className="eyebrow">{block.kicker}</p>
          <dl className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {block.fields.map((fieldName) => (
              <div
                key={fieldName}
                className="flex items-end justify-between gap-4 border-b border-line py-4"
              >
                <dt className="text-base text-cream/80">{fieldName}</dt>
                <dd aria-label="Left blank in this sample" className="h-px w-16 shrink-0 bg-sage/60" />
              </div>
            ))}
          </dl>
          <p className="mt-6 text-base">{block.text}</p>
        </Card>
      );

    case "faq":
      return <Faq items={block.items} />;

    case "feature":
      return (
        <div className="grid items-center gap-8 md:grid-cols-2">
          <p className="max-w-xl text-lg">{block.text}</p>
          <Card>
            <Photo name={block.image} sizes="(min-width: 768px) 50vw, 100vw" />
          </Card>
        </div>
      );

    default:
      return null;
  }
}

function Hero({ section }: { section: Extract<PitchSection, { type: "hero" }> }) {
  return (
    <header className="relative flex min-h-[100svh] items-end overflow-hidden md:items-center">
      <Image
        src={`/images/pitch/${section.image}.webp`}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={90}
        className="object-cover object-right"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/20 md:bg-gradient-to-r md:from-obsidian md:via-obsidian/80 md:to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-32 sm:px-8 md:py-24">
        <p className="eyebrow">{section.label}</p>
        <h1 className="mt-5 max-w-3xl text-6xl leading-[0.95] sm:text-7xl md:text-8xl">
          {section.title}
        </h1>
        <p className="mt-6 max-w-xl font-serif text-2xl leading-snug text-gold-soft sm:text-3xl">
          {section.subtitle}
        </p>
        <div className="mt-8 h-px w-24 bg-gold" />
        <p className="mt-6 text-base text-cream">{section.line}</p>
        <p className="mt-1 text-sm text-sage">{section.small}</p>
      </div>
    </header>
  );
}

function Contact({ section }: { section: Extract<PitchSection, { type: "contact" }> }) {
  return (
    <section className="border-t border-line bg-velvet/60">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.2fr_0.8fr] md:py-24">
        <div>
          {section.label ? <p className="eyebrow">{section.label}</p> : null}
          <h2 className={`text-5xl leading-[1.05] md:text-7xl ${section.label ? "mt-4" : ""}`}>
            {section.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg">{section.text}</p>

          <address className="mt-8 not-italic">
            <p className="font-serif text-3xl text-gold-soft">{section.name}</p>
            <p className="mt-1 text-sm text-sage">{section.role}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={`mailto:${section.email}`}
                className="button-solid min-h-[52px] normal-case tracking-normal"
              >
                {section.email}
              </a>
              {section.phone ? (
                <a
                  href={`tel:+1${section.phone.replace(/\D/g, "")}`}
                  className="button-outline min-h-[52px] tracking-[0.08em]"
                >
                  {section.phone}
                </a>
              ) : null}
            </div>
          </address>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
          <Image
            src={`/images/pitch/${section.image}.webp`}
            alt=""
            fill
            sizes="(min-width: 768px) 30vw, 80vw"
            quality={90}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}

export default function PitchPage({ content }: { content: PitchContent }) {
  return (
    <>
      {content.sections.map((section, index) => {
        // A section tied to a flag stays hidden until that flag is switched on.
        if (section.flag && !FLAGS[section.flag]) {
          return null;
        }

        if (section.type === "hero") {
          return <Hero key={index} section={section} />;
        }

        if (section.type === "contact") {
          return <Contact key={index} section={section} />;
        }

        return (
          <Section key={index} label={section.label} title={section.title} band={section.band}>
            {section.blocks.map((block, blockIndex) => (
              <Block key={blockIndex} block={block} />
            ))}
          </Section>
        );
      })}
    </>
  );
}
