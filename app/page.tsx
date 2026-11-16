import Link from "next/link";
import SipCalculator from "@/components/SipCalculator";
import StartEarly from "@/components/StartEarly";

const CONCEPTS = [
  {
    icon: "📅",
    title: "Invest a fixed amount, regularly",
    body: "A SIP automatically invests the same amount into a mutual fund every month (or week, or quarter), straight from your bank account.",
  },
  {
    icon: "⚖️",
    title: "Rupee cost averaging",
    body: "When prices are low your fixed amount buys more units; when prices are high it buys fewer. Over time this can lower your average cost per unit.",
  },
  {
    icon: "📈",
    title: "The power of compounding",
    body: "Returns earn returns of their own. The longer you stay invested, the larger the share of your final value that comes from growth rather than deposits.",
  },
  {
    icon: "🧘",
    title: "Discipline without timing",
    body: "You don't have to guess when the market will rise or fall. A SIP keeps you investing steadily, which removes much of the emotion from the decision.",
  },
];

const STEPS = [
  { n: 1, title: "Choose SIP or Lumpsum", body: "Use SIP for a monthly amount, or Lumpsum for a one-time investment." },
  { n: 2, title: "Enter your numbers", body: "Set the amount, expected yearly return and how many years you plan to stay invested." },
  { n: 3, title: "Add a step-up (optional)", body: "Increase your SIP each year, for example by 10% as your income grows." },
  { n: 4, title: "Press Calculate", body: "See your total invested, estimated returns and final value, then switch between charts for growth, breakdown, inflation and different return rates." },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-inner">
          <span className="eyebrow">Free SIP &amp; Lumpsum calculator</span>
          <h1>See how small, regular investments grow into real wealth</h1>
          <p className="lead">
            Plan your Systematic Investment Plan in seconds. Adjust the amount, return and time period
            to see your estimated returns, a year-by-year breakdown and the effect of inflation.
          </p>
          <div className="hero-cta">
            <a href="#calculator" className="btn primary">Calculate now</a>
            <Link href="/learn" className="btn ghost">Learn what a SIP is</Link>
          </div>
        </div>
      </section>

      <section id="calculator" className="section calc-section">
        {/* Anchors for /#sip and /#lumpsum links; the calculator reads the hash to pick the mode */}
        <span id="sip" className="anchor" aria-hidden />
        <span id="lumpsum" className="anchor" aria-hidden />
        <div className="container">
          <div className="section-head">
            <h2>SIP calculator</h2>
            <p className="muted">Set your numbers, press <b>Calculate</b>, then explore the results in four different charts.</p>
          </div>
          <SipCalculator />
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <h2>What is a SIP?</h2>
            <p className="muted">
              A <strong>Systematic Investment Plan (SIP)</strong> is a way of investing in mutual funds where
              you put in a fixed amount at regular intervals instead of a large sum all at once. It works much
              like a recurring deposit, but your money buys mutual fund units whose value moves with the market.
            </p>
          </div>
          <div className="cards">
            {CONCEPTS.map((c) => (
              <article key={c.title} className="info-card">
                <span className="info-icon" aria-hidden>{c.icon}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))}
          </div>
          <p className="center">
            <Link href="/learn" className="text-link">Read the full guide to SIPs →</Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>How to use this calculator</h2>
          </div>
          <ol className="steps">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="step-n">{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <StartEarly />
        </div>
      </section>

      <section className="section">
        <div className="container cta-band">
          <div>
            <h2>New to investing?</h2>
            <p>Our glossary explains terms like NAV, expense ratio, XIRR and exit load in plain language.</p>
          </div>
          <div className="hero-cta">
            <Link href="/glossary" className="btn primary">Open glossary</Link>
            <Link href="/faq" className="btn ghost">Read FAQs</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
