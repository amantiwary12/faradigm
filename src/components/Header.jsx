import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { buildMenu } from '../data/nav.js';
import { useCatalog } from '../lib/catalog.js';
import useScrollValue from '../hooks/useScrollValue.js';
import { cn } from '../lib/env.js';
import Logo from './ui/Logo.jsx';
import Search from './Search.jsx';
import { Wrap } from './ui/Layout.jsx';

const isScrolled = () => window.scrollY > 30;
const canHover = () => window.matchMedia('(hover: hover)').matches;

// A link inside a dropdown: a router link for pages, a plain anchor for mailto/tel/external
function MenuLink({ link, className, children, ...rest }) {
  if (link.href) {
    const external = link.href.startsWith('http');
    return (
      <a href={link.href} className={className} {...(external && { target: '_blank', rel: 'noopener' })} {...rest}>
        {children}
      </a>
    );
  }
  return <Link to={link.to} className={className} {...rest}>{children}</Link>;
}

const panelLink =
  'group/l flex items-center gap-0 py-1.5 text-[15px] leading-snug text-muted transition-colors duration-150 before:h-0.5 before:w-0 before:shrink-0 before:bg-brand-cyan before:transition-[width,margin] before:duration-200 hover:text-ink hover:before:mr-2 hover:before:w-3';
const metaClass = 'ml-auto shrink-0 pl-3 font-mono text-[11px] tracking-[.04em] text-muted';

const COL_W = 340; // width of one column in a short dropdown
const PAGE_W = 1200; // matches --container-page
const GUTTER = 24;

/**
 * Desktop mega-menu panel: one column per group, heading with a hairline, then its links.
 * Menus with three or more columns span the page; shorter ones are centred under their own
 * nav item (clamped inside the page margins) instead of sitting at the left edge.
 */
const EASE_OUT = 'ease-[cubic-bezier(.16,1,.3,1)]';
const OPEN_DELAY = 80; // ms: a pointer just passing over the nav does not flash a menu
const CLOSE_DELAY = 160; // ms: a short trip outside the menu does not close it

/**
 * `swap` is true when another menu was already open: the new panel then appears in place without
 * sliding, and `anyOpen` hides the others at once, so switching menus never shows two panels.
 */
