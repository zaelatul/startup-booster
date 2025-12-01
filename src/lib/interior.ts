// src/lib/interior.ts
// 셀프 인테리어 계산/타입/주문초안 헬퍼 (클라이언트/서버 공용)

// ===== 타입 =====
export type ProductKind = 'floor' | 'wall';

export interface ProductSpec {
  unit?: string;        // 예: '원/㎡'
  waste_pct?: number;   // 기본 여유율(%)
  [k: string]: unknown;
}

export interface Product {
  id: string;
  kind: ProductKind;
  name: string;
  price_per_sqm: number;
  spec_json?: ProductSpec | null;
}

export interface CalcInput {
  width_m: number;       // 가로(m)
  length_m: number;      // 세로(m)
  price_per_sqm: number; // ㎡당 단가(원)
  waste_pct: number;     // 여유율(%)
  extra_count: number;   // 추가자재 개수
  extra_unit: number;    // 추가자재 개당 단가(원)
}

export interface CalcResult {
  area_m2: number;         // 순수 면적(㎡)
  area_m2_waste: number;   // 여유율 적용 면적(㎡)
  material_cost: number;   // 자재·시공(㎡ 단가 기반)
  extra_cost: number;      // 추가자재 비용
  total: number;           // 총액
}

// 주문초안 아이템(DB 스키마에 맞춘 형태)
export interface DraftItem {
  kind: 'floor' | 'wall' | 'addon';
  title: string;                 // 예: '바닥 — 데코타일'
  quantity: number;              // 기본 1
  amount: number;                // 소계(원)
  meta: Record<string, unknown>; // 계산 근거 저장
  sort?: number;
}

// ===== 유틸 =====
export function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}

export function roundWon(n: number): number {
  return Math.round(n); // 필요 시 10원/100원 단위 반올림으로 변경 가능
}

// ===== 계산기 =====
export function compute(input: CalcInput): CalcResult {
  const width = clamp(input.width_m, 0, 1_000);
  const length = clamp(input.length_m, 0, 1_000);
  const price = clamp(input.price_per_sqm, 0, 10_000_000);
  const waste = clamp(input.waste_pct, 0, 100);
  const extraCount = clamp(input.extra_count, 0, 1_000_000);
  const extraUnit = clamp(input.extra_unit, 0, 10_000_000);

  const area_m2 = width * length;
  const area_m2_waste = area_m2 * (1 + waste / 100);

  const material_cost = area_m2_waste * price;
  const extra_cost = extraCount * extraUnit;

  const total = material_cost + extra_cost;

  return {
    area_m2,
    area_m2_waste,
    material_cost: roundWon(material_cost),
    extra_cost: roundWon(extra_cost),
    total: roundWon(total),
  };
}

// ===== 주문초안 아이템 빌더 =====
export function buildDraftItem(
  kind: ProductKind,
  title: string,
  input: CalcInput,
  quantity = 1
): DraftItem {
  const result = compute(input);
  return {
    kind,
    title,
    quantity,
    amount: result.total,
    meta: {
      ...input,
      ...result,
    },
  };
}

export function sumDraftItems(items: DraftItem[]): number {
  return roundWon(items.reduce((acc, it) => acc + (it.amount || 0), 0));
}

// ===== 제품 헬퍼 =====
// 제품을 API에서 받아오도록 분리(다음 단계에서 /api/interior/products 구현 예정)
export interface ProductLite {
  id: string;
  kind: ProductKind;
  name: string;
  price_per_sqm: number;
  waste_pct?: number;
}

/**
 * 클라이언트/서버 어디서나 호출 가능한 fetch 스텁.
 * 다음 단계에서 /api/interior/products(서버 라우트) 구현 후 동작.
 */
export async function fetchProducts(): Promise<ProductLite[]> {
  const res = await fetch('/api/interior/products', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json() as Array<{
    id: string;
    kind: ProductKind;
    name: string;
    price_per_sqm: number;
    spec_json?: ProductSpec | null;
  }>;
  return data.map((p) => ({
    id: p.id,
    kind: p.kind,
    name: p.name,
    price_per_sqm: p.price_per_sqm,
    waste_pct: p.spec_json?.waste_pct ?? 10,
  }));
}

/**
 * 제품 하나에서 CalcInput 기본값 만들기(페이지 초기값 주입용)
 */
export function defaultCalcInputFromProduct(
  p: ProductLite,
  width_m = 3,
  length_m = 6
): CalcInput {
  return {
    width_m,
    length_m,
    price_per_sqm: p.price_per_sqm,
    waste_pct: p.waste_pct ?? 10,
    extra_count: 0,
    extra_unit: 15000,
  };
}
