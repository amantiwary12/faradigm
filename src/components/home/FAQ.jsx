import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import { Section, Wrap } from '../ui/Layout.jsx';

// Every answer restates something already published elsewhere on this site.
const faqs = [
  {
    q: 'What is an ultracapacitor?',
    a: 'Capacitance is measured in Farads. Thanks to nanotechnology, ultracapacitors reach hundreds and thousands of Farads. That is a paradigm shift in energy storage, and it is how the name Faradigm® was coined.',
  },
  {
    q: 'What makes Faradigm® ultracapacitors different?',
    a: 'They are low cost, prismatic, aqueous electrolyte cells with one of the lowest ESR in the industry, which makes them well suited to pulse power. They have a simple two-terminal interface up to 200V and need no external balancing or monitoring systems.',
  },
  {
    q: 'Are they qualified for defence use?',
    a: 'Yes. Faradigm® ultracapacitors meet the MIL grade JS55555 type tests and are qualified by the Indian Army as a jump-start device for Class A vehicles. They have been field tested from the Himalayas (−30 °C) to Rajasthan (+50 °C).',
    link: { to: '/work/mil-grade-ultracapacitors', label: 'Read the case study' },
  },
  {
    q: 'Do you only supply your own ultracapacitors?',
    a: 'No. Every application needs its own mix of features, capabilities and economics, so Faradigm® stays technology and OEM agnostic and integrates ultracapacitors from world-class manufacturers case by case.',
    link: { to: '/products/oem-ultracapacitors', label: 'See the OEM partners' },
  },
  {
    q: 'What about batteries and complete storage systems?',
    a: 'We began with ultracapacitors and are exploring many energy storage technologies across diverse domains. We design battery energy storage and hybrid systems around your application, using whichever technology fits best.',
    link: { to: '/products/category/energy-storage-module', label: 'Energy storage modules' },
  },
  {
    q: 'Where is Faradigm® based?',
    a: 'Faradigm® Ultracapacitors Pvt. Ltd. is a 100% subsidiary of Aartech Solonics Limited, incorporated in 2017. Our address is 35-A/36, Sector B, Industrial Area, Mandideep, District Raisen (Bhopal), Madhya Pradesh, India.',
  },
  {
    q: 'How do I get a quote or start a project?',
    a: 'Share your energy storage pain point with us. Our team dives deep into your application and builds the right solution from technology options across the board. Use the form at the end of this page, or write to info@faradigm.com.',
    link: { to: '/support', label: 'How we work' },
  },
];

export default function FAQ() {
  return (
    <Section id="faq" className="bg-surface-alt">
      <Wrap>
        <SectionHead index="06" eyebrow="Questions" title="Good to know" bold="before you ask.">
          The short answers to what people ask us first.
        </SectionHead>
        <div className="max-w-[900px]">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i % 3} className="border-b first:border-t">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-[1.15rem] leading-[1.3] font-semibold text-heading marker:hidden [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-pill bg-brand-cyan text-lg leading-none text-white transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <div className="pb-6 pr-12 text-muted">
                  <p className="mb-3">{f.a}</p>
                  {f.link && <Link to={f.link.to} className="font-semibold text-link underline underline-offset-[3px] hover:decoration-2">{f.link.label} →</Link>}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </Section>
  );
}
