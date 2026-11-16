"use client";

import { useEffect, useState } from "react";

interface Props {
  id: string;
  label: string;
  display: string;
  value: number;
  min: number;        // slider range
  max: number;
  step: number;
  limitMin: number;   // allowed range for typed values
  limitMax: number;
  prefix?: string;    // shown inside the number box, e.g. ₹
  suffix?: string;    // e.g. %, yrs
  presets?: { label: string; value: number }[];  // quick-pick chips
  icon?: React.ReactNode;
  onChange: (v: number) => void;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/**
 * A slider paired with a number box. The box keeps its own text while you type,
 * so you can clear it or type "12.5" without the value jumping back. It is
 * clamped to the allowed range when you leave the box.
 */
export default function SliderField({ id, label, display, value, min, max, step, limitMin, limitMax, prefix, suffix, presets, icon, onChange }: Props) {
  const [text, setText] = useState(String(value));

  // Follow outside changes (slider, reset, mode switch) without fighting the user's typing.
  useEffect(() => {
    setText((t) => (parseFloat(t) === value ? t : String(value)));
  }, [value]);

  function onType(t: string) {
    setText(t);
    const n = parseFloat(t);
    if (!Number.isNaN(n) && n >= 0) onChange(Math.min(n, limitMax));
  }

  function commit() {
    const n = parseFloat(text);
    const v = clamp(Number.isNaN(n) ? value : n, limitMin, limitMax);
    onChange(v);
    setText(String(v));
  }

  const pct = ((clamp(value, min, max) - min) / (max - min)) * 100;

  return (
    <div className="field">
      <div className="field-head">
        <label htmlFor={id}>
          {icon && <span className="field-icon" aria-hidden>{icon}</span>}
          {label}
        </label>
        <div className="num-wrap">
          {prefix && <span className="unit">{prefix}</span>}
          <input
            type="number" className="num" inputMode="decimal"
            min={limitMin} max={limitMax} step="any" value={text}
            aria-label={`${label} value`}
            onChange={(e) => onType(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
          />
          {suffix && <span className="unit">{suffix}</span>}
        </div>
      </div>
      <input
        type="range" id={id} min={min} max={max} step={step}
        value={clamp(value, min, max)}
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="field-foot">
        <span>{prefix}{min.toLocaleString("en-IN")}{suffix && ` ${suffix}`}</span>
        <output>{display}</output>
        <span>{prefix}{max.toLocaleString("en-IN")}{suffix && ` ${suffix}`}</span>
      </div>
      {presets && (
        <div className="chips" role="group" aria-label={`Quick ${label.toLowerCase()} options`}>
          {presets.map((p) => (
            <button
              key={p.value} type="button"
              className={`chip ${p.value === value ? "on" : ""}`}
              aria-pressed={p.value === value}
              onClick={() => { onChange(p.value); setText(String(p.value)); }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
