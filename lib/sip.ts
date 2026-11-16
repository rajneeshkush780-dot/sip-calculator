export type Mode = "sip" | "lumpsum";

export interface Inputs {
  mode: Mode;
  amount: number;   // monthly for SIP, one-time for lumpsum
  rate: number;     // expected annual return, %
  years: number;
  stepUp: number;   // yearly increase in the SIP amount, %
}

export interface YearRow {
  year: number;
  monthly: number | null;
  invested: number;
  value: number;
}

/** Year-by-year growth. SIP compounds monthly with deposits at the start of each month
 *  (as standard SIP calculators do); lumpsum compounds annually. */
export function compute({ mode, amount, rate, years, stepUp }: Inputs): YearRow[] {
  const rows: YearRow[] = [];

  if (mode === "lumpsum") {
    let value = amount;
    for (let y = 1; y <= years; y++) {
      value *= 1 + rate / 100;
      rows.push({ year: y, monthly: null, invested: amount, value });
    }
    return rows;
  }

  const i = rate / 12 / 100;
  let value = 0, invested = 0, monthly = amount;
  for (let y = 1; y <= years; y++) {
    if (y > 1) monthly *= 1 + stepUp / 100;
    for (let m = 0; m < 12; m++) {
      value = (value + monthly) * (1 + i);
      invested += monthly;
    }
    rows.push({ year: y, monthly, invested, value });
  }
  return rows;
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const fmt = (n: number) => inr.format(Math.round(n));

/** Compact axis label: ₹25 L, ₹1.2 Cr */
export function short(n: number): string {
  // Trim trailing zeros so axis ticks read "₹25 L", "₹1 Cr", "₹3.53 Cr"
  const trim = (v: number, d: number) => String(Number(v.toFixed(d)));
  if (n >= 9.995e6) return "₹" + trim(n / 1e7, n >= 1e8 ? 1 : 2) + " Cr";
  if (n >= 1e5) return "₹" + trim(n / 1e5, n >= 1e6 ? 1 : 2) + " L";
  if (n >= 1e3) return "₹" + trim(n / 1e3, 1) + "K";
  return "₹" + Math.round(n);
}
