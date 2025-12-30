// 신규 — src/lib/m365.ts
// 소상공인365 상권/업종 핵심 지표 모듈
// - 타입/정규화/샘플 포함
// - 워커 프록시(/api/market365/metrics) 호출
// - 실패 시 안전 Fallback (플래그 __FAIL_MARKET_API__, __NO_FALLBACK__ 지원)

export type MarketParams = {
  dong?: string;      // 행정동 코드 또는 이름(워커에서 해석)
  biz: string;        // 업종 코드/키워드 (예: 'F&B', '카페', '치킨', 'Retail' 등)
};

// UI 카드 구성에 맞춘 핵심 지표
export type MarketMetrics = {
  totalStores: number;      // 전체 매장수
  momChangePct: number;     // 전월 대비 증감(%)
  recent3m: { open: number; close: number }; // 최근 3개월 개업/폐업 수
  // 선택 지표(향후 확장)
  salesTrend?: number[];    // 매출 추이(간단 스파크라인용)
  updatedAt?: string;       // ISO
  source?: 'M365' | 'local';
};

export const METRICS_DEFAULT: MarketMetrics = {
  totalStores: 0,
  momChangePct: 0,
  recent3m: { open: 0, close: 0 },
  salesTrend: [],
  source: 'local',
  updatedAt: undefined,
};

// 샘플(업종 키워드 or 브랜드 id 별 간단 프리셋)
// 실제 연동 후 제거 가능
const SAMPLE: Record<string, MarketMetrics> = {
  'F&B': {
    totalStores: 17000,
    momChangePct: 0.8,
    recent3m: { open: 1200, close: 1050 },
    salesTrend: [92, 95, 99, 101, 103, 104, 106, 108],
    source: 'local',
    updatedAt: new Date().toISOString(),
  },
  '카페': {
    totalStores: 3500,
    momChangePct: 1.6,
    recent3m: { open: 320, close: 240 },
    salesTrend: [88, 90, 93, 95, 97, 101, 103, 105],
    source: 'local',
    updatedAt: new Date().toISOString(),
  },
  '치킨': {
    totalStores: 2800,
    momChangePct: -0.4,
    recent3m: { open: 190, close: 210 },
    salesTrend: [101, 100, 99, 98, 98, 97, 97, 98],
    source: 'local',
    updatedAt: new Date().toISOString(),
  },
  // 브랜드 id 예시
  'ddakddak-chicken': {
    totalStores: 430,
    momChangePct: 0.3,
    recent3m: { open: 28, close: 24 },
    salesTrend: [97, 98, 99, 100, 101, 101, 102, 103],
    source: 'local',
    updatedAt: new Date().toISOString(),
  },
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') || ''; // 상대경로 사용 시 '' 그대로

// ───────────── 정규화/보조 ─────────────
const toNum = (v: unknown, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

function normalize(raw?: Partial<MarketMetrics>): MarketMetrics {
  const r = raw ?? {};
  return {
    ...METRICS_DEFAULT,
    ...r,
    totalStores: toNum(r.totalStores),
    momChangePct: toNum(r.momChangePct),
    recent3m: {
      open: toNum(r.recent3m?.open),
      close: toNum(r.recent3m?.close),
    },
    salesTrend: Array.isArray(r.salesTrend)
      ? r.salesTrend.map((x) => toNum(x)).filter((x) => Number.isFinite(x))
      : [],
  };
}

export const pct = (v?: number) =>
  typeof v === 'number' && Number.isFinite(v) ? `${v}%` : '0%';
export const int = (v?: number) =>
  typeof v === 'number' && Number.isFinite(v) ? v.toLocaleString('ko-KR') : '0';

// ───────────── API 호출 ─────────────
function buildMetricsUrl({ dong, biz }: MarketParams) {
  const u = new URL(`${API_BASE}/api/market365/metrics`, typeof window === 'undefined' ? 'http://localhost' : window.location.origin);
  if (dong) u.searchParams.set('dong', dong);
  if (biz) u.searchParams.set('biz', biz);
  return u.toString().replace(/^https?:\/\/localhost/, ''); // 상대경로 유지
}

async function fetchFromApi(p: MarketParams): Promise<MarketMetrics | null> {
  if (globalThis && (globalThis as any).__FAIL_MARKET_API__) {
    throw new Error('Forced API fail by __FAIL_MARKET_API__');
  }
  const url = buildMetricsUrl(p);
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  // 워커 응답 예시 가정:
  // { totalStores, momChangePct, recent3m: { open, close }, salesTrend, updatedAt }
  const raw = (await res.json()) as Partial<MarketMetrics>;
  return normalize({ ...raw, source: 'M365', updatedAt: raw.updatedAt || new Date().toISOString() });
}

// 공개 함수: 상권/업종 핵심 지표 조회(실패 시 샘플/기본값)
export async function getMarketMetrics(p: MarketParams): Promise<MarketMetrics> {
  try {
    const fromApi = await fetchFromApi(p);
    if (fromApi) return fromApi;
  } catch (e) {
    if (globalThis && (globalThis as any).__NO_FALLBACK__) {
      throw e;
    }
    console.warn('[m365] API 실패, 샘플/기본값 사용:', (e as Error)?.message);
  }
  // 우선순위: 업종 키워드 → 브랜드 id → 기본값
  if (p.biz && SAMPLE[p.biz]) return normalize(SAMPLE[p.biz]);
  return normalize(SAMPLE['F&B'] || METRICS_DEFAULT);
}

// 선택: 브랜드 id를 업종 키로 매핑할 때 사용(간단 헬퍼)
export function inferBizFromBrandId(brandId: string): string {
  if (/chicken|bbq|bhc|kyochon/i.test(brandId)) return '치킨';
  if (/cafe|coffee|starbucks|paik/i.test(brandId)) return '카페';
  return 'F&B';
}
