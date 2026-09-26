import useScrollValue from '../hooks/useScrollValue.js';
import { cn } from '../lib/env.js';

const scrollPercent = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.round(Math.min(1, Math.max(0, window.scrollY / max)) * 100) : 0;
};
const pastHalfScreen = () => window.scrollY > window.innerHeight * 0.5;
const pastFold = () => window.scrollY > 700;

/** State-of-charge meter: the page itself charges as you scroll. Ten cells, like the hero cell. */
export function ScrollMeter() {
  const pct = useScrollValue(scrollPercent);
  const show = useScrollValue(pastHalfScreen);
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed top-1/2 right-[18px] z-[45] flex -translate-y-1/2 flex-col items-center gap-1.5 border bg-white/95 px-1.5 pt-2 pb-1.5 opacity-0 transition-opacity duration-[400ms] max-xl:hidden',
        show && 'opacity-100',
      )}
    >
      <div className="h-[5px] w-2.5 bg-brand-navy" />
      <div className="relative h-[min(40vh,320px)] w-[18px] overflow-hidden border-2 border-brand-navy bg-white p-0.5 after:absolute after:inset-0 after:bg-[repeating-linear-gradient(0deg,transparent_0_calc(10%_-_2px),#fff_calc(10%_-_2px)_10%)]">
        <div className="absolute inset-0.5 origin-bottom bg-brand-cyan" style={{ transform: `scaleY(${pct / 100})` }} />
      </div>
      <div className="min-w-11 pt-0.5 text-center font-mono text-[11px] leading-[1.2] font-medium tracking-[.08em] text-brand-navy">
        <small className="block text-[9px] tracking-[.16em] text-muted">SOC</small>
        <span>{pct}%</span>
      </div>
    </div>
  );
}

export function ToTop() {
  const show = useScrollValue(pastFold);
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed right-[22px] bottom-[22px] z-40 grid size-12 place-items-center rounded-control bg-brand-navy font-sans text-lg font-semibold text-white shadow-popover transition-all duration-300',
        show ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-3 opacity-0',
      )}
    >
      ↑
    </button>
  );
}
