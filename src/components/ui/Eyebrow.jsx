import { useEffect, useState } from 'react';
import useInView from '../../hooks/useInView.js';
import { cn, hasIntersectionObserver, prefersReducedMotion } from '../../lib/env.js';

const base = 'block font-mono text-xs font-medium leading-4 tracking-[.16em] uppercase text-muted';

/**
 * Small mono label above a heading. With `type`, it types in like an instrument readout when
 * scrolled into view. The full text stays in the DOM (sr-only + transparent tail) so layout
 * never shifts and screen readers read it whole.
 */
export default function Eyebrow({ children: text, type = false, flush = false, className }) {
  const cls = cn(base, !flush && 'mb-4', className);
  const animated = type && hasIntersectionObserver && !prefersReducedMotion;
  const [ref, seen] = useInView({ threshold: 0.5 });
  const [count, setCount] = useState(animated ? 0 : text.length);
  const [cursor, setCursor] = useState(false);

  useEffect(() => {
    if (!animated || !seen) return undefined;
    let i = 0;
    let hide;
    setCursor(true);
    const iv = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) {
        clearInterval(iv);
        hide = setTimeout(() => setCursor(false), 1400);
      }
    }, 32);
    return () => {
      clearInterval(iv);
      clearTimeout(hide);
    };
  }, [animated, seen, text]);

  if (!animated) return <div className={cls}>{text}</div>;

  return (
    <div ref={ref} className={cls}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      {cursor && <i aria-hidden="true" className="ml-0.5 inline-block h-[1em] w-[.6em] animate-blink bg-brand-cyan align-[-2px]" />}
      <span aria-hidden="true" className="text-transparent">{text.slice(count)}</span>
    </div>
  );
}
