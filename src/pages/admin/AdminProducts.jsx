import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { admin as api } from '../../lib/api.js';
import { ADMIN_BASE } from '../../lib/admin.js';
import { buildCatalog, optimize, photoUrl } from '../../lib/catalog.js';
import { cn } from '../../lib/env.js';
import { btn, btnDanger, btnGhost, btnPrimary, inputClass, useAdmin } from './AdminShell.jsx';

const StatusPill = ({ status }) => (
  <span className={cn('rounded-pill px-2.5 py-1 font-mono text-[11px] tracking-[.08em] uppercase', status === 'published' ? 'bg-cyan-100 text-brand-navy' : 'bg-red-100 text-brand-red')}>
    {status === 'published' ? 'Published' : 'Waiting'}
  </span>
);

// ---- list -------------------------------------------------------------------------------------

export function AdminProducts() {
  const { sessionEnded } = useAdmin();
  const [items, setItems] = useState(null);
  const [note, setNote] = useState({ kind: '', text: '' });
  const [confirming, setConfirming] = useState(null);

  const load = () => api.list().then(setItems).catch((e) => !sessionEnded(e) && setNote({ kind: 'error', text: e.message }));
  useEffect(() => { document.title = 'Products · Admin'; load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setStatus = async (p, status) => {
    setNote({ kind: '', text: '' });
    try {
      await api.setStatus(p._id, status);
      setNote({ kind: 'ok', text: status === 'published' ? `${p.model} is now live.` : `${p.model} is waiting: hidden from the site.` });
      load();
    } catch (e) { if (!sessionEnded(e)) setNote({ kind: 'error', text: e.message }); }
  };
  const remove = async (p) => {
    try {
      await api.remove(p._id);
      setConfirming(null);
      setNote({ kind: 'ok', text: `${p.model} was deleted.` });
      load();
    } catch (e) { if (!sessionEnded(e)) setNote({ kind: 'error', text: e.message }); }
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[1.8rem]">All products {items && <span className="font-mono text-base font-normal text-muted not-italic">({items.length})</span>}</h1>
        <Link to={`${ADMIN_BASE}/products/new`} className={btnPrimary}>+ Add product</Link>
      </div>
      {note.text && <p role="status" className={cn('mb-4 border-l-4 px-3 py-2 text-sm', note.kind === 'error' ? 'border-brand-red bg-red-100' : 'border-brand-cyan bg-cyan-100')}>{note.text}</p>}
      {!items ? <p className="text-muted">Loading…</p> : (
        <div className="overflow-x-auto border bg-surface">
          <table className="w-full border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b bg-surface-alt font-mono text-xs tracking-[.08em] text-muted uppercase">
                <th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id} className="border-b last:border-b-0">
                  <td className="px-4 py-2.5">
                    <Link to={`${ADMIN_BASE}/products/${p._id}`} className="flex items-center gap-3 font-semibold text-heading hover:text-link">
                      {p.image ? <img src={photoUrl(p, 160)} alt="" className="h-10 w-16 bg-surface-alt object-cover object-top" /> : <span className="grid h-10 w-16 place-items-center bg-surface-alt text-[10px] text-muted">no image</span>}
                      {p.model}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-muted">{p.familyTitle} › {p.groupTitle}</td>
                  <td className="px-4 py-2.5"><StatusPill status={p.status} /></td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link to={`${ADMIN_BASE}/products/${p._id}`} className={btnGhost}>Edit</Link>
                      {p.status === 'published'
                        ? <button type="button" onClick={() => setStatus(p, 'draft')} className={btnGhost}>Set to waiting</button>
                        : <button type="button" onClick={() => setStatus(p, 'published')} className={btnGhost}>Publish</button>}
                      {confirming === p._id ? (
                        <>
                          <button type="button" onClick={() => remove(p)} className={cn(btn, 'border-brand-red bg-brand-red text-white')}>Confirm delete</button>
                          <button type="button" onClick={() => setConfirming(null)} className={btnGhost}>Cancel</button>
                        </>
                      ) : <button type="button" onClick={() => setConfirming(p._id)} className={btnDanger}>Delete</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan="4" className="px-4 py-8 text-center text-muted">No products yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ---- form pieces ---------------------------------------------------------------------------------

let uid = 0;
const withKey = (o) => ({ ...o, _k: ++uid });
const blankSpec = () => withKey({ section: '', columns: ['Parameter', 'Value'], rows: [['', '']] });
const blank = () => ({ model: '', sub: '', description: '', image: '', curves: '', familyTitle: '', groupTitle: '', groupBlurb: '', advantages: [], features: [], specs: [blankSpec()], status: 'draft' });

const Label = ({ children, hint, error }) => (
  <span className="mb-1.5 block text-sm font-semibold text-ink">{children}{hint && <span className="ml-2 font-normal text-muted">{hint}</span>}{error && <span role="alert" className="mt-1 block font-normal text-brand-red">{error}</span>}</span>
);
const Card = ({ title, children }) => <section className="mb-6 border bg-surface p-6"><h2 className="mb-4 text-[1.2rem]">{title}</h2>{children}</section>;

function ImageField({ label, value, onChange, error, onError }) {
  const [busy, setBusy] = useState(false);
  const { sessionEnded } = useAdmin();
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try { onChange(await api.upload(file)); onError(''); } catch (err) { if (!sessionEnded(err)) onError(err.message); } finally { setBusy(false); }
  };
  return (
    <div>
      <Label error={error}>{label}</Label>
      <div className="flex flex-wrap items-center gap-4">
        {value ? <img src={optimize(value, 400)} alt="" className="h-28 w-44 border bg-surface-alt object-contain" /> : <div className="grid h-28 w-44 place-items-center border border-dashed text-sm text-muted">No image</div>}
        <div className="flex flex-col gap-2">
          <label className={cn(btnGhost, 'cursor-pointer')}>
            {busy ? 'Uploading…' : value ? 'Replace image' : 'Choose image'}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} disabled={busy} className="sr-only" aria-label={label} />
          </label>
          {value && <button type="button" onClick={() => onChange('')} className={btnDanger}>Remove</button>}
          <span className="text-xs text-muted">JPG, PNG or WebP, up to 5 MB</span>
        </div>
      </div>
    </div>
  );
}

function ListEditor({ label, items, onChange, render, blankItem, addLabel }) {
  return (
    <div>
      <Label>{label}</Label>
      {items.map((it, i) => (
        <div key={it._k ?? i} className="mb-3 flex items-start gap-2">
          <div className="min-w-0 flex-1">{render(it, (patch) => onChange(items.map((x, j) => (j === i ? (typeof x === 'string' ? patch : { ...x, ...patch }) : x))))}</div>
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`Remove ${label} ${i + 1}`} className={cn(btnDanger, 'px-3')}>✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, blankItem()])} className={btnGhost}>+ {addLabel}</button>
    </div>
  );
}

/** Spec tables: any number of sections, each with editable column headings, and rows you can add or remove. */
function SpecsEditor({ specs, onChange, error }) {
  const setSpec = (i, patch) => onChange(specs.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const cell = 'w-full min-w-[120px] rounded-control border border-line-control bg-surface px-2.5 py-2 text-sm text-ink focus:border-focus focus:outline-2 focus:outline-focus';
  return (
    <div>
      {error && <p role="alert" className="mb-3 text-sm text-brand-red">{error}</p>}
      {specs.map((s, i) => (
        <div key={s._k} className="mb-6 border p-4">
          <div className="mb-3 flex items-center gap-2">
            <input value={s.section} onChange={(e) => setSpec(i, { section: e.target.value })} placeholder="Section title, e.g. Basic Indicators" aria-label={`Section ${i + 1} title`} className={cn(inputClass, 'font-semibold')} />
            <button type="button" onClick={() => onChange(specs.filter((_, j) => j !== i))} className={btnDanger}>Remove section</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {s.columns.map((c, k) => (
                    <th key={k} className="p-1 align-top">
                      <div className="flex gap-1">
                        <input value={c} onChange={(e) => setSpec(i, { columns: s.columns.map((x, m) => (m === k ? e.target.value : x)) })} aria-label={`Section ${i + 1} column ${k + 1} heading`} className={cn(cell, 'bg-surface-alt font-mono text-xs uppercase')} />
                        {s.columns.length > 2 && <button type="button" onClick={() => setSpec(i, { columns: s.columns.filter((_, m) => m !== k), rows: s.rows.map((r) => r.filter((_, m) => m !== k)) })} aria-label={`Remove column ${k + 1}`} className="px-1.5 text-brand-red">✕</button>}
                      </div>
                    </th>
                  ))}
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {s.rows.map((r, j) => (
                  <tr key={j}>
                    {s.columns.map((_, k) => (
                      <td key={k} className="p-1">
                        <input value={r[k] ?? ''} onChange={(e) => setSpec(i, { rows: s.rows.map((x, m) => (m === j ? s.columns.map((__, n) => (n === k ? e.target.value : x[n] ?? '')) : x)) })} aria-label={`Section ${i + 1} row ${j + 1} column ${k + 1}`} className={cell} />
                      </td>
                    ))}
                    <td className="p-1"><button type="button" onClick={() => setSpec(i, { rows: s.rows.filter((_, m) => m !== j) })} aria-label={`Remove row ${j + 1}`} className="px-1.5 text-brand-red">✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setSpec(i, { rows: [...s.rows, s.columns.map(() => '')] })} className={btnGhost}>+ Add row</button>
            {s.columns.length < 8 && <button type="button" onClick={() => setSpec(i, { columns: [...s.columns, `Column ${s.columns.length + 1}`], rows: s.rows.map((r) => [...r, '']) })} className={btnGhost}>+ Add column</button>}
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...specs, blankSpec()])} className={btnGhost}>+ Add section</button>
    </div>
  );
}

// ---- the form (add + edit) -----------------------------------------------------------------------

const NEW = '__new';

export function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionEnded } = useAdmin();
  const [form, setForm] = useState(null);
  const [all, setAll] = useState([]);
  const [fam, setFam] = useState('');
  const [grp, setGrp] = useState('');
  const [saved, setSaved] = useState(null); // { slug, status } of the stored product
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState({ kind: '', text: '' });
  const [busy, setBusy] = useState(false);

  const categories = useMemo(() => buildCatalog(all).categories, [all]);

  useEffect(() => {
    document.title = id ? 'Edit product · Admin' : 'Add product · Admin';
    setErrors({}); setNote(location.state?.note ?? { kind: '', text: '' }); // a just-created product arrives here with its "saved" message
    (async () => {
      try {
        const list = await api.list();
        setAll(list);
        if (!id) { setForm(blank()); setFam(''); setGrp(''); setSaved(null); return; }
        const p = await api.get(id);
        setForm({ ...blank(), ...p, specs: p.specs.map(withKey), advantages: p.advantages.map(withKey), features: p.features.map((f) => f) });
        setFam(p.familySlug); setGrp(p.groupSlug); setSaved({ slug: p.slug, status: p.status });
      } catch (e) { if (!sessionEnded(e)) setNote({ kind: 'error', text: e.message }); }
    })();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!form) return <p className="text-muted">{note.text || 'Loading…'}</p>;
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const family = categories.find((c) => c.slug === fam);
  const setField = (name) => (e) => set({ [name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    if (busy) return;
    const familyTitle = fam === NEW ? form.familyTitle : family?.title || '';
    const group = family?.groups.find((g) => g.slug === grp);
    const groupTitle = grp === NEW ? form.groupTitle : group?.title || '';
    const payload = {
      ...form, familyTitle, groupTitle, groupBlurb: grp === NEW ? form.groupBlurb : group?.blurb || form.groupBlurb,
      specs: form.specs.map(({ _k, ...s }) => s), advantages: form.advantages.map(({ _k, ...a }) => a),
    };
    setBusy(true); setErrors({}); setNote({ kind: '', text: '' });
    try {
      const item = id ? await api.update(id, payload) : await api.create(payload);
      setSaved({ slug: item.slug, status: item.status });
      const done = { kind: 'ok', text: item.status === 'published' ? 'Saved and published. It is live on the site now.' : 'Saved as waiting. It is stored but hidden from the site.' };
      setNote(done);
      if (!id) navigate(`${ADMIN_BASE}/products/${item._id}`, { replace: true, state: { note: done } });
    } catch (err) {
      if (sessionEnded(err)) return;
      setErrors(err.fields || {});
      setNote({ kind: 'error', text: err.message });
    } finally { setBusy(false); }
  };

  return (
    <form onSubmit={save} noValidate>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[1.8rem]">{id ? `Edit ${form.model || 'product'}` : 'Add product'}</h1>
        <div className="flex flex-wrap items-center gap-3">
          {saved?.status === 'published' && <Link to={`/products/${saved.slug}`} target="_blank" className={btnGhost}>View on site ↗</Link>}
          <Link to={`${ADMIN_BASE}/products`} className={btnGhost}>All products</Link>
        </div>
      </div>
      {note.text && <p role="status" className={cn('mb-5 border-l-4 px-3 py-2 text-sm', note.kind === 'error' ? 'border-brand-red bg-red-100' : 'border-brand-cyan bg-cyan-100')}>{note.text}</p>}

      <Card title="Basics">
        <div className="grid gap-5">
          <label className="block"><Label error={errors.model}>Name</Label><input value={form.model} onChange={setField('model')} className={inputClass} placeholder="e.g. MXR150060B-850" /></label>
          <label className="block"><Label hint="one line, shown on cards">Short description</Label><input value={form.sub} onChange={setField('sub')} className={inputClass} placeholder="e.g. 60KW@1500V EV DC Charging Power Module" /></label>
          <label className="block"><Label error={errors.description}>Description</Label><textarea rows={5} value={form.description} onChange={setField('description')} className={inputClass} /></label>
          <ImageField label="Product image" value={form.image} onChange={(image) => set({ image })} error={errors.image} onError={(m) => setErrors((x) => ({ ...x, image: m }))} />
        </div>
      </Card>

      <Card title="Category">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <Label error={errors.familyTitle}>Family</Label>
            <select value={fam} onChange={(e) => { setFam(e.target.value); setGrp(''); }} className={inputClass}>
              <option value="">Choose a family…</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
              <option value={NEW}>+ New family…</option>
            </select>
            {fam === NEW && <input value={form.familyTitle} onChange={setField('familyTitle')} placeholder="New family name" aria-label="New family name" className={cn(inputClass, 'mt-2')} />}
          </label>
          <label className="block">
            <Label error={errors.groupTitle}>Category</Label>
            <select value={grp} onChange={(e) => setGrp(e.target.value)} className={inputClass} disabled={!fam}>
              <option value="">Choose a category…</option>
              {(family?.groups || []).map((g) => <option key={g.slug} value={g.slug}>{g.title}</option>)}
              <option value={NEW}>+ New category…</option>
            </select>
            {grp === NEW && (
              <>
                <input value={form.groupTitle} onChange={setField('groupTitle')} placeholder="New category name" aria-label="New category name" className={cn(inputClass, 'mt-2')} />
                <input value={form.groupBlurb} onChange={setField('groupBlurb')} placeholder="One line about this category (optional)" aria-label="New category description" className={cn(inputClass, 'mt-2')} />
              </>
            )}
          </label>
        </div>
      </Card>

      <Card title="Specifications">
        <SpecsEditor specs={form.specs} onChange={(specs) => set({ specs })} error={errors.specs} />
      </Card>

      <Card title="Advantages and features (optional)">
        <div className="grid gap-6">
          <ListEditor
            label="Advantages" addLabel="Add advantage" items={form.advantages} onChange={(advantages) => set({ advantages })} blankItem={() => withKey({ title: '', text: '' })}
            render={(a, edit) => (<><input value={a.title} onChange={(e) => edit({ title: e.target.value })} placeholder="Title" aria-label="Advantage title" className={inputClass} /><textarea rows={2} value={a.text} onChange={(e) => edit({ text: e.target.value })} placeholder="Details" aria-label="Advantage details" className={cn(inputClass, 'mt-2')} /></>)}
          />
          <ListEditor
            label="Features" addLabel="Add feature" items={form.features} onChange={(features) => set({ features })} blankItem={() => ''}
            render={(f, edit) => <input value={f} onChange={(e) => edit(e.target.value)} placeholder="Feature" aria-label="Feature" className={inputClass} />}
          />
          <ImageField label="Characteristic curves image" value={form.curves} onChange={(curves) => set({ curves })} error={errors.curves} onError={(m) => setErrors((x) => ({ ...x, curves: m }))} />
        </div>
      </Card>

      <Card title="Visibility">
        <fieldset className="grid gap-3">
          <legend className="sr-only">Visibility</legend>
          <label className="flex items-start gap-3"><input type="radio" name="status" checked={form.status === 'draft'} onChange={() => set({ status: 'draft' })} className="mt-1.5" /><span><b>Waiting</b><br /><span className="text-sm text-muted">Saved to the database but hidden from the site. Save unfinished work here.</span></span></label>
          <label className="flex items-start gap-3"><input type="radio" name="status" checked={form.status === 'published'} onChange={() => set({ status: 'published' })} className="mt-1.5" /><span><b>Published</b><br /><span className="text-sm text-muted">Live on the site. Needs an image, a description and at least one specification row.</span></span></label>
        </fieldset>
      </Card>

      <div className="sticky bottom-0 -mx-2 flex items-center gap-3 border-t bg-surface-alt px-2 py-4">
        <button type="submit" disabled={busy} className={btnPrimary}>{busy ? 'Saving…' : form.status === 'published' ? 'Save and publish' : 'Save as waiting'}</button>
        <Link to={`${ADMIN_BASE}/products`} className={btnGhost}>Cancel</Link>
      </div>
    </form>
  );
}
