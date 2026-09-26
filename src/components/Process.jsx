import { processSteps } from '../data/content.js';
import useInView from '../hooks/useInView.js';
import { cn } from '../lib/env.js';
import Reveal from './ui/Reveal.jsx';
import Button from './ui/Button.jsx';
import RegMarks from './ui/RegMarks.jsx';
import SectionHead from './ui/SectionHead.jsx';
import { Section, Wrap } from './ui/Layout.jsx';

// Each step's dot lights after the current passes it
const dotDelays = ['delay-[350ms]', 'delay-[800ms]', 'delay-[1250ms]', 'delay-[1700ms]'];

export default function Process({ headless = false, index = '02' }) {
  const [ref, lit] = useInView({ threshold: 0.4 });
  return (
    <Section
      id="process"
      data-theme="dark"
      className="overflow-hidden bg-surface text-ink before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] before:[background-size:44px_44px] before:[mask-image:linear-gradient(200deg,#000,transparent_62%)]"
    >
      <Wrap className="relative">
        {!headless && <SectionHead index={index} eyebrow="How might we address your pain point?" title="We love solving" bold="difficult problems.">
          Share your energy storage pain points with us. Our team dives deep into your application and builds the right solution from technology options across the board.
        </SectionHead>}

        {/* Current flows down the line and the steps charge in turn */}
        <div
          ref={ref}
          className="relative grid grid-cols-4 gap-6 before:absolute before:inset-x-[6%] before:top-[34px] before:h-0.5 before:bg-brand-cyan before:opacity-30 max-lg:grid-cols-2 max-lg:gap-y-11 max-lg:before:hidden max-sm:grid-cols-1 max-sm:gap-y-9"
        >
          <span
            aria-hidden="true"
            className={cn(
              'absolute inset-x-[6%] top-[34px] h-0.5 origin-left scale-x-0 bg-brand-cyan transition-transform duration-[1800ms] ease-[cubic-bezier(.4,0,.2,1)] max-lg:hidden',
              lit && 'scale-x-100',
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-[21px] left-[6%] z-[2] size-7 rounded-pill bg-[radial-gradient(circle,#fff_0_4px,rgba(92,193,242,.85)_5px,rgba(0,147,221,.25)_9px,transparent_14px)] opacity-0 max-lg:hidden',
              lit && 'animate-current',
            )}
          />
          {processSteps.map((s, i) => (
            <Reveal key={s.n} id={`step-${s.n}`} delay={i} className="group/step relative px-1.5">
              <div
                className={cn(
                  'relative z-[1] mb-6 grid size-[76px] place-items-center border-2 border-brand-cyan bg-surface-highlight font-mono text-[26px] font-medium text-heading transition-[background-color,border-color,color] duration-[400ms] group-hover/step:bg-white group-hover/step:text-brand-navy-deep',
                  lit && `bg-brand-cyan text-white ${dotDelays[i]}`,
                )}
              >
                {s.n}
              </div>
              <small className="font-mono text-xs font-medium tracking-[.16em] text-muted">STEP {s.n}</small>
              <h3 className="mt-1.5 mb-2.5 text-[1.2rem]">{s.title}</h3>
              <p className="m-0 text-[15px] text-muted">{s.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="reg mt-16 flex flex-wrap items-center justify-between gap-7 border-l-4 border-brand-cyan bg-surface-highlight px-10 py-8 max-sm:p-7 max-xs:px-5 max-xs:py-6">
          <p className="m-0 max-w-[720px] font-display text-[clamp(1.2rem,2.2vw,1.6rem)] font-extrabold text-heading italic">
            After all, the proof of the pudding is <b className="font-extrabold text-accent">only in the eating</b>, not the recipe!
          </p>
          <Button to="/contact" lean className="max-sm:w-full">Share your pain point</Button>
          <RegMarks />
        </Reveal>
      </Wrap>
    </Section>
  );
}
