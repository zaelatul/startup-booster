// src/lib/market.ts
export type MarketPeriod = '1m' | '3m' | '6m' | '12m';

export type MarketFilters = {
  industry: string;   // 업종
  region: string;     // 지역(행정동/구 등 문자열)
  period: MarketPeriod;
};

export type MarketKpis = {
  avgSales: number;          // 매출 평균 (원)
  openings: number;          // 개업 건수
  openingRate: number;       // 개업 율 (%)
  closures: number;          // 폐업 건수
  closureRate: number;       // 폐업 율 (%)
  footTraffic: number;       // 유동인구 (명)
  sameIndustryCount: number; // 동일 업종 수
};

const FALLBACK: MarketKpis = {
  avgSales: 0,
  openings: 0,
  openingRate: 0,
  closures: 0,
  closureRate: 0,
  footTraffic: 0,
  sameIndustryCount: 0,
};

// 간단한 결정적 의사난수로 더미 KPI 생성(입력 동일하면 동일 출력)
export async function getMarketKpis(filters: MarketFilters): Promise<MarketKpis> {
  try {
    const key = `${filters.industry}|${filters.region}|${filters.period}`;
    let h = 2166136261 >>> 0; // FNV-1a 해시 비슷하게
    for (let i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const rnd = (min: number, max: number) => {
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
      const u = (h >>> 0) / 0xffffffff;
      return Math.round(min + u * (max - min));
    };

    const scale = filters.period === '1m' ? 0.6 : filters.period === '3m' ? 0.8 : filters.period === '6m' ? 1.0 : 1.2;

    return {
      avgSales: rnd(3000, 12000) * 1000,             // 3백만~1.2억
      openings: Math.max(1, Math.round(rnd(5, 80) * scale)),
      openingRate: rnd(1, 20),
      closures: Math.max(1, Math.round(rnd(3, 60) * scale)),
      closureRate: rnd(1, 15),
      footTraffic: rnd(10000, 500000),
      sameIndustryCount: rnd(10, 300),
    };
  } catch {
    return FALLBACK;
  }
}
