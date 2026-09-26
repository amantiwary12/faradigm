import { twMerge } from 'tailwind-merge';

const mq = (q) => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(q).matches;

// Read once at load: these don't change during a visit in any way the design cares about.
export const prefersReducedMotion = mq('(prefers-reduced-motion: reduce)');
export const finePointer = mq('(pointer: fine)');
export const hasIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window;

// Joins class names and lets the last of any conflicting Tailwind utilities win
export const cn = (...parts) => twMerge(parts.filter(Boolean).join(' '));
