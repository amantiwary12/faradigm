import useInView from '../../hooks/useInView.js';
import { cn } from '../../lib/env.js';

/** The brand rail: a cyan line that draws itself in, then a + node lands at the end. */
export default function Rail({ short = false, className }) {
  const [ref, seen] = useInView({ threshold: 0.2 });
  return <div ref={ref} aria-hidden="true" data-in={seen || undefined} className={cn('rail', short && 'short', className)} />;
}
