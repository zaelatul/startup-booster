// [1] 카테고리
export const FRANCHISE_CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'korean', name: '한식' },
  { id: 'chicken', name: '치킨' },
  { id: 'cafe', name: '카페' },
  { id: 'snack', name: '분식' },
  { id: 'pub', name: '호프/주점' },
  { id: 'burger', name: '버거/피자' },
  { id: 'japanese', name: '일식' },
  { id: 'chinese', name: '중식' },
  { id: 'bakery', name: '베이커리' },
  { id: 'store', name: '편의점/마트' },
  { id: 'cosmetic', name: '화장품' },
  { id: 'beauty', name: '미용/뷰티' },
  { id: 'fashion', name: '의류/패션' },
  { id: 'retail', name: '도소매/유통' },
  { id: 'service', name: '서비스/기타' },
];

// [2] 리스트용 데이터 (500개 더미 복구 - 목록 페이지용)
const TOP_BRANDS = [
  {
    id: 'mega-coffee',
    name: '메가커피',
    category: '카페',
    description: '가성비 커피의 선두주자, 폭발적인 성장세',
    avgSales: 3500,
    startupCost: 7500,
    storeCount: 2500,
    profitMargin: 25,
    heroImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    tags: ['저가커피', '테이크아웃', '고수익'],
    rankChange: 1,
    isHot: true
  },
  {
    id: 'bbq',
    name: 'BBQ치킨',
    category: '치킨',
    description: '황금올리브 치킨의 신화',
    avgSales: 4500,
    startupCost: 9000,
    storeCount: 1800,
    profitMargin: 20,
    heroImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    tags: ['배달특화', '브랜드파워'],
    rankChange: -1,
    isHot: true
  },
   {
    id: 'cu',
    name: 'CU 편의점',
    category: '편의점/마트',
    description: '대한민국 1등 편의점',
    avgSales: 5500,
    startupCost: 6000,
    storeCount: 15000,
    profitMargin: 15,
    heroImage: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80',
    tags: ['안정적', '24시간', '대기업'],
    rankChange: 0,
    isHot: false
  }
];

// [수정 완료] 랜덤 함수(Math.random) 제거 -> 고정된 계산식 사용 (Hydration Error 해결)
const DUMMY_BRANDS = Array.from({ length: 497 }).map((_, i) => {
  const cats = FRANCHISE_CATEGORIES.slice(1);
  // 랜덤 대신 순서대로 선택
  const randomCat = cats[i % cats.length]; 
  
  const dummyImages = [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    'https://images.unsplash.com/photo-1493770348161-369560ae357d'
  ];

  return {
    id: `franchise-${i}`,
    name: `${randomCat.name} 브랜드 ${i + 1}`,
    category: randomCat.name,
    description: '안정적인 수익과 체계적인 시스템을 갖춘 유망 브랜드',
    // i 값을 이용해 "랜덤처럼 보이지만 고정된 숫자" 생성
    avgSales: ((i * 1234) % 4000) + 1500,
    startupCost: ((i * 5678) % 7000) + 3000,
    storeCount: ((i * 910) % 490) + 10,
    profitMargin: ((i * 11) % 15) + 10,
    heroImage: `${dummyImages[i % 10]}?auto=format&fit=crop&w=800&q=80`,
    tags: ['소자본', '오토운영', '인기'],
    rankChange: (i % 5) - 2,
    isHot: i % 10 === 0
  };
});

export const FRANCHISE_LIST = [...TOP_BRANDS, ...DUMMY_BRANDS];

