// web/src/lib/reco.ts

export type AnyBrand = any;

export const POPULAR_FRANCHISES = [
  {
    id: 'pop-1',
    name: '요거트월드',
    category: '디저트',
    slogan: 'MZ세대가 선택한 프리미엄 요거트',
    
    // [신규 필드 추가]
    concept: '취향대로 조합하는 커스텀 그릭요거트', // 브랜드 컨셉
    targetLayer: '트렌드에 민감한 2030 여성',      // 주 소비층

    avgSales: 300000000,
    netProfit: 8000000,
    profitMargin: 32.0,
    startupCostTotal: 45000000,
    openRate: 100.0,
    closeRate: 0.0,
    storesTotal: 150,

    brandStoryTitle: '건강함과 달콤함의 완벽한 조화',
    brandStory: `요거트월드는 "나를 위한 건강한 사치"라는 슬로건 아래 2021년 시작되었습니다.\n\n단순한 디저트가 아닌, SNS에 공유하고 싶은 비주얼과 건강을 동시에 잡은 것이 고속 성장의 비결입니다.`,

    hqName: '요거트월드 본사',
    hqPhone: '02-1234-5678',
    hqEmail: 'contact@yogurtworld.com',
    hqAddress: '서울 마포구 동교로 123',
    establishedYear: 2021,
    url: 'http://example.com',

    mainImage: 'https://images.unsplash.com/photo-1488477181946-6428a029177b?q=80&w=1200',
    description: '배달 플랫폼 디저트 카테고리 1위! 계절을 타지 않는 꾸준한 매출이 강점입니다.',
    successPoints: ['높은 객단가 (평균 2만원)', '간편한 토핑 시스템', '재고 관리 용이'],
    growthRate: [10, 15, 25, 40, 60, 85],
    storeTrend: [{ year: 2021, count: 20 }, { year: 2022, count: 50 }, { year: 2023, count: 150 }],
    
    storeImages: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=600',
      'https://images.unsplash.com/photo-1550614000-4b9519e0034a?q=80&w=600',
      'https://images.unsplash.com/photo-1488477181946-6428a029177b?q=80&w=600',
      'https://images.unsplash.com/photo-1517643312965-06d2890db7f9?q=80&w=600'
    ],
    menus: [] 
  },
  {
    id: 'pop-2',
    name: '컴포즈커피',
    category: '카페',
    slogan: '전국민이 사랑하는 대용량 커피',
    
    // [신규 필드 추가]
    concept: '자체 로스팅 원두 기반의 고품질 저가 커피',
    targetLayer: '데일리 커피를 즐기는 직장인/학생',

    avgSales: 250000000,
    netProfit: 6020000,
    profitMargin: 21.5,
    startupCostTotal: 55000000,
    openRate: 26.4,
    closeRate: 0.8,
    storesTotal: 2300,

    brandStoryTitle: '합리적인 가격, 타협하지 않는 품질',
    brandStory: `매일 마시는 커피, 왜 비싸야 할까요? 컴포즈커피는 자체 로스팅 공장을 통해 유통 마진을 획기적으로 줄였습니다.`,

    hqName: '컴포즈커피(주)',
    hqPhone: '1588-0000',
    hqEmail: 'franchise@compose.com',
    hqAddress: '서울 강남구 테헤란로',
    establishedYear: 2014,
    url: 'http://example.com',

    mainImage: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1200',
    description: '압도적인 브랜드 인지도와 저가 커피 시장 점유율 1위.',
    successPoints: ['자체 로스팅 공장 운영', '테이크아웃 최적화 동선', '마케팅비 본사 지원'],
    growthRate: [5, 10, 15, 20, 22, 25],
    storeTrend: [{ year: 2021, count: 1200 }, { year: 2022, count: 1800 }, { year: 2023, count: 2300 }],
    
    storeImages: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=800'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600',
      'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=600',
      'https://images.unsplash.com/photo-1579306094722-608f533098e0?q=80&w=600',
      'https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=600'
    ],
    menus: []
  },
  // ... (나머지 8개도 동일하게 복제됨)
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `pop-${i+3}`,
    name: `인기 브랜드 ${i+3}`,
    category: '외식업',
    slogan: '성공 창업의 확실한 선택',
    
    // [신규 필드 더미]
    concept: '차별화된 맛과 가성비를 갖춘 외식 브랜드',
    targetLayer: '가성비를 중시하는 2040 세대',

    avgSales: 200000000 + (i * 10000000),
    netProfit: 5000000 + (i * 500000),
    profitMargin: 20 + i,
    startupCostTotal: 50000000 + (i * 5000000),
    openRate: 15.0,
    closeRate: 2.5,
    storesTotal: 100 + (i * 50),
    
    brandStoryTitle: '가맹점과의 동반 성장을 꿈꿉니다',
    brandStory: '오랜 현장 경험을 바탕으로, 초보 창업자도 쉽게 운영할 수 있는 시스템을 구축했습니다.',
    
    hqName: '성공 본사', hqPhone: '1588-9999', hqEmail: 'help@success.com', hqAddress: '서울시 강남구', establishedYear: 2018, url: '#',
    mainImage: `https://source.unsplash.com/random/1200x800?restaurant&sig=${i}`,
    description: '안정적인 수익 구조와 체계적인 교육 시스템을 갖춘 유망 프랜차이즈입니다.',
    successPoints: ['소자본 창업 가능', '초보자도 쉬운 운영', '높은 재방문율'],
    growthRate: [10, 20, 30, 40, 50, 60],
    storeTrend: [{ year: 2021, count: 50 }, { year: 2022, count: 80 }, { year: 2023, count: 100 + i*50 }],
    storeImages: [
      `https://source.unsplash.com/random/800x600?store&sig=${i}`,
      `https://source.unsplash.com/random/800x600?interior&sig=${i}`
    ],
    menuImages: [
      `https://source.unsplash.com/random/600x600?food&sig=${i}`,
      `https://source.unsplash.com/random/600x600?dessert&sig=${i}`,
      `https://source.unsplash.com/random/600x600?meal&sig=${i}`,
      `https://source.unsplash.com/random/600x600?snack&sig=${i}`
    ],
    menus: []
  }))
];

export const BRANDS = [...POPULAR_FRANCHISES];