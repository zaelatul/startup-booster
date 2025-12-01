// web/src/lib/brand-logic.ts

export type AnyBrand = any;

export type StoreTrendPoint = {
  year: number;
  stores: number;
  open?: number;
  close?: number;
};

export type BrandViewModel = {
  id: string;
  name: string;
  categoryKey?: string;
  categoryLabel: string;
  slogan?: string;
  hqName?: string;
  hqAddress?: string;
  hqPhone?: string;
  hqHomepage?: string;
  storesTotal?: number;
  storesOpenRecent?: number;
  storesCloseRecent?: number;
  storesEndRecent?: number;
  feeJoin?: number;
  feeDeposit?: number;
  feeTraining?: number;
  feeEtc?: number;
  startupCostTotal?: number;
  interiorCostPerPy?: number;
  avgSales?: number;
  avgSalesPerPy30?: number;
  adRoyaltyRate?: number;
  adCostDesc?: string;
  contractTerminateCases?: number;
  contractDisputeCases?: number;
  openRateRecent?: number;
  closeRateRecent?: number;
  profitMargin?: number;
  trendIndex: number[];
  storeTrend3Y: StoreTrendPoint[];
  salesTop25?: number;
  salesBottom25?: number;
  riskBadges: string[];
  strengths: string[];
  cautions: string[];
  founderFit: string[];
  mainImage?: string;
  storeImage1?: string;
  storeImage2?: string;
};

/* ───────── 유틸 함수 ───────── */