function Panel({ item, open, swap, anyOpen, close }) {
  const frame = useRef(null);
  const narrow = item.columns.length < 3;
  const [box, setBox] = useState({ width: undefined, left: 0 });

  useLayoutEffect(() => {
    if (!narrow || !open) return undefined;
    const place = () => {
      const vw = document.documentElement.clientWidth;
      const width = Math.min(item.columns.length * COL_W, vw - GUTTER * 2);
      const anchor = frame.current?.parentElement?.getBoundingClientRect(); // the nav item's row
      const centre = anchor ? anchor.left + anchor.width / 2 : vw / 2;
      // Stay inside the page column (the same edges as the content and the full-width menus)
      const min = Math.max(GUTTER, (vw - PAGE_W) / 2);
      const max = Math.min(vw - GUTTER, (vw + PAGE_W) / 2) - width;
      setBox({ width, left: Math.round(Math.min(Math.max(centre - width / 2, min), Math.max(min, max))) });
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [narrow, open, item.columns.length]);

  if (!item.columns.length) return null; // e.g. Products while the catalogue is still loading
  return (
    <div
      ref={frame}
      className={cn(
        'absolute inset-x-0 top-full transition-[opacity,translate,visibility] max-md:hidden motion-reduce:transition-none',
        !narrow && 'px-6',
        open
          ? cn('visible translate-y-0 opacity-100', EASE_OUT, swap ? 'duration-150' : 'duration-300')
          : cn('invisible -translate-y-2 opacity-0 ease-in', anyOpen ? 'duration-0' : 'duration-200'),
      )}
    >
      <div className={narrow ? 'relative' : 'mx-auto max-w-page'}>
      <div
        style={narrow ? { position: 'absolute', top: 0, left: box.left, width: box.width } : undefined}
        className="max-h-[calc(100vh-110px)] max-w-full overflow-y-auto border border-t-4 border-t-brand-cyan bg-surface-raised px-8 pt-7 pb-6 shadow-modal"
      >
      <div className="grid gap-x-10" style={{ gridTemplateColumns: `repeat(${item.columns.length}, minmax(0, 1fr))` }}>
        {item.columns.map((col, idx) => (
          <div
            key={col.title}
            // Columns rise in one after another as the panel opens
            style={{ transitionDelay: open ? `${60 + idx * 45}ms` : '0ms' }}
            className={cn('min-w-0 transition-[opacity,translate] duration-300 motion-reduce:transition-none', EASE_OUT, open ? 'translate-y-0 opacity-100' : 'translate-y-1.5 opacity-0')}
          >
            <Link to={col.to} onClick={close} className="block border-b pb-4 font-display text-[1.1rem] leading-[1.27] font-semibold text-heading transition-colors hover:text-link">
              {col.title}
            </Link>
            <ul className="mt-4 grid">
              {col.links.map((l) => (
                <li key={l.label}>
                  <MenuLink link={l} className={panelLink} onClick={close}>
                    <span className="min-w-0 [overflow-wrap:anywhere]">{l.label}</span>
                    {l.meta && <span className={metaClass}>{l.meta}</span>}
                  </MenuLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {item.footer && (
        <ul
          style={{ transitionDelay: open ? `${60 + item.columns.length * 45}ms` : '0ms' }}
          className={cn('mt-6 flex flex-wrap items-center gap-x-8 gap-y-1 border-t pt-4 transition-opacity duration-300 motion-reduce:transition-none', open ? 'opacity-100' : 'opacity-0')}
        >
          {item.footer.map((l) => (
            <li key={l.label}>
              <MenuLink link={l} onClick={close} className={cn(panelLink, l.strong && 'font-semibold text-link hover:text-heading')}>{l.label}</MenuLink>
            </li>
          ))}
        </ul>
      )}
      </div>
      </div>
    </div>
  );
}

function Chevron({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true" className={cn('size-4 transition-transform duration-200', open && 'rotate-180')}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const catalog = useCatalog();
  const menu = useMemo(() => buildMenu(catalog), [catalog]);
  const [drawer, setDrawer] = useState(false); // mobile drawer
  // desktop: index of the open dropdown, and whether it replaced another open one (see Panel)
  const [{ i: hover, swap }, setMenu] = useState({ i: null, swap: false });
  const [accordion, setAccordion] = useState(null); // mobile: index of the expanded group
  const scrolled = useScrollValue(isScrolled);
  const timer = useRef(null);

  const setHover = (i) => {
    clearTimeout(timer.current);
    setMenu((m) => (m.i === i ? m : { i, swap: m.i !== null && i !== null }));
  };
  // Hover intent: open after a short pause (at once when a menu is already open), close after a grace period
  const hoverIn = (i) => {
    clearTimeout(timer.current);
    if (hover !== null) setHover(i);
    else timer.current = setTimeout(() => setHover(i), OPEN_DELAY);
  };
  const hoverOut = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setHover(null), CLOSE_DELAY);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const closeAll = () => {
    setDrawer(false);
    setHover(null);
  };
  useEffect(closeAll, [pathname]);

  // Lock page scroll behind the open drawer; Esc or widening the window closes things
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && closeAll();
    const onResize = () => window.innerWidth > 920 && setDrawer(false);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [drawer]);

  // Touch tablets (>920px, no hover): the first tap opens the dropdown, the second follows the link
  const onTopClick = (e, i) => {
    if (window.innerWidth > 920 && !canHover() && hover !== i) {
      e.preventDefault();
      setHover(i);
    }
  };

  const bar = 'absolute right-3 left-3 h-0.5 bg-heading transition-[transform,opacity] duration-300';

  return (
    <header
      onMouseLeave={() => canHover() && hoverOut()}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHover(null)}
      className={cn(
        // The blur lives on ::before: backdrop-filter on the header itself would become the
        // containing block for the fixed-position mobile drawer.
        'fixed inset-x-0 top-0 z-50 py-4 transition-[box-shadow,padding] duration-300 before:absolute before:inset-0 before:-z-10 before:bg-white/88 before:opacity-0 before:backdrop-blur-[14px] before:transition-opacity before:duration-300',
        (scrolled || hover !== null) && 'before:opacity-100',
        scrolled && 'py-2 shadow-[0_1px_0_var(--border)]',
      )}
    >
      <Wrap className="flex items-center justify-between gap-6">
        <Logo priority />
        <nav aria-label="Primary">
          <div
            onClick={closeAll}
            className={cn(
              'fixed inset-0 -z-10 hidden bg-[rgba(26,14,74,.45)] backdrop-blur-sm transition-[opacity,visibility] duration-300',
              drawer ? 'max-md:visible max-md:block max-md:opacity-100' : 'max-md:invisible max-md:block max-md:opacity-0',
            )}
          />
          <div
            id="navLinks"
            className={cn(
              'flex items-center gap-1',
              'max-md:fixed max-md:inset-y-0 max-md:right-0 max-md:w-[min(360px,88vw)] max-md:flex-col max-md:items-stretch max-md:gap-0 max-md:overflow-y-auto max-md:border-l max-md:bg-surface max-md:px-[22px] max-md:pt-24 max-md:pb-[30px] max-md:shadow-modal',
              drawer
                ? 'max-md:visible max-md:translate-x-0 max-md:[transition:transform_.4s_cubic-bezier(.2,.7,.2,1)]'
                : 'max-md:invisible max-md:translate-x-full max-md:[transition:transform_.4s_cubic-bezier(.2,.7,.2,1),visibility_0s_linear_.4s]',
            )}
          >
            <Search onNavigate={closeAll} className="max-md:order-first max-md:mb-4 md:order-last md:ml-3" />
            {menu.map((item, i) => (
              <div
                key={item.label}
                onMouseEnter={() => canHover() && hoverIn(i)}
                onFocus={() => window.innerWidth > 920 && setHover(i)}
                className="max-md:border-b"
              >
                <div className="flex items-center">
                  <NavLink
                    to={item.to}
                    onClick={(e) => onTopClick(e, i)}
                    aria-haspopup="true"
                    aria-expanded={hover === i}
                    className={({ isActive }) =>
                      cn(
                        'relative rounded-control px-3.5 py-2.5 font-sans text-[15px] font-medium text-muted transition-colors duration-200 hover:text-ink max-lg:px-2.5 max-lg:text-sm max-md:flex-1 max-md:px-0 max-md:py-3.5 max-md:text-[17px]',
                        // Underline grows out from the centre on hover and stays for the open menu / current page
                        'after:absolute after:inset-x-3.5 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-brand-cyan after:transition-transform after:duration-300 hover:after:scale-x-100 max-lg:after:inset-x-2.5 max-md:after:hidden motion-reduce:after:transition-none',
                        'after:ease-[cubic-bezier(.16,1,.3,1)]',
                        (isActive || hover === i) && 'text-ink after:scale-x-100',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                  <button
                    type="button"
                    aria-label={`${accordion === i ? 'Collapse' : 'Expand'} ${item.label}`}
                    aria-expanded={accordion === i}
                    onClick={() => setAccordion(accordion === i ? null : i)}
                    className="hidden size-11 place-items-center text-muted max-md:grid"
                  >
                    <Chevron open={accordion === i} />
                  </button>
                </div>
                <Panel item={item} open={hover === i} swap={swap} anyOpen={hover !== null} close={closeAll} />
                {/* Mobile: the same groups as an accordion inside the drawer */}
                {/* grid-rows 0fr -> 1fr animates to the content's real height */}
                <div
                  inert={accordion !== i}
                  className={cn(
                    'hidden transition-[grid-template-rows,opacity] duration-300 max-md:grid motion-reduce:transition-none',
                    EASE_OUT,
                    accordion === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                <div className="min-h-0 overflow-hidden">
                <div className="pb-3 pl-1">
                  {item.columns.map((col) => (
                    <div key={col.title} className="mb-3">
                      <Link to={col.to} onClick={closeAll} className="block py-1.5 font-mono text-xs font-medium tracking-[.14em] text-heading uppercase">{col.title}</Link>
                      <ul>
                        {col.links.map((l) => (
                          <li key={l.label}>
                            <MenuLink link={l} onClick={closeAll} className="block border-l-2 py-1.5 pl-3 text-[15px] text-muted hover:border-brand-cyan hover:text-ink"><span>{l.label}</span>{l.meta && <span className="ml-2 font-mono text-[11px] text-muted">{l.meta}</span>}</MenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {item.footer && (
                    <ul className="mb-3 border-t pt-3">
                      {item.footer.map((l) => (
                        <li key={l.label}>
                          <MenuLink link={l} onClick={closeAll} className={cn('block py-1.5 text-[15px] text-muted hover:text-ink', l.strong && 'font-semibold text-link')}>{l.label}</MenuLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            aria-label={drawer ? 'Close menu' : 'Open menu'}
            aria-expanded={drawer}
            aria-controls="navLinks"
            onClick={() => setDrawer((o) => !o)}
            className="relative z-[2] hidden size-[46px] rounded-control border-2 border-line-control bg-transparent max-md:block"
          >
            <span className={cn(bar, 'top-[15px]', drawer && 'translate-y-1.5 rotate-45')} />
            <span className={cn(bar, 'top-[21px]', drawer && 'opacity-0')} />
            <span className={cn(bar, 'top-[27px]', drawer && '-translate-y-1.5 -rotate-45')} />
          </button>
        </nav>
      </Wrap>
    </header>
  );
}
