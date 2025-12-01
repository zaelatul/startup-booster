// src/lib/reco.safe.ts
// rankBrandsFor 호출 시 list가 undefined이거나 스키마가 달라도 절대 터지지 않도록 보호하는 래퍼.
// avgSales/avgRevenue, profitRate/profit, closeRate 등 이름 차이도 흡수.

import { BRANDS } from '@/lib/reco';

export type Brand = {
  id: string;
  name: string;
  sector?: string;
  category?: string;
  kind?: string;
  avgSales?: number;        // 우리 코드 기준
  avgRevenue?: number;      // 샘플/타 코드 기준
  profitRate?: number;
  profit?: number;
  closeRate?: number;
  [k: string]: any;
};

// 내부 안전 게터
const n = (v: unknown, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const salesOf  = (b: Brand) => n(b.avgSales ?? b.avgRevenue ?? 0, 0);
const profitOf = (b: Brand) => n(b.profitRate ?? b.profit ?? 0, 0);
const closeOf  = (b: Brand) => n(b.closeRate ?? 0, 0);

// 아주 간단한 점수화: 매출(규모) + 수익률(비중) - 폐업률(패널티)
function scoreBrand(b: Brand, maxSales: number) {
  const s = salesOf(b);
  const p = profitOf(b);
  const c = closeOf(b);
  const salesRatio = maxSales > 0 ? s / maxSales : 0;
  return salesRatio * 50 + p * 2 - c * 1; // 가중치는 임시(샘플)
}

/**
 * 안전 추천 래퍼.
 * - list가 없거나 이상하면 BRANDS로 대체
 * - 예외가 나지 않도록 모든 곳 방어
 * - topN 초과 값도 방어
 */
export function rankBrandsSafe(list?: Brand[], topN = 5): Brand[] {
  const base: Brand[] = Array.isArray(list)
    ? list
    : (Array.isArray(BRANDS) ? (BRANDS as Brand[]) : []);

  if (base.length === 0) return [];

  const maxSales = Math.max(...base.map(salesOf), 0);
  const scored = base.map(b => ({ ...b, __score: scoreBrand(b, maxSales) }));
  return scored.sort((a, b) => n(b.__score) - n(a.__score)).slice(0, Math.max(1, Math.min(50, topN)));
}
