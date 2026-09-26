import { useEffect, useRef, useState } from 'react';
import { hasIntersectionObserver, prefersReducedMotion } from '../lib/env.js';

/**
 * One-shot visibility: returns [ref, seen]. `seen` flips to true the first time the element
 * scrolls into view and stays true. With reduced motion (or no IntersectionObserver) it is
 * true from the start, so nothing is ever left hidden.
 */
export default function useInView(options = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(prefersReducedMotion || !hasIntersectionObserver);

  useEffect(() => {
    const el = ref.current;
    if (seen || !el) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // `options` is a literal per call site and only read on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);

  return [ref, seen];
}
