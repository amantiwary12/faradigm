import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildMenu, buildSearchIndex } from '../data/nav.js';
import { useCatalog } from '../lib/catalog.js';
import useDebouncedValue from '../hooks/useDebouncedValue.js';
import { cn } from '../lib/env.js';

// Every word typed must appear in a result's title or its menu group; title matches rank first.
function search(index, query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return index
    .map((e) => {
      const title = e.title.toLowerCase();
      const hay = `${title} ${e.group.toLowerCase()} ${(e.kw || '').toLowerCase()}`;
      if (!words.every((w) => hay.includes(w))) return null;
      return { e, score: words.every((w) => title.includes(w)) ? (title.startsWith(words[0]) ? 0 : 1) : 2 };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score)
    .slice(0, 8)
    .map((r) => r.e);
}

// Wait for a pause in typing before filtering; the input itself stays instant
const DEBOUNCE_MS = 200;

/** Pill search over every page and section in the menu. Up/Down/Enter/Esc work. */
export default function Search({ className, onNavigate }) {
  const navigate = useNavigate();
  const catalog = useCatalog();
  const index = useMemo(() => buildSearchIndex(buildMenu(catalog), catalog), [catalog]);
  const listId = useId();
  const box = useRef(null);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const dq = useDebouncedValue(q, DEBOUNCE_MS); // what the results were computed for
  const settled = dq === q; // false while a keystroke is still waiting out the debounce
  const results = useMemo(() => search(index, dq), [index, dq]);

  // New results: put the highlight back on the first one
  useEffect(() => setActive(0), [dq]);

  useEffect(() => {
    const away = (e) => !box.current?.contains(e.target) && setOpen(false);
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, []);

  const go = (entry) => {
    if (!entry) return;
    setQ('');
    setOpen(false);
    onNavigate?.();
    navigate(entry.to);
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      // Enter must act on what is typed now, not on results from before the last keystrokes
      go(settled ? results[active] : search(index, q)[0]);
    }
    else if (e.key === 'Escape') { setOpen(false); e.stopPropagation(); }
  };
  // Don't open an empty box while the first debounced search is still pending
  const showList = open && q.trim().length > 0 && (results.length > 0 || settled);

  return (
    <div ref={box} role="search" className={cn('relative', className)}>
      <div className="flex h-10 w-48 items-center gap-2 rounded-pill border border-line-control bg-surface px-4 transition-colors duration-200 focus-within:border-focus max-lg:w-36 max-md:w-full">
        <input
          type="search"
          value={q}
          placeholder="Search"
          aria-label="Search the site"
          aria-expanded={showList}
          aria-controls={listId}
          aria-busy={!settled}
          aria-activedescendant={showList && results.length ? `${listId}-${active}` : undefined}
          autoComplete="off"
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent font-sans text-[15px] text-ink outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
        />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-[18px] shrink-0 text-brand-cyan">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
      </div>
      {showList && (
        <ul id={listId} role="listbox" aria-busy={!settled} className={cn(!settled && 'opacity-60', 'transition-opacity duration-150 absolute top-full right-0 z-[60] mt-2 w-[min(340px,86vw)] border bg-surface-raised py-2 shadow-modal max-md:right-auto max-md:left-0 max-md:w-full')}>
          {results.length === 0 && settled && <li className="px-4 py-3 text-sm text-muted">No pages match “{q}”.</li>}
          {results.map((r, i) => (
            <li key={r.to + r.title} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
              <button
                type="button"
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => go(r)}
                onMouseEnter={() => setActive(i)}
                className={cn('flex w-full items-baseline justify-between gap-4 px-4 py-2.5 text-left text-[15px] text-ink', i === active && 'bg-surface-highlight')}
              >
                <span>{r.title}</span>
                <span className="shrink-0 font-mono text-[11px] tracking-[.1em] text-muted uppercase">{r.group}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
