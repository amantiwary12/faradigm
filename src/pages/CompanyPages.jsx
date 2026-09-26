import PageHero from '../components/PageHero.jsx';
import About from '../components/About.jsx';
import Equation from '../components/Equation.jsx';
import Trust from '../components/Trust.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Process from '../components/Process.jsx';
import Contact from '../components/Contact.jsx';
import Partner from '../components/Partner.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import Button from '../components/ui/Button.jsx';
import { Section, Wrap } from '../components/ui/Layout.jsx';
import { site } from '../data/content.js';

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Us" title="A decade of energy storage," bold="one clear focus." />
      <About headless />
      <Partner />
    </>
  );
}

export function NamePage() {
  return (
    <>
      <PageHero eyebrow="Our Name" title="How Faradigm®" bold="was coined.">
        Capacitance is measured in Farads. Nanotechnology took ultracapacitors to hundreds and thousands of Farads.
      </PageHero>
      <Equation />
      <Partner />
    </>
  );
}

export function TrustPage() {
  return (
    <>
      <PageHero eyebrow="Testimonials" title="Trusted where it" bold="matters most." />
      <Trust />
      <Testimonials headless />
      <Partner />
    </>
  );
}

export function SupportPage() {
  return (
    <>
      <PageHero eyebrow="How might we address your pain point?" title="We love solving" bold="difficult problems.">
        Share your energy storage pain points with us. Our team dives deep into your application and builds the right solution from technology options across the board.
      </PageHero>
      <Process headless />
      <Section className="bg-surface-alt">
        <Wrap>
          <Reveal id="oem-support" className="max-w-[760px]">
            <h2 className="mb-4 text-[clamp(1.6rem,3vw,2.2rem)]">OEM application support</h2>
            <p className="text-muted">Our application development team will be happy to support your OEM application requirements.</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button to="/solutions/oem" arrow>OEM applications</Button>
              <Button to="/products/oem-ultracapacitors" variant="secondary">Other Ultracapacitor OEMs</Button>
            </div>
          </Reveal>
        </Wrap>
      </Section>
    </>
  );
}

// Only facts already published on the site: no dates beyond the 2017 incorporation.
const milestones = [
  { id: 'incorporated', label: '2017', title: 'Incorporated', text: 'Faradigm® Ultracapacitors Pvt. Ltd. was incorporated after almost a decade of work in energy storage, to develop state-of-the-art energy storage technologies and their applications.' },
  { id: 'mil-grade', label: 'JS55555', title: 'MIL grade qualified', text: 'Faradigm® ultracapacitors meet MIL grade JS55555 type tests and are qualified by the Indian Army as a jump-start device for Class A vehicles, field tested from the Himalayas (−30 °C) to Rajasthan (+50 °C).' },
  { id: 'uplift', label: 'UPLIFT', title: 'Project UPLIFT', text: 'Ultracapacitor Powered Lift, built with IIT Bombay and M/s Johnson Lifts, Chennai: more than 25% energy savings in high-rise elevators, funded under the Clean Energy Research Initiative, Department of Science & Technology, Govt. of India.' },
];

export function NewsPage() {
  return (
    <>
      <PageHero eyebrow="News" title="Milestones" bold="& updates.">
        Where Faradigm® has been, and where announcements will appear.
      </PageHero>
      <Section>
        <Wrap>
          <ol className="grid gap-6">
            {milestones.map((m, i) => (
              <Reveal as="li" key={m.id} id={m.id} delay={i} className="grid grid-cols-[160px_1fr] gap-8 border bg-surface-raised p-8 max-sm:grid-cols-1 max-sm:gap-3">
                <span className="font-mono text-[1.6rem] leading-none font-medium text-brand-cyan">{m.label}</span>
                <div>
                  <h3 className="mb-2 text-[1.35rem]">{m.title}</h3>
                  <p className="m-0 text-muted">{m.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal id="updates" className="mt-12 border border-l-4 border-l-brand-cyan bg-surface-alt p-8">
            <h2 className="mb-2 text-[1.4rem]">Company announcements</h2>
            <p className="m-0 text-muted">
              There are no announcements to show yet. For press or partnership enquiries, write to <a className="text-link underline underline-offset-[3px]" href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </Reveal>
        </Wrap>
      </Section>
      <Partner />
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact Us" title="Tell us about your" bold="application.">
        Whether it's a pain point, an OEM requirement or a partnership idea, our team would love to hear from you.
      </PageHero>
      <Contact headless />
      <Partner />
    </>
  );
}

export function NotFound() {
  return (
    <>
      <PageHero eyebrow="Error 404" title="Page not found." />
      <Section>
        <Wrap>
          <p className="mb-6 text-muted">That page doesn't exist, or it has moved.</p>
          <Button to="/" arrow>Back to home</Button>
        </Wrap>
      </Section>
    </>
  );
}
