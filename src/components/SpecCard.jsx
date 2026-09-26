import { specRows } from '../data/content.js';
import Eyebrow from './ui/Eyebrow.jsx';
import Rail from './ui/Rail.jsx';
import RegMarks from './ui/RegMarks.jsx';
import { cn } from '../lib/env.js';

/** Spec card: mono eyebrow, the figure as headline, hairline rows, closed by a rail. */
export default function SpecCard({ className, ...props }) {
  return (
    <div className={cn('reg border bg-surface-alt p-6', className)} {...props}>
      <div className="flex flex-col gap-2 border-b pb-4">
        <Eyebrow flush>Ultracapacitor cell · JS55555</Eyebrow>
        <p className="m-0 font-mono text-[clamp(1.6rem,3vw,2.2rem)] leading-none font-medium text-heading">
          <b className="font-medium text-accent">200 V</b> <span className="text-[.5em] tracking-[.06em] text-muted">max</span>
        </p>
      </div>
      <dl className="m-0 grid">
        {specRows.map(([term, value]) => (
          <div key={term} className="flex items-baseline justify-between gap-4 border-b py-2.5 last:border-b-0">
            <dt className="text-sm text-muted">{term}</dt>
            <dd className="m-0 text-right font-mono text-sm text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <Rail className="mt-4" />
      <RegMarks />
    </div>
  );
}
