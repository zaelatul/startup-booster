// 신규: src/lib/api.ts
// 역할: 소상공인365(시장지표) / 공정위(가맹) 프록시 호출 유틸 + 안전 폴백
// 사용처 예: app/dev/m365/page.tsx, 브랜드 상세 데이터 치환 등

// ────────────────── 공통 ──────────────────
export const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "/api").replace(/\/$/, "") || "/api";

// 간단 캐시(메모리) — 리로드하면 초기화됨
const cache = new Map<string, { at: number; ttl: number; data: any }>();
const DEFAULT_TTL = 1000 * 30; // 30s

type FetchOpts = { ttlMs?: number; timeoutMs?: number };

// fetch + 타임아웃 + 캐시
async function fetchJson<T = unknown>(url: string, opts: FetchOpts = {}): Promise<T> {
  const ttl = opts.ttlMs ?? DEFAULT_TTL;
  const hit = cache.get(url);
  const now = Date.now();
  if (hit && now - hit.at < hit.ttl) return hit.data as T;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), opts.timeoutMs ?? 8000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as T;
    cache.set(url, { at: now, ttl, data });
    return data;
  } finally {
    clearTimeout(t);
  }
}

// 런타임 플래그 읽기(브라우저 전용 토글 UI와 호환)
// __FAIL_MARKET_API__ : true면 강제 실패 시뮬레이션
// __NO_FALLBACK__     : true면 폴백 금지(실패 그대로)
function readFlag(name: "__FAIL_MARKET_API__" | "__NO_FALLBACK__"): boolean {
  try {
    if (typeof window !== "undefined" && (window as any)[name] === true) return true;
  } catch {}
  return false;
}

// (선택) 테스트용: 코드에서 플래그를 세팅하고 싶을 때 사용
export function setApiFailFlags(p: { FAIL_MARKET?: boolean; NO_FALLBACK?: boolean }) {
  if (typeof window !== "undefined") {
    if (p.FAIL_MARKET !== undefined) (window as any).__FAIL_MARKET_API__ = !!p.FAIL_MARKET;
    if (p.NO_FALLBACK !== undefined) (window as any).__NO_FALLBACK__ = !!p.NO_FALLBACK;
  }
}

// ────────────────── 타입 ──────────────────
export type MarketMetrics = {
  kpi: {
    avgRevenue?: number; // 평균매출(원)
    roi?: number;        // 수익률(%)
    openRate?: number;   // 개업률(%)
    closeRate?: number;  // 폐업률(%)
  };
  trendIndex?: number[];  // 기준월=100 지수 배열
  lastUpdated?: string;
  source?: string;
};

export type KFTCBrand = {
  id: string;
  name: string;
  category?: string;
  summary?: string;
  metrics?: {
    avgRevenue?: number;
    roi?: number;
    openRate?: number;
    closeRate?: number;
    stores?: number;
    trendIndex?: number[];
  };
};

// ────────────────── 폴백(샘플) ──────────────────
const FALLBACK_MARKET: MarketMetrics = {
  kpi: { avgRevenue: 68000000, roi: 18.4, openRate: 3.2, closeRate: 1.1 },
  trendIndex: [100, 103, 101, 107, 110, 113],
  lastUpdated: "snapshot-demo",
  source: "fallback",
};

const FALLBACK_BRAND = (id: string): KFTCBrand => ({
  id,
  name: "샘플 브랜드",
  category: "F&B",
  summary: "임시 샘플 데이터입니다.",
  metrics: {
    avgRevenue: 72000000,
    roi: 19.2,
    openRate: 3.0,
    closeRate: 1.0,
    stores: 210,
    trendIndex: [100, 102, 104, 103, 108, 112],
  },
});

// ────────────────── API 래퍼 ──────────────────

// 상태 점검: /api/status (워커 헬스체크)
export async function getApiStatus(): Promise<any> {
  const url = `${API_BASE}/status`;
  try {
    return await fetchJson<any>(url, { ttlMs: 5000, timeoutMs: 4000 });
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

/**
 * 소상공인365 지표
 * @param dong 법정동 코드(문자열) 예) "1168064000"
 * @param biz 업종 코드/키워드 예) "FNB" | "Retail" 등
 */
export async function getMarketMetrics(
  dong: string,
  biz: string
): Promise<MarketMetrics> {
  // 강제 실패 시뮬레이션
  if (readFlag("__FAIL_MARKET_API__")) {
    if (readFlag("__NO_FALLBACK__")) throw new Error("FAIL_MARKET_API on (no fallback)");
    return FALLBACK_MARKET;
  }

  const url = `${API_BASE}/market365/metrics?dong=${encodeURIComponent(dong)}&biz=${encodeURIComponent(biz)}`;
  try {
    const data = await fetchJson<MarketMetrics>(url, { ttlMs: 15000, timeoutMs: 8000 });
    // 데이터 최소 정규화
    return {
      kpi: data?.kpi ?? {},
      trendIndex: Array.isArray(data?.trendIndex) ? data!.trendIndex : undefined,
      lastUpdated: data?.lastUpdated,
      source: data?.source ?? "market365",
    };
  } catch (e) {
    if (readFlag("__NO_FALLBACK__")) throw e;
    return FALLBACK_MARKET;
  }
}

/**
 * 공정위 브랜드 요약
 */
export async function getKFTCBrand(id: string): Promise<KFTCBrand> {
  const url = `${API_BASE}/kftc/brand?id=${encodeURIComponent(id)}`;
  try {
    const data = await fetchJson<KFTCBrand>(url, { ttlMs: 30000, timeoutMs: 8000 });
    return {
      id: data?.id ?? id,
      name: data?.name ?? "브랜드",
      category: data?.category,
      summary: data?.summary,
      metrics: data?.metrics ?? {},
    };
  } catch (e) {
    return FALLBACK_BRAND(id);
  }
}
