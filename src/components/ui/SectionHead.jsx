import Reveal from './Reveal.jsx';
import Eyebrow from './Eyebrow.jsx';
import Rail from './Rail.jsx';

/** Eyebrow, headline, rail and optional lede, with a ghost index numeral behind. */
export default function SectionHead({ index, eyebrow, title, bold, children }) {
  return (
    <Reveal
      data-index={index}
      className="relative isolate mb-12 before:pointer-events-none before:absolute before:top-1/2 before:right-0 before:-z-10 before:-translate-y-1/2 before:font-display before:text-[clamp(6rem,15vw,13rem)] before:leading-[.8] before:font-extrabold before:tracking-[-.04em] before:text-transparent before:italic before:content-[attr(data-index)] before:[-webkit-text-stroke:1.5px_var(--border)] max-sm:before:hidden *:max-w-[800px]"
    >
      <Eyebrow type>{eyebrow}</Eyebrow>
      <h2 className="text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.04] font-extrabold tracking-[-.025em] italic">
        {title} <b className="font-extrabold">{bold}</b>
      </h2>
      <Rail short />
      {children && <p className="mt-5 text-xl leading-[30px] text-muted">{children}</p>}
    </Reveal>
  );
}
