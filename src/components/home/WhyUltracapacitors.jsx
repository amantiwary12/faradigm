import { Link } from 'react-router-dom';
import { applicationTabs } from '../../data/content.js';
import { slugify } from '../../lib/slug.js';
import Reveal from '../ui/Reveal.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { Section, Wrap } from '../ui/Layout.jsx';

const reasons = [
  { n: '01', title: 'Built for pulse power', text: 'One of the lowest ESR in the industry, so energy moves in and out fast.' },
  { n: '02', title: 'Simple to use', text: 'A two-terminal interface up to 200V, with no external balancing or monitoring systems.' },
  { n: '03', title: 'Field proven', text: 'Tested by the Indian Army from −30 °C to +50 °C, and trusted by DRDO labs.' },
  { n: '04', title: 'Rugged and clean', text: 'Nanotechnology cells in non-hazardous, eco-friendly materials.' },
];

export default function WhyUltracapacitors() {
  const apps = applicationTabs[0].items.slice(0, 8);
  return (
    <Section id="why" className="bg-surface-alt">
      <Wrap>
        <SectionHead index="02" eyebrow="Why Faradigm®" title="Power that keeps up" bold="with your application.">
          Where a job needs a burst of power, a long life or a hard environment, an ultracapacitor does what a battery alone cannot.
        </SectionHead>

        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1 *:min-w-0">
          {reasons.map((r, i) => (
            <Reveal key={r.n} delay={i} className="border border-t-4 border-t-brand-cyan bg-surface-raised p-6">
              <span className="font-mono text-sm font-medium tracking-[.16em] text-brand-cyan">{r.n}</span>
              <h3 className="mt-3 mb-2 text-[1.2rem]">{r.title}</h3>
              <p className="m-0 text-[15px] text-muted">{r.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <h3 className="mb-5 text-[1.3rem]">Where they are used</h3>
          <ul className="flex flex-wrap gap-3">
            {apps.map((a) => (
              <li key={a}>
                <Link to={`/solutions/proven#${slugify(a)}`} className="inline-block rounded-pill border bg-surface-raised px-4 py-2 font-mono text-xs tracking-[.04em] text-ink transition-colors hover:border-brand-navy hover:bg-surface-highlight">{a}</Link>
              </li>
            ))}
            <li><Link to="/solutions/proven" className="inline-block px-2 py-2 font-semibold text-link underline underline-offset-[3px]">All applications →</Link></li>
          </ul>
        </Reveal>
      </Wrap>
    </Section>
  );
}
