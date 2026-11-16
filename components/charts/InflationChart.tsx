"use client";

import { useState } from "react";
import { fmt, short, type YearRow } from "@/lib/sip";
import { niceMax, useWidth } from "./useWidth";

const H = 300;
const PAD = { l: 56, r: 16, t: 14, b: 26 };

/** Total value vs. what it would buy in today's money, alongside the amount invested. */
export default function InflationChart({ rows, inflation }: { rows: YearRow[]; inflation: number }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const pts = [{ year: 0, invested: 0, value: 0, real: 0 }, ...rows.map((r) => ({
    year: r.year, invested: r.invested, value: r.value,
    real: r.value / Math.pow(1 + inflation / 100, r.year),
  }))];
  const n = pts.length - 1;
  const cw = width - PAD.l - PAD.r, ch = H - PAD.t - PAD.b;
  const max = niceMax(Math.max(1, ...pts.map((p) => p.value)));
  const x = (i: number) => PAD.l + (i / n) * cw;
  const y = (v: number) => PAD.t + ch - (v / max) * ch;
  const line = (key: "invested" | "value" | "real") =>
    pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
  const labelEvery = Math.ceil(n / 10);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left - PAD.l) / cw) * n);
    setHover(i >= 1 && i <= n ? i : null);
  }

  const h = hover != null ? pts[hover] : null;
  const last = pts[n];

  return (
    <div className="chart-wrap" ref={ref}>
      <svg className="chart" viewBox={`0 0 ${width} ${H}`} height={H} role="img"
        aria-label="Total value compared with value in today's money"
        onPointerMove={onMove} onPointerDown={onMove}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") setHover(null); }}>
        {[0, 1, 2, 3, 4].map((k) => {
          const v = (max / 4) * k, yy = y(v);
          return (
            <g key={k}>
              <line className="grid" x1={PAD.l} x2={width - PAD.r} y1={yy} y2={yy} />
              <text x={PAD.l - 8} y={yy + 4} textAnchor="end">{short(v)}</text>
            </g>
          );
        })}
        {pts.map((p, i) => (i % labelEvery === 0 || i === n) && i > 0 ? (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle">{p.year}</text>
        ) : null)}

        {/* gap between total value and today's value = purchasing power lost to inflation */}
        <path d={`${line("value")} ${pts.slice().reverse().map((p, j) => `L${x(n - j)},${y(p.real)}`).join(" ")} Z`}
          fill="var(--value)" opacity={0.08} />

        <path d={line("invested")} className="ln" stroke="var(--invested)" />
        <path d={line("real")} className="ln" stroke="var(--value)" strokeDasharray="6 5" />
        <path d={line("value")} className="ln" stroke="var(--value)" />

        {h && hover != null && (
          <g>
            <line className="crosshair" x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={PAD.t + ch} />
            {(["invested", "real", "value"] as const).map((k) => (
              <circle key={k} cx={x(hover)} cy={y(h[k])} r={4.5}
                fill={k === "invested" ? "var(--invested)" : "var(--value)"} stroke="var(--card)" strokeWidth={2} />
            ))}
          </g>
        )}
      </svg>

      <div className="legend">
        <span><i className="sw value" />Total value</span>
        <span><i className="sw dashed" />In today&apos;s money ({inflation}% inflation)</span>
        <span><i className="sw invested" />Invested</span>
      </div>

      {h && hover != null && (
        <div className="tip" style={{ left: Math.min(Math.max(0, x(hover) + 12), width - 210), top: 8 }}>
          <b>Year {h.year}</b>
          <div className="tip-row"><i className="sw value" />Total value <span>{fmt(h.value)}</span></div>
          <div className="tip-row"><i className="sw dashed" />Today&apos;s money <span>{fmt(h.real)}</span></div>
          <div className="tip-row"><i className="sw invested" />Invested <span>{fmt(h.invested)}</span></div>
        </div>
      )}

      <p className="chart-note">
        At {inflation}% inflation, {fmt(last.value)} in {n} {n === 1 ? "year" : "years"} will buy about what{" "}
        <b>{fmt(last.real)}</b> buys today. The shaded gap is purchasing power lost to rising prices.
      </p>
    </div>
  );
}
