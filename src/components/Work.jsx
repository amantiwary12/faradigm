import { Link } from 'react-router-dom';
import { cases } from '../data/cases.js';
import { cn } from '../lib/env.js';
import Reveal from './ui/Reveal.jsx';
import SectionHead from './ui/SectionHead.jsx';
import { Section, Wrap } from './ui/Layout.jsx';

const tempCell = 'border border-l-4 bg-surface px-[18px] py-4';
const tempFigure = 'block font-mono text-[1.6rem] leading-[1.15] font-medium text-heading';

/** −30 °C to +50 °C, with 0 °C marked at 37.5% along the scale */
function TempRange() {
  const label = 'absolute top-[18px] font-mono text-[11px] text-muted';
  return (
    <div aria-hidden="true" className="relative col-span-full mt-1 h-[34px]">
      <div className="absolute inset-x-0 top-1.5 h-1.5 bg-[linear-gradient(90deg,var(--color-brand-cyan),var(--color-navy-100)_50%,var(--color-brand-red))]" />
      <div className="absolute top-px left-[37.5%] h-4 w-0.5 bg-brand-navy" />
      <span className={cn(label, 'left-0')}>−30 °C</span>
      <span className={cn(label, 'left-[37.5%] -translate-x-1/2')}>0 °C</span>
      <span className={cn(label, 'right-0')}>+50 °C</span>
    </div>
  );
}

/** One case study: image beside the story. `flip` puts the image on the right on wide screens. */
export function CaseCard({ c, flip = false, link = false }) {
  return (
    <Reveal
      as="article"
      className={cn(
        'group mb-8 grid grid-cols-2 overflow-hidden border bg-surface-alt hover:border-brand-cyan max-md:grid-cols-1',
        flip && 'md:*:first:order-2',
      )}
    >
      <div className={cn('relative min-h-[380px] overflow-hidden bg-surface-panel max-md:min-h-[300px] max-sm:min-h-[240px]', c.contain && 'bg-surface')}>
        <span className="absolute top-5 left-5 z-[1] rounded-pill bg-brand-navy px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-[.14em] text-white uppercase">{c.tag}</span>
        <img
          src={c.image}
          alt={c.alt}
          width={c.width}
          height={c.height}
          loading="lazy"
          decoding="async"
          className={cn('absolute inset-0 size-full transition-transform duration-[800ms] group-hover:scale-105', c.contain ? 'object-contain p-9 mix-blend-multiply' : 'object-cover')}
        />
      </div>
      <div className="flex flex-col justify-center p-[clamp(32px,4.4vw,56px)]">
        <h3 className="mb-2 text-[clamp(1.5rem,2.6vw,2rem)]">{c.title}</h3>
        <p className="mb-6 text-muted">{c.sub}</p>
        <ul>
          {c.points.map((p) => (
            <li key={p} className="flex gap-3.5 border-b py-[13px] text-[15px] leading-normal last:border-b-0 before:mt-1.5 before:size-[9px] before:shrink-0 before:bg-brand-cyan">
              {p}
            </li>
          ))}
        </ul>
        {c.range && (
          <div className="mt-[22px] grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
            <div className={cn(tempCell, 'border-l-brand-cyan')}>
              <strong className={tempFigure}>−30°C</strong>
              <span className="text-[13px] text-muted">Northern Command · Himalayan winters</span>
            </div>
            <div className={cn(tempCell, 'border-l-brand-red')}>
              <strong className={tempFigure}>+50°C</strong>
              <span className="text-[13px] text-muted">Southern Command · Rajasthan desert summer</span>
            </div>
            <TempRange />
          </div>
        )}
        {link && (
          <Link to={`/work/${c.slug}`} className="mt-6 inline-flex items-center gap-2 self-start font-sans text-[15px] font-semibold text-link underline underline-offset-[3px] hover:decoration-2">
            Read the case study <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </Reveal>
  );
}

export default function Work({ headless = false, index = '03' }) {
  return (
    <Section id="work" className="bg-surface">
      <Wrap>
        {!headless && (
          <SectionHead index={index} eyebrow="Our Work" title="Application" bold="engineering.">
            Proven in the harshest conditions and in everyday infrastructure.
          </SectionHead>
        )}
        {cases.map((c, i) => (
          <CaseCard key={c.slug} c={c} flip={i % 2 === 0} link />
        ))}
      </Wrap>
    </Section>
  );
}
