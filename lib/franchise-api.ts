// 파일: src/lib/franchise-api.ts  (교체)
// 목적: 실데이터 연동 + 스냅샷 폴백 + 슬러그 별칭(olive-young 등) 자동 해석
// 주의: 클라이언트 콘솔에 Promise 에러가 새지 않도록 throw 대신 null/폴백 반환

export type Category = 'Retail' | 'F&B' | 'Service';

export type SortKey =
  | 'relevance'
  | 'sales_desc'
  | 'margin_desc'
  | 'openRate_desc'
  | 'closeRate_asc'
  | 'stores_desc';

export interface Brand {
  id: string;
  name: string;
  category: Category;
  sales: number | null;
  margin: number | null;
  openRate: number | null;
  closeRate: number | null;
  stores?: number | null;
  desc?: string;
  risks?: string[];
}

// --------- 환경/플래그 ---------
const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE as string) ||
  (process.env.VITE_API_BASE as string) ||
  '/api';

const FORCE_FAIL =
  (process.env.NEXT_PUBLIC__FAIL_API__ === '1') ||
  (typeof window !== 'undefined' && (window as any).__FAIL_API__);

// --------- 별칭/정규화 ---------
const ALIASES: Record<string, string> = {
  // URL/슬러그 → 표준 id
  'olive-young': 'ololive',
  'oliveyoung': 'ololive',
};

const normKey = (s: string) => s.toLowerCase().replace(/[\s_\-]/g, '');
const resolveAlias = (id: string) => {
  const k = normKey(id || '');
  return ALIASES[k] || id;
};

// --------- 캐시 ---------
type CacheEntry<T> = { at: number; ttl: number; value: T };
const cache = new Map<string, CacheEntry<any>>();
function setCache<T>(key: string, value: T, ttlMs = 60_000) {
  cache.set(key, { at: Date.now(), ttl: ttlMs, value });
}
function getCache<T>(key: string): T | null {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() - e.at > e.ttl) return null;
  return e.value as T;
}

// --------- 유틸 ---------
function toNum(v: unknown): number | null {
  if (v == null) return null;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const t = v.trim();
    if (!t) return null;
    const pct = t.endsWith('%');
    const n = Number(t.replace(/[,%\s]/g, ''));
    if (!Number.isFinite(n)) return null;
    return pct ? n : n;
  }
  return null;
}
function clamp01to100(n: number | null): number | null {
  if (n == null || !Number.isFinite(n)) return null;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return n;
}
function normCategory(v: unknown): Category {
  const s = String(v || '').toLowerCase();
  if (s.includes('f&b') || s.includes('fnb') || s.includes('식음') || s.includes('외식')) return 'F&B';
  if (s.includes('retail') || s.includes('소매') || s.includes('리테일')) return 'Retail';
  return 'Service';
}

type AnyObj = Record<string, any>;
function looksNormalized(o: AnyObj) {
  return o && typeof o === 'object' && 'id' in o && 'name' in o && 'category' in o;
}
function cryptoish(o: AnyObj) {
  const s = (o.name || o.brandNm || 'unknown') + ':' + (o.category || o.industryLarge || '');
  let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return 'x' + h.toString(16);
}
function makeRiskBadges(p: { margin: number | null; closeRate: number | null }): string[] {
  const r: string[] = [];
  if (p.margin != null && p.margin < 10) r.push('마진 낮음');
  if (p.closeRate != null && p.closeRate >= 8) r.push('폐업률 높음');
  return r;
}
function normalizeFromKftc(o: AnyObj): Brand {
  const id = String(o.id ?? o.brandId ?? o.brndId ?? o.FRCS_ID ?? o.franchiseId ?? o.code ?? cryptoish(o));
  const name = o.name ?? o.brandNm ?? o.brndNm ?? o.CMPNM_NM ?? o.franchiseName ?? '이름미상';
  const category = normCategory(o.category ?? o.categoryLarge ?? o.industryLarge ?? o.indutyLclasNm ?? o.sector ?? o.majorCategory);
  const sales = toNum(o.sales ?? o.avgSales ?? o.AVRGE_SALES_AMT) ?? null;
  const margin = clamp01to100(toNum(o.margin ?? o.marginRate ?? o.AVRGE_PRFT_RATE)) ?? null;
  const openRate = clamp01to100(toNum(o.openRate ?? o.OPEN_RATE ?? o.avgOpenRate)) ?? null;
  const closeRate = clamp01to100(toNum(o.closeRate ?? o.CLOSE_RATE ?? o.avgCloseRate)) ?? null;
  const stores = toNum(o.stores ?? o.storeCnt ?? o.BZOPCNT) ?? null;
  const desc: string | undefined = o.desc ?? o.summary ?? undefined;
  const risks: string[] | undefined = Array.isArray(o.risks) ? o.risks : makeRiskBadges({ margin, closeRate });
  return { id, name, category, sales, margin, openRate, closeRate, stores, desc, risks };
}

