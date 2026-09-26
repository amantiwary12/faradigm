import { applicationTabs, oemChips, processSteps, site } from './content.js';
import { cases } from './cases.js';
import { slugify } from '../lib/slug.js';
import { powerTag } from '../lib/catalog.js';

// One entry per top-level menu item. Each has columns for its mega-menu dropdown:
// a column has a heading (which links to a page) and a list of links.
// A link is { label, to } for a page in this app, or { label, href } for mailto/tel/external.

const tab = (id) => applicationTabs.find((t) => t.id === id);
const appLinks = (id) => tab(id).items.map((label) => ({ label, to: `/solutions/${id}#${slugify(label)}` }));

/** The mega-menu. The Products columns come from the live catalogue (published products only). */
export const buildMenu = ({ categories, products }) => [
  {
    label: 'Products',
    to: '/products',
    // One column per product family, as in the catalogue: every model links to its own page
    columns: categories.map((c) => ({
      title: c.title,
      to: `/products/category/${c.slug}`,
      links: c.groups.flatMap((g) => g.models).map((m) => {
        const p = products.find((x) => x.slug === m);
        return { label: p.model, meta: powerTag(p), to: `/products/${p.slug}` };
      }),
    })),
    footer: [
      { label: 'Product Catalogue (PDF) ↗', href: site.catalogUrl, strong: true },
      { label: 'Faradigm® Ultracapacitors', to: '/products/faradigm-ultracapacitors' },
      { label: 'Other Ultracapacitor OEMs', to: '/products/oem-ultracapacitors' },
      { label: 'KranKing jump-start module', to: '/work/mil-grade-ultracapacitors' },
      { label: 'Project UPLIFT', to: '/work/project-uplift' },
    ],
  },
  {
    label: 'Solutions',
    to: '/solutions/proven',
    columns: [
      { title: 'Proven Capabilities', to: '/solutions/proven', links: appLinks('proven') },
      { title: 'Under the Radar', to: '/solutions/radar', links: appLinks('radar') },
      { title: 'Defence', to: '/solutions/defence', links: appLinks('defence') },
      {
        title: 'Application Engineering',
        to: '/work',
        links: [
          ...cases.map((c) => ({ label: c.title, to: `/work/${c.slug}` })),
          { label: 'OEM applications', to: '/solutions/oem' },
        ],
      },
    ],
  },
  {
    label: 'About Us',
    to: '/about',
    columns: [
      {
        title: 'Company',
        to: '/about',
        links: [
          { label: 'About Faradigm®', to: '/about' },
          { label: 'Registered trademark', to: '/about#trademark' },
          { label: 'Aartech Solonics Ltd. ↗', href: site.aartech },
        ],
      },
      { title: 'Our Name', to: '/about/name', links: [{ label: 'How Faradigm® was coined', to: '/about/name' }] },
      {
        title: 'Trust',
        to: '/about/testimonials',
        links: [
          { label: 'Trusted & validated by', to: '/about/testimonials#trusted' },
          { label: 'Testimonials', to: '/about/testimonials#testimonials' },
        ],
      },
    ],
  },
  {
    label: 'Service Support',
    to: '/support',
    columns: [
      {
        title: 'Application Support',
        to: '/support',
        links: processSteps.map((s) => ({ label: s.title, to: `/support#step-${s.n}` })),
      },
      {
        title: 'OEM Support',
        to: '/solutions/oem',
        links: [
          { label: 'OEM application requirements', to: '/solutions/oem' },
          { label: 'Other OEM integrations', to: '/products/oem-ultracapacitors' },
        ],
      },
      { title: 'Pain Point', to: '/contact', links: [{ label: 'Share your pain point', to: '/contact' }] },
    ],
  },
  {
    label: 'News',
    to: '/news',
    columns: [
      {
        title: 'Milestones',
        to: '/news',
        links: [
          { label: 'Incorporated in 2017', to: '/news#incorporated' },
          { label: 'MIL grade JS55555 qualified', to: '/news#mil-grade' },
          { label: 'Project UPLIFT', to: '/news#uplift' },
        ],
      },
      { title: 'Updates', to: '/news#updates', links: [{ label: 'Company announcements', to: '/news#updates' }] },
    ],
  },
  {
    label: 'Contact Us',
    to: '/contact',
    columns: [
      {
        title: 'Get in Touch',
        to: '/contact',
        links: [
          { label: 'Send an enquiry', to: '/contact' },
          { label: site.email, href: `mailto:${site.email}` },
          { label: site.phoneDisplay, href: site.phoneHref },
        ],
      },
      { title: 'Visit Us', to: '/contact#address', links: [{ label: 'Mandideep, Madhya Pradesh', to: '/contact#address' }] },
      { title: 'Partnerships', to: '/contact#partner', links: [{ label: 'Start a conversation', to: '/contact#partner' }] },
    ],
  },
];

// Flat list for the search box: every page and every anchor the menu reaches.
export const buildSearchIndex = (menu, { categories, products }) => {
  const seen = new Set();
  const out = [];
  const add = (title, to, group, kw = '') => {
    if (seen.has(to + title)) return;
    seen.add(to + title);
    out.push({ title: title.replace(/ ↗$/, ''), to, group, kw });
  };
  products.forEach((p) => add(p.model, `/products/${p.slug}`, 'Products', p.sub));
  categories.forEach((c) => add(c.title, `/products/category/${c.slug}`, 'Products'));
  add('Product Catalogue', '/products', 'Products', 'catalog catalogue pdf download brochure');
  menu.forEach((m) => {
    add(m.label, m.to, 'Page');
    m.columns.forEach((c) => {
      add(c.title, c.to, m.label);
      c.links.filter((l) => l.to).forEach((l) => add(l.label, l.to, m.label));
    });
  });
  return out;
};