// [3] 상세 데이터 타입
export type FranchiseDetail = {
  id: string; name: string; companyName: string; ceoName: string; address: string; contact: string; logoUrl: string; category: string;
  financials: { year: string; totalSales: number; franchiseSales: number; operatingProfit: number; netProfit: number; }[];
  legalStatus: { hasViolation: boolean; violationDetail?: string; };
  storeTrends: { year: string; newStores: number; closedStores: number; transferStores: number; totalStores: number; }[];
  
  storeSummary: {
    total: number;
    totalDiff: number;
    new: number;
    newDiff: number;
    closed: number;
    closedDiff: number;
  };

  regionalStores: { region: string; count: number }[];
  avgRevenue: { nationwide: number; perArea: number; };
  initialCosts: { joinFee: number; eduFee: number; deposit: number; interior: number; other: number; totalAvg: number; totalMax: number; };
  ongoingCosts: { royalty: string; adFee: string; };
  contract: { termInitial: number; termRenewal: number; renewalCost: string; areaProtection: boolean; areaDesc: string; training: { days: number; costBearer: string; contents: string; }; marketing: { ratio: string; desc: string; }; qualityControl: { priceControl: boolean; supplyStandard: string; }; };
};

// [4] 상세 더미 데이터
export const FRANCHISE_MOCK_DATA: FranchiseDetail = {
  id: 'sample-1',
  name: '메가커피 (MEGA COFFEE)',
  companyName: '(주)앤하우스',
  ceoName: '김대영',
  address: '서울 마포구 동교로',
  contact: '1588-0000',
  logoUrl: 'https://via.placeholder.com/100x100?text=MEGA',
  category: '카페',
  
  financials: [
    { year: '2022', totalSales: 25000000, franchiseSales: 20000000, operatingProfit: 3000000, netProfit: 2500000 },
    { year: '2023', totalSales: 30000000, franchiseSales: 24000000, operatingProfit: 3800000, netProfit: 3200000 },
    { year: '2024', totalSales: 35000000, franchiseSales: 28000000, operatingProfit: 4500000, netProfit: 3800000 },
  ],

  legalStatus: {
    hasViolation: false,
    violationDetail: '-'
  },

  storeTrends: [
    { year: '2022', newStores: 350, closedStores: 8, transferStores: 30, totalStores: 1650 },
    { year: '2023', newStores: 400, closedStores: 10, transferStores: 40, totalStores: 2050 },
    { year: '2024', newStores: 450, closedStores: 12, transferStores: 50, totalStores: 2500 },
  ],

  storeSummary: {
    total: 2500,
    totalDiff: 450,
    new: 450,
    newDiff: 50,
    closed: 12,
    closedDiff: 2
  },

  regionalStores: [
    { region: '경기', count: 520 },
    { region: '서울', count: 480 },
    { region: '인천', count: 150 },
    { region: '부산', count: 120 },
    { region: '경남', count: 90 },
    { region: '대구', count: 80 },
    { region: '충남', count: 75 },
    { region: '경북', count: 70 },
    { region: '대전', count: 65 },
    { region: '광주', count: 60 },
    { region: '충북', count: 55 },
    { region: '전북', count: 50 },
    { region: '전남', count: 45 },
    { region: '강원', count: 40 },
    { region: '울산', count: 35 },
    { region: '제주', count: 20 },
    { region: '세종', count: 15 },
  ],

  avgRevenue: {
    nationwide: 34500, 
    perArea: 2100, 
  },

  initialCosts: {
    joinFee: 500,
    eduFee: 300,
    deposit: 200,
    interior: 180, 
    other: 3000, 
    totalAvg: 7500, 
    totalMax: 8500, 
  },

  ongoingCosts: {
    royalty: '월 150,000원 (VAT 별도)',
    adFee: '가맹점 50% : 본부 50% 분담',
  },

  contract: {
    termInitial: 2,
    termRenewal: 1,
    renewalCost: '없음 (단, 교육비 별도 발생 가능)',
    areaProtection: true,
    areaDesc: '가맹점 반경 500m 내 신규 출점 제한',
    training: {
      days: 5,
      costBearer: '가맹점주 (숙식비 별도)',
      contents: '조리 실습, POS 운영, 서비스 교육'
    },
    marketing: {
      ratio: '본부 50% : 가맹점 50%',
      desc: '신메뉴 출시 프로모션 및 브랜드 TV 광고 집행'
    },
    qualityControl: {
      priceControl: true,
      supplyStandard: '본사 지정 물류 필수 사용'
    }
  }
};