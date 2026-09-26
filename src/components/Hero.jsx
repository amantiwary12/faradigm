import { useEffect, useRef, useState } from 'react';
import mapImage from '../assets/mmap-locations.webp';
import { heroCallouts, heroChecks } from '../data/content.js';
import { cn, finePointer, hasIntersectionObserver, prefersReducedMotion } from '../lib/env.js';
import Reveal from './ui/Reveal.jsx';
import Rail from './ui/Rail.jsx';
import Button from './ui/Button.jsx';
import { Wrap } from './ui/Layout.jsx';
import PlugScene from './hero/PlugScene.jsx';

const icons = {
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  pulse: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  medal: <><circle cx="12" cy="9" r="6" /><path d="M8.5 14L7 22l5-3 5 3-1.5-8" /></>,
};

export default function Hero() {
  const heroRef = useRef(null);
  const fieldRef = useRef(null);
  const [visible, setVisible] = useState(true);

  // Pause all hero motion (and the charge loop) while the hero is off screen
  useEffect(() => {
    if (!hasIntersectionObserver) return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(heroRef.current);
    return () => io.disconnect();
  }, []);

  // The field grid follows the pointer
  useEffect(() => {
    if (!finePointer || prefersReducedMotion) return undefined;
    const hero = heroRef.current;
    let queued = 0;
    const onMove = (e) => {
      if (queued) return;
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      queued = requestAnimationFrame(() => {
        fieldRef.current?.style.setProperty('--fx', `${x}px`);
        fieldRef.current?.style.setProperty('--fy', `${y}px`);
        queued = 0;
      });
    };
    hero.addEventListener('pointermove', onMove);
    return () => {
      hero.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(queued);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className={cn(
        'relative isolate flex min-h-svh items-center overflow-hidden bg-surface pt-[120px] pb-20 text-ink max-sm:pt-[108px] short-landscape:min-h-0 short-landscape:pt-[100px] short-landscape:pb-14',
        !visible && 'is-paused',
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-contain bg-right bg-no-repeat opacity-[.16] max-md:bg-center max-md:opacity-[.14]"
        style={{ backgroundImage: `url(${mapImage})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--surface)_0%,rgba(255,255,255,.94)_40%,rgba(255,255,255,.6)_75%,rgba(255,255,255,.35)_100%),linear-gradient(0deg,var(--surface-alt)_0%,transparent_26%)] max-md:bg-[linear-gradient(180deg,rgba(255,255,255,.94),rgba(255,255,255,.82)_60%,var(--surface-alt))]"
      />
      <div ref={fieldRef} aria-hidden="true" className="efield" />

      <Wrap className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] items-center gap-14 max-lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] max-lg:gap-8 max-md:grid-cols-1 max-md:gap-12 *:min-w-0">
        <div>
          <Reveal className="mb-6 inline-flex items-center gap-2 rounded-pill border bg-transparent py-1.5 pr-3.5 pl-1.5 font-mono text-xs tracking-[.06em] text-muted max-xs:text-[12.5px]">
            <b className="shrink-0 rounded-pill bg-action px-2.5 py-1 font-mono text-[11px] font-medium tracking-[.12em] text-surface uppercase">JS55555</b>
            MIL grade qualified ultracapacitors
          </Reveal>
          <Reveal as="h1" delay={1} className="mb-6 text-[clamp(2.4rem,4.6vw,3.6rem)] max-xs:text-[2.3rem]">
            <span aria-hidden="true" className="align-[.12em] text-[.72em] leading-[0] text-brand-cyan">✳</span> Ushering a{' '}
            {/* The key phrase gets a charging underline once the headline is revealed */}
            <span className="text-accent transition-[background-size] delay-700 duration-[1200ms] ease-[cubic-bezier(.2,.7,.2,1)] [background:linear-gradient(var(--color-brand-cyan),var(--color-brand-cyan))_0_92%/0_4px_no-repeat] group-data-[in]/reveal:[background-size:100%_4px]">
              paradigm change
            </span>{' '}
            in energy storage.
          </Reveal>
          <Rail short />
          <Reveal as="p" delay={2} className="mb-10 max-w-[560px] text-xl leading-[30px] text-muted">
            Best-in-class energy storage technologies, made in India. Trusted by the Indian Army and DRDO labs for pulse power, engine starting and backup power.
          </Reveal>
          <Reveal delay={3} className="flex flex-wrap gap-4">
            <Button to="/about" arrow lean className="max-sm:flex-auto">About us</Button>
            <Button to="/contact" variant="secondary" lean className="max-sm:flex-auto">Contact us</Button>
          </Reveal>
          <Reveal as="ul" delay={3} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t pt-6 max-sm:mt-[30px] max-sm:gap-x-[18px] max-sm:gap-y-2.5 max-sm:pt-[22px]">
            {heroChecks.map((c) => (
              <li key={c} className="inline-flex items-center gap-2.5 text-sm leading-5 text-muted max-sm:text-[13.5px]">
                <span className="grid size-5 shrink-0 place-items-center bg-surface-highlight text-xs font-semibold text-heading">✓</span>
                {c}
              </li>
            ))}
          </Reveal>
        </div>

        <Reveal delay={2} className="relative mx-auto w-full max-w-[600px]">
          <PlugScene running={visible} />
          <div className="mt-2 grid grid-cols-3 gap-2.5 max-sm:grid-cols-2 max-xs:grid-cols-1">
            {heroCallouts.map((c, i) => (
              <div
                key={c.id}
                className={cn(
                  'flex min-w-0 items-center gap-3 rounded-control border bg-surface-raised p-3',
                  i === 2 && 'max-sm:col-span-full max-xs:col-auto',
                )}
              >
                <span className="grid size-[34px] shrink-0 place-items-center bg-surface-highlight text-brand-cyan max-lg:size-[30px]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" className="size-5 max-lg:size-[17px]">
                    {icons[c.icon]}
                  </svg>
                </span>
                <div>
                  <strong className="block font-display text-[15px] leading-[1.2] font-semibold text-ink max-lg:text-sm">{c.title}</strong>
                  <span className="block font-mono text-[11px] leading-[1.35] text-muted">{c.text}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Wrap>
      <a
        href="#stats"
        aria-label="Scroll down"
        className="absolute bottom-[26px] left-1/2 h-[42px] w-[26px] -translate-x-1/2 rounded-pill border border-line-control after:absolute after:top-2 after:left-1/2 after:-ml-0.5 after:h-2 after:w-1 after:animate-wheel after:rounded-pill after:bg-brand-cyan max-sm:hidden short-landscape:hidden"
      />
    </section>
  );
}
