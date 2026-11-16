"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { compute, fmt, short, type Mode } from "@/lib/sip";
import SliderField from "./SliderField";
import { useCountUp } from "./useCountUp";
import { IconCalendar, IconCoins, IconFlame, IconPercent, IconShield, IconStairs, IconTrend, IconWallet } from "./icons";
import StackedBars from "./charts/StackedBars";
import DonutChart from "./charts/DonutChart";
import InflationChart from "./charts/InflationChart";
import RateCompare from "./charts/RateCompare";

interface Params {
  mode: Mode;
  amount: number;
  rate: number;
  years: number;
  stepUp: number;
  inflation: number;
}

const DEFAULT_AMOUNT: Record<Mode, number> = { sip: 10000, lumpsum: 100000 };
const defaults = (mode: Mode): Params => ({ mode, amount: DEFAULT_AMOUNT[mode], rate: 12, years: 10, stepUp: 0, inflation: 6 });
const COMPARE_RATES = [8, 10, 12, 14, 16];
const AUTO_KEY = "sipwise:auto";

const VIEWS = [
  { id: "growth", label: "Growth" },
  { id: "breakdown", label: "Breakdown" },
  { id: "inflation", label: "Inflation" },
  { id: "rates", label: "Compare returns" },
] as const;
type View = (typeof VIEWS)[number]["id"];

/** Values that are safe to calculate with, whatever is half-typed in the boxes. */
function sanitize(p: Params): Params {
  return {
    ...p,
    amount: Math.max(0, p.amount),
    rate: Math.min(Math.max(0, p.rate), 50),
    years: Math.min(Math.max(1, Math.round(p.years)), 60),
    stepUp: p.mode === "sip" ? Math.min(Math.max(0, p.stepUp), 50) : 0,
    inflation: Math.min(Math.max(0, p.inflation), 20),
  };
}

const run = (p: Params, rate = p.rate) =>
  compute({ mode: p.mode, amount: p.amount, rate, years: p.years, stepUp: p.stepUp });

