"use client";

import { useState } from "react";
import { fmt, short } from "@/lib/sip";

/** Share of the final value that is your money vs. growth. */
export default function DonutChart({ invested, value }: { invested: number; value: number }) {
  const [hover, setHover] = useState<"invested" | "value" | null>(null);
  const returns = Math.max(0, value - invested);
  const total = invested + returns || 1;
  const parts = [
    { key: "invested" as const, label: "Invested", amount: invested, color: "var(--invested)" },
    { key: "value" as const, label: "Returns", amount: returns, color: "var(--value)" },
  ];

  const R = 80, STROKE = 26, C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 200 200" className="donut" role="img" aria-label="Invested vs returns share">
        <g transform="rotate(-90 100 100)">
          {parts.map((p) => {
            const len = (p.amount / total) * C;
            const seg = (
              <circle
                key={p.key} cx={100} cy={100} r={R} fill="none"
                stroke={p.color} strokeWidth={hover === p.key ? STROKE + 6 : STROKE}
                strokeDasharray={`${Math.max(0, len - 2)} ${C}`} strokeDashoffset={-offset}
                opacity={hover && hover !== p.key ? 0.45 : 1}
                onPointerEnter={() => setHover(p.key)} onPointerDown={() => setHover(p.key)} onPointerLeave={() => setHover(null)}
                style={{ transition: "stroke-width .15s, opacity .15s", cursor: "default" }}
              />
            );
            offset += len;
            return seg;
          })}
        </g>
        <text x={100} y={94} textAnchor="middle" className="donut-k">
          {hover ? parts.find((p) => p.key === hover)!.label : "Total value"}
        </text>
        <text x={100} y={118} textAnchor="middle" className="donut-v">
          {short(hover ? parts.find((p) => p.key === hover)!.amount : value)}
        </text>
      </svg>

      <ul className="donut-legend">
        {parts.map((p) => (
          <li key={p.key} onMouseEnter={() => setHover(p.key)} onMouseLeave={() => setHover(null)}>
            <i className={`sw ${p.key}`} />
            <span className="dl-label">{p.label}</span>
            <span className="dl-pct">{Math.round((p.amount / total) * 100)}%</span>
            <span className="dl-amt">{fmt(p.amount)}</span>
          </li>
        ))}
        <li className="dl-total">
          <span className="dl-label">Total value</span>
          <span className="dl-amt">{fmt(value)}</span>
        </li>
        <li className="dl-note">
          {returns > invested
            ? `Growth makes up more of your final value than the money you put in. That is ${(value / Math.max(invested, 1)).toFixed(1)}× your investment.`
            : `Your money has grown ${(value / Math.max(invested, 1)).toFixed(1)}×. Staying invested longer increases the share that comes from growth.`}
        </li>
      </ul>
    </div>
  );
}
