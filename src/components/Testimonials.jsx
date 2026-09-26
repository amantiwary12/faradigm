import { testimonials } from '../data/content.js';
import useSpotlight from '../hooks/useSpotlight.js';
import Reveal from './ui/Reveal.jsx';
import Glow from './ui/Glow.jsx';
import SectionHead from './ui/SectionHead.jsx';
import { Section, Wrap } from './ui/Layout.jsx';

export default function Testimonials({ headless = false, index = '05' }) {
  const spot = useSpotlight();
  return (
    <Section id="testimonials">
      <Wrap>
        {!headless && <SectionHead index={index} eyebrow="Testimonials" title="Trusted where it" bold="matters most." />}
        <div className="grid grid-cols-2 gap-7 max-md:grid-cols-1 *:min-w-0">
          {testimonials.map((t) => (
            <Reveal
              as="figure"
              key={t.initials}
              delay={t.delay}
              className="group isolate relative m-0 overflow-hidden border bg-surface p-10 hover:border-brand-cyan max-sm:px-[26px] max-sm:pt-10 max-sm:pb-[30px]"
              {...spot}
            >
              <Glow />
              <span aria-hidden="true" className="block h-[52px] font-[Georgia,serif] text-[110px] leading-[.6] text-brand-cyan opacity-30 transition-opacity duration-300 group-hover:opacity-60">“</span>
              <blockquote className="m-0 mb-[30px] font-display text-[clamp(1.25rem,2.2vw,1.6rem)] leading-[1.38] font-semibold tracking-[-.015em] text-heading">
                {t.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3.5 border-t pt-6">
                <div className="grid size-12 shrink-0 place-items-center rounded-pill bg-surface-highlight font-mono text-sm font-medium text-heading">{t.initials}</div>
                <div>
                  <b className="block font-sans text-[15px] font-semibold text-ink">{t.name}</b>
                  <span className="text-sm text-muted">{t.role}</span>
                </div>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </Section>
  );
}
