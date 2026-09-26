import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import SpecCard from '../components/SpecCard.jsx';
import Partner from '../components/Partner.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { Section, Wrap } from '../components/ui/Layout.jsx';
import { techFeatures } from '../data/content.js';
import { cases } from '../data/cases.js';

export default function ProductFaradigm() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Faradigm®"
        bold="Ultracapacitors"
      >
        Low cost, prismatic, aqueous electrolyte ultracapacitors with one of the lowest ESR in the industry. That makes them one of the best products for pulse power applications.
      </PageHero>

      <Section>
        <Wrap className="grid grid-cols-[1.2fr_.8fr] items-start gap-[clamp(32px,5vw,72px)] max-md:grid-cols-1 *:min-w-0">
          <Reveal id="features">
            <h2 className="mb-6 text-[clamp(1.6rem,3vw,2.2rem)]">Features</h2>
            <ul>
              {techFeatures.map((f) => (
                <li key={f} className="flex gap-3.5 border-b py-3.5 text-[1.02rem] leading-normal text-ink before:mt-2 before:size-[9px] before:shrink-0 before:bg-brand-cyan">
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal id="specs" delay={1}>
            <SpecCard />
          </Reveal>
        </Wrap>
      </Section>

      <Section className="bg-surface-alt">
        <Wrap>
          <Reveal className="mb-10">
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">Proven in the field</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-7 max-md:grid-cols-1">
            {cases.map((c, i) => (
              <Reveal key={c.slug} delay={i}>
                <Link
                  to={`/work/${c.slug}`}
                  className="group block h-full border bg-surface-raised p-8 transition-colors duration-200 hover:border-brand-cyan"
                >
                  <span className="rounded-pill bg-brand-navy px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-[.14em] text-white uppercase">{c.tag}</span>
                  <h3 className="mt-5 mb-2 text-[1.35rem]">{c.title}</h3>
                  <p className="mb-4 text-muted">{c.sub}</p>
                  <span className="font-semibold text-link underline underline-offset-[3px]">Read the case study →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Wrap>
      </Section>
      <Partner />
    </>
  );
}
