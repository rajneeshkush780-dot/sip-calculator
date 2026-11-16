import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SIP FAQs",
  description: "Answers to common questions about SIPs: minimum amount, missed instalments, stopping a SIP, returns and more.",
};

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is the minimum amount to start a SIP?",
    a: "Many mutual funds allow SIPs from ₹100 to ₹500 a month. The exact minimum depends on the scheme and is listed in its documents.",
  },
  {
    q: "Is SIP the same as a mutual fund?",
    a: "No. A mutual fund is the investment product. A SIP is one way of investing in it, by putting in a fixed amount regularly. You can also invest in the same fund as a one-time lumpsum.",
  },
  {
    q: "Are SIP returns guaranteed?",
    a: "No. SIP returns depend on how the underlying fund performs. Equity funds can go down as well as up. The numbers in this calculator are estimates based on the constant return you enter.",
  },
  {
    q: "What return should I assume in the calculator?",
    a: "There is no single correct number. Many people use a conservative long-term assumption, for example 10–12% for diversified equity funds and 6–8% for debt funds, and check how the results change at lower rates. Past performance does not guarantee future returns.",
  },
  {
    q: "What happens if I miss a SIP instalment?",
    a: "Usually nothing serious. That month's investment simply doesn't happen, and your bank may charge a fee for the failed debit. Some fund houses cancel a SIP after several consecutive missed instalments.",
  },
  {
    q: "Can I stop or pause my SIP?",
    a: "Yes. Most fund houses and investment platforms let you pause a SIP for a few months or cancel it at any time. The units you already own stay invested until you choose to redeem them.",
  },
  {
    q: "Can I withdraw my money at any time?",
    a: "For most open-ended funds, yes. Some funds charge an exit load (often around 1%) if you redeem within a set period, such as one year. ELSS tax-saving funds have a 3-year lock-in for each instalment.",
  },
  {
    q: "Which SIP date is best?",
    a: "Over the long run the date makes very little difference to returns. Choose a date a few days after your salary is credited so the debit never fails.",
  },
  {
    q: "What is a step-up SIP and should I use one?",
    a: (
      <>
        A step-up SIP increases your instalment every year by a fixed percentage or amount. Because it raises
        your contributions in line with your income, it can make a large difference to the final value. Try a
        10% step-up in the <Link href="/#calculator">calculator</Link> to see the effect.
      </>
    ),
  },
  {
    q: "How are SIP returns actually measured?",
    a: "Because each instalment is invested on a different date, simple percentage returns are misleading. Fund statements use XIRR (extended internal rate of return), which gives an annualised return that accounts for the timing of every cash flow.",
  },
  {
    q: "Is a SIP better than a fixed deposit?",
    a: "They serve different needs. A fixed deposit offers a guaranteed return with low risk. An equity SIP has historically had the potential for higher long-term returns, but with ups and downs along the way. Many people use both: FDs for safety and short-term needs, SIPs for long-term goals.",
  },
  {
    q: "What does 'In today's money' mean in the calculator?",
    a: "It adjusts the final value for inflation, showing roughly what that future amount would buy at today's prices. For example, at 6% inflation ₹23 lakh in 10 years has about the purchasing power of ₹13 lakh today.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">FAQ</span>
          <h1>Frequently asked questions</h1>
          <p className="lead">Quick answers to the questions people ask most about SIPs.</p>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <div className="faq">
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <div className="faq-a">{f.a}</div>
              </details>
            ))}
          </div>
          <p className="center muted">
            Still unsure about a term? Check the <Link href="/glossary" className="text-link">glossary</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
