import { stats } from '../data/content.js';
import Reveal from './ui/Reveal.jsx';
import CountUp from './ui/CountUp.jsx';
import { Wrap } from './ui/Layout.jsx';

function Figure({ parts }) {
  return parts.map((p, i) => {
    if (typeof p === 'string') return p;
    if (p.em) return <em key={i} className="text-brand-cyan not-italic">{p.em}</em>;
    return <CountUp key={i} to={p.count} />;
  });
}

export default function Stats() {
  return (
    <section id="stats" aria-label="Key figures" className="border-y bg-surface-alt text-ink">
      <Wrap className="grid grid-cols-4 max-md:grid-cols-2 *:min-w-0">
        {stats.map((s) => (
          // Each cell is a size container so the figure can scale with its own width (cqi)
          <Reveal
            key={s.id}
            delay={s.delay}
            className="@container relative border-l p-[48px_32px] first:border-l-0 hover:bg-surface max-md:nth-3:border-l-0 max-md:nth-[n+3]:border-t max-sm:px-[18px] max-sm:py-7 max-xs:px-3 max-xs:py-[22px] after:absolute after:bottom-6 after:left-8 after:h-1 after:w-0 after:bg-brand-cyan after:transition-[width] after:duration-[400ms] after:ease-[cubic-bezier(.2,.7,.2,1)] hover:after:w-11"
          >
            <div className="font-mono text-[clamp(1.3rem,19cqi,3.3rem)] leading-none font-medium tracking-[-.03em] whitespace-nowrap text-heading">
              <Figure parts={s.parts} />
            </div>
            <p className="mt-4 mb-0 max-w-[26ch] text-sm leading-[21px] text-muted">{s.caption}</p>
          </Reveal>
        ))}
      </Wrap>
    </section>
  );
}