export function safeNumber(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function fmtKRW(value?: number): string {
  if (value === undefined) return '-';
  try {
    return `${new Intl.NumberFormat('ko-KR').format(value)}원`;
  } catch {
    return `${value.toLocaleString()}원`;
  }
}

export function fmtKRWShort(value?: number): string {
  if (value === undefined) return '-';
  const v = Math.round(value);
  if (!Number.isFinite(v)) return '-';
  if (v >= 100_000_000) {
    const eok = v / 100_000_000;
    return `${eok.toFixed(eok >= 10 ? 0 : 1)}억`;
  }
  return v.toLocaleString('ko-KR');
}

export function fmtPCT(value?: number): string {
  if (value === undefined) return '-';
  const v = Number(value);
  if (!Number.isFinite(v)) return '-';
  return `${v.toFixed(1)}%`;
}

export function fmtCount(value?: number, suffix = '개'): string {
  if (value === undefined) return '-';
  return `${value.toLocaleString()}${suffix}`;
}

export function fmtText(value?: string): string {
  if (!value) return '자료 준비 중';
  return value;
}

export function mapCategoryLabel(cat?: string): string {
  if (!cat) return '업종 정보 없음';
  const c = cat.toUpperCase();
  if (c === 'F&B' || c === 'FOOD') return '외식 · 요식(F&B)';
  if (c === 'RETAIL') return '도소매 · 편의점 · 드럭스토어';
  if (c === 'SERVICE') return '서비스 · 교육 · 기타';
  return cat;
}

/* ───────── 뷰모델 변환기 ───────── */

export function toViewModel(raw: AnyBrand): BrandViewModel {
  const id: string = raw?.id ?? raw?.brandId ?? raw?.brand_id ?? 'unknown-brand';
  const name: string = raw?.name ?? raw?.brandName ?? raw?.brand_name ?? '이름 없는 브랜드';
  const categoryKey: string | undefined = raw?.category ?? raw?.sector ?? raw?.type;

  const hqName = raw?.hqName ?? raw?.franchisorName ?? raw?.hq_name ?? undefined;
  const hqAddress = raw?.hqAddress ?? raw?.franchisorAddress ?? raw?.hq_address ?? undefined;
  const hqPhone = raw?.hqPhone ?? raw?.franchisorPhone ?? raw?.hq_phone ?? undefined;
  const hqHomepage = raw?.homepage ?? raw?.hqHomepage ?? raw?.homepage_url ?? undefined;

  const storesTotal = safeNumber(raw?.stores ?? raw?.storeCount ?? raw?.stores_total ?? raw?.total_stores ?? raw?.branch_count);
  const storesOpenRecent = safeNumber(raw?.storesOpenRecent ?? raw?.openStoresRecent ?? raw?.open_count_recent);
  const storesCloseRecent = safeNumber(raw?.storesCloseRecent ?? raw?.closeStoresRecent ?? raw?.close_count_recent);
  const storesEndRecent = safeNumber(raw?.storesEndRecent ?? raw?.terminateStoresRecent ?? raw?.end_contract_recent);

  const feeJoin = safeNumber(raw?.feeJoin ?? raw?.franchiseFee ?? raw?.join_fee);
  const feeDeposit = safeNumber(raw?.feeDeposit ?? raw?.deposit ?? raw?.deposit_fee);
  const feeTraining = safeNumber(raw?.feeTraining ?? raw?.trainingFee ?? raw?.training_fee);
  const feeEtc = safeNumber(raw?.feeEtc ?? raw?.etcFee ?? raw?.other_fee);
  const startupCostTotal = safeNumber(raw?.startupCostTotal ?? raw?.startup_cost_total);
  const interiorCostPerPy = safeNumber(raw?.interiorCostPerPy ?? raw?.interior_cost_per_py);

  const avgSales = safeNumber(raw?.avgSales ?? raw?.salesAvg ?? raw?.avg_sales ?? raw?.avg_sales_amount);
  const avgSalesPerPy30 = safeNumber(raw?.avgSalesPerPy30 ?? raw?.avg_sales_per_30py);

  const adRoyaltyRate = safeNumber(raw?.adRoyaltyRate ?? raw?.ad_rate ?? raw?.adRoyalty);
  const adCostDesc: string | undefined = raw?.adCostDesc ?? raw?.ad_desc ?? undefined;

  const contractTerminateCases = safeNumber(raw?.contractTerminateCases ?? raw?.terminate_cases_recent);
  const contractDisputeCases = safeNumber(raw?.contractDisputeCases ?? raw?.dispute_cases_recent);

  const openRateRecent = safeNumber(raw?.openRateRecent ?? raw?.open_rate_recent ?? raw?.openRate);
  const closeRateRecent = safeNumber(raw?.closeRateRecent ?? raw?.close_rate_recent ?? raw?.closeRate);
  const profitMargin = safeNumber(raw?.profitMargin ?? raw?.margin ?? raw?.profit_margin);

  let trendIndex: number[] = Array.isArray(raw?.trendIndex ?? raw?.sales_index) && (raw?.trendIndex ?? raw?.sales_index).length > 1
      ? (raw?.trendIndex ?? raw?.sales_index)
      : [95, 100, 102, 104, 107, 110];
  trendIndex = trendIndex.map((v: any) => Number(v)).filter((v: any) => Number.isFinite(v));
  if (trendIndex.length < 2) trendIndex = [100, 101, 102, 103, 104];

  let storeTrend3Y: StoreTrendPoint[] = [];
  const rawStoreTrend = raw?.storeTrend3Y ?? raw?.store_trend3y ?? raw?.storeTrend ?? raw?.store_trend;
  if (Array.isArray(rawStoreTrend)) {
    storeTrend3Y = rawStoreTrend
      .map((row: any) => {
        const year = Number(row?.year ?? row?.y ?? row?.[0]);
        const stores = Number(row?.stores ?? row?.storeCount ?? row?.store_count ?? row?.count ?? row?.[1]);
        const open = row?.open ?? Math.floor(stores * 0.1);
        const close = row?.close ?? Math.floor(stores * 0.05);
        return { year, stores, open, close };
      })
      .filter((row: any) => Number.isFinite(row.year) && Number.isFinite(row.stores) && row.year > 0 && row.stores >= 0)
      .sort((a: any, b: any) => a.year - b.year)
      .slice(-3);
  }

  const salesTop25 = safeNumber(raw?.salesTop25 ?? raw?.sales_top25 ?? raw?.salesTopQuartile ?? raw?.sales_top_quartile);
  const salesBottom25 = safeNumber(raw?.salesBottom25 ?? raw?.sales_bottom25 ?? raw?.salesBottomQuartile ?? raw?.sales_bottom_quartile);

  const riskBadges: string[] = [];
  if (closeRateRecent !== undefined) {
    if (closeRateRecent >= 10) riskBadges.push('폐업률이 높은 편');
    else if (closeRateRecent >= 5) riskBadges.push('폐업률이 다소 높은 편');
  }
  if (openRateRecent !== undefined && closeRateRecent !== undefined) {
    if (openRateRecent > closeRateRecent) riskBadges.push('최근 개점이 폐점보다 많은 편');
    else if (openRateRecent < closeRateRecent) riskBadges.push('최근 폐점이 개점보다 많은 편');
  }
  if (profitMargin !== undefined) {
    if (profitMargin >= 20) riskBadges.push('수익률이 높은 편');
    else if (profitMargin <= 10) riskBadges.push('수익률이 낮은 편');
  }

  const strengths: string[] = [];
  const cautions: string[] = [];
  const founderFit: string[] = [];

  if (avgSales !== undefined) strengths.push('점포당 평균 매출이 일정 수준 이상으로 유지되고 있습니다.');
  if (openRateRecent !== undefined && closeRateRecent !== undefined && openRateRecent >= closeRateRecent) {
    strengths.push('최근 개점 수가 폐점 수보다 많아 성장세 브랜드에 가깝습니다.');
  }
  if (!strengths.length) strengths.push('지표 상으로는 평균적인 안정성을 가진 브랜드입니다.');

  if (closeRateRecent !== undefined && closeRateRecent >= 10) cautions.push('폐업률이 높아 입지 선정과 운영 전략이 특히 중요합니다.');
  if (profitMargin !== undefined && profitMargin <= 10) cautions.push('수익률이 낮은 편이라 임대료·인건비 등 비용 관리가 필수입니다.');
  if (!cautions.length) cautions.push('특별한 위험 요소는 두드러지지 않지만 기본적인 수익성 검토는 필요합니다.');

  const catUpper = categoryKey?.toUpperCase();
  if (catUpper === 'F&B' || catUpper === 'FOOD') {
    founderFit.push('매장 운영·위생·서비스 관리에 직접 참여할 수 있는 창업자에게 적합합니다.');
    founderFit.push('주말·저녁 시간대 근무 비중이 커도 괜찮은 라이프스타일이라면 좋습니다.');
  } else if (catUpper === 'RETAIL') {
    founderFit.push('재고·발주 관리와 매장 디스플레이에 관심이 많은 창업자에게 어울립니다.');
    founderFit.push('단골 고객을 꾸준히 만들고 싶은 경우에 적합합니다.');
  } else if (catUpper === 'SERVICE') {
    founderFit.push('상담·설명·교육 등 사람을 직접 상대하는 서비스 경험이 있다면 유리합니다.');
  }
  if (!founderFit.length) founderFit.push('브랜드 본사의 매뉴얼을 성실히 따라가며 운영할 수 있는 창업자라면 무난합니다.');

  const images: string[] = [];
  if (raw?.mainImage) images.push(raw.mainImage);
  if (Array.isArray(raw?.storeImages)) raw.storeImages.forEach((u: string) => images.push(u));
  if (Array.isArray(raw?.images)) raw.images.forEach((u: string) => images.push(u));

  const [mainImage, storeImage1, storeImage2] = images;

  return {
    id, name, categoryKey, categoryLabel: mapCategoryLabel(categoryKey), slogan: raw?.slogan ?? raw?.tagline ?? undefined,
    hqName, hqAddress, hqPhone, hqHomepage,
    storesTotal, storesOpenRecent, storesCloseRecent, storesEndRecent,
    feeJoin, feeDeposit, feeTraining, feeEtc, startupCostTotal, interiorCostPerPy,
    avgSales, avgSalesPerPy30, adRoyaltyRate, adCostDesc,
    contractTerminateCases, contractDisputeCases,
    openRateRecent, closeRateRecent, profitMargin, trendIndex, storeTrend3Y,
    salesTop25, salesBottom25,
    riskBadges, strengths, cautions, founderFit,
    mainImage, storeImage1, storeImage2,
  };
}