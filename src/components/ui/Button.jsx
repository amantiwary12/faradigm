import { Link } from 'react-router-dom';
import { cn, finePointer, prefersReducedMotion } from '../../lib/env.js';

const base =
  'group/btn inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-control border-2 border-transparent px-6 font-sans text-[15px] leading-none font-semibold transition-[background-color,color,border-color,transform] duration-200';

// Every colour here is a role token, so the same class works on light and dark sections.
const variants = {
  primary: 'border-action bg-action text-surface hover:border-action-hover hover:bg-action-hover',
  secondary: 'border-action bg-transparent text-heading hover:bg-surface-highlight',
  // The red accent is the sales CTA only — one per layout
  accent: 'border-brand-red bg-brand-red text-white hover:border-[#7E1C15] hover:bg-[#7E1C15]',
};

const magnetic = finePointer && !prefersReducedMotion;
const lean = {
  onPointerMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
  },
  onPointerLeave(e) {
    e.currentTarget.style.transform = '';
  },
};

/** A router <Link> with `to`, an <a> with `href`, otherwise a <button>. `lean` makes it drift toward the pointer. */
export default function Button({ variant = 'primary', arrow, lean: leans = false, className, children, ...props }) {
  const Tag = props.to ? Link : props.href ? 'a' : 'button';
  return (
    <Tag
      {...(Tag === 'button' && { type: props.type || 'button' })}
      {...(leans && magnetic ? lean : {})}
      {...props}
      className={cn(base, variants[variant], className)}
    >
      {children}
      {arrow && <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-[3px]">→</span>}
    </Tag>
  );
}
