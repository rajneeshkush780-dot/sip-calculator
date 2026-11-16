import type { Metadata } from "next";
import Link from "next/link";
import RcaChart from "@/components/charts/RcaChart";
import StackedBars from "@/components/charts/StackedBars";
import { compute } from "@/lib/sip";

const COMPOUND = [5, 10, 15, 20, 25, 30].map((y) => {
  const last = compute({ mode: "sip", amount: 10000, rate: 12, years: y, stepUp: 0 }).at(-1)!;
  return { label: `${y} yrs`, title: `After ${y} years`, invested: last.invested, value: last.value };
});

export const metadata: Metadata = {
  title: "What is SIP? A complete guide",
  description:
    "Learn what a Systematic Investment Plan is, how it works, rupee cost averaging, compounding, types of SIP, benefits, risks and how to start.",
};

const TOC = [
  ["definition", "What is a SIP?"],
  ["how-it-works", "How a SIP works"],
  ["rupee-cost-averaging", "Rupee cost averaging"],
  ["compounding", "The power of compounding"],
  ["types", "Types of SIP"],
  ["sip-vs-lumpsum", "SIP vs lumpsum"],
  ["benefits", "Benefits"],
  ["risks", "Risks and limitations"],
  ["start", "How to start a SIP"],
  ["tax", "Tax basics"],
] as const;

const RCA = [
  { m: "Month 1", nav: 50, units: 100 },
  { m: "Month 2", nav: 40, units: 125 },
  { m: "Month 3", nav: 25, units: 200 },
  { m: "Month 4", nav: 40, units: 125 },
  { m: "Month 5", nav: 50, units: 100 },
];

const TYPES = [
  { name: "Regular SIP", body: "A fixed amount invested at a fixed interval, usually monthly. The simplest and most common type." },
  { name: "Step-up (Top-up) SIP", body: "The SIP amount increases automatically every year by a fixed amount or percentage, so your investing keeps pace with a growing income." },
  { name: "Flexible SIP", body: "Lets you change the amount of each instalment, or skip one, depending on your cash flow." },
  { name: "Perpetual SIP", body: "Has no end date. It continues until you choose to stop it, which suits long-term goals like retirement." },
  { name: "Trigger SIP", body: "Starts or changes investments when a condition you set is met, such as a market index reaching a certain level. Better suited to experienced investors." },
];

