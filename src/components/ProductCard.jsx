import { Link } from 'react-router-dom';
import { photoUrl, powerTag } from '../lib/catalog.js';
import Reveal from './ui/Reveal.jsx';

/** A catalogue product: photo, model, one-line description. The whole card opens the detail page. */
export default function ProductCard({ product: p, delay = 0 }) {
  return (
    <Reveal delay={delay % 3} className="h-full">
      <Link
        to={`/products/${p.slug}`}
        className="group relative flex h-full flex-col overflow-hidden border bg-surface-raised transition-colors duration-200 before:absolute before:top-0 before:left-0 before:z-[1] before:h-1 before:w-0 before:bg-brand-cyan before:transition-[width] before:duration-[450ms] before:ease-[cubic-bezier(.2,.7,.2,1)] hover:border-brand-cyan hover:before:w-full"
      >
        <img
          src={photoUrl(p, 640)}
          alt={p.sub ? `${p.model} — ${p.sub}` : p.model}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full bg-surface-alt object-cover object-top transition-transform duration-[600ms] group-hover:scale-[1.03]"
        />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="min-w-0 text-[1.15rem] [overflow-wrap:anywhere]">{p.model}</h3>
            {powerTag(p) && <span className="shrink-0 font-mono text-xs tracking-[.04em] text-brand-cyan">{powerTag(p)}</span>}
          </div>
          <p className="mt-2 mb-4 text-sm leading-[21px] text-muted">{(p.sub || '').replace(/^\d+(\.\d+)?\s?KW(@[\w/]+)?\s*/i, '') || p.sub || p.description.slice(0, 110)}</p>
          <span className="mt-auto font-semibold text-link">
            View details <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
