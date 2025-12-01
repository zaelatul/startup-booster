// web/src/lib/cases.ts

export type CaseItem = {
  id: string;
  brand: string;
  branch: string;
  area: string;
  monthlySales: string; 
  netProfit: string;    
  profitMargin: string; 
  investCost: string;   
  startupYear: string;  
  areaGrade: 'S' | 'A' | 'B'; 
  salesRatio: { hall: number; delivery: number }; 
  mainImage: string;    
  storeImages: string[]; // 매장 2장
  menuImages: string[];  // 메뉴 4장
  summary: string;
  successPoint: string;
  interview: string;
  tags: string[];
};

const ORIGINAL_CASES: CaseItem[] = [
  {
    id: 'oliveyoung-gangnam',
    brand: '올리브영',
    branch: '강남역점',
    area: '서울 강남구 역삼동',
    monthlySales: '9,200만원',
    netProfit: '1,850만원',
    profitMargin: '20%',
    investCost: '2억 5,000만원',
    startupYear: '2021',
    areaGrade: 'S',
    salesRatio: { hall: 95, delivery: 5 },
    summary: '2030 여성 유동인구가 끊이지 않는 뷰티 핫플레이스',
    successPoint: '퇴근 시간대 집중적인 프로모션과 체험형 매대 배치',
    interview: '높은 임대료가 부담스러웠지만, S급 상권의 압도적인 유동인구를 믿었습니다.',
    mainImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200',
    storeImages: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=800',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=600',
      'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=600',
      'https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=600',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600'
    ],
    tags: ['초대형상권', '2030여성', '오토운영'],
  },
  {
    id: 'bbq-suwon',
    brand: 'BBQ치킨',
    branch: '수원영통점',
    area: '경기 수원시 영통구',
    monthlySales: '4,500만원',
    netProfit: '1,100만원',
    profitMargin: '24%',
    investCost: '9,500만원',
    startupYear: '2023',
    areaGrade: 'B',
    salesRatio: { hall: 10, delivery: 90 },
    summary: '배달 비중 90%로 임대료 부담을 줄인 실속형 매장',
    successPoint: 'A급 상권을 포기하고, 배달 대행 거점이 가까운 입지 선택',
    interview: '홀 영업을 과감하게 줄이고 배달에만 집중했습니다.',
    mainImage: 'https://images.unsplash.com/photo-1513639776629-7b611594e29b?q=80&w=1200',
    storeImages: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800'
    ],
    menuImages: [
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600',
      'https://images.unsplash.com/photo-1562967963-ed7858c77c64?q=80&w=600',
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=600',
      'https://images.unsplash.com/photo-1598103442097-8b7407275666?q=80&w=600'
    ],
    tags: ['배달특화', '소자본창업', '주거상권'],
  },
  // ... (다른 데이터 생략, 구조 동일)
];

// 데이터 20개로 뻥튀기 (더보기 버튼용)
export const CASES: CaseItem[] = Array.from({ length: 20 }).map((_, i) => {
  const original = ORIGINAL_CASES[i % ORIGINAL_CASES.length];
  return {
    ...original,
    id: `${original.id}-${i}`,
    branch: i < 2 ? original.branch : `${original.brand} ${i+1}호점`
  };
});