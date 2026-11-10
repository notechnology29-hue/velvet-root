"use client";

import { useMemo, useState } from "react";

/**
 * Dispensary partnership return calculator.
 * Direct port of the published calculator. Keep the math identical.
 * Defaults = realistic case. Stretch case: 35% redemption, $75 kit, 30% regulars.
 */

type FeeType = "flat" | "perf";

const money = (n: number) =>
  (n < 0 ? "−$" : "$") + Math.round(Math.abs(n)).toLocaleString("en-US");

export type CalculatorPreset = { key: string; label: string; guests: number; flat: number };

/** Event presets and fee terms. Supplied with the page content, never hardcoded here. */
export type CalculatorSettings = {
  presets: CalculatorPreset[];
  /** Key of the preset selected when the page opens. */
  start?: string;
  base: number;
  per: number;
  cap: number;
};

function Slider(props: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  hint?: string;
  onChange: (v: number) => void;
}) {
  const { id, label, value, min, max, step, format, hint, onChange } = props;
  return (
    <div className="mb-4">
      <label htmlFor={id} className="flex justify-between gap-3 text-sm font-medium">
        <span>{label}</span>
        <output htmlFor={id} className="font-bold tabular-nums text-gold">
          {format(value)}
        </output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-6 w-full cursor-pointer accent-gold"
      />
      {hint ? <p className="mt-1 text-xs text-sage">{hint}</p> : null}
    </div>
  );
}

