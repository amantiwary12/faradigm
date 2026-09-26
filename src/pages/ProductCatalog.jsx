import { Link, Navigate, useParams } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import Technology from '../components/Technology.jsx';
import Partner from '../components/Partner.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import Button from '../components/ui/Button.jsx';
import Rail from '../components/ui/Rail.jsx';
import { Section, Wrap } from '../components/ui/Layout.jsx';
import { site } from '../data/content.js';
import { curvesUrl, isPlainSpec, photoUrl, quickFacts, useCatalog, useCatalogStatus } from '../lib/catalog.js';

const grid = 'grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1 *:min-w-0';

function CatalogueBanner() {
  return (
    <Reveal
      data-theme="dark"
      className="relative flex flex-wrap items-center justify-between gap-6 overflow-hidden bg-surface-panel p-[clamp(28px,4vw,44px)] text-white *:relative"
    >
      <div className="max-w-[640px]">
        <h2 className="text-[clamp(1.4rem,2.6vw,2rem)] text-white italic">Product catalogue</h2>
        <p className="mt-2 mb-0 text-[#BFBCCC]">The full range with specifications, in one PDF.</p>
      </div>
      <Button href={site.catalogUrl} target="_blank" rel="noopener" arrow>Open the catalogue (PDF)</Button>
    </Reveal>
  );
}

function Groups({ family }) {
  const { modelsOf } = useCatalog();
  return family.groups.map((g) => (
    <div key={g.slug} id={g.slug} className="mb-14 last:mb-0">
      <Reveal>
        <h3 className="text-[clamp(1.3rem,2.4vw,1.7rem)]">{g.title}</h3>
        <p className="mt-1 mb-0 text-muted">{g.blurb}</p>
        <Rail className="mb-8 mt-4" />
      </Reveal>
      <div className={grid}>
        {modelsOf(g).map((p, i) => <ProductCard key={p.slug} product={p} delay={i} />)}
      </div>
    </div>
  ));
}

/** /products — the catalogue, family by family, then the Faradigm® ultracapacitors. */
export function ProductsPage() {
  const { categories, products } = useCatalog();
  const status = useCatalogStatus();
  return (
    <>
      <PageHero eyebrow="Products" title="Power modules &" bold="ultracapacitors.">
        EV charging, liquid cooling and energy storage power modules, and Faradigm® ultracapacitors. Every product opens its own page.
      </PageHero>
      <Section className="pb-0">
        <Wrap>
          <CatalogueBanner />
          <nav aria-label="Product families" className="mt-8 flex flex-wrap gap-3" data-count={products.length}>
            {categories.map((c) => (
              <Link key={c.slug} to={`/products/category/${c.slug}`} className="rounded-pill border px-4 py-2 font-mono text-xs tracking-[.08em] text-heading uppercase transition-colors hover:border-brand-cyan hover:bg-surface-highlight">
                {c.title}
              </Link>
            ))}
            <a href="#ultracapacitors" className="rounded-pill border px-4 py-2 font-mono text-xs tracking-[.08em] text-heading uppercase transition-colors hover:border-brand-cyan hover:bg-surface-highlight">Ultracapacitors</a>
          </nav>
        </Wrap>
      </Section>
      {status === 'loading' && <Section><Wrap><p className="text-muted" role="status">Loading products…</p></Wrap></Section>}
      {categories.map((c) => (
        <Section key={c.slug} id={c.slug}>
          <Wrap>
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)] italic">{c.title}</h2>
              <Link to={`/products/category/${c.slug}`} className="font-semibold text-link underline underline-offset-[3px] hover:decoration-2">View this family →</Link>
            </Reveal>
            <Groups family={c} />
          </Wrap>
        </Section>
      ))}
      <div id="ultracapacitors" className="bg-surface-alt">
        <Wrap className="pt-[clamp(56px,7vw,88px)]">
          <Reveal>
            <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)] italic">Faradigm® Ultracapacitors</h2>
          </Reveal>
        </Wrap>
        <Technology headless />
      </div>
      <Partner />
    </>
  );
}

/** /products/category/:slug — one family with all its groups. */
export function ProductCategory() {
  const { slug } = useParams();
  const { categoryBySlug } = useCatalog();
  const status = useCatalogStatus();
  const family = categoryBySlug(slug);
  if (!family) return status === 'loading' ? <Loading /> : <Navigate to="/products" replace />;
  return (
    <>
      <PageHero eyebrow="Products" title={family.title}>{family.blurb}.</PageHero>
      <Section>
        <Wrap>
          <Groups family={family} />
          <Reveal className="mt-14 flex flex-wrap gap-4">
            <Button href={site.catalogUrl} target="_blank" rel="noopener" arrow>Product catalogue (PDF)</Button>
            <Button to="/products" variant="secondary">All products</Button>
          </Reveal>
        </Wrap>
      </Section>
      <Partner />
    </>
  );
}