async function safeFetchJSON<T>(url: string, init?: RequestInit, timeoutMs = 10_000): Promise<T> {
  const cached = getCache<T>(url);
  if (cached) return cached;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: 'no-store', ...init, signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as T;
    setCache(url, data);
    return data;
  } finally {
    clearTimeout(id);
  }
}

export interface ListParams {
  q?: string;
  categories?: Category[];
  sort?: SortKey;
  limit?: number;
  offset?: number;
}

function bySortKey(k: SortKey) {
  const desc = (a?: number | null, b?: number | null) => (b ?? -Infinity) - (a ?? -Infinity);
  const asc  = (a?: number | null, b?: number | null) => (a ?? Infinity) - (b ?? Infinity);
  switch (k) {
    case 'sales_desc':   return (a: Brand, b: Brand) => desc(a.sales, b.sales);
    case 'margin_desc':  return (a: Brand, b: Brand) => desc(a.margin, b.margin);
    case 'openRate_desc':return (a: Brand, b: Brand) => desc(a.openRate, b.openRate);
    case 'closeRate_asc':return (a: Brand, b: Brand) => asc(a.closeRate, b.closeRate);
    case 'stores_desc':  return (a: Brand, b: Brand) => desc(a.stores ?? null, b.stores ?? null);
    default:             return (a: Brand, b: Brand) => 0;
  }
}

function applyClientQuery(rows: Brand[], p: ListParams): Brand[] {
  let out = rows;

  // 검색 우선순위(간단 가중치)
  if (p.q) {
    const q = p.q.trim().toLowerCase();
    const score = (v: Brand) => {
      let s = 0;
      if (v.name.toLowerCase().includes(q)) s += 5;
      if (v.category && p.categories?.includes(v.category)) s += 1;
      if (v.sales) s += Math.min(v.sales / 1000, 3);
      if (v.margin) s += Math.min(v.margin / 10, 3);
      return s;
    };
    out = out.map(v => ({ v, s: score(v) })).sort((a,b)=>b.s-a.s).map(x=>x.v);
  }

  if (p.categories?.length) {
    const set = new Set(p.categories);
    out = out.filter(v => set.has(v.category));
  }

  if (!p.q) {
    const sortKey: SortKey = p.sort || 'relevance';
    if (sortKey !== 'relevance') out = out.sort(bySortKey(sortKey));
  }

  const off = Math.max(0, p.offset || 0);
  const lim = Math.max(1, Math.min(200, p.limit || 20));
  return out.slice(off, off + lim);
}

function normalizeArray(arr: AnyObj[]): Brand[] {
  return arr.map(o => looksNormalized(o) ? (o as Brand) : normalizeFromKftc(o));
}
function normalizeOne(o: AnyObj): Brand {
  return looksNormalized(o) ? (o as Brand) : normalizeFromKftc(o);
}

export async function listBrands(params: ListParams = {}): Promise<Brand[]> {
  if (!FORCE_FAIL) {
    try {
      const qs = new URLSearchParams();
      if (params.q) qs.set('q', params.q);
      (params.categories || []).forEach(c => qs.append('category', c));
      if (params.sort)   qs.set('sort', params.sort);
      if (params.limit != null)  qs.set('limit',  String(params.limit));
      if (params.offset != null) qs.set('offset', String(params.offset));

      const url = `${API_BASE.replace(/\/$/, '')}/franchise/brands${qs.toString() ? `?${qs}` : ''}`;
      const data = await safeFetchJSON<any>(url);
      const rows = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      const norm = normalizeArray(rows);
      return applyClientQuery(norm, params);
    } catch {
      // 통신 실패 → 폴백
    }
  }
  return applyClientQuery(SNAPSHOT_BRANDS, params);
}

