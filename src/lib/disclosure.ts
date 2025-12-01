// 신규 — src/lib/disclosure.ts
// 공정위 정보공개서(갱신/해지 제외) 요약 모듈
// - 타입/기본값/샘플 포함
// - API 실패 시 안전 Fallback
// - 환경 플래그: __FAIL_API__, __NO_FALLBACK__

export type RoyaltyType = '고정' | '매출비례' | '없음';

export type Disclosure = {
  franchisor: string;            // 가맹본부명
  ceo?: string;
  since?: number;                // 설립연도
  hqAddr?: string;               // 본사 주소
  directStores?: number;         // 직영점 수
  franchiseStores?: number;      // 가맹점 수
  royaltyType?: RoyaltyType;     // 로열티 형태
  royaltyNote?: string;          // 로열티 비고
  initialFees?: {
    가맹비?: number;
    교육비?: number;
    보증금?: number;
    인테리어_평당?: number;      // 원/평 등 표기용
    장비비?: number;
  };
  marketingShare?: string;       // 광고분담금
  logisticsMargin?: string;      // 물류마진
  contractYears?: number;        // 계약기간(년)
  // 메타
  source?: 'KFTC' | 'local';
  updatedAt?: string;            // ISO string
};

// 안전 기본값
export const DISCLOSURE_DEFAULT: Disclosure = {
  franchisor: '',
  source: 'local',
  updatedAt: undefined,
};

// 샘플 데이터(브랜드 ID 기준)
// ※ 실제 연동 시 이 매핑은 제거/보완됩니다.
const SAMPLE: Record<string, Disclosure> = {
  'olive-young': {
    franchisor: '씨제이올리브영 주식회사',
    ceo: '구창근',
    since: 1999,
    hqAddr: '서울특별시 용산구 한강대로 366',
    directStores: 150,
    franchiseStores: 1300,
    royaltyType: '매출비례',
    royaltyNote: '매출 구간 비율',
    initialFees: { 가맹비: 10000000, 교육비: 3000000, 보증금: 10000000, 인테리어_평당: 900000, 장비비: 15000000 },
    marketingShare: '브랜드/프로모션 분담',
    logisticsMargin: '일부 카테고리 물류 수수료',
    contractYears: 2,
    source: 'local',
    updatedAt: new Date().toISOString(),
  },
  'bbq': {
    franchisor: '제너시스BBQ',
    ceo: '윤홍근',
    since: 1995,
    hqAddr: '서울 강동구 천호대로 1077',
    directStores: 50,
    franchiseStores: 1900,
    royaltyType: '매출비례',
    initialFees: { 가맹비: 10000000, 교육비: 2000000, 보증금: 5000000, 인테리어_평당: 700000, 장비비: 25000000 },
    marketingShare: '전국/지역 광고 분담',
    logisticsMargin: '원재료 물류 수수료',
    contractYears: 2,
    source: 'local',
    updatedAt: new Date().toISOString(),
  },
};

// 유틸: 안전 파싱(누락 키를 기본값으로 보강)
function normalize(d?: Partial<Disclosure>): Disclosure {
  return {
    ...DISCLOSURE_DEFAULT,
    ...d,
    initialFees: { ...DISCLOSURE_DEFAULT.initialFees, ...(d?.initialFees ?? {}) },
  };
}

// API 베이스 (워커 프록시 가정)
// - 환경변수가 없으면 상대경로 사용
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') || ''; // 예: '' → '/api' 를 prefix로 직접 넣는 스타일이면 수정

// 실제 호출 함수
async function fetchFromApi(brandId: string): Promise<Disclosure | null> {
  // 실패 강제 플래그
  if (globalThis && (globalThis as any).__FAIL_API__) {
    throw new Error('Forced API fail by __FAIL_API__');
  }

  // 라우트 예시: /api/kftc/disclosure?brand={id}
  const url = `${API_BASE}/api/kftc/disclosure?brand=${encodeURIComponent(brandId)}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const raw = (await res.json()) as Partial<Disclosure>;
  // 백엔드 응답을 우리 스키마로 정규화(필요 시 맵핑)
  return normalize({
    ...raw,
    source: 'KFTC',
    updatedAt: raw.updatedAt || new Date().toISOString(),
  });
}

// 공개 함수: 정보공개서 조회(실패 시 샘플/기본값)
export async function getDisclosure(brandId: string): Promise<Disclosure> {
  try {
    const fromApi = await fetchFromApi(brandId);
    if (fromApi) return fromApi;
  } catch (e) {
    // NO_FALLBACK이면 에러 전파
    if (globalThis && (globalThis as any).__NO_FALLBACK__) {
      throw e;
    }
    // console.warn로만 남기고 샘플/기본값 사용
    console.warn('[disclosure] API 실패, 샘플/기본값 사용:', (e as Error)?.message);
  }

  // 샘플 → 없으면 기본값
  if (SAMPLE[brandId]) return normalize(SAMPLE[brandId]);
  return normalize({ franchisor: '', source: 'local', updatedAt: new Date().toISOString() });
}

// 헬퍼: 통화 포맷
export const krw = (v?: number) =>
  typeof v === 'number' && Number.isFinite(v) ? v.toLocaleString('ko-KR') + '원' : '—';
