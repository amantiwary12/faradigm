// In dev, Vite proxies /api and /uploads to the Express server. Set VITE_API_URL only if the API lives elsewhere.
const BASE = import.meta.env.VITE_API_URL || '';

export class ApiError extends Error {
  constructor(message, { status, fields } = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { credentials: 'same-origin', ...options });
  } catch {
    throw new ApiError('Could not reach the server.'); // offline, or the API is down
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || 'Something went wrong.', { status: res.status, fields: data.fields });
  return data;
}

const json = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'faradigm-admin' },
  body: body === undefined ? undefined : JSON.stringify(body),
});

export const submitEnquiry = (payload) => request('/api/contact', json('POST', payload));

// ---- public catalogue ----------------------------------------------------------------------
export const fetchProducts = () => request('/api/products', { cache: 'no-store' }).then((d) => d.items);

// ---- admin (needs the session cookie; state-changing calls send X-Requested-With) -----------------
export const admin = {
  login: (creds) => request('/api/admin/login', json('POST', creds)).then((d) => d.admin),
  logout: () => request('/api/admin/logout', json('POST')),
  me: () => request('/api/admin/me').then((d) => d.admin),
  list: () => request('/api/admin/products').then((d) => d.items),
  get: (id) => request(`/api/admin/products/${id}`).then((d) => d.item),
  create: (p) => request('/api/admin/products', json('POST', p)).then((d) => d.item),
  update: (id, p) => request(`/api/admin/products/${id}`, json('PUT', p)).then((d) => d.item),
  setStatus: (id, status) => request(`/api/admin/products/${id}/status`, json('PATCH', { status })).then((d) => d.item),
  remove: (id) => request(`/api/admin/products/${id}`, json('DELETE')),
  upload: (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('/api/admin/upload', { method: 'POST', headers: { 'X-Requested-With': 'faradigm-admin' }, body: form }).then((d) => d.url);
  },
};
