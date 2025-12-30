export type CaseImage = {
  url: string;
  label: string;
};

export type CaseItem = {
  id: string;
  brand: string;
  branch: string;
  category: string;
  area: string;
  startupYear: string;
  
  // 리스트용
  monthlySales: string;
  netProfit: string;
  profitMargin: string;
  tags: string[];

  detail: {
    monthlyRevenue: number;
    netProfit: number;
    profitMargin: number;
    investCost: number;
    storeSize: number; // [NEW] 평수
    rent: { deposit: number; monthly: number };
  };

  // [NEW] 3단 콤보 분석 텍스트
  metricsComment?: string; // 1. 상단 핵심 지표 분석 (선택사항 ? 처리)
  quarterComment?: string; // 2. 분기 매출 분석
  // 3. 상권 분석은 footTraffic 안에 comment로 이미 있음

  summary: string;
  successPoint: string;
  ownerComment: string;
  
  mainImage: string;
  storeImages: CaseImage[];
  menuImages: CaseImage[];

  quarterlyRevenue: { name: string; value: number }[];

  footTraffic: {
    dailyAvg: number;
    trafficLevel: string;
    competitors: number;
    competitorLevel: string;
    comment: string; // 여기가 상권 분석 텍스트
    lat: number;
    lng: number;
    weekRatio: { name: string; value: number }[];
    dayRatio: { day: string; value: number }[];
    timeRatio: { time: string; value: number }[];
  };
};

