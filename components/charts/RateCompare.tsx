"use client";

import { useState } from "react";
import { fmt, short } from "@/lib/sip";
import { useWidth } from "./useWidth";

export interface RateItem { rate: number; value: number; invested: number }

/** Final value at several return rates; the user's own rate is highlighted. */
export default function RateCompare({ items, current }: { items: RateItem[]; current: number }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const LABEL_W = 64, VALUE_W = 74, ROW = 40, BAR = 22;
  const max = Math.max(1, ...items.map((i) => i.value));
  const cw = width - LABEL_W - VALUE_W;
  const H = items.length * ROW;
  const xi = (v: number) => (v / max) * cw;

  return (
    <div className="chart-wrap" ref={ref}>
      <svg className="chart" viewBox={`0 0 ${width} ${H}`} height={H} role="img"
        aria-label="Final value at different rates of return">
        {items.map((it, i) => {
          const isCur = it.rate === current;
          const yy = i * ROW + (ROW - BAR) / 2;
          const dim = hover != null ? hover !== i : !isCur;
          const wv = Math.max(4, xi(it.value));
          const wi = Math.max(0, xi(it.invested) - 2);
          return (
            <g key={it.rate} onPointerEnter={() => setHover(i)} onPointerDown={() => setHover(i)} onPointerLeave={() => setHover(null)}>
              <rect x={0} y={i * ROW} width={width} height={ROW} fill="transparent" />
              <text x={LABEL_W - 10} y={yy + BAR / 2 + 4} textAnchor="end" className={isCur ? "strong" : ""}>
                {it.rate}%{isCur ? " ★" : ""}
              </text>
              <g opacity={dim ? 0.4 : 1}>
                <rect x={LABEL_W} y={yy} width={wv} height={BAR} rx={4} fill="var(--value)" />
                <rect x={LABEL_W} y={yy} width={wi} height={BAR} fill="var(--invested)" />
              </g>
              <text x={LABEL_W + wv + 8} y={yy + BAR / 2 + 4} className={isCur ? "strong" : ""}>{short(it.value)}</text>
            </g>
          );
        })}
      </svg>
      <div className="legend">
        <span><i className="sw invested" />Invested</span>
        <span><i className="sw value" />Returns</span>
        <span>★ your expected return</span>
      </div>
      {hover != null && (
        <div className="tip" style={{ left: Math.min(LABEL_W + 20, width - 200), top: Math.max(0, hover * ROW - 92) }}>
          <b>At {items[hover].rate}% a year</b>
          <div className="tip-row"><i className="sw invested" />Invested <span>{fmt(items[hover].invested)}</span></div>
          <div className="tip-row"><i className="sw value" />Returns <span>{fmt(items[hover].value - items[hover].invested)}</span></div>
          <div className="tip-row total">Total <span>{fmt(items[hover].value)}</span></div>
        </div>
      )}
      <p className="chart-note">
        Small differences in return add up over time. Compare a cautious and an optimistic assumption before you plan.
      </p>
    </div>
  );
}
