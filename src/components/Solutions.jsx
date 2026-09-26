import { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { applicationTabs } from '../data/content.js';
import useCountUp from '../hooks/useCountUp.js';
import { cn } from '../lib/env.js';
import { slugify } from '../lib/slug.js';
import Reveal from './ui/Reveal.jsx';
import SectionHead from './ui/SectionHead.jsx';
import { Section, Wrap } from './ui/Layout.jsx';

/** The big figure counts up whenever a tab is opened (but not on first paint). */
function BigFigure({ value, animate }) {
  const numeric = typeof value === 'number';
  const n = useCountUp(numeric ? value : 0, { duration: 700, enabled: animate && numeric });
  return <div className="font-mono text-[3.6rem] leading-none font-medium text-white">{numeric ? String(n).padStart(2, '0') : value}</div>;
}

/** The applications tabs. The open tab lives in the URL (/solutions/:tab), so each category is its own page. */
export default function Solutions({ tab, headless = false }) {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const active = applicationTabs.some((t) => t.id === tab) ? tab : applicationTabs[0].id;
  const tabRefs = useRef({});
  const touched = useRef(false);

  const select = (id) => {
    touched.current = true;
    navigate(`/solutions/${id}`);
  };
  // Arrow keys move between tabs (roving tabindex)
  const onKeyDown = (e, i) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    const next = applicationTabs[(i + step + applicationTabs.length) % applicationTabs.length];
    tabRefs.current[next.id].focus();
    select(next.id);
  };

  return (
    <Section id="applications" className="bg-surface-alt">
      <Wrap>
        {!headless && <SectionHead index="04" eyebrow="Our Capabilities" title="We know this:" bold="applications." />}

        <Reveal
          role="tablist"
          aria-label="Application categories"
          className="mb-[34px] flex flex-wrap gap-6 border-b [scrollbar-width:none] max-sm:-mx-[18px] max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-[18px] max-sm:pb-1.5 [&::-webkit-scrollbar]:hidden"
        >
          {applicationTabs.map((t, i) => {
            const on = t.id === active;
            return (
              <button
                key={t.id}
                ref={(el) => (tabRefs.current[t.id] = el)}
                type="button"
                role="tab"
                id={`t-${t.id}`}
                aria-controls={`p-${t.id}`}
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                onClick={() => select(t.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  'flex cursor-pointer items-center gap-2 border-0 border-b-2 border-transparent bg-transparent px-1 py-3 font-sans text-[15px] font-semibold text-muted transition-[color,border-color] duration-200 max-sm:shrink-0 max-sm:px-4 max-sm:py-[11px] max-sm:text-sm',
                  on ? 'border-brand-navy text-heading' : 'hover:text-ink',
                )}
              >
                {t.label}
                {t.count && (
                  <span className={cn('rounded-pill px-2 py-0.5 font-mono text-[11px] transition-all duration-200', on ? 'bg-brand-navy text-white' : 'bg-surface-highlight text-muted')}>
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </Reveal>

        {applicationTabs.map((t) => {
          const on = t.id === active;
          return (
            <div
              key={t.id}
              role="tabpanel"
              id={`p-${t.id}`}
              aria-labelledby={`t-${t.id}`}
              hidden={!on}
              className="grid grid-cols-[.9fr_1.1fr] items-stretch gap-7 max-md:grid-cols-1 *:min-w-0"
            >
              {/* Panels mount only while open, so their entrance animation replays on every switch */}
              {on && (
                <>
                  <div data-theme="dark" className="relative animate-fade-up overflow-hidden bg-surface-panel p-10 text-white max-sm:p-7">
                    <BigFigure value={t.big} animate={touched.current} />
                    <h3 className="mt-3.5 mb-3 text-[1.6rem] text-white">{t.heading}</h3>
                    <p className="m-0 text-[#BFBCCC]">{t.text}</p>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] content-start gap-3.5 max-sm:grid-cols-1">
                    {t.items ? (
                      t.items.map((item, i) => (
                        <div
                          key={item}
                          id={slugify(item)}
                          style={{ animationDelay: `${i * 45}ms` }}
                          className={cn(hash === `#${slugify(item)}` && 'border-brand-cyan ring-2 ring-brand-cyan', 'relative flex animate-fade-up items-center overflow-hidden border border-l-4 border-l-brand-cyan bg-surface px-5 py-[18px] font-sans text-[15px] leading-[1.3] font-medium transition-colors duration-[250ms] before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-0 before:bg-brand-navy before:transition-transform before:duration-[350ms] before:ease-[cubic-bezier(.2,.7,.2,1)] hover:text-white hover:before:scale-x-100 *:relative *:z-[1]')}
                        >
                          <span>{item}</span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full animate-fade-up border border-l-4 border-l-brand-navy bg-cyan-100 p-[26px] text-[1.02rem] leading-[1.3]">
                        Our application development team will be happy to support your OEM application requirements.{' '}
                        <Link to="/contact" className="font-semibold text-brand-navy">Tell us what you're building →</Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </Wrap>
    </Section>
  );
}
