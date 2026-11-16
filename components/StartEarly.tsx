import { compute, fmt } from "@/lib/sip";
import StackedBars from "./charts/StackedBars";

const MONTHLY = 5000;
const RATE = 12;
const RETIRE_AGE = 60;
const START_AGES = [25, 30, 35, 40, 45];

/** Same ₹5,000/month SIP, different starting ages, all stopping at 60. */
export default function StartEarly() {
  const items = START_AGES.map((age) => {
    const last = compute({ mode: "sip", amount: MONTHLY, rate: RATE, years: RETIRE_AGE - age, stepUp: 0 }).at(-1)!;
    return { label: `Age ${age}`, title: `Start at ${age} (${RETIRE_AGE - age} years)`, invested: last.invested, value: last.value };
  });
  const first = items[0], wait = items[1];

  return (
    <div className="split">
      <div>
        <h2>Why starting early matters</h2>
        <p>
          Each bar shows the same {fmt(MONTHLY)} monthly SIP at {RATE}% a year, stopped at age {RETIRE_AGE}. The only
          difference is when it started.
        </p>
        <div className="highlight-stats">
          <div>
            <span className="k">Start at 25</span>
            <span className="v">{fmt(first.value)}</span>
          </div>
          <div>
            <span className="k">Start at 30</span>
            <span className="v">{fmt(wait.value)}</span>
          </div>
        </div>
        <p className="muted">
          Waiting just five years means investing only {fmt(first.invested - wait.invested)} less, but ending up with
          about <b>{fmt(first.value - wait.value)} less</b>. Compounding rewards time far more than amount.
        </p>
      </div>
      <div className="card">
        <StackedBars items={items} height={280} maxBar={56} />
      </div>
    </div>
  );
}
