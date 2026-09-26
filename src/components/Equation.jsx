import useInView from '../hooks/useInView.js';
import { cn } from '../lib/env.js';
import Reveal from './ui/Reveal.jsx';
import { Wrap } from './ui/Layout.jsx';

const half = 'inline-flex transition-transform duration-1000 ease-[cubic-bezier(.2,.7,.2,1)]';
const op = 'font-semibold text-muted not-italic transition-opacity delay-500 duration-500';

/** Name origin: the shared letters light up and merge into FARADIGM®. */
export default function Equation() {
  const [ref, seen] = useInView();
  // The letters both words share get a cyan underline; the rest fade back
  const keep = (text) => (
    <span
      className={cn(
        'relative after:absolute after:inset-x-0 after:-bottom-[.1em] after:h-1 after:origin-left after:bg-brand-cyan after:transition-transform after:delay-[600ms] after:duration-700 after:ease-[cubic-bezier(.2,.7,.2,1)]',
        seen ? 'after:scale-x-100' : 'after:scale-x-0',
      )}
    >
      {text}
    </span>
  );
  const gone = (text) => <span className="text-muted opacity-[.38]">{text}</span>;

  return (
    <section aria-label="Name origin" className="overflow-hidden bg-surface-highlight py-[clamp(56px,7vw,88px)] text-heading">
      <Wrap>
        <div
          ref={ref}
          className="relative flex flex-wrap items-center justify-center gap-[clamp(12px,2.4vw,32px)] font-display text-[clamp(1.6rem,4.6vw,3.6rem)] leading-[1.05] font-extrabold tracking-[-.03em] italic"
        >
          <span className={cn(half, !seen && '-translate-x-10')}>{keep('FARA')}{gone('DS')}</span>
          <span className={cn(op, !seen && 'opacity-0')}>+</span>
          <span className={cn(half, !seen && 'translate-x-10')}>{gone('PARA')}{keep('DIGM')}</span>
          <span className={cn(op, !seen && 'opacity-0')}>=</span>
          <span
            className={cn(
              'bg-brand-navy px-[.36em] py-[.12em] text-white [clip-path:inset(0)] transition-[clip-path] delay-[1100ms] duration-[900ms] ease-[cubic-bezier(.7,0,.2,1)]',
              !seen && '[clip-path:inset(0_100%_0_0)]',
            )}
          >
            FARADIGM®
          </span>
        </div>
        <Reveal as="p" delay={1} className="relative mx-auto mt-8 mb-0 max-w-[760px] text-center text-base leading-[26px] text-muted">
          Capacitance is measured in Farads. Thanks to nanotechnology, ultracapacitors reach hundreds and thousands of Farads. That is a <strong>paradigm shift</strong> in energy storage, and it is how the name Faradigm® was coined.
        </Reveal>
      </Wrap>
    </section>
  );
}
