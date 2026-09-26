import { useEffect } from 'react';
import Reveal from './ui/Reveal.jsx';
import Eyebrow from './ui/Eyebrow.jsx';
import Rail from './ui/Rail.jsx';
import { Wrap } from './ui/Layout.jsx';

/**
 * Title band for inner pages: eyebrow, headline, rail, lede. It sits on the same white as the
 * header, so the logo never sits on a mismatched background. Also sets the document title.
 */
export default function PageHero({ eyebrow, title, bold, children }) {
  const heading = `${title} ${bold || ''}`.trim();
  useEffect(() => {
    document.title = `${heading} | Faradigm® Ultracapacitors`;
  }, [heading]);
  return (
    <section className="relative overflow-hidden border-b bg-surface pt-[128px] pb-[clamp(40px,5vw,64px)] max-sm:pt-[108px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] opacity-50 [background-size:44px_44px] [mask-image:linear-gradient(200deg,#000,transparent_55%)]"
      />
      <Wrap className="relative">
        <Reveal className="max-w-[900px]">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] font-extrabold tracking-[-.025em] italic [overflow-wrap:anywhere]">
            {title} {bold && <b className="font-extrabold text-accent">{bold}</b>}
          </h1>
          <Rail short />
          {children && <p className="mt-5 mb-0 max-w-[720px] text-xl leading-[30px] text-muted">{children}</p>}
        </Reveal>
      </Wrap>
    </section>
  );
}
