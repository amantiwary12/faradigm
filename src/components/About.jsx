import kranking from '../assets/kranking.webp';
import { site } from '../data/content.js';
import Reveal from './ui/Reveal.jsx';
import Rail from './ui/Rail.jsx';
import Eyebrow from './ui/Eyebrow.jsx';
import { Section, Wrap, titleClass } from './ui/Layout.jsx';

const points = [
  ['Registered trademark', 'Faradigm® belongs to Aartech Solonics Ltd.'],
  ['Open to partnerships', 'Collaborations & investments welcome'],
];

export default function About({ headless = false }) {
  return (
    <Section id="about">
      <Wrap className="grid grid-cols-2 items-center gap-[clamp(40px,6vw,88px)] max-md:grid-cols-1 *:min-w-0">
        <Reveal className="group/about relative max-md:max-w-[520px]">
          <div className="relative grid aspect-[4/4.3] place-items-center overflow-hidden bg-[linear-gradient(145deg,#EEF1F7,#DCE2EE)]">
            <img
              src={kranking}
              alt="KranKing ultracapacitor jump-start module by Faradigm"
              width="533"
              height="373"
              loading="lazy"
              decoding="async"
              className="h-auto w-[84%] object-contain mix-blend-multiply transition-transform duration-[600ms] group-hover/about:-rotate-[1.5deg] group-hover/about:scale-[1.04]"
            />
          </div>
          <div data-theme="dark" className="absolute right-5 bottom-6 bg-surface-panel px-6 py-5 text-white max-sm:right-3 max-sm:bottom-4 max-sm:px-[18px] max-sm:py-4">
            <strong className="block font-mono text-[2.3rem] leading-none font-medium text-white max-sm:text-[2rem]">100%</strong>
            <span className="font-mono text-xs tracking-[.06em] text-[#BFBCCC]">Subsidiary of Aartech Solonics Ltd.</span>
          </div>
        </Reveal>

        <div>
          {!headless && <Reveal><Eyebrow>About Us</Eyebrow></Reveal>}
          {!headless && <Reveal as="h2" delay={1} className={titleClass}>
            A decade of energy storage, <b className="font-extrabold">one clear focus.</b>
          </Reveal>}
          {!headless && <Rail short />}
          <Reveal as="p" delay={2} className="mt-6 text-muted">
            <strong className="text-ink">Faradigm® Ultracapacitors Pvt. Ltd.</strong> is a 100% subsidiary of{' '}
            <a className="text-link underline underline-offset-[3px] hover:decoration-2" href={site.aartech} target="_blank" rel="noopener">Aartech Solonics Limited</a>. It was incorporated in 2017, after almost a decade of work in the field, to develop state-of-the-art energy storage technologies and their applications.
          </Reveal>
          <Reveal as="p" delay={2} className="text-muted">
            We started with ultracapacitors. Today we are exploring many exciting energy storage technologies across diverse domains. Faradigm® is a registered trademark of Aartech Solonics Limited, which currently markets all our products exclusively.
          </Reveal>
          <Reveal delay={3} className="mt-[30px] grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            {points.map(([title, text]) => (
              <div key={title} id={title === points[0][0] ? 'trademark' : undefined} className="border-l-4 border-brand-cyan bg-surface-alt px-5 py-[18px]">
                <b className="block font-display text-[15.5px] font-semibold text-heading">{title}</b>
                <span className="text-sm text-muted">{text}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </Wrap>
    </Section>
  );
}
