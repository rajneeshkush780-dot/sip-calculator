import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossary of investing terms",
  description: "Plain-language definitions of SIP and mutual fund terms: NAV, AMC, expense ratio, exit load, XIRR, CAGR, KYC and more.",
};

const TERMS: { term: string; full?: string; def: string }[] = [
  { term: "AMC", full: "Asset Management Company", def: "The company that runs a mutual fund, employs the fund managers and makes investment decisions for the scheme." },
  { term: "Absolute return", def: "The total percentage gain or loss on an investment, regardless of how long it was held. Useful for periods under a year." },
  { term: "CAGR", full: "Compound Annual Growth Rate", def: "The steady yearly rate at which a single investment would have grown from its starting value to its ending value. Best for lumpsum investments." },
  { term: "Compounding", def: "Earning returns on your previous returns, not just on the money you invested. Its effect grows with time." },
  { term: "Debt fund", def: "A mutual fund that mainly invests in bonds, government securities and money market instruments. Generally less volatile than equity funds, with lower expected returns." },
  { term: "Direct plan", def: "A version of a mutual fund bought straight from the fund house without a distributor. It has a lower expense ratio than the regular plan of the same fund." },
  { term: "ELSS", full: "Equity Linked Savings Scheme", def: "A tax-saving equity mutual fund with a mandatory 3-year lock-in for every investment, including each SIP instalment." },
  { term: "Equity fund", def: "A mutual fund that mainly invests in company shares. It has higher growth potential and higher short-term volatility." },
  { term: "Exit load", def: "A fee some funds charge if you redeem units before a set period, often around 1% within the first year." },
  { term: "Expense ratio", def: "The yearly fee a fund charges to manage your money, shown as a percentage of your investment. It is deducted from the fund's NAV, so returns you see are already after this cost." },
  { term: "Hybrid fund", def: "A fund that invests in a mix of equity and debt to balance growth and stability." },
  { term: "Inflation", def: "The rate at which prices rise over time, reducing what a fixed amount of money can buy." },
  { term: "KYC", full: "Know Your Customer", def: "A one-time identity verification, using documents like PAN and Aadhaar, required before you can invest in mutual funds." },
  { term: "Lumpsum", def: "Investing a single large amount at once, as opposed to spreading it out through a SIP." },
  { term: "NAV", full: "Net Asset Value", def: "The price of one unit of a mutual fund, calculated at the end of every business day as the fund's total assets minus liabilities, divided by the number of units." },
  { term: "Redemption", def: "Selling your mutual fund units back to the fund house to get your money out." },
  { term: "Regular plan", def: "A version of a mutual fund bought through a distributor or adviser. It has a higher expense ratio because it includes the distributor's commission." },
  { term: "Rupee cost averaging", def: "The effect of investing a fixed amount regularly: you buy more units when prices are low and fewer when they are high, which can lower your average cost per unit." },
  { term: "SIP", full: "Systematic Investment Plan", def: "A method of investing a fixed amount in a mutual fund at regular intervals, usually monthly, through automatic bank debits." },
  { term: "Step-up SIP", def: "A SIP whose instalment automatically increases every year by a set percentage or amount." },
  { term: "STP", full: "Systematic Transfer Plan", def: "Moving a fixed amount regularly from one fund to another, often from a debt fund into an equity fund to spread out a lumpsum." },
  { term: "SWP", full: "Systematic Withdrawal Plan", def: "Withdrawing a fixed amount from a fund at regular intervals, often used to create a monthly income in retirement." },
  { term: "Units", def: "The shares of a mutual fund you own. The lower the NAV when you invest, the more units your money buys." },
  { term: "XIRR", full: "Extended Internal Rate of Return", def: "An annualised return that accounts for the timing of every cash flow. It is the standard way to measure SIP returns, since each instalment is invested on a different date." },
];

export default function GlossaryPage() {
  const letters = [...new Set(TERMS.map((t) => t.term[0].toUpperCase()))].sort();
  const sorted = [...TERMS].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Glossary</span>
          <h1>Investing terms, explained simply</h1>
          <p className="lead">Definitions of the words you&apos;ll come across when investing through a SIP.</p>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <nav className="letters" aria-label="Jump to letter">
            {letters.map((l) => <a key={l} href={`#letter-${l}`}>{l}</a>)}
          </nav>
          <dl className="glossary">
            {sorted.map((t, i) => {
              const letter = t.term[0].toUpperCase();
              const first = i === 0 || sorted[i - 1].term[0].toUpperCase() !== letter;
              return (
                <div key={t.term} className="term" id={first ? `letter-${letter}` : undefined}>
                  <dt>
                    {t.term}
                    {t.full && <span className="full"> · {t.full}</span>}
                  </dt>
                  <dd>{t.def}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>
    </main>
  );
}
