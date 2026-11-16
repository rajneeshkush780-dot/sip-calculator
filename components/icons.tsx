// Small stroke icons (24×24 grid, inherit currentColor).
const P = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconWallet = () => (
  <svg {...P}><path d="M3 7a2 2 0 0 1 2-2h12v4" /><path d="M3 7v10a2 2 0 0 0 2 2h14V9H5a2 2 0 0 1-2-2Z" /><circle cx="16" cy="14" r="1.2" /></svg>
);
export const IconPercent = () => (
  <svg {...P}><path d="M19 5 5 19" /><circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="17" r="2.5" /></svg>
);
export const IconCalendar = () => (
  <svg {...P}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
);
export const IconStairs = () => (
  <svg {...P}><path d="M3 20h5v-5h5v-5h5V5h3" /></svg>
);
export const IconFlame = () => (
  <svg {...P}><path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.5 1 2.5 2 2.5 0-3-1-5 1-8Z" /></svg>
);
export const IconCoins = () => (
  <svg {...P}><ellipse cx="9" cy="7" rx="6" ry="3" /><path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7" /><path d="M15 11.5c3.3 0 6 1.3 6 3v3c0 1.7-2.7 3-6 3-2 0-3.8-.5-4.9-1.3" /></svg>
);
export const IconTrend = () => (
  <svg {...P}><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>
);
export const IconShield = () => (
  <svg {...P}><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
