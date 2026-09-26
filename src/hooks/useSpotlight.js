import { finePointer, prefersReducedMotion } from '../lib/env.js';

/**
 * Pointer-follow spotlight for cards: spread the result onto the card element and render
 * <Glow /> inside it. Does nothing on touch devices or with reduced motion.
 */
export default function useSpotlight() {
  if (!finePointer || prefersReducedMotion) return {};
  return {
    onPointerMove(e) {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
    },
  };
}
