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
  { id: 'western', name: '서양식' },
  { id: 'bakery', name: '베이커리' },
  { id: 'store', name: '편의점/마트' },
  { id: 'beauty', name: '미용/뷰티' },
  { id: 'retail', name: '도소매/유통' },
  { id: 'service', name: '서비스/기타' },
];

// [2] 리스트용 데이터 (생략 없이 유지)
const TOP_BRANDS = [
  {
    id: 'mega-coffee',
    name: '메가커피',
    category: '카페',
    description: '가성비 커피의 선두주자',
    avgSales: 350000, 
    avgSalesPerPyeong: 21000,
    startupCost: 75000, 
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
    avgSales: 450000,
    avgSalesPerPyeong: 28000,
    startupCost: 90000,
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
    avgSales: 550000,
    avgSalesPerPyeong: 31000,
    startupCost: 60000,
    storeCount: 15000,
    profitMargin: 15,
    heroImage: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80',
    tags: ['안정적', '24시간', '대기업'],
    rankChange: 0,
    isHot: false
  }
];

const DUMMY_BRANDS = Array.from({ length: 497 }).map((_, i) => {
  const cats = FRANCHISE_CATEGORIES.slice(1);
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
  const avgSales = ((i * 1234) % 400000) + 150000;
  const avgSalesPerPyeong = Math.floor(avgSales / 15) + (i % 5000); 

  return {
    id: `franchise-${i}`,
    name: `${randomCat.name} 브랜드 ${i + 1}`,
    category: randomCat.name,
    description: '안정적인 수익',
    avgSales: avgSales,
    avgSalesPerPyeong: avgSalesPerPyeong,
    startupCost: ((i * 5678) % 70000) + 30000, 
    storeCount: ((i * 910) % 490) + 10,
    profitMargin: ((i * 11) % 15) + 10,
    heroImage: `${dummyImages[i % 10]}?auto=format&fit=crop&w=800&q=80`,
    tags: ['소자본', '오토운영', '인기'],
    rankChange: (i % 5) - 2,
    isHot: i % 10 === 0
  };
});

export const FRANCHISE_LIST = [...TOP_BRANDS, ...DUMMY_BRANDS];

// [3] 상세 데이터 타입 정의 (기준 평수 단위 변경: baseSizeM2)
export type FranchiseDetail = {
  id: string; name: string; companyName: string; ceoName: string; address: string; contact: string; logoUrl: string; category: string;
  heroImage?: string;
  
  // [NEW] 평균 영업 기간 & 기준 면적(m2)
  avgDuration?: string; 
  baseSizeM2?: number;    // 기존 baseSize(평) 대신 baseSizeM2(제곱미터) 사용

  financials: { year: string; totalSales: number; franchiseSales: number; operatingProfit: number; netProfit: number; }[];
  legalStatus: { hasViolation: boolean; violationDetail?: string; };
  storeTrends: { year: string; newStores: number; closedStores: number; transferStores: number; totalStores: number; }[];
  
  storeSummary: {
    total: number; totalDiff: number; new: number; newDiff: number; closed: number; closedDiff: number;
  };

  regionalStores: { region: string; count: number }[];
  
  avgRevenue: { total: number; perPyeong: number; } | number; 
  
  initialCosts: { 
    joinFee: number; 
    eduFee: number; 
    deposit: number; 
    interior: number; // 평당 단가(천원)
    other: number; 
    totalAvg: number; 
    totalMax: number; 
  };
  ongoingCosts: { royalty: string; adFee: string; };
  contract: { termInitial: number; termRenewal: number; renewalCost: string; areaProtection: boolean; areaDesc: string; training: { days: number; costBearer: string; contents: string; }; marketing: { ratio: string; desc: string; }; qualityControl: { priceControl: boolean; supplyStandard: string; }; };
};

// [4] 상세 더미 데이터 (천원 단위 적용)
export const FRANCHISE_MOCK_DATA: FranchiseDetail = {
  id: 'sample-1',
  name: '메가커피 (MEGA COFFEE)',
  companyName: '(주)앤하우스',
  ceoName: '김대영',
  address: '서울 마포구 동교로',
  contact: '1588-0000',
  logoUrl: 'https://via.placeholder.com/100x100?text=MEGA',
  category: '카페',
  
  // [NEW] 기본값: 50m2 (약 15평)
  avgDuration: "3년 2개월",
  baseSizeM2: 50, 

  financials: [
    { year: '2022', totalSales: 25000000, franchiseSales: 20000000, operatingProfit: 3000000, netProfit: 2500000 },
    { year: '2023', totalSales: 30000000, franchiseSales: 24000000, operatingProfit: 3800000, netProfit: 3200000 },
    { year: '2024', totalSales: 35000000, franchiseSales: 28000000, operatingProfit: 4500000, netProfit: 3800000 },
  ],

  legalStatus: { hasViolation: false, violationDetail: '-' },

  storeTrends: [
    { year: '2022', newStores: 350, closedStores: 8, transferStores: 30, totalStores: 1650 },
    { year: '2023', newStores: 400, closedStores: 10, transferStores: 40, totalStores: 2050 },
    { year: '2024', newStores: 450, closedStores: 12, transferStores: 50, totalStores: 2500 },
  ],

  storeSummary: { total: 2500, totalDiff: 450, new: 450, newDiff: 50, closed: 12, closedDiff: 2 },

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
    total: 345000, 
    perPyeong: 21000, 
  },

  initialCosts: {
    joinFee: 5000,      // 천원
    eduFee: 3000,        
    deposit: 2000,      
    interior: 1800,     // 평당(천원)
    other: 30000,        
    totalAvg: 75000,     
    totalMax: 85000,     
  },

  ongoingCosts: {
    royalty: '월 150,000원 (VAT 별도)',
    adFee: '가맹점 50% : 본부 50% 분담',
  },

  contract: {
    termInitial: 2, termRenewal: 1, renewalCost: '없음 (단, 교육비 별도 발생 가능)',
    areaProtection: true, areaDesc: '가맹점 반경 500m 내 신규 출점 제한',
    training: { days: 5, costBearer: '가맹점주 (숙식비 별도)', contents: '조리 실습, POS 운영, 서비스 교육' },
    marketing: { ratio: '본부 50% : 가맹점 50%', desc: '신메뉴 출시 프로모션 및 브랜드 TV 광고 집행' },
    qualityControl: { priceControl: true, supplyStandard: '본사 지정 물류 필수 사용' }
  }
};