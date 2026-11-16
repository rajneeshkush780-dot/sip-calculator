import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand">
            <span className="brand-mark" aria-hidden>₹</span><span>SIP<span className="brand-light">Wise</span></span>
          </div>
          <p className="muted small">
            Free tools and plain-language guides to help you understand systematic investing.
          </p>
        </div>
        <div>
          <h4>Tools</h4>
          {/* plain <a>: Next's Link doesn't fire hashchange, which the calculator listens for */}
          <a href="/#sip">SIP calculator</a>
          <a href="/#lumpsum">Lumpsum calculator</a>
        </div>
        <div>
          <h4>Learn</h4>
          <Link href="/learn">What is SIP</Link>
          <Link href="/learn#types">Types of SIP</Link>
          <Link href="/glossary">Glossary</Link>
          <Link href="/faq">FAQ</Link>
        </div>
      </div>
      <div className="container disclaimer">
        <p>
          <strong>Disclaimer:</strong> This website is for education only and is not investment advice.
          Calculations assume a constant rate of return; real mutual fund returns go up and down and are
          not guaranteed. Mutual fund investments are subject to market risks. Read all scheme-related
          documents carefully, and consider speaking to a SEBI-registered investment adviser before investing.
        </p>
        <p className="muted">© {new Date().getFullYear()} SIPWise</p>
      </div>
    </footer>
  );
}
