import { Link } from 'react-router-dom';
import { oemChips, techFeatures } from '../data/content.js';
import useSpotlight from '../hooks/useSpotlight.js';
import Reveal from './ui/Reveal.jsx';
import SpecCard from './SpecCard.jsx';
import Glow from './ui/Glow.jsx';
import SectionHead from './ui/SectionHead.jsx';
import { Section, Wrap } from './ui/Layout.jsx';

const cardClass =
  'group isolate relative overflow-hidden border bg-surface-raised p-8 hover:border-brand-cyan hover:bg-surface-alt max-sm:p-7 before:absolute before:top-0 before:left-0 before:h-1 before:w-0 before:bg-brand-cyan before:transition-[width] before:duration-[450ms] before:ease-[cubic-bezier(.2,.7,.2,1)] hover:before:w-full';
const iconClass =
  'grid size-[52px] shrink-0 place-items-center font-mono text-sm font-medium tracking-[.04em] text-brand-navy transition-[background-color,color] duration-300 group-hover:bg-brand-navy group-hover:text-white max-xs:size-11';

function DetailLink({ to }) {
  return (
    <Link to={to} className="mt-6 inline-flex items-center gap-2 font-sans text-[15px] font-semibold text-link underline underline-offset-[3px] hover:decoration-2">
      View details <span aria-hidden="true">→</span>
    </Link>
  );
}

export default function Technology({ headless = false }) {
  const spot = useSpotlight();
  return (
    <Section id="technology" className="bg-surface-alt">
      <Wrap>
        {!headless && <SectionHead index="01" eyebrow="Energy Storage Technologies" title="Best-in-class." bold="Made in India." />}

        <div className="grid grid-cols-[1fr_1.25fr] items-stretch gap-7 max-md:grid-cols-1 *:min-w-0">
          <Reveal className="relative flex flex-col justify-between gap-9 overflow-hidden bg-surface p-10 text-ink max-sm:p-7 *:relative *:z-[1] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] after:opacity-70 after:[background-size:40px_40px] after:[mask-image:linear-gradient(200deg,#000,transparent_55%)]">
            <div>
              <h3 className="text-[clamp(1.7rem,3vw,2.3rem)]">
                Energy storage is the <b className="font-extrabold text-accent italic">key differentiator.</b>
              </h3>
              <p className="mt-5 mb-0 text-muted">
                Energy storage sets solutions apart when it comes to existing and emerging problems in the energy domain. Faradigm® develops and harnesses best-in-class energy storage technology and applications to solve customer pain points.
              </p>
            </div>

            <SpecCard />

            <div className="inline-flex items-center gap-3 font-mono text-xs font-medium tracking-[.16em] text-ink uppercase">
              <span aria-hidden="true" className="inline-grid h-5 w-[30px] grid-rows-3 overflow-hidden">
                <i className="bg-[#FF9933]" />
                <i className="relative bg-white after:absolute after:top-1/2 after:left-1/2 after:-m-[2.5px] after:size-[5px] after:border after:border-[#000080]" />
                <i className="bg-[#138808]" />
              </span>{' '}
              Designed &amp; manufactured in India
            </div>
          </Reveal>

          <div className="grid gap-7">
            <Reveal as="article" delay={1} className={cardClass} {...spot}>
              <Glow />
              <div className="mb-4 flex items-center gap-4 max-xs:gap-3">
                <div className={`${iconClass} bg-cyan-100`}>FC</div>
                <h3 className="min-w-0 text-[1.35rem] [overflow-wrap:break-word]">Faradigm® Ultracapacitors</h3>
              </div>
              <p className="m-0 text-muted">
                Low cost, prismatic, aqueous electrolyte ultracapacitors with one of the lowest ESR in the industry. That makes them one of the best products for pulse power applications.
              </p>
              <ul className="mt-[22px] grid grid-cols-2 gap-x-5 gap-y-3 max-sm:grid-cols-1">
                {techFeatures.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm leading-5 text-ink before:mt-1.5 before:size-2 before:shrink-0 before:bg-brand-cyan">
                    {f}
                  </li>
                ))}
              </ul>
              <DetailLink to="/products/faradigm-ultracapacitors" />
            </Reveal>

            <Reveal as="article" delay={2} className={cardClass} {...spot}>
              <Glow />
              <div className="mb-4 flex items-center gap-4 max-xs:gap-3">
                <div className={`${iconClass} bg-navy-100`}>OEM</div>
                <h3 className="min-w-0 text-[1.35rem] [overflow-wrap:break-word]">Other Ultracapacitor OEMs</h3>
              </div>
              <p className="m-0 text-muted">
                Every application needs its own mix of features, capabilities and economics. Faradigm® stays technology and OEM agnostic and integrates ultracapacitors from world-class manufacturers case by case.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {oemChips.map((c) => (
                  <span
                    key={c}
                    className="rounded-pill border bg-transparent px-3.5 py-1.5 font-mono text-xs tracking-[.04em] text-ink transition-all duration-200 hover:border-brand-navy hover:bg-surface-highlight max-xs:px-3 max-xs:text-[12.5px]"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <DetailLink to="/products/oem-ultracapacitors" />
            </Reveal>
          </div>
        </div>
      </Wrap>
    </Section>
  );
}