export default function SipCalculator() {
  const [draft, setDraftState] = useState<Params>(() => defaults("sip"));
  const [applied, setApplied] = useState<Params>(() => defaults("sip"));
  const [auto, setAuto] = useState(true);
  const [view, setView] = useState<View>("growth");
  const resultsRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  // Always holds the latest inputs, so Calculate never reads a stale value
  // (e.g. when Enter commits a number box and submits in the same keystroke).
  const draftRef = useRef(draft);

  const setDraft = (next: Params) => { draftRef.current = next; setDraftState(next); };
  const set = <K extends keyof Params>(k: K) => (v: Params[K]) => setDraft({ ...draftRef.current, [k]: v });

  // Remember the auto-calculate preference for this browser.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTO_KEY);
      if (saved !== null) setAuto(saved === "1");
    } catch { /* storage blocked: keep default */ }
  }, []);
  function toggleAuto(on: boolean) {
    setAuto(on);
    if (on) setApplied(draftRef.current);
    try { localStorage.setItem(AUTO_KEY, on ? "1" : "0"); } catch { /* ignore */ }
  }

  function switchMode(m: Mode, scroll = false) {
    if (draftRef.current.mode !== m) {
      const next = { ...draftRef.current, mode: m, amount: DEFAULT_AMOUNT[m] };
      setDraft(next);
      setApplied(next); // the form changes shape, so show matching results right away
    }
    if (scroll) document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Links like /#lumpsum or /#sip open the calculator in that mode.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (h === "lumpsum" || h === "sip") switchMode(h, false); // the #sip / #lumpsum anchors handle scrolling
    };
    fromHash();
    // Arriving from another page: jump straight to the calculator once the page has rendered.
    if (/^#(sip|lumpsum)$/.test(window.location.hash)) {
      setTimeout(() => document.getElementById("calculator")?.scrollIntoView({ behavior: "instant", block: "start" }), 50);
    }
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function calculate() {
    setApplied(draftRef.current);
    if (window.innerWidth < 820) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() {
    const next = defaults(draftRef.current.mode);
    setDraft(next);
    setApplied(next);
  }

  const shown = sanitize(auto ? draft : applied);
  const dirty = !auto && JSON.stringify(sanitize(draft)) !== JSON.stringify(sanitize(applied));
  const isSip = draft.mode === "sip";
  const draftYears = Math.max(1, Math.round(draft.years));

  const rows = useMemo(() => run(shown), [JSON.stringify(shown)]); // eslint-disable-line react-hooks/exhaustive-deps
  const last = rows[rows.length - 1];
  const real = last.value / Math.pow(1 + shown.inflation / 100, shown.years);

  const rateItems = useMemo(() => {
    const rates = [...new Set([...COMPARE_RATES, shown.rate])].sort((a, b) => a - b);
    return rates.map((r) => {
      const l = run(shown, r).at(-1)!;
      return { rate: r, value: l.value, invested: l.invested };
    });
  }, [JSON.stringify(shown)]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="calc-grid" ref={rootRef}>
      <form className="card calc-form" onSubmit={(e) => { e.preventDefault(); calculate(); }}>
        <h3 className="form-title">Your investment</h3>
        <div className="tabs" role="tablist" aria-label="Investment type">
          {(["sip", "lumpsum"] as const).map((m) => (
            <button
              key={m} type="button" role="tab" aria-selected={draft.mode === m}
              className={`tab ${draft.mode === m ? "active" : ""}`}
              onClick={() => switchMode(m)}
            >
              {m === "sip" ? "SIP" : "Lumpsum"}
            </button>
          ))}
        </div>

        <SliderField
          key={`amount-${draft.mode}`}
          id="amount" label={isSip ? "Monthly investment" : "Total investment"} display={fmt(draft.amount)}
          value={draft.amount} onChange={set("amount")}
          min={isSip ? 500 : 5000} max={isSip ? 200000 : 10000000} step={isSip ? 500 : 5000}
          limitMin={100} limitMax={100000000} prefix="₹" icon={<IconWallet />}
          presets={isSip
            ? [1000, 5000, 10000, 25000, 50000].map((v) => ({ value: v, label: short(v) }))
            : [50000, 100000, 500000, 1000000, 2500000].map((v) => ({ value: v, label: short(v) }))}
        />
        <SliderField id="rate" label="Expected return (p.a.)" display={`${draft.rate}% a year`}
          value={draft.rate} onChange={set("rate")} min={1} max={30} step={0.1} limitMin={0} limitMax={50} suffix="%"
          icon={<IconPercent />}
          presets={[{ value: 8, label: "8% Safe" }, { value: 12, label: "12% Balanced" }, { value: 15, label: "15% Bold" }]} />
        <SliderField id="years" label="Time period" display={`${draftYears} ${draftYears === 1 ? "year" : "years"}`}
          value={draft.years} onChange={set("years")} min={1} max={40} step={1} limitMin={1} limitMax={60} suffix="yrs"
          icon={<IconCalendar />}
          presets={[5, 10, 15, 20, 30].map((v) => ({ value: v, label: `${v}Y` }))} />
        {isSip && (
          <SliderField id="stepup" label="Annual step-up" display={draft.stepUp ? `+${draft.stepUp}% every year` : "No step-up"}
            value={draft.stepUp} onChange={set("stepUp")} min={0} max={25} step={1} limitMin={0} limitMax={50} suffix="%"
            icon={<IconStairs />} />
        )}
        <SliderField id="inflation" label="Inflation" display={`${draft.inflation}% a year`}
          value={draft.inflation} onChange={set("inflation")} min={0} max={12} step={0.5} limitMin={0} limitMax={20} suffix="%"
          icon={<IconFlame />} />

        <label className="switch">
          <input type="checkbox" checked={auto} onChange={(e) => toggleAuto(e.target.checked)} />
          <span className="track" aria-hidden><span className="thumb" /></span>
          <span>
            <b>Auto-calculate</b>
            <small>{auto ? "Results update as you change the inputs" : "Results update when you press Calculate"}</small>
          </span>
        </label>

        <div className="form-actions">
          <button type="submit" className="btn primary block">Calculate</button>
          <button type="button" className="btn ghost" onClick={reset}>Reset</button>
        </div>
        <p className={`pending ${dirty ? "show" : ""}`} aria-live="polite">
          {dirty ? "Inputs changed. Press Calculate to update the results." : " "}
        </p>
      </form>

      <section className={`card results ${dirty ? "stale" : ""}`} ref={resultsRef} aria-label="Results">
        <TotalHero
          total={last.value} invested={last.invested}
          caption={`${shown.mode === "sip" ? `${fmt(shown.amount)} a month` : `${fmt(shown.amount)} once`} · ${shown.years} ${shown.years === 1 ? "year" : "years"} · ${shown.rate}% a year`}
        />
        <div className="stats">
          <Stat label="Total invested" value={fmt(last.invested)} kind="invested" icon={<IconCoins />} />
          <Stat label="Est. returns" value={fmt(last.value - last.invested)} kind="value" icon={<IconTrend />} />
          <Stat label="In today's money" value={fmt(real)} kind="real" icon={<IconShield />} />
        </div>

        <div className="chart-tabs" role="tablist" aria-label="Chart view">
          {VIEWS.map((v) => (
            <button key={v.id} type="button" role="tab" aria-selected={view === v.id}
              className={view === v.id ? "active" : ""} onClick={() => setView(v.id)}>
              {v.label}
            </button>
          ))}
        </div>

        {view === "growth" && (
          <StackedBars items={rows.map((r) => ({ label: String(r.year), title: `Year ${r.year}`, invested: r.invested, value: r.value }))} />
        )}
        {view === "breakdown" && <DonutChart invested={last.invested} value={last.value} />}
        {view === "inflation" && <InflationChart rows={rows} inflation={shown.inflation} />}
        {view === "rates" && <RateCompare items={rateItems} current={shown.rate} />}
      </section>

      <section className="card table-card">
        <h2>Year-by-year breakdown</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>Year</th><th>{shown.mode === "sip" ? "Monthly" : "Invested at start"}</th><th>Invested</th><th>Returns</th><th>Value</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year}>
                  <td>{r.year}</td>
                  <td>{r.monthly == null ? (r.year === 1 ? fmt(r.invested) : "–") : fmt(r.monthly)}</td>
                  <td>{fmt(r.invested)}</td>
                  <td>{fmt(r.value - r.invested)}</td>
                  <td>{fmt(r.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="note">
          Estimates assume a constant rate of return. Actual market returns vary; this is not financial advice.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value, kind, icon }: { label: string; value: string; kind: "invested" | "value" | "real"; icon: React.ReactNode }) {
  return (
    <div className={`stat stat-${kind}`}>
      <span className="stat-icon" aria-hidden>{icon}</span>
      <span className="stat-text">
        <span className="k">{label}</span>
        <span className="v">{value}</span>
      </span>
    </div>
  );
}

function TotalHero({ total, invested, caption }: { total: number; invested: number; caption: string }) {
  const animated = useCountUp(total);
  const returns = Math.max(0, total - invested);
  const investedPct = total > 0 ? Math.round((invested / total) * 100) : 100;
  return (
    <div className="total-hero">
      <div className="hero-top">
        <div>
          <span className="k">Your estimated total value</span>
          <span className="v" aria-live="polite">{fmt(animated)}</span>
          <span className="sub">{caption}</span>
        </div>
        <div className="multiple" title="Final value divided by amount invested">
          <b>{(total / Math.max(1, invested)).toFixed(1)}×</b>
          <span>your money</span>
        </div>
      </div>
      <div className="hero-split" aria-label={`${investedPct}% invested, ${100 - investedPct}% returns`}>
        <div className="split-bar">
          <span className="seg inv" style={{ width: `${investedPct}%` }} />
          <span className="seg ret" style={{ width: `${100 - investedPct}%` }} />
        </div>
        <div className="split-legend">
          <span><i className="dot inv" />Invested {investedPct}%</span>
          <span><i className="dot ret" />Returns {100 - investedPct}% · {fmt(returns)}</span>
        </div>
      </div>
    </div>
  );
}
