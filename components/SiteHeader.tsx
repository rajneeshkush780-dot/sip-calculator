"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Calculator" },
  { href: "/learn", label: "What is SIP" },
  { href: "/glossary", label: "Glossary" },
  { href: "/faq", label: "FAQ" },
];

export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden>₹</span>
          <span>SIP<span className="brand-light">Wise</span></span>
        </Link>
        <button
          className="menu-btn" aria-label="Menu" aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
        <nav className={`nav ${open ? "open" : ""}`}>
          {LINKS.map((l) => (
            <Link
              key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={path === l.href ? "active" : ""}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
