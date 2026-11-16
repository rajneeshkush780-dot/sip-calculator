"use client";

import { useEffect, useRef, useState } from "react";

/** Animates a number toward `target`. Always lands on the exact target, even if animation frames are paused. */
export function useCountUp(target: number, ms = 600) {
  const [shown, setShown] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    fromRef.current = target;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || from === target) { setShown(target); return; }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Safety net for background tabs where animation frames don't run.
    const done = setTimeout(() => setShown(target), ms + 100);
    return () => { cancelAnimationFrame(raf); clearTimeout(done); };
  }, [target, ms]);

  return shown;
}
