/**
 * Talks to the Laravel backend (backend/ folder) when the site is built with VITE_BACKEND=1.
 * The GitHub Pages demo is built without it and keeps everything in the browser.
 */
export const BACKEND = import.meta.env.VITE_BACKEND === '1'

const TOKEN = 'ks-dash-token'
export const getToken = () => { try { return sessionStorage.getItem(TOKEN) } catch { return null } }
export const setToken = (t: string | null) => { try { if (t) sessionStorage.setItem(TOKEN, t); else sessionStorage.removeItem(TOKEN) } catch { /* private mode */ } }

export class ApiError extends Error {
  status: number
  body: unknown
  constructor(message: string, status: number, body: unknown) { super(message); this.status = status; this.body = body }
}

const listeners = new Set<() => void>()
/** Called when the server says the sign-in expired, so the dashboard can show the login screen. */
export const onSignedOut = (f: () => void) => { listeners.add(f); return () => { listeners.delete(f) } }

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, ...rest } = init
  const token = getToken()
  const r = await fetch(`/api${path}`, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(rest.headers || {}),
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })
  const body = await r.json().catch(() => null)
  if (r.status === 401 && token) { setToken(null); listeners.forEach(f => f()) }
  if (!r.ok) throw new ApiError((body as { message?: string } | null)?.message ?? `Server error ${r.status}`, r.status, body)
  return body as T
}

export async function login(email: string, password: string) {
  const r = await api<{ token: string }>('/login', { method: 'POST', json: { email, password } })
  setToken(r.token)
}

export async function logout() {
  try { await api('/admin/logout', { method: 'POST' }) } catch { /* already gone */ }
  setToken(null)
}
