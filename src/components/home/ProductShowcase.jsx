import { Link } from 'react-router-dom';
import kranking from '../../assets/kranking.webp';
import { techFeatures } from '../../data/content.js';
import Reveal from '../ui/Reveal.jsx';
import Eyebrow from '../ui/Eyebrow.jsx';
import Rail from '../ui/Rail.jsx';
import Button from '../ui/Button.jsx';
import SectionHead from '../ui/SectionHead.jsx';
import SpecCard from '../SpecCard.jsx';
import { Section, Wrap } from '../ui/Layout.jsx';

const check = 'flex gap-3 text-[15px] leading-normal text-ink before:mt-2 before:size-2 before:shrink-0 before:bg-brand-cyan';

/** One product block: copy on one side, a visual on the other; `flip` swaps them on wide screens. */
function Feature({ id, eyebrow, title, flip, visual, children }) {
  return (
    <div id={id} className="grid grid-cols-2 items-center gap-[clamp(32px,5vw,72px)] max-md:grid-cols-1 *:min-w-0">
      <Reveal className={flip ? 'md:order-2' : undefined}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="text-[clamp(1.7rem,3.2vw,2.4rem)] leading-[1.1] font-extrabold italic">{title}</h3>
        <Rail short />
        {children}
      </Reveal>
      <Reveal delay={1}>{visual}</Reveal>
    </div>
  );
}

/** A stack of battery cells in the brand's flat style, used as the BESS visual. */
function BatteryStack() {
  return (
    <div className="reg border bg-surface-alt p-8" role="img" aria-label="Battery energy storage: a bank of cells charging and discharging">
      <svg viewBox="0 0 360 200" className="block h-auto w-full" aria-hidden="true">
        {[0, 1, 2].map((r) => (
          <g key={r} transform={`translate(0 ${r * 62})`}>
            <rect x="20" y="10" width="270" height="46" fill="#FFFFFF" stroke="#29166F" strokeWidth="2" />
            <rect x="290" y="24" width="12" height="18" fill="#29166F" />
            {[0, 1, 2, 3, 4, 5].map((c) => (
              <rect key={c} x={28 + c * 43} y="17" width="36" height="32" fill={c < 5 - r ? '#0093DD' : '#DCDAE6'} />
            ))}
          </g>
        ))}
        <path d="M318 40v120M312 150l6 10 6-10" stroke="#29166F" strokeWidth="2" fill="none" />
        <path d="M340 160V40M334 50l6-10 6 10" stroke="#0093DD" strokeWidth="2" fill="none" />
      </svg>
      <p className="mt-4 mb-0 font-mono text-xs tracking-[.14em] text-muted uppercase">Charge · Store · Deliver</p>
    </div>
  );
}

export default function ProductShowcase() {
  return (
    <Section id="products-overview" className="bg-surface">
      <Wrap>
        <SectionHead index="01" eyebrow="What we make" title="Storage for power," bold="and for energy.">
          Ultracapacitors are our core product. Alongside them we build complete systems: the KranKing jump-start module and battery energy storage.
        </SectionHead>

        <div className="grid gap-[clamp(64px,9vw,112px)]">
          <Feature
            id="ultracapacitors"
            eyebrow="Our main product"
            title="Faradigm® Ultracapacitors"
            visual={<SpecCard />}
          >
            <p className="mt-6 text-muted">
              Low cost, prismatic, aqueous electrolyte ultracapacitors with one of the lowest ESR in the industry. That makes them one of the best products for pulse power applications.
            </p>
            <ul className="mb-8 grid gap-2.5">
              {techFeatures.slice(0, 4).map((f) => <li key={f} className={check}>{f}</li>)}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Button to="/products/faradigm-ultracapacitors" arrow>View the ultracapacitors</Button>
              <Button to="/contact?product=Faradigm%20Ultracapacitors" variant="secondary">Request a quote</Button>
            </div>
          </Feature>

          <Feature
            id="kranking"
            eyebrow="Defence · Jump-start"
            title="KranKing jump-start module"
            flip
            visual={
              <div className="group relative grid aspect-[4/3.4] place-items-center overflow-hidden bg-[linear-gradient(145deg,#EEF1F7,#DCE2EE)]">
                <img src={kranking} alt="KranKing ultracapacitor jump-start module by Faradigm" width="533" height="373" loading="lazy" decoding="async" className="h-auto w-[84%] object-contain mix-blend-multiply transition-transform duration-[600ms] group-hover:scale-[1.04]" />
                <span className="absolute top-5 left-5 rounded-pill bg-brand-navy px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-[.14em] text-white uppercase">MIL grade</span>
              </div>
            }
          >
            <p className="mt-6 text-muted">
              Qualified by the Indian Army as a jump-start device for Class A vehicles. It meets the MIL grade JS55555 type tests and has been field tested from the Himalayan winters to the Rajasthan desert summer.
            </p>
            <dl className="mb-8 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
              {[['JS55555', 'MIL grade'], ['−30 °C', 'Northern Command'], ['+50 °C', 'Southern Command']].map(([v, l]) => (
                <div key={v} className="border border-l-4 border-l-brand-cyan bg-surface-raised px-4 py-3">
                  <dt className="font-mono text-lg font-medium text-heading">{v}</dt>
                  <dd className="m-0 text-xs text-muted">{l}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-4">
              <Button to="/work/mil-grade-ultracapacitors" arrow>Read the case study</Button>
              <Button to="/contact?product=KranKing" variant="secondary">Request a quote</Button>
            </div>
          </Feature>

          <Feature id="bess" eyebrow="Energy storage systems" title="Battery Energy Storage Systems (BESS)" visual={<BatteryStack />}>
            <p className="mt-6 text-muted">
              A battery energy storage system holds electrical energy and delivers it when it is needed. Faradigm® designs storage around your application, using whichever technology fits best, from batteries and ultracapacitors to hybrids of both.
            </p>
            <ul className="mb-8 grid gap-2.5">
              {[
                'Backup power and UPS for critical loads',
                'Peak shaving and power-quality support',
                'Hybrid systems: batteries for energy, ultracapacitors for power bursts',
                'Storage for solar and EV charging',
              ].map((f) => <li key={f} className={check}>{f}</li>)}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Button to="/products/category/energy-storage-module" arrow>Energy storage modules</Button>
              <Button to="/contact?product=Battery%20Energy%20Storage%20System" variant="secondary">Discuss your BESS project</Button>
            </div>
            <p className="mt-5 mb-0 text-sm text-muted">Every system is engineered to order. <Link to="/support" className="text-link underline underline-offset-[3px]">See how we work</Link>.</p>
          </Feature>
        </div>
      </Wrap>
    </Section>
  );
}
