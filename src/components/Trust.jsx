import { trusted } from '../data/content.js';

export default function Trust() {
  return (
    <section id="trusted" aria-label="Customers and collaborators" className="border-b bg-surface py-10">
      <div className="mb-6 text-center font-mono text-xs leading-4 font-medium tracking-[.16em] text-muted uppercase">Trusted &amp; validated by</div>
      <div className="group/marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-16 will-change-transform group-hover/marquee:[animation-play-state:paused]">
          {/* The list is repeated once so the -50% loop is seamless; the copy is hidden from assistive tech */}
          {[false, true].map((copy) =>
            trusted.map((name) => (
              <span
                key={`${copy}-${name}`}
                aria-hidden={copy || undefined}
                className="flex items-center gap-16 font-display text-[clamp(1.05rem,2vw,1.3rem)] font-semibold whitespace-nowrap text-muted transition-colors duration-200 after:size-2 after:rotate-45 after:bg-brand-cyan hover:text-heading"
              >
                {name}
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