const ORIGINAL_CASES: CaseItem[] = [
  {
    id: 'mega-gangnam',
    brand: '메가커피',
    branch: '강남역삼점',
    category: '카페',
    area: '서울 강남구 역삼동',
    monthlySales: '5,800만원',
    netProfit: '1,250만원',
    profitMargin: '21.5%',
    startupYear: '2022년 05월',
    tags: ['오피스상권', '직장인', '박리다매'],
    
    detail: {
      monthlyRevenue: 5800,
      netProfit: 1250,
      profitMargin: 21.5,
      investCost: 15000,
      storeSize: 15, 
      rent: { deposit: 5000, monthly: 250 }
    },

    // [NEW] 분석 텍스트 예시 추가
    metricsComment: "15평 매장에서 월 5,800만원 매출은 상위 1% 효율입니다. 임대료(250만원) 비중이 4.3%로 매우 낮아 높은 순수익(1,250만원) 방어가 가능했습니다.",
    
    summary: '오피스 상권의 폭발적인 점심 수요를 흡수한 저가 커피 신화',
    successPoint: '회전율 극대화 전략과 키오스크 3대 운영',
    ownerComment: '오피스 상권 특성상 평일 점심 장사에 모든 걸 걸어야 합니다. 임대료가 낮은 이면도로를 선택한 대신, 배달 깃발을 공격적으로 꽂아 저녁 매출을 보완했습니다.',

    mainImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200',
    storeImages: [
      { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800', label: '매장 전경' },
      { url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800', label: '카운터' }
    ],
    menuImages: [
      { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600', label: '아메리카노' },
      { url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600', label: '라떼' },
      { url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600', label: '디저트' },
      { url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600', label: '시그니처' }
    ],

    quarterlyRevenue: [
      { name: '1분기', value: 4200 },
      { name: '2분기', value: 5500 },
      { name: '3분기', value: 5800 },
      { name: '4분기', value: 4500 },
    ],
    quarterComment: "여름 성수기(2~3분기)에 아이스 음료 판매량이 급증하며 매출이 30% 이상 상승하는 패턴을 보입니다.",

    footTraffic: {
      dailyAvg: 15400,
      trafficLevel: '매우 붐빔', 
      competitors: 12,
      competitorLevel: '치열', 
      comment: "평일 점심시간(11:00~14:00)에 오피스 인구가 폭발적으로 유입되는 전형적인 오피스 상권입니다. 경쟁점은 많지만 유동인구 자체가 워낙 풍부해 나눠먹기가 가능합니다.",
      lat: 37.4979, 
      lng: 127.0276,
      weekRatio: [{ name: '주중', value: 75 }, { name: '주말', value: 25 }],
      dayRatio: [{ day: '월', value: 18 }, { day: '화', value: 18 }, { day: '수', value: 17 }, { day: '목', value: 17 }, { day: '금', value: 20 }, { day: '토', value: 6 }, { day: '일', value: 4 }],
      timeRatio: [{ time: '09~13', value: 45 }, { time: '13~17', value: 25 }, { time: '17~21', value: 15 }, { time: '21~01', value: 15 }],
    }
  },
  {
    id: 'bbq-suwon',
    brand: 'BBQ치킨',
    branch: '수원영통점',
    category: '치킨',
    area: '경기 수원시 영통구',
    monthlySales: '4,500만원',
    netProfit: '1,100만원',
    profitMargin: '24%',
    startupYear: '2023년 01월',
    tags: ['배달특화', '소자본창업', '주거상권'],
    detail: {
        monthlyRevenue: 4500,
        netProfit: 1100,
        profitMargin: 24,
        investCost: 9500,
        storeSize: 12,
        rent: { deposit: 3000, monthly: 120 }
    },
    
    metricsComment: "12평 소형 매장에서 배달 위주 운영으로 임대료를 절감하여 24%라는 높은 수익률을 달성했습니다.",

    summary: '배달 비중 90%로 임대료 부담을 줄인 실속형 매장',
    successPoint: 'A급 상권을 포기하고, 배달 대행 거점이 가까운 입지 선택',
    ownerComment: '홀 영업을 과감하게 줄이고 배달에만 집중했습니다.',
    mainImage: 'https://images.unsplash.com/photo-1513639776629-7b611594e29b?q=80&w=1200',
    storeImages: [], menuImages: [],
    quarterlyRevenue: [
        { name: '1분기', value: 4000 }, { name: '2분기', value: 4200 }, { name: '3분기', value: 4800 }, { name: '4분기', value: 5000 }
    ], 
    quarterComment: '연말 모임과 스포츠 이벤트가 있는 4분기에 매출이 가장 높습니다.',
    footTraffic: {
      dailyAvg: 5000, trafficLevel: '보통',
      competitors: 20, competitorLevel: '치열',
      comment: '배달 수요가 높은 주거 밀집 지역으로, 유동인구보다는 세대수와 배달앱 노출 빈도가 중요합니다.', 
      lat: 37.2520, lng: 127.0713,
      weekRatio: [{name:'주중',value:40},{name:'주말',value:60}],
      dayRatio: [{day:'월',value:10},{day:'화',value:10},{day:'수',value:10},{day:'목',value:10},{day:'금',value:20},{day:'토',value:30},{day:'일',value:10}], 
      timeRatio: [{ time: '09~13', value: 5 }, { time: '13~17', value: 15 }, { time: '17~21', value: 50 }, { time: '21~01', value: 30 }]
    }
  }
];

const CATEGORY_LIST = ['한식', '일식', '중식', '치킨', '카페', '분식', '호프/주점', '버거/피자', '베이커리', '편의점/마트', '화장품', '미용/뷰티', '의류/패션', '도소매/유통', '서비스/기타'];

// 더미 데이터 1000개 생성 (이 부분이 있어야 화면에 데이터가 나옵니다!)
export const CASES: CaseItem[] = Array.from({ length: 1000 }).map((_, i) => {
  const original = ORIGINAL_CASES[i % ORIGINAL_CASES.length];
  const randomCategory = i < 3 ? original.category : CATEGORY_LIST[i % CATEGORY_LIST.length];
  return {
    ...original,
    id: `${original.id}-${i}`, // 예: mega-gangnam-0
    branch: i < 3 ? original.branch : `${original.brand} ${i+1}호점`,
    category: randomCategory
  };
});