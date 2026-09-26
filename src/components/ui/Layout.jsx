import { cn } from '../../lib/env.js';

/** Centres content in the 1200px column with the page gutter. */
export function Wrap({ className, ...props }) {
  return <div className={cn('mx-auto w-full max-w-page px-6 max-sm:px-[18px]', className)} {...props} />;
}

/** A page section with the standard fluid vertical padding. */
export function Section({ className, ...props }) {
  return <section className={cn('py-[clamp(64px,9vw,112px)]', className)} {...props} />;
}

/** Big italic headline style shared by section titles. */
export const titleClass = 'text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.04] font-extrabold tracking-[-.025em] italic';
