import PageHero from '../components/PageHero.jsx';
import Partner from '../components/Partner.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import Button from '../components/ui/Button.jsx';
import { Section, Wrap } from '../components/ui/Layout.jsx';
import { oemChips } from '../data/content.js';
import { slugify } from '../lib/slug.js';
import { useLocation } from 'react-router-dom';
import { cn } from '../lib/env.js';

export default function ProductOEM() {
  const { hash } = useLocation();
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Other Ultracapacitor"
        bold="OEMs"
      >
        Every application needs its own mix of features, capabilities and economics. Faradigm® stays technology and OEM agnostic and integrates ultracapacitors from world-class manufacturers case by case.
      </PageHero>

      <Section>
        <Wrap>
          <div className="grid grid-cols-3 gap-7 max-md:grid-cols-2 max-sm:grid-cols-1">
            {oemChips.map((name, i) => {
              const id = slugify(name);
              return (
                <Reveal
                  key={name}
                  id={id}
                  delay={i % 3}
                  className={cn(
                    'border border-l-4 border-l-brand-cyan bg-surface-raised p-7 transition-colors duration-200 hover:bg-surface-alt',
                    hash === `#${id}` && 'border-brand-cyan ring-2 ring-brand-cyan',
                  )}
                >
                  <span className="font-mono text-xs tracking-[.16em] text-muted uppercase">OEM partner</span>
                  <h3 className="mt-2 mb-2 text-[1.35rem]">{name}</h3>
                  <p className="m-0 text-[15px] text-muted">Integrated case by case, where the application calls for it.</p>
                </Reveal>
              );
            })}
          </div>
          <Reveal className="mt-12 flex flex-wrap gap-4">
            <Button to="/contact" arrow>Tell us your requirement</Button>
            <Button to="/products/faradigm-ultracapacitors" variant="secondary">Faradigm® Ultracapacitors</Button>
          </Reveal>
        </Wrap>
      </Section>
      <Partner />
    </>
  );
}
