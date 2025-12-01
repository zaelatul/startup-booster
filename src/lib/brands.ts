// src/lib/brands.ts  (신규)
// 목적: 프랜차이즈 공통 어댑터. 화면은 이 표준 인터페이스만 의존.
// 약어 풀이: KPI=핵심지표(Key Performance Indicator)

export type BrandCategory = 'Retail' | 'F&B' | 'Service';

export type BadgeTone = 'pos' | 'neg' | 'neutral';
export type Badge = { key: '매출' | '수익률' | '개업률' | '폐업률'; label: string; tone: BadgeTone };

export type BrandSummary = {
  id: string;             // slug (URL id)
  name: string;           // 브랜드명
  category: BrandCategory;
  logo?: string;          // 로고 URL (선택)
  foundedYear?: number;   // 설립연도 (선택)
};

export type BrandKpis = {
  // 단위 설명: 월매출(백만원), 수익률(%), 개업률/폐업률(%), 점포수(개)
  avgSalesMonthly: number;
  avgMarginPct: number;
  openRate: number;
  closeRate: number;
  storeCount: number;
  trend12m: number[];     // 최근 12개월 지표(스파크라인). 여기선 월매출 지수(0~100) 예시.
  badges: Badge[];        // 화면에 바로 쓸 근거 배지
};

export type BrandDetail = {
  summary: BrandSummary;
  kpis: BrandKpis;
  description?: string;
  sources?: Array<{ label: string; href: string }>; // 근거/출처 링크(선택)
};

// ─────────────────────────────────────────────────────────────────────────────
// 내부 유틸

const slug = (s: string) => s
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

function makeBadges(k: Pick<BrandKpis, 'avgSalesMonthly' | 'avgMarginPct' | 'openRate' | 'closeRate'>): Badge[] {
  const out: Badge[] = [];
  if (k.avgSalesMonthly >= 80) out.push({ key: '매출', label: '월매출 상위권', tone: 'pos' });
  else if (k.avgSalesMonthly <= 40) out.push({ key: '매출', label: '월매출 낮음', tone: 'neg' });

  if (k.avgMarginPct >= 20) out.push({ key: '수익률', label: '수익률 양호', tone: 'pos' });
  else if (k.avgMarginPct <= 10) out.push({ key: '수익률', label: '수익률 낮음', tone: 'neg' });

  if (k.openRate >= 12) out.push({ key: '개업률', label: '개업 증가세', tone: 'pos' });
  if (k.closeRate <= 4) out.push({ key: '폐업률', label: '폐업률 낮음', tone: 'pos' });
  if (k.closeRate >= 8) out.push({ key: '폐업률', label: '폐업주의', tone: 'neg' });

  // 중복 키는 첫 항목만 유지
  const seen = new Set<string>();
  return out.filter(b => (seen.has(b.key) ? false : (seen.add(b.key), true)));
}

// ─────────────────────────────────────────────────────────────────────────────
// 샘플 카탈로그 (스냅샷 교체 지점)
// 실데이터 연동 시, 동일 키로 매핑하여 대체.

