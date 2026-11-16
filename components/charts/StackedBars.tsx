"use client";

import { useState } from "react";
import { fmt, short } from "@/lib/sip";
import { niceMax, useWidth } from "./useWidth";

export interface BarItem {
  label: string;     // axis label
  title: string;     // tooltip heading
  invested: number;
  value: number;
}

const PAD = { l: 56, r: 12, t: 12, b: 26 };

/** Stacked columns: invested at the base, returns on top, with a hover tooltip. */
export default function StackedBars({ items, height = 300, maxBar = 28 }: { items: BarItem[]; height?: number; maxBar?: number }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const cw = width - PAD.l - PAD.r;
  const ch = height - PAD.t - PAD.b;
  const max = niceMax(Math.max(1, ...items.map((r) => r.value)));
  const n = items.length;
  const slot = cw / n;
  const bw = Math.max(3, Math.min(maxBar, slot * 0.62));
  const y = (v: number) => PAD.t + ch - (v / max) * ch;
  const labelEvery = Math.ceil(n / 10);
  const base = PAD.t + ch;

  const h = hover != null ? items[hover] : null;
  const tipX = hover != null ? PAD.l + slot * hover + slot / 2 : 0;

  return (
    <div className="chart-wrap" ref={ref}>
      <svg
        className="chart" viewBox={`0 0 ${width} ${height}`} height={height}
        role="img" aria-label="Invested amount and returns"
        onPointerLeave={(e) => { if (e.pointerType === "mouse") setHover(null); }}
      >
        {[0, 1, 2, 3, 4].map((k) => {
          const v = (max / 4) * k, yy = y(v);
          return (
            <g key={k}>
              <line className="grid" x1={PAD.l} x2={width - PAD.r} y1={yy} y2={yy} />
              <text x={PAD.l - 8} y={yy + 4} textAnchor="end">{short(v)}</text>
            </g>
          );
        })}
        {items.map((r, idx) => {
          const x = PAD.l + slot * idx + (slot - bw) / 2;
          const yi = y(r.invested), yv = y(r.value);
          const dim = hover != null && hover !== idx ? 0.45 : 1;
          return (
            <g key={r.label + idx} opacity={dim}>
              {/* invested: square top (it's under the returns segment) */}
              <rect x={x} y={yi} width={bw} height={Math.max(0, base - yi)} fill="var(--invested)" />
              {/* returns: rounded data-end, 2px surface gap from the invested segment */}
              {yi - yv > 2 && (
                <path d={roundTop(x, yv, bw, yi - yv - 2, Math.min(4, bw / 2))} fill="var(--value)" />
              )}
              {((idx + 1) % labelEvery === 0 || idx === 0 || n <= 10) && (
                <text x={x + bw / 2} y={height - 8} textAnchor="middle">{r.label}</text>
              )}
              {/* hit target is the whole column slot, larger than the bar */}
              <rect
                x={PAD.l + slot * idx} y={PAD.t} width={slot} height={ch}
                fill="transparent" onPointerEnter={() => setHover(idx)} onPointerDown={() => setHover(idx)}
              />
            </g>
          );
        })}
      </svg>

      <Legend items={[["invested", "Invested"], ["value", "Returns"]]} />

      {h && (
        <div className="tip" style={{ left: Math.min(Math.max(0, tipX - 90), width - 190), top: Math.max(0, y(h.value) - 104) }}>
          <b>{h.title}</b>
          <div className="tip-row"><i className="sw invested" />Invested <span>{fmt(h.invested)}</span></div>
          <div className="tip-row"><i className="sw value" />Returns <span>{fmt(h.value - h.invested)}</span></div>
          <div className="tip-row total">Total <span>{fmt(h.value)}</span></div>
        </div>
      )}
    </div>
  );
}

function roundTop(x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, h);
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

export function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className="legend">
      {items.map(([cls, label]) => (
        <span key={label}><i className={`sw ${cls}`} />{label}</span>
      ))}
    </div>
  );
}
