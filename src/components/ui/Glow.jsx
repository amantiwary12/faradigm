import { finePointer, prefersReducedMotion } from '../../lib/env.js';

/**
 * Cyan spotlight that follows the pointer. The parent needs `group isolate relative`
 * and the props from useSpotlight(). Sits at -z-10 so it lights the card without tinting text.
 */
export default function Glow() {
  if (!finePointer || prefersReducedMotion) return null;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),rgba(0,147,221,.11),transparent_60%)] opacity-0 transition-opacity duration-[350ms] group-hover:opacity-100"
    />
  );
}