const SAMPLE: BrandDetail[] = [
  {
    summary: { id: 'olive-young', name: '올리브영', category: 'Retail', foundedYear: 1999 },
    kpis: {
      avgSalesMonthly: 95, avgMarginPct: 22, openRate: 9, closeRate: 3, storeCount: 1500,
      trend12m: [78, 80, 82, 84, 83, 86, 88, 90, 92, 94, 96, 98],
      badges: [],
    },
    description: 'H&B 리테일 대표 브랜드. 카테고리 확장과 PB 비중 상승.',
    sources: [{ label: '공정위 가맹정보', href: 'https://franchise.ftc.go.kr' }],
  },
  {
    summary: { id: 'paris-baguette', name: '파리바게뜨', category: 'F&B', foundedYear: 1988 },
    kpis: {
      avgSalesMonthly: 88, avgMarginPct: 18, openRate: 8, closeRate: 4, storeCount: 3600,
      trend12m: [70, 69, 71, 73, 74, 76, 77, 79, 80, 82, 84, 86],
      badges: [],
    },
    description: '베이커리 대표 프랜차이즈. 전국 단위 체인망.',
  },
  {
    summary: { id: 'ediya-coffee', name: '이디야커피', category: 'F&B', foundedYear: 2001 },
    kpis: {
      avgSalesMonthly: 72, avgMarginPct: 16, openRate: 13, closeRate: 5, storeCount: 3000,
      trend12m: [58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 70],
      badges: [],
    },
    description: '합리적 가격대의 커피 프랜차이즈.',
  },
  {
    summary: { id: 'coupang-friend', name: '쿠팡프렌즈 픽업', category: 'Retail', foundedYear: 2022 },
    kpis: {
      avgSalesMonthly: 60, avgMarginPct: 14, openRate: 22, closeRate: 6, storeCount: 420,
      trend12m: [30, 35, 38, 42, 45, 48, 50, 52, 55, 58, 60, 62],
      badges: [],
    },
    description: '픽업 허브형 소매/물류 하이브리드 모델.',
  },
  {
    summary: { id: 'laundry-lab', name: '런드리랩', category: 'Service', foundedYear: 2015 },
    kpis: {
      avgSalesMonthly: 54, avgMarginPct: 28, openRate: 8, closeRate: 2, storeCount: 210,
      trend12m: [40, 42, 43, 44, 45, 47, 49, 50, 51, 52, 53, 55],
      badges: [],
    },
    description: '셀프/무인 세탁 전문. 원가 구조 안정적.',
  },
];

// 최초 로딩 시 배지 산출
for (const b of SAMPLE) {
  b.kpis.badges = makeBadges(b.kpis);
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API

export function listBrands(opts?: { q?: string; categories?: BrandCategory[]; sort?: 'relevance' | 'sales' | 'openRate' | 'closeRate' | 'name' }): BrandSummary[] {
  const q = (opts?.q ?? '').toLowerCase().trim();
  const cats = opts?.categories ?? [];

  let arr = SAMPLE.slice();

  if (cats.length) {
    arr = arr.filter(b => cats.includes(b.summary.category));
  }
  if (q) {
    arr = arr.filter(b => (b.summary.name + ' ' + b.summary.id).toLowerCase().includes(q));
  }

  const sort = opts?.sort ?? 'relevance';
  const scored = arr.map(b => {
    const hit = q ? (b.summary.name.toLowerCase().includes(q) ? 2 : (b.summary.id.includes(q) ? 1 : 0)) : 0;
    return { b, score: hit };
  });

  switch (sort) {
    case 'sales':
      scored.sort((a, c) => c.b.kpis.avgSalesMonthly - a.b.kpis.avgSalesMonthly);
      break;
    case 'openRate':
      scored.sort((a, c) => c.b.kpis.openRate - a.b.kpis.openRate);
      break;
    case 'closeRate':
      scored.sort((a, c) => a.b.kpis.closeRate - c.b.kpis.closeRate);
      break;
    case 'name':
      scored.sort((a, c) => a.b.summary.name.localeCompare(c.b.summary.name, 'ko'));
      break;
    case 'relevance':
    default:
      scored.sort((a, c) => c.score - a.score);
  }

  return scored.map(s => s.b.summary);
}

export async function getBrandById(idOrName: string): Promise<BrandDetail | null> {
  const key = slug(idOrName);
  const found =
    SAMPLE.find(b => slug(b.summary.id) === key)
    || SAMPLE.find(b => slug(b.summary.name) === key);

  return found ? structuredClone(found) : null;
}

// 확장 포인트: 실데이터 연동 시 아래 함수를 교체/확장
export type BrandDataSource = {
  getById(id: string): Promise<BrandDetail | null>;
  list(params?: { q?: string; categories?: BrandCategory[]; sort?: 'relevance' | 'sales' | 'openRate' | 'closeRate' | 'name' }): Promise<BrandSummary[]>;
};

// 기본 소스(샘플)
export const DefaultBrandSource: BrandDataSource = {
  getById: getBrandById,
  list: async (p) => listBrands(p),
};
