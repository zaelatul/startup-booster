// 신규 파일: src/components/BrandRecommendations.tsx
// 역할: 브랜드 상세 하단 "추천 브랜드" 블록 (같은 업종 인기·유사 Top-N)
// 서버 컴포넌트(기본) — React 훅 미사용

import React from "react";
import { BRANDS } from "@/lib/reco";

type Num = number | undefined | null;

type BrandMetrics = {
  avgRevenue?: number;     // 평균 매출
  roi?: number;            // 수익률(%)
  openRate?: number;       // 개업률(%)
  closeRate?: number;      // 폐업률(%)
  growth3m?: number;       // 최근 3개월 지수/증가율
  stores?: number;         // 매장수(키가 다를 수 있어 아래에서 보정)
  storeCount?: number;
  totalStores?: number;
};

type Brand = {
  id: string;
  name: string;
  category?: string;
  metrics?: BrandMetrics;
};

type Scored = {
  brand: Brand;
  score: number;
  evidence: string[];
};

export type BrandRecommendationsProps = {
  currentId: string;
  category?: string;     // 없으면 현재 브랜드의 category 사용
  topN?: number;         // 기본 6
  excludeIds?: string[]; // 추가 제외 목록
  title?: string;        // 섹션 제목 커스터마이즈
};

// 안전 숫자 변환(없으면 undefined)
const num = (v: Num) => (v ?? undefined);

// 정규화 유틸 (0..1). min==max면 0.5 반환해 분모 0 방지.
function normalize(v: Num, min: number, max: number): number {
  const x = num(v);
  if (x === undefined) return 0; // 데이터 없으면 0으로 취급(보수적)
  if (max === min) return 0.5;
  return (x - min) / (max - min);
}

// 후보군에서 특정 키의 [min,max] 계산
function range(brands: Brand[], pick: (b: Brand) => Num): [number, number] {
  let mn = Number.POSITIVE_INFINITY;
  let mx = Number.NEGATIVE_INFINITY;
  for (const b of brands) {
    const v = pick(b);
    if (v === undefined || v === null || Number.isNaN(v)) continue;
    const n = Number(v);
    if (n < mn) mn = n;
    if (n > mx) mx = n;
  }
  if (mn === Number.POSITIVE_INFINITY) return [0, 0];
  return [mn, mx];
}

// 메트릭 접근(키가 다를 수 있어 보정)
function m(b: Brand) {
  const mt = b.metrics || {};
  return {
    revenue: num(mt.avgRevenue),
    roi: num(mt.roi),
    open: num(mt.openRate),
    close: num(mt.closeRate),
    growth: num(mt.growth3m),
    stores: num(mt.stores ?? mt.storeCount ?? mt.totalStores),
  };
}

/**
 * 내부 스코어링:
 * - 카테고리 일치: 가산 (W.category)
 * - 평균매출↑, 수익률↑, 개업률↑, 폐업률↓(역정규화), 최근증가↑, 매장수↑
 * - 가중치는 합 1 근사로 설정. 필요 시 조정 가능.
 */
