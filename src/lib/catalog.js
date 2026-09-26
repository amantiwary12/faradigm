import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';
import { categories as staticCategories, products as staticProducts } from '../data/catalog.js';
import { fetchProducts } from './api.js';

// ---- pure helpers (work on one product) ---------------------------------------------------------
/**
 * Cloudinary images are delivered resized and re-encoded on the fly (f_auto = WebP/AVIF where the browser
 * supports it, q_auto = smart compression, w_ = at most this many pixels wide). Other URLs pass through.
 */
export const optimize = (url, width) =>
  url && url.startsWith('https://res.cloudinary.com/') ? url.replace('/image/upload/', `/image/upload/f_auto,q_auto${width ? `,w_${width}` : ''}/`) : url;

export const photoUrl = (p, width) => optimize(p.image || `/products/${p.slug}.webp`, width);
export const curvesUrl = (p, width) => optimize(p.curves || '', width);

/** "60KW@1500V EV DC Charging Power Module" -> "60KW@1500V" (empty when the line has no such prefix) */
export const powerTag = (p) => {
  const tag = ((p.sub || '').match(/^\d+(\.\d+)?\s?KW(@[\w/]+)?/i)?.[0] || '').replace(/\s/g, '');
  return tag.length > 12 ? tag.split('@')[0] : tag; // long dual-voltage tags shrink to just the power
};

/** The first few headline figures from a product's spec table, for the summary strip. */
const FACTS = [/^(rated |output )?power$/i, /^dimensions?$/i, /^weight$/i, /^(peak )?efficiency/i, /^cooling (method|mode)$/i];
export function quickFacts(p) {
  const rows = p.specs.flatMap((s) => s.rows);
  return FACTS.map((re) => rows.find(([k]) => re.test(k))).filter(Boolean).slice(0, 4);
}

/** A spec table that still has the default two headings is shown as plain label/value rows. */
export const isPlainSpec = (s) => !s.columns || (s.columns.length === 2 && s.columns[0] === 'Parameter' && s.columns[1] === 'Value');

// ---- building the catalogue from a flat product list -------------------------------------------
const fromStatic = () =>
  staticProducts.map((p, i) => {
    const fam = staticCategories.find((c) => c.slug === p.family);
    const grp = fam.groups.find((g) => g.slug === p.group);
    return {
      ...p, order: i, familySlug: fam.slug, familyTitle: fam.title, groupSlug: grp.slug, groupTitle: grp.title, groupBlurb: grp.blurb,
      image: `/products/${p.slug}.webp`, curves: p.hasCurves ? `/products/${p.slug}-curves.webp` : '', description: '',
    };
  });

/** Families -> groups -> model slugs, in first-seen order (the products arrive sorted by `order`). */
export function buildCatalog(list) {
  const products = list.map((p) => ({ description: '', curves: '', advantages: [], features: [], specs: [], ...p, family: p.familySlug, group: p.groupSlug }));
  const categories = [];
  for (const p of products) {
    let fam = categories.find((c) => c.slug === p.familySlug);
    if (!fam) categories.push((fam = { slug: p.familySlug, title: p.familyTitle, blurb: '', groups: [] }));
    let grp = fam.groups.find((g) => g.slug === p.groupSlug);
    if (!grp) fam.groups.push((grp = { slug: p.groupSlug, title: p.groupTitle, blurb: p.groupBlurb || '', models: [] }));
    grp.models.push(p.slug);
    if (!grp.blurb && p.groupBlurb) grp.blurb = p.groupBlurb;
  }
  categories.forEach((c) => { c.blurb = c.groups.map((g) => g.blurb).filter(Boolean).join('; '); });
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  return {
    products,
    categories,
    productBySlug: (slug) => bySlug.get(slug),
    categoryBySlug: (slug) => categories.find((c) => c.slug === slug),
    familyOf: (p) => categories.find((c) => c.slug === p.familySlug),
    groupOf: (p) => categories.find((c) => c.slug === p.familySlug)?.groups.find((g) => g.slug === p.groupSlug),
    modelsOf: (group) => group.models.map((m) => bySlug.get(m)).filter(Boolean),
  };
}

// ---- context: the live catalogue -----------------------------------------------------------------
// status: 'loading' (nothing shown yet, so unpublished products can never flash), 'ready' (from the API),
// or 'fallback' (API unreachable: the bundled catalogue is shown so the site still works).
const CatalogContext = createContext(buildCatalog([]));
const CatalogStatus = createContext('loading');

export function CatalogProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', list: [] });

  useEffect(() => {
    let alive = true;
    let last = 0;
    const load = () => {
      last = Date.now();
      fetchProducts()
        .then((items) => alive && setState({ status: 'ready', list: items }))
        .catch(() => alive && setState((s) => (s.status === 'ready' ? s : { status: 'fallback', list: fromStatic() })));
    };
    load();
    // Pick up admin changes when the visitor returns to the tab
    const onVisible = () => document.visibilityState === 'visible' && Date.now() - last > 30000 && load();
    document.addEventListener('visibilitychange', onVisible);
    return () => { alive = false; document.removeEventListener('visibilitychange', onVisible); };
  }, []);

  const catalog = useMemo(() => buildCatalog(state.list), [state.list]);
  return createElement(CatalogStatus.Provider, { value: state.status }, createElement(CatalogContext.Provider, { value: catalog }, children));
}

export const useCatalog = () => useContext(CatalogContext);
export const useCatalogStatus = () => useContext(CatalogStatus);