function SpecTable({ sections }) {
  return (
    <div className="border">
      {sections.map((sec, i) => (
        <div key={sec.section + i}>
          {sec.section && <h3 className="border-b bg-surface-highlight px-5 py-3 font-display text-[1.05rem] font-semibold text-heading not-italic [&:not(:first-child)]:border-t">{sec.section}</h3>}
          {isPlainSpec(sec) ? (
            <dl className="m-0">
              {sec.rows.map(([k, v]) => (
                <div key={k + v} className="grid grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] gap-4 border-b px-5 py-3 last:border-b-0 max-sm:grid-cols-1 max-sm:gap-1">
                  <dt className="text-[15px] text-muted">{k}</dt>
                  <dd className="m-0 text-[15px] text-ink [overflow-wrap:anywhere]">{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[15px]">
                <thead>
                  <tr>{sec.columns.map((c, j) => <th key={j} scope="col" className="border-b bg-surface-alt px-5 py-2.5 font-mono text-xs font-medium tracking-[.08em] text-muted uppercase">{c}</th>)}</tr>
                </thead>
                <tbody>
                  {sec.rows.map((r, j) => (
                    <tr key={j} className="border-b last:border-b-0">
                      {sec.columns.map((_, k) => <td key={k} className={k === 0 ? 'px-5 py-3 text-muted' : 'px-5 py-3 text-ink'}>{r[k]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Loading() {
  return <Section className="pt-[160px]"><Wrap><p className="text-muted" role="status">Loading…</p></Wrap></Section>;
}

/** /products/:slug — one product: photo, headline figures, advantages, features, curves, full spec table. */
export function ProductDetail() {
  const { slug } = useParams();
  const { productBySlug, familyOf, groupOf, modelsOf } = useCatalog();
  const status = useCatalogStatus();
  const p = productBySlug(slug);
  if (!p) return status === 'loading' ? <Loading /> : <Navigate to="/products" replace />;
  const family = familyOf(p);
  const group = groupOf(p);
  const related = modelsOf(group).filter((x) => x.slug !== p.slug).slice(0, 3);
  const facts = quickFacts(p);

  return (
    <>
      <PageHero eyebrow={family.title} title={p.model}>{p.sub || p.description.slice(0, 160)}</PageHero>

      <Section className="pb-0">
        <Wrap className="grid grid-cols-[1.15fr_.85fr] items-start gap-[clamp(28px,4vw,56px)] max-md:grid-cols-1 *:min-w-0">
          <Reveal className="reg border bg-surface-alt">
            <img src={photoUrl(p, 1100)} alt={p.sub ? `${p.model} — ${p.sub}` : p.model} className="block h-auto w-full" />
          </Reveal>
          <Reveal delay={1}>
            <dl className="m-0 grid grid-cols-2 gap-px border bg-line max-sm:grid-cols-1">
              {facts.map(([k, v]) => (
                <div key={k} className="bg-surface-raised p-5">
                  <dt className="font-mono text-[11px] tracking-[.14em] text-muted uppercase">{k}</dt>
                  <dd className="m-0 mt-1 font-display text-[1.05rem] font-semibold text-heading [overflow-wrap:anywhere]">{v}</dd>
                </div>
              ))}
            </dl>
            {p.description && p.sub && <p className="mt-6 mb-0 whitespace-pre-line text-muted">{p.description}</p>}
            <div className="mt-6 flex flex-wrap gap-4">
              <Button to={`/contact?product=${encodeURIComponent(p.model)}`} arrow>Request a quote</Button>
              <Button href={site.catalogUrl} target="_blank" rel="noopener" variant="secondary">Catalogue (PDF) ↗</Button>
            </div>
            <p className="mt-5 mb-0 text-sm text-muted">
              {group.title} · <Link to={`/products/category/${family.slug}`} className="text-link underline underline-offset-[3px]">{family.title}</Link>
            </p>
          </Reveal>
        </Wrap>
      </Section>

      {p.advantages.length > 0 && (
        <Section className="pb-0">
          <Wrap>
            <Reveal><h2 className="mb-8 text-[clamp(1.5rem,2.8vw,2rem)]">Excellent advantages</h2></Reveal>
            <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
              {p.advantages.map((a, i) => (
                <Reveal key={a.title} delay={i % 2} className="border border-l-4 border-l-brand-cyan bg-surface-raised p-6">
                  <h3 className="text-[1.15rem]">{a.title}</h3>
                  {a.text && <p className="mt-2 mb-0 text-[15px] text-muted">{a.text}</p>}
                </Reveal>
              ))}
            </div>
          </Wrap>
        </Section>
      )}

      {p.features.length > 0 && (
        <Section className="pb-0">
          <Wrap>
            <Reveal><h2 className="mb-6 text-[clamp(1.5rem,2.8vw,2rem)]">Main features</h2></Reveal>
            <ul className="grid grid-cols-2 gap-x-10 max-md:grid-cols-1">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3.5 border-b py-3.5 text-[15px] leading-normal text-ink before:mt-2 before:size-[9px] before:shrink-0 before:bg-brand-cyan">{f}</li>
              ))}
            </ul>
          </Wrap>
        </Section>
      )}

      {p.curves && (
        <Section className="pb-0">
          <Wrap>
            <Reveal><h2 className="mb-6 text-[clamp(1.5rem,2.8vw,2rem)]">Characteristic curves</h2></Reveal>
            <Reveal className="border bg-surface-raised p-4">
              <img src={curvesUrl(p, 1400)} alt={`Characteristic curves for ${p.model}`} loading="lazy" decoding="async" className="block h-auto w-full" />
            </Reveal>
          </Wrap>
        </Section>
      )}

      <Section id="specifications">
        <Wrap>
          <Reveal><h2 className="mb-6 text-[clamp(1.5rem,2.8vw,2rem)]">Technical specifications</h2></Reveal>
          <SpecTable sections={p.specs} />
        </Wrap>
      </Section>

      {related.length > 0 && (
        <Section className="bg-surface-alt">
          <Wrap>
            <Reveal><h2 className="mb-8 text-[clamp(1.5rem,2.8vw,2rem)]">More in {group.title}</h2></Reveal>
            <div className={grid}>{related.map((r, i) => <ProductCard key={r.slug} product={r} delay={i} />)}</div>
          </Wrap>
        </Section>
      )}
      <Partner />
    </>
  );
}