export default function LearnPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Guide</span>
          <h1>What is SIP? Everything you need to know</h1>
          <p className="lead">
            A beginner-friendly explanation of Systematic Investment Plans: what they are, how they grow
            your money, and what to watch out for.
          </p>
        </div>
      </section>

      <div className="container article-layout">
        <aside className="toc">
          <h4>On this page</h4>
          <nav>
            {TOC.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>
        </aside>

        <article className="prose">
          <h2 id="definition">What is a SIP?</h2>
          <div className="definition">
            <span className="def-label">Definition</span>
            <p>
              A <strong>Systematic Investment Plan (SIP)</strong> is a method of investing a fixed sum of money
              in a mutual fund scheme at regular intervals (such as every month) instead of investing a large
              amount at once.
            </p>
          </div>
          <p>
            A SIP is not a product in itself; it is a <em>way of investing</em> in a mutual fund. You choose a
            fund, an amount and a date, and that amount is debited from your bank account automatically on
            each date. Many funds accept SIPs starting from as little as ₹100–₹500 a month, which makes
            investing accessible to almost everyone.
          </p>

          <h2 id="how-it-works">How a SIP works</h2>
          <p>
            Every time an instalment is debited, the fund uses it to buy <strong>units</strong> at that
            day&apos;s <strong>Net Asset Value (NAV)</strong>, which is the price of one unit. For example, if the
            NAV is ₹50, an instalment of ₹5,000 buys 100 units.
          </p>
          <p>
            Over months and years you build up a pile of units. The value of your investment at any time is
            the total number of units you hold multiplied by the current NAV.
          </p>

          <h2 id="rupee-cost-averaging">Rupee cost averaging</h2>
          <p>
            Because you invest the same amount every time, you automatically buy <strong>more units when
            prices are low</strong> and <strong>fewer units when prices are high</strong>. This is called
            rupee cost averaging. Here is an example with ₹5,000 invested each month while the NAV rises and falls:
          </p>
          <RcaChart rows={RCA} amount={5000} />
          <div className="table-scroll">
            <table>
              <thead><tr><th>Month</th><th>Invested</th><th>NAV</th><th>Units bought</th></tr></thead>
              <tbody>
                {RCA.map((r) => (
                  <tr key={r.m}><td>{r.m}</td><td>₹5,000</td><td>₹{r.nav}</td><td>{r.units}</td></tr>
                ))}
                <tr className="total-row"><td>Total</td><td>₹25,000</td><td>Avg ₹41.00</td><td>650</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            The average NAV over these months was ₹41, but your <strong>average cost per unit was only
            ₹38.46</strong> (₹25,000 spread over 650 units). Even though the NAV ended exactly where it started (₹50),
            your 650 units are now worth <strong>₹32,500</strong>, a gain of ₹7,500 that came from buying
            more units during the dip.
          </p>
          <p className="callout">
            Rupee cost averaging reduces the risk of investing everything at a market peak. It does not
            guarantee a profit or protect against a market that keeps falling.
          </p>

          <h2 id="compounding">The power of compounding</h2>
          <p>
            Compounding means your returns start earning returns of their own. In the early years most of your
            balance is money you put in; in later years growth starts to dominate. That is why
            <strong> starting early matters more than investing a large amount</strong>.
          </p>
          <p>
            The chart below follows ₹10,000 a month at 12% a year. It grows to roughly ₹23 lakh in 10 years,
            ₹1 crore in 20 years and ₹3.5 crore in 30 years. Watch the green returns segment take over.
            Hover over a bar for the details.
          </p>
          <div className="card chart-card">
            <StackedBars items={COMPOUND} height={280} maxBar={48} />
          </div>
          <p>
            Tripling the time period from 10 to 30 years multiplies the final value by about 15. Try your own
            numbers in the <Link href="/#calculator">calculator</Link>. Real returns vary from year to year,
            so treat these as estimates rather than promises.
          </p>

          <h2 id="types">Types of SIP</h2>
          <div className="type-list">
            {TYPES.map((t) => (
              <div key={t.name} className="type-item">
                <h3>{t.name}</h3>
                <p>{t.body}</p>
              </div>
            ))}
          </div>

          <h2 id="sip-vs-lumpsum">SIP vs lumpsum</h2>
          <div className="table-scroll">
            <table className="compare">
              <thead><tr><th></th><th>SIP</th><th>Lumpsum</th></tr></thead>
              <tbody>
                <tr><td>How you invest</td><td>Small fixed amounts at regular intervals</td><td>One large amount at once</td></tr>
                <tr><td>Best for</td><td>Regular monthly income, salaried investors</td><td>A bonus, inheritance or other large sum</td></tr>
                <tr><td>Market timing</td><td>Not needed; purchases are spread out</td><td>Entry point matters a lot</td></tr>
                <tr><td>Cost averaging</td><td>Yes</td><td>No</td></tr>
                <tr><td>In a steadily rising market</td><td>Usually earns less than lumpsum</td><td>Usually earns more, since all money is invested from day one</td></tr>
                <tr><td>Discipline</td><td>Automated habit</td><td>One-time decision</td></tr>
              </tbody>
            </table>
          </div>

          <h2 id="benefits">Benefits</h2>
          <ul>
            <li><b>Low starting amount:</b> begin with a few hundred rupees a month.</li>
            <li><b>Financial discipline:</b> automatic debits turn investing into a habit.</li>
            <li><b>No need to time the market:</b> regular buying smooths out ups and downs.</li>
            <li><b>Compounding:</b> long holding periods let returns build on returns.</li>
            <li><b>Flexibility:</b> you can usually pause, increase, decrease or stop a SIP.</li>
            <li><b>Professional management:</b> fund managers handle research and stock selection.</li>
          </ul>

          <h2 id="risks">Risks and limitations</h2>
          <ul>
            <li><b>Market risk:</b> equity fund values can fall, sometimes sharply. Returns are not guaranteed.</li>
            <li><b>Short horizons:</b> over 1–3 years an equity SIP can show a loss. SIPs work best over 5+ years.</li>
            <li><b>Costs:</b> every fund charges an expense ratio, and many charge an exit load if you redeem early.</li>
            <li><b>Stopping in a downturn:</b> pausing a SIP when markets fall means missing the cheap units that make cost averaging work.</li>
            <li><b>Inflation:</b> a large number in the future buys less than it does today. Use the inflation setting in the calculator to see real value.</li>
          </ul>

          <h2 id="start">How to start a SIP</h2>
          <ol>
            <li><b>Set a goal:</b> decide what you are saving for, how much you need and by when.</li>
            <li><b>Complete KYC:</b> a one-time identity verification using PAN, Aadhaar and a bank account.</li>
            <li><b>Pick a fund:</b> match the fund type (equity, debt, hybrid) to your goal and risk tolerance.</li>
            <li><b>Choose direct or regular plan:</b> direct plans have lower expense ratios because no distributor commission is paid.</li>
            <li><b>Set the amount and date:</b> pick a date shortly after your salary is credited.</li>
            <li><b>Register the mandate:</b> authorise auto-debit from your bank (NACH or UPI AutoPay).</li>
            <li><b>Review once a year:</b> check progress and consider a step-up as your income grows.</li>
          </ol>

          <h2 id="tax">Tax basics</h2>
          <p>
            Gains from mutual funds are taxed when you redeem units. Each SIP instalment is treated as a
            separate purchase, so its holding period is counted from its own date.
          </p>
          <ul>
            <li><b>Equity funds:</b> units held for more than 12 months are taxed as long-term capital gains, at a lower rate and with an annual exemption limit. Units held for 12 months or less are taxed as short-term gains at a higher rate.</li>
            <li><b>Debt funds:</b> gains are generally added to your income and taxed at your slab rate.</li>
            <li><b>ELSS funds:</b> tax-saving equity funds with a 3-year lock-in, applied separately to each SIP instalment.</li>
          </ul>
          <p className="callout">
            Tax rates and limits change with government budgets. Check the current rules or consult a tax
            professional before redeeming.
          </p>

          <div className="article-cta">
            <h3>Ready to plan your SIP?</h3>
            <p>See how much your monthly investment could grow to.</p>
            <Link href="/#calculator" className="btn primary">Open the calculator</Link>
          </div>
        </article>
      </div>
    </main>
  );
}
