import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../lib/env.js';

/** Eased count from `from` to `to` (cubic ease-out). Rests on `to` until enabled. */
export default function useCountUp(to, { from = 0, duration = 1600, enabled = true } = {}) {
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!enabled || prefersReducedMotion) {
      setValue(to);
      return undefined;
    }
    let raf;
    let t0 = null;
    const step = (ts) => {
      if (t0 === null) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setValue(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [enabled, to, from, duration]);

  return value;
}