function scoreBrands(
  universe: Brand[],
  base: Brand,
  desiredCategory?: string
): Scored[] {
  const candidates = universe.filter(
    (b) => b.id !== base.id && b.id && b.name
  );

  // 정규화 범위 계산
  const [revMin, revMax] = range(candidates, (b) => m(b).revenue);
  const [roiMin, roiMax] = range(candidates, (b) => m(b).roi);
  const [openMin, openMax] = range(candidates, (b) => m(b).open);
  const [closeMin, closeMax] = range(candidates, (b) => m(b).close);
  const [grMin, grMax] = range(candidates, (b) => m(b).growth);
  const [stMin, stMax] = range(candidates, (b) => m(b).stores);

  // 가중치 (합 ≈ 1)
  const W = {
    category: 0.35,
    revenue: 0.18,
    roi: 0.18,
    open: 0.08,
    closeInv: 0.11,
    growth: 0.05,
    stores: 0.05,
  };

  return candidates.map((b) => {
    const ev: string[] = [];
    const catMatch =
      (desiredCategory ?? base.category ?? "").toLowerCase() ===
      (b.category ?? "").toLowerCase();

    let s = 0;

    if (catMatch) {
      s += W.category;
      ev.push("카테고리 일치");
    }

    const rev = normalize(m(b).revenue, revMin, revMax);
    if (rev > 0.66) ev.push("매출↑");
    s += W.revenue * rev;

    const r = normalize(m(b).roi, roiMin, roiMax);
    if (r > 0.66) ev.push("수익률↑");
    s += W.roi * r;

    const op = normalize(m(b).open, openMin, openMax);
    if (op > 0.66) ev.push("개업률↑");
    s += W.open * op;

    // 폐업률은 낮을수록 좋음 → 역정규화(큰 값 = 좋은 것)
    let closeInv = 0.5;
    const closeVal = m(b).close;
    if (closeVal !== undefined) {
      const n = normalize(closeVal, closeMin, closeMax);
      closeInv = 1 - n;
      if (closeInv > 0.66) ev.push("폐업률↓");
    }
    s += W.closeInv * closeInv;

    const g = normalize(m(b).growth, grMin, grMax);
    if (g > 0.66) ev.push("최근증가");
    s += W.growth * g;

    const st = normalize(m(b).stores, stMin, stMax);
    s += W.stores * st;

    return { brand: b, score: Number(s.toFixed(6)), evidence: Array.from(new Set(ev)) };
  });
}

export default function BrandRecommendations(props: BrandRecommendationsProps) {
  const { currentId, category, topN = 6, excludeIds = [], title } = props;

  const all = (BRANDS as Brand[]) || [];
  const current = all.find((b) => b.id === currentId);
  if (!current) {
    // 현재 브랜드를 못 찾으면 렌더 생략 (안전)
    return null;
  }

  const desiredCat = category ?? current.category ?? undefined;

  const scored = scoreBrands(all, current, desiredCat)
    .filter((s) => !excludeIds.includes(s.brand.id))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, Math.min(12, topN)));

  if (scored.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-3">
        {title ?? "추천 브랜드"}{" "}
        <span className="text-sm text-gray-500">
          ({desiredCat ? `${desiredCat} 기준` : "유사도 기준"})
        </span>
      </h2>

      <div
        className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        data-testid="reco-list"
      >
        {scored.map(({ brand, score, evidence }) => {
          const mt = brand.metrics || {};
          const stores = mt.stores ?? mt.storeCount ?? mt.totalStores;
          return (
            <article
              key={brand.id}
              className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition"
              data-testid={`reco-card-${brand.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-base font-medium">{brand.name}</div>
                <div className="text-xs text-gray-500">{brand.category ?? "-"}</div>
              </div>

              {/* 근거 배지 */}
              <div className="mt-2 flex flex-wrap gap-1">
                {evidence.map((e) => (
                  <span
                    key={e}
                    className="text-xs px-2 py-0.5 rounded-full border bg-gray-50"
                  >
                    {e}
                  </span>
                ))}
              </div>

              {/* 미니 KPI */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-lg bg-gray-50 p-2">
                  <div className="text-xs text-gray-500">평균매출</div>
                  <div className="font-semibold">
                    {mt.avgRevenue != null ? `₩${Math.round(mt.avgRevenue).toLocaleString()}` : "-"}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-2">
                  <div className="text-xs text-gray-500">수익률</div>
                  <div className="font-semibold">
                    {mt.roi != null ? `${mt.roi.toFixed(1)}%` : "-"}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-2">
                  <div className="text-xs text-gray-500">매장수</div>
                  <div className="font-semibold">
                    {stores != null ? `${Math.round(stores).toLocaleString()}` : "-"}
                  </div>
                </div>
              </div>

              {/* 유사도 점수(설명용) */}
              <div className="mt-2 text-xs text-gray-500">
                유사도 점수: {Math.round(score * 100)}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
