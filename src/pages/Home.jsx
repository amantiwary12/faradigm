import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import Stats from '../components/Stats.jsx';
import Trust from '../components/Trust.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Partner from '../components/Partner.jsx';
import Contact from '../components/Contact.jsx';
import ProductShowcase from '../components/home/ProductShowcase.jsx';
import WhyUltracapacitors from '../components/home/WhyUltracapacitors.jsx';
import FAQ from '../components/home/FAQ.jsx';
import About from '../components/About.jsx';
import Equation from '../components/Equation.jsx';
import Work from '../components/Work.jsx';
import Process from '../components/Process.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import SectionHead from '../components/ui/SectionHead.jsx';
import { Section, Wrap } from '../components/ui/Layout.jsx';

const tiles = [
  { to: '/products', n: '01', title: 'Products', text: 'Low cost, prismatic, aqueous electrolyte ultracapacitors with one of the lowest ESR in the industry.' },
  { to: '/solutions/proven', n: '02', title: 'Solutions', text: 'Engine starting, battery assist, UPS, regenerative braking, elevators and more.' },
  { to: '/work', n: '03', title: 'Our Work', text: 'Proven in the harshest conditions and in everyday infrastructure.' },
  { to: '/support', n: '04', title: 'Service Support', text: 'Share your energy storage pain points. Our team dives deep into your application.' },
];

export default function Home() {
  useEffect(() => {
    document.title = 'Faradigm® Ultracapacitors | Energy Storage, Made in India';
  }, []);
  return (
    <>
      <Hero />
      <Stats />
      <Trust />
      <ProductShowcase />
      <WhyUltracapacitors />
      <About />
      <Equation />
      <Section className="bg-surface-alt">
        <Wrap>
          <SectionHead index="03" eyebrow="Explore Faradigm®" title="Everything about" bold="our technology." />
          <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1 *:min-w-0">
            {tiles.map((t, i) => (
              <Reveal key={t.to} delay={i}>
                <Link
                  to={t.to}
                  className="group relative block h-full overflow-hidden border bg-surface-raised p-7 transition-colors duration-200 before:absolute before:top-0 before:left-0 before:h-1 before:w-0 before:bg-brand-cyan before:transition-[width] before:duration-[450ms] before:ease-[cubic-bezier(.2,.7,.2,1)] hover:border-brand-cyan hover:bg-surface-alt hover:before:w-full"
                >
                  <span className="font-mono text-sm font-medium tracking-[.16em] text-brand-cyan">{t.n}</span>
                  <h3 className="mt-4 mb-2 text-[1.35rem]">{t.title}</h3>
                  <p className="m-0 text-[15px] text-muted">{t.text}</p>
                  <span aria-hidden="true" className="mt-5 inline-block font-semibold text-link transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Wrap>
      </Section>
      <Work index="04" />
      <Process index="05" />
      <FAQ />
      <Testimonials index="07" />
      <Partner />
      {/* Enquiry form on the landing page itself */}
      <Contact index="08" />
    </>
  );
}
