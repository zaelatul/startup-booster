// src/lib/server-url.ts  (교체본)
// URL 빌드 + 안전 JSON fetch + getBaseUrl 제공

export type JsonMap = Record<string, unknown>;

export type SafeJsonResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string; detail?: unknown };

export function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin;
  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  const local = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5174';
  return vercel || local;
}

export function buildUrl(pathOrUrl: string, params?: Record<string, string | number | boolean | undefined | null>) {
  const base = getBaseUrl();
  const u = new URL(pathOrUrl, base);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === '') continue;
      u.searchParams.set(k, String(v));
    }
  }
  return u.toString();
}

async function safeFetch(input: RequestInfo | URL, init?: RequestInit & { timeoutMs?: number }) {
  const { timeoutMs = 15_000, ...rest } = init || {};
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(input, { ...rest, signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

export async function getJsonSafe<T = JsonMap>(url: string, init?: RequestInit & { timeoutMs?: number }): Promise<SafeJsonResult<T>> {
  try {
    const res = await safeFetch(url, { method: 'GET', ...init });
    const status = res.status;
    let payload: unknown = null;
    try {
      const text = await res.text();
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = null;
    }
    if (!res.ok) return { ok: false, status, error: `HTTP ${status}`, detail: payload };
    return { ok: true, status, data: payload as T };
  } catch (e: any) {
    const msg = e?.name === 'AbortError' ? 'Request timeout' : (e?.message || 'Network error');
    return { ok: false, status: 0, error: msg, detail: e };
  }
}

export async function postJsonSafe<T = JsonMap>(url: string, body?: unknown, init?: RequestInit & { timeoutMs?: number }): Promise<SafeJsonResult<T>> {
  const headers = new Headers(init?.headers || {});
  if (!headers.has('content-type')) headers.set('content-type', 'application/json');
  return getJsonSafe<T>(url, { ...init, method: 'POST', body: body ? JSON.stringify(body) : undefined, headers });
}
