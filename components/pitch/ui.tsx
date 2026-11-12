import Image from "next/image";

const IMAGE_BASE = "/images/pitch";

export function Section({
  label,
  title,
  band = false,
  children
}: {
  label?: string;
  title?: string;
  /** Slightly lighter background, to separate neighbouring sections. */
  band?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={band ? "border-y border-line bg-velvet/60" : undefined}>
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        {label ? <p className="eyebrow">{label}</p> : null}
        {title ? (
          <h2 className="mt-4 max-w-4xl text-4xl leading-[1.05] sm:text-5xl md:text-6xl">{title}</h2>
        ) : null}
        <div className={label || title ? "mt-10 md:mt-12" : undefined}>{children}</div>
      </div>
    </section>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return <p className="mt-8 max-w-3xl text-sm text-sage">{children}</p>;
}

export function Photo({
  name,
  alt = "",
  ratio = "aspect-[4/3]",
  sizes = "(min-width: 768px) 33vw, 100vw"
}: {
  name: string;
  alt?: string;
  ratio?: string;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${ratio}`}>
      <Image
        src={`${IMAGE_BASE}/${name}.webp`}
        alt={alt}
        fill
        sizes={sizes}
        quality={90}
        className="object-cover"
      />
    </div>
  );
}

export function Card({
  children,
  highlight = false,
  className = ""
}: {
  children: React.ReactNode;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border bg-velvet ${
        highlight ? "border-gold/70" : "border-line"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** A card with a photo on top, a heading and a line of text. */
export function PhotoCard({
  image,
  alt,
  heading,
  text,
  kicker,
  highlight,
  sizes
}: {
  image: string;
  alt?: string;
  heading: string;
  text?: string;
  kicker?: string;
  highlight?: boolean;
  sizes?: string;
}) {
  return (
    <Card highlight={highlight} className="h-full">
      <Photo name={image} alt={alt} sizes={sizes} />
      <div className="p-5 sm:p-6">
        {kicker ? <p className="eyebrow">{kicker}</p> : null}
        <h3 className={`font-serif text-2xl leading-snug text-gold-soft sm:text-3xl ${kicker ? "mt-3" : ""}`}>
          {heading}
        </h3>
        {text ? <p className="mt-3 text-base">{text}</p> : null}
      </div>
    </Card>
  );
}

/** A plain text card: heading plus supporting line. */
export function TextCard({ heading, text }: { heading: string; text?: string }) {
  return (
    <Card className="h-full p-5 sm:p-6">
      <h3 className="font-serif text-2xl leading-snug text-gold-soft">{heading}</h3>
      {text ? <p className="mt-2 text-base">{text}</p> : null}
    </Card>
  );
}

export function BigNumbers({ items }: { items: { value: string; text: string }[] }) {
  return (
    <dl className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.value} className="flex flex-col-reverse justify-end p-6 sm:p-8">
          <dt className="mt-3 text-base text-cream/80">{item.text}</dt>
          <dd
            className={`font-serif leading-none text-gold ${
              item.value.length > 5 ? "text-4xl sm:text-5xl" : "text-6xl sm:text-7xl"
            }`}
          >
            {item.value}
          </dd>
        </Card>
      ))}
    </dl>
  );
}

/** Wide tables scroll sideways inside their own box on small screens. */
export function DataTable({
  caption,
  head,
  rows,
  minWidth = "min-w-[640px]"
}: {
  caption: string;
  head: string[];
  rows: string[][];
  minWidth?: string;
}) {
  return (
    <div
      className="mask-scrollbar overflow-x-auto rounded-3xl border border-line bg-velvet"
      tabIndex={0}
      role="region"
      aria-label={caption}
    >
      <table className={`w-full border-collapse text-left text-base ${minWidth}`}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {head.map((cell, index) => (
              <th
                key={cell || index}
                scope="col"
                className="border-b border-line px-5 py-4 text-xs font-medium uppercase tracking-[0.2em] text-gold"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-line last:border-b-0">
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={index} scope="row" className="px-5 py-4 font-medium text-cream">
                    {cell}
                  </th>
                ) : (
                  <td key={index} className="px-5 py-4 text-cream/80">
                    {cell === "—" ? <span aria-label="Not included">—</span> : cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <dl className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <Card key={item.q} className="p-5 sm:p-6">
          <dt className="font-serif text-2xl leading-snug text-gold-soft">{item.q}</dt>
          <dd className="mt-2 text-base text-cream/80">{item.a}</dd>
        </Card>
      ))}
    </dl>
  );
}
