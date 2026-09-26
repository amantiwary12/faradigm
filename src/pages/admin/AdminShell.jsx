import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { admin as api, ApiError } from '../../lib/api.js';
import { ADMIN_BASE } from '../../lib/admin.js';
import { cn } from '../../lib/env.js';
import { Wrap } from '../../components/ui/Layout.jsx';

const AdminContext = createContext(null);
export const useAdmin = () => useContext(AdminContext);

export const inputClass =
  'w-full rounded-control border border-line-control bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted focus:border-focus focus:outline-2 focus:outline-offset-0 focus:outline-focus';
export const btn = 'inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-control border-2 px-4 font-sans text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60';
export const btnPrimary = `${btn} border-action bg-action text-surface hover:border-action-hover hover:bg-action-hover`;
export const btnGhost = `${btn} border-line-control bg-transparent text-heading hover:bg-surface-highlight`;
export const btnDanger = `${btn} border-brand-red bg-transparent text-brand-red hover:bg-red-100`;

/** Root of every admin route: keeps search engines out and checks once whether there is a session. */
export function AdminRoot() {
  const [state, setState] = useState({ status: 'checking', admin: null });

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    api.me().then((a) => setState({ status: 'in', admin: a })).catch(() => setState({ status: 'out', admin: null }));
  }, []);

  // Any 401 from a call means the session ended: send the user back to the login
  const sessionEnded = useCallback((err) => {
    if (err instanceof ApiError && err.status === 401) { setState({ status: 'out', admin: null }); return true; }
    return false;
  }, []);

  return <AdminContext.Provider value={{ ...state, setState, sessionEnded }}><Outlet /></AdminContext.Provider>;
}

/** Everything except the login page needs a session. */
export function AdminGuard() {
  const { status, admin, setState } = useAdmin();
  const navigate = useNavigate();
  if (status === 'checking') return null;
  if (status === 'out') return <Navigate to={`${ADMIN_BASE}/login`} replace />;

  const signOut = async () => {
    await api.logout().catch(() => {});
    setState({ status: 'out', admin: null });
    navigate(`${ADMIN_BASE}/login`, { replace: true });
  };
  const tab = ({ isActive }) => cn('rounded-control px-3 py-2 text-sm font-medium text-muted hover:text-ink', isActive && 'bg-surface-highlight text-heading');

  return (
    <div className="min-h-screen bg-surface-alt">
      <header className="border-b bg-surface">
        <Wrap className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-6">
            <span className="font-display text-lg font-extrabold text-heading italic">Faradigm® <span className="font-mono text-xs font-medium tracking-[.14em] text-brand-cyan not-italic uppercase">Admin</span></span>
            <nav aria-label="Admin" className="flex gap-1">
              <NavLink to={`${ADMIN_BASE}/products/new`} className={tab}>Add product</NavLink>
              <NavLink to={`${ADMIN_BASE}/products`} end className={tab}>All products</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span>{admin?.username}</span>
            <button type="button" onClick={signOut} className={btnGhost}>Sign out</button>
          </div>
        </Wrap>
      </header>
      <Wrap className="py-8"><Outlet /></Wrap>
    </div>
  );
}

/** The hidden login: username, email and password. On success it goes to the add-product page. */
export function AdminLogin() {
  const { status, setState } = useAdmin();
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: '', email: '', password: '', totp: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => { document.title = 'Sign in'; }, []);
  if (status === 'checking') return null;
  if (status === 'in') return <Navigate to={`${ADMIN_BASE}/products/new`} replace />;

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const a = await api.login(values);
      setState({ status: 'in', admin: a });
      navigate(`${ADMIN_BASE}/products/new`, { replace: true });
    } catch (err) {
      setError(err.message);
      setValues((v) => ({ ...v, password: '', totp: '' }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-surface-alt px-4">
      <form onSubmit={onSubmit} className="reg w-full max-w-[420px] border bg-surface p-8">
        <h1 className="mb-1 text-[1.6rem]">Admin sign in</h1>
        <p className="mb-6 text-sm text-muted">Enter your username, email and password.</p>
        {['username', 'email'].map((name) => (
          <label key={name} className="mb-4 block text-sm font-semibold text-ink">
            <span className="mb-1.5 block capitalize">{name}</span>
            <input name={name} type={name === 'email' ? 'email' : 'text'} autoComplete={name} required value={values[name]} onChange={onChange} className={inputClass} />
          </label>
        ))}
        <label className="mb-2 block text-sm font-semibold text-ink">
          <span className="mb-1.5 block">Password</span>
          <input name="password" type={show ? 'text' : 'password'} autoComplete="current-password" required value={values.password} onChange={onChange} className={inputClass} />
        </label>
        <label className="mb-4 block text-sm font-semibold text-ink">
          <span className="mb-1.5 block">Authenticator code <span className="font-normal text-muted">(only if 2FA is enabled)</span></span>
          <input name="totp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="d{6}" value={values.totp} onChange={onChange} className={inputClass} />
        </label>
        <label className="mb-5 flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show password
        </label>
        {error && <p role="alert" className="mb-4 border-l-4 border-brand-red bg-red-100 px-3 py-2 text-sm text-ink">{error}</p>}
        <button type="submit" disabled={busy} className={cn(btnPrimary, 'w-full')}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <span className="mk tl" aria-hidden="true" /><span className="mk tr" aria-hidden="true" /><span className="mk bl" aria-hidden="true" /><span className="mk br" aria-hidden="true" />
      </form>
    </main>
  );
}