export async function getBrandById(id: string): Promise<Brand | null> {
  if (!id) return null;

  // 0) 별칭 해석
  const resolved = resolveAlias(id);

  // 1) 실서버 시도 (id + 별칭 모두 탐색)
  if (!FORCE_FAIL) {
    try {
      // 우선 resolved id
      const tryIds = Array.from(new Set([resolved, id]));
      for (const tryId of tryIds) {
        const url = `${API_BASE.replace(/\/$/, '')}/franchise/brand/${encodeURIComponent(tryId)}`;
        try {
          const data = await safeFetchJSON<any>(url);
          if (data) return normalizeOne(data);
        } catch {
          // 다음 후보 시도
        }
      }
    } catch {
      // 서버 전파 금지
    }
  }

  // 2) 폴백: 스냅샷에서 id/별칭 둘 다 검색(정규화)
  const nk = normKey(resolved);
  const hit = SNAPSHOT_BRANDS.find(x => normKey(x.id) === nk) ||
              SNAPSHOT_BRANDS.find(x => normKey(x.id) === normKey(id));
  return hit || null;
}

// --------- 스냅샷 ---------
const SNAPSHOT_BRANDS: Brand[] = [
  {
    id: 'ololive', // 표준 id
    name: '올리브영',
    category: 'Retail',
    sales: 5800,
    margin: 22,
    openRate: 6,
    closeRate: 3,
    stores: 1400,
    desc: 'H&B 리테일',
    risks: ['임대료 영향 큼'],
  },
  {
    id: 'cupn',
    name: '쿠프앤',
    category: 'F&B',
    sales: 3900,
    margin: 18,
    openRate: 7,
    closeRate: 5,
    stores: 210,
    desc: '테이크아웃 커피',
  },
  {
    id: 'bbq',
    name: 'BBQ 치킨',
    category: 'F&B',
    sales: 4200,
    margin: 16,
    openRate: 5,
    closeRate: 7,
    stores: 1700,
    desc: '치킨 프랜차이즈',
  },
  {
    id: 'gs25',
    name: 'GS25',
    category: 'Retail',
    sales: 6100,
    margin: 14,
    openRate: 4,
    closeRate: 6,
    stores: 15000,
    desc: '편의점',
  },
  {
    id: 'daolwash',
    name: '다올워시',
    category: 'Service',
    sales: 1600,
    margin: 28,
    openRate: 9,
    closeRate: 4,
    stores: 120,
    desc: '셀프빨래방',
  },
  {
    id: 'mathkids',
    name: '매쓰키즈',
    category: 'Service',
    sales: 900,
    margin: 35,
    openRate: 8,
    closeRate: 2,
    stores: 85,
    desc: '어린이 학습',
  },
  {
    id: 'dduck',
    name: '신전떡볶이',
    category: 'F&B',
    sales: 2400,
    margin: 20,
    openRate: 8,
    closeRate: 6,
    stores: 700,
    desc: '분식',
  },
  {
    id: 'paris',
    name: '파리바게뜨',
    category: 'F&B',
    sales: 5200,
    margin: 12,
    openRate: 4,
    closeRate: 5,
    stores: 3500,
    desc: '베이커리',
  },
  {
    id: 'hairlab',
    name: '헤어랩',
    category: 'Service',
    sales: 1800,
    margin: 30,
    openRate: 10,
    closeRate: 5,
    stores: 60,
    desc: '헤어살롱',
  },
  {
    id: 'zerozero',
    name: '제로마트',
    category: 'Retail',
    sales: 2100,
    margin: 11,
    openRate: 6,
    closeRate: 9,
    stores: 40,
    desc: '무포장 친환경 마트',
    risks: ['마진 낮음', '폐업률 높음'],
  },
];
