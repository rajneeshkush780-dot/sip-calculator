"use client";

import { useState } from "react";

export interface RcaRow { m: string; nav: number; units: number }

const H = 200, PAD = { l: 40, r: 12, t: 22, b: 26 };

/** Two small charts side by side (never a dual axis): price per unit, and units bought. */
export default function RcaChart({ rows, amount }: { rows: RcaRow[]; amount: number }) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="rca">
      <MiniChart title="Price per unit (NAV)" rows={rows} hover={hover} setHover={setHover}
        get={(r) => r.nav} fmt={(v) => `₹${v}`} kind="line" amount={amount} />
      <MiniChart title={`Units bought with ₹${amount.toLocaleString("en-IN")}`} rows={rows} hover={hover} setHover={setHover}
        get={(r) => r.units} fmt={(v) => String(v)} kind="bar" amount={amount} />
    </div>
  );
}

function MiniChart({ title, rows, get, fmt, kind, hover, setHover, amount }: {
  title: string; rows: RcaRow[]; get: (r: RcaRow) => number; fmt: (v: number) => string;
  kind: "line" | "bar"; hover: number | null; setHover: (i: number | null) => void; amount: number;
}) {
  const W = 320;
  const cw = W - PAD.l - PAD.r, ch = H - PAD.t - PAD.b;
  const max = Math.max(...rows.map(get)) * 1.15;
  const slot = cw / rows.length;
  const cx = (i: number) => PAD.l + slot * i + slot / 2;
  const y = (v: number) => PAD.t + ch - (v / max) * ch;
  const bw = slot * 0.5;

  return (
    <figure className="mini">
      <figcaption>{title}</figcaption>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} onMouseLeave={() => setHover(null)}>
        <line className="grid" x1={PAD.l} x2={W - PAD.r} y1={PAD.t + ch} y2={PAD.t + ch} />
        {kind === "line" && (
          <path className="ln" stroke="var(--invested)"
            d={rows.map((r, i) => `${i ? "L" : "M"}${cx(i)},${y(get(r))}`).join(" ")} />
        )}
        {rows.map((r, i) => {
          const v = get(r);
          const on = hover === i;
          return (
            <g key={r.m} opacity={hover != null && !on ? 0.45 : 1}>
              {kind === "bar"
                ? <path d={`M${cx(i) - bw / 2},${PAD.t + ch} V${y(v) + 4} Q${cx(i) - bw / 2},${y(v)} ${cx(i) - bw / 2 + 4},${y(v)} H${cx(i) + bw / 2 - 4} Q${cx(i) + bw / 2},${y(v)} ${cx(i) + bw / 2},${y(v) + 4} V${PAD.t + ch} Z`} fill="var(--value)" />
                : <circle cx={cx(i)} cy={y(v)} r={on ? 6 : 4.5} fill="var(--invested)" stroke="var(--card)" strokeWidth={2} />}
              <text x={cx(i)} y={y(v) - 8} textAnchor="middle" className={on ? "strong" : ""}>{fmt(v)}</text>
              <text x={cx(i)} y={H - 8} textAnchor="middle">{r.m.replace("Month ", "M")}</text>
              <rect x={PAD.l + slot * i} y={0} width={slot} height={H} fill="transparent" onMouseEnter={() => setHover(i)} />
            </g>
          );
        })}
      </svg>
      <p className="chart-note">
        {hover != null
          ? `${rows[hover].m}: at ₹${rows[hover].nav} a unit, ₹${amount.toLocaleString("en-IN")} bought ${rows[hover].units} units.`
          : kind === "line" ? "The price falls, then recovers." : "You automatically buy the most units when the price is lowest."}
      </p>
    </figure>
  );
}