export default function RoiCalculator({ settings }: { settings: CalculatorSettings }) {
  const presets = settings.presets ?? [];
  const first = presets.find((item) => item.key === settings.start) ?? presets[0];

  const [preset, setPreset] = useState<string | null>(first?.key ?? null);
  const [guests, setGuests] = useState(first?.guests ?? 100);
  const [redeem, setRedeem] = useState(20);
  const [basket, setBasket] = useState(55);
  const [margin, setMargin] = useState(45);
  const [repeat, setRepeat] = useState(20);
  const [monthly, setMonthly] = useState(75);
  const [months, setMonths] = useState(6);
  const [medShare, setMedShare] = useState(10);
  const [medSpend, setMedSpend] = useState(200);
  const [feeType, setFeeType] = useState<FeeType>("flat");
  const [fee, setFee] = useState(first?.flat ?? 5000);
  const [base, setBase] = useState(settings.base);
  const [per, setPer] = useState(settings.per);
  const [cap, setCap] = useState(settings.cap);

  const feeFor = (visits: number) =>
    feeType === "flat" ? fee : Math.min(cap, base + per * visits);

  const model = (rate: number) => {
    const m = margin / 100;
    const visits = guests * rate;
    const fr = visits * basket;
    const regulars = (visits * repeat) / 100;
    const ms = medShare / 100;
    const rr = regulars * (ms * medSpend + (1 - ms) * monthly) * months;
    return { visits, regulars, fr, fg: fr * m, rr, rg: rr * m, fee: feeFor(visits) };
  };

  const x = useMemo(
    () => model(redeem / 100),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [guests, redeem, basket, margin, repeat, monthly, months, medShare, medSpend, feeType, fee, base, per, cap]
  );

  const breakEven = useMemo(() => {
    for (let r = 0.001; r <= 1.0001; r += 0.001) {
      const y = model(r);
      if (y.fg + y.rg >= y.fee) return r;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guests, basket, margin, repeat, monthly, months, medShare, medSpend, feeType, fee, base, per, cap]);

  const gp = x.fg + x.rg;
  const net = gp - x.fee;
  const v = Math.round(x.visits);
  const r = Math.round(x.regulars);
  const max = Math.max(gp, x.fee) * 1.08 || 1;
  const pct = (n: number) => `${(n / max) * 100}%`;

  const applyPreset = (item: CalculatorPreset) => {
    setPreset(item.key);
    setGuests(item.guests);
    setFee(item.flat);
    setFeeType("flat");
  };

  return (
    <section aria-label="Partnership return calculator" className="grid gap-8 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
      <div className="rounded-2xl border border-line bg-velvet p-6">
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Choose an event">
          {presets.map((item) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={preset === item.key}
              onClick={() => applyPreset(item)}
              className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 ${
                preset === item.key ? "border-gold bg-gold text-obsidian" : "border-line text-cream hover:border-gold/60"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <h3 className="mb-3 font-serif text-2xl text-gold-soft">The event</h3>
        <Slider id="guests" label="Guests who receive your offer" value={guests} min={25} max={600} step={5}
          format={(n) => String(n)} onChange={(n) => { setGuests(n); setPreset(null); }} />
        <Slider id="redeem" label="Guests who redeem in your store" value={redeem} min={5} max={80} step={1}
          format={(n) => `${n}%`} hint="Unknown until the pilot. Realistic case 20%; stretch case 35%." onChange={setRedeem} />

        <h3 className="mb-3 mt-6 font-serif text-2xl text-gold-soft">Your store</h3>
        <Slider id="basket" label="Average first purchase" value={basket} min={20} max={250} step={5}
          format={money} hint="Arizona's last published average basket was about $52." onChange={setBasket} />
        <Slider id="margin" label="Gross margin" value={margin} min={15} max={70} step={1} format={(n) => `${n}%`} onChange={setMargin} />
        <Slider id="repeat" label="Visitors who become regulars" value={repeat} min={0} max={70} step={1} format={(n) => `${n}%`} onChange={setRepeat} />
        <Slider id="monthly" label="A regular's monthly spend" value={monthly} min={20} max={300} step={5} format={money} onChange={setMonthly} />
        <Slider id="months" label="Months a regular keeps buying" value={months} min={0} max={12} step={1} format={(n) => String(n)} onChange={setMonths} />
        <Slider id="medshare" label="Regulars who are medical cardholders" value={medShare} min={0} max={50} step={1}
          format={(n) => `${n}%`} hint="Cardholders are under 2% of Arizona adults but buy far more often." onChange={setMedShare} />
        <Slider id="medspend" label="A medical regular's monthly spend" value={medSpend} min={50} max={400} step={10}
          format={money} hint="Arizona averaged roughly $200 per cardholder per month in 2024." onChange={setMedSpend} />

        <h3 className="mb-3 mt-6 font-serif text-2xl text-gold-soft">Your partnership fee</h3>
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Fee type">
          {(["flat", "perf"] as FeeType[]).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={feeType === t}
              onClick={() => setFeeType(t)}
              className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 ${
                feeType === t ? "border-gold bg-gold text-obsidian" : "border-line text-cream hover:border-gold/60"
              }`}
            >
              {t === "flat" ? "Flat fee" : "Base plus per redemption"}
            </button>
          ))}
        </div>
        {feeType === "flat" ? (
          <Slider id="fee" label="Flat fee" value={fee} min={500} max={30000} step={500} format={money}
            onChange={(n) => { setFee(n); setPreset(null); }} />
        ) : (
          <>
            <Slider id="base" label="Base fee" value={base} min={0} max={20000} step={500} format={money} onChange={setBase} />
            <Slider id="per" label="Per redeemed code" value={per} min={0} max={75} step={5} format={money} onChange={setPer} />
            <Slider id="cap" label="Fee cap" value={cap} min={1000} max={30000} step={500} format={money} onChange={setCap} />
          </>
        )}
      </div>

      <div className="flex flex-col gap-5" aria-live="polite">
        <div className="rounded-2xl border border-line bg-velvet p-6">
          <p className="font-serif text-2xl leading-tight md:text-3xl">
            {net >= 0
              ? `Your estimated gross profit covers the fee with ${money(net)} to spare.`
              : `Your estimated gross profit is ${money(-net)} short of the fee.`}
          </p>
          <p className="mt-2 text-cream/80">
            {money(gp)} estimated gross profit against a {money(x.fee)} fee, from {v} store visits.
          </p>

          <div className="relative mt-12 h-14 rounded-xl bg-line" role="img"
            aria-label={`First-visit gross profit ${money(x.fg)}, repeat gross profit ${money(x.rg)}, fee ${money(x.fee)}`}>
            <div className="absolute left-0 top-0 h-full rounded-l-xl bg-botanical" style={{ width: pct(x.fg) }} />
            <div className="absolute top-0 h-full bg-botanical/50" style={{ left: pct(x.fg), width: pct(x.rg) }} />
            <div className="absolute -bottom-2.5 -top-2.5 w-[3px] rounded bg-rose" style={{ left: pct(x.fee) }} />
            <div className="absolute -top-8 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-cream" style={{ left: pct(x.fee) }}>
              Fee {money(x.fee)}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-cream/80">
            <span><span className="mr-1.5 inline-block h-3 w-3 rounded-sm bg-botanical align-[-1px]" />First-visit gross profit</span>
            <span><span className="mr-1.5 inline-block h-3 w-3 rounded-sm bg-botanical/50 align-[-1px]" />Repeat-customer gross profit</span>
            <span><span className="mr-1.5 inline-block h-3 w-3 rounded-sm bg-rose align-[-1px]" />Partnership fee</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [v.toLocaleString("en-US"), "store visits"],
            [r.toLocaleString("en-US"), "new regular customers"],
            [v ? money(x.fee / x.visits) : "—", "fee per store visit"],
            [breakEven === null ? "Above 100%" : `${Math.round(breakEven * 100)}%`, "redemption rate to break even"]
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-line bg-velvet p-4">
              <b className="block font-serif text-3xl tabular-nums text-gold-soft">{value}</b>
              <span className="text-xs text-cream/80">{label}</span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-line bg-velvet p-6">
          <h3 className="mb-3 font-serif text-2xl text-gold-soft">The math</h3>
          <table className="w-full text-sm tabular-nums">
            <thead className="text-sage">
              <tr><th className="py-2 text-left">Source</th><th className="text-right">Customers</th><th className="text-right">Revenue</th><th className="text-right">Gross profit</th></tr>
            </thead>
            <tbody>
              <tr className="border-t border-line"><td className="py-2">First visits</td><td className="text-right">{v}</td><td className="text-right">{money(x.fr)}</td><td className="text-right">{money(x.fg)}</td></tr>
              <tr className="border-t border-line"><td className="py-2">Repeat purchases</td><td className="text-right">{r}</td><td className="text-right">{money(x.rr)}</td><td className="text-right">{money(x.rg)}</td></tr>
              <tr className="border-t border-line"><td className="py-2">Partnership fee</td><td /><td /><td className="text-right">{money(-x.fee)}</td></tr>
              <tr className="border-t border-line font-bold"><td className="py-2">Net after fee</td><td /><td className="text-right">{money(x.fr + x.rr)}</td><td className="text-right">{money(net)}</td></tr>
            </tbody>
          </table>
          <p className="mt-4 text-xs text-sage">
            Estimates only, not a promise. No cannabis is sold, sampled or given away at our events; every sale happens at your
            counter, and you share redemption totals only.
          </p>
        </div>
      </div>
    </section>
  );
}
