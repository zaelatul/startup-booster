export type TabKey = 'wall' | 'floor';

export type PromoBanner = {
  id: string;
  title: string;
  description: string;
  tag: string;
  imageUrl: string;
};

export type ProductVisual = {
  id: string;
  name: string;
  tag: string;
  imageUrl: string;
  // 상세 모달을 위한 추가 정보 (가상)
  description?: string;
  spec?: string;
};

export type CaseVisual = {
  id: string;
  title: string;
  imageUrl: string;
};

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'franchise',
    title: '프랜차이즈 인테리어 패키지',
    description: '동일 콘셉트 매장을 여러 개 운영할 때, 셀프 시공 구간을 분리하면 초기 비용을 크게 줄일 수 있습니다.',
    tag: '프랜차이즈 제휴 안내',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'self-wall',
    title: '벽면 셀프 시공만으로도 분위기 확 바꾸기',
    description: '소프트스톤, 데코 패널 등 벽면만 먼저 손보는 셀프 시공으로 전체 인테리어 느낌을 바꿔보세요.',
    tag: '소프트스톤 · 데코 패널',
    imageUrl: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'self-floor',
    title: '데코타일로 바닥 셀프 시공',
    description: '기존 바닥 철거 없이 올려 시공하는 방식으로, 공사 기간과 비용을 동시에 줄일 수 있습니다.',
    tag: '데코타일 셀프 시공',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
  },
];

export const WALL_PRODUCTS: ProductVisual[] = [
  {
    id: 'wall-1',
    name: '무광 소프트스톤 화이트',
    tag: '조용한 카페 · 사무실 벽면',
    imageUrl: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=80',
    description: '차분하고 고급스러운 분위기를 연출하는 무광 화이트 스톤입니다. 오염에 강하고 관리가 쉽습니다.',
    spec: '규격: 600x600mm / 두께: 12mm',
  },
  {
    id: 'wall-2',
    name: '텍스처 소프트스톤 그레이',
    tag: '브랜드 매장 포토존',
    imageUrl: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=800&q=80',
    description: '거친 질감이 살아있는 그레이 톤의 스톤으로, 인더스트리얼 무드의 포토존에 적합합니다.',
    spec: '규격: 300x600mm / 두께: 15mm',
  },
  {
    id: 'wall-3',
    name: '라인 패턴 데코 패널',
    tag: '카운터·벽면 포인트',
    imageUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
    description: '세로 라인 패턴이 공간을 더 높아 보이게 만듭니다. 카운터 하단이나 포인트 벽면에 추천합니다.',
    spec: '규격: 1200x2400mm / 두께: 9mm',
  },
  {
    id: 'wall-4',
    name: '우드톤 소프트스톤',
    tag: '따뜻한 감성 매장',
    imageUrl: 'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?auto=format&fit=crop&w=800&q=80',
    description: '나무의 따뜻한 질감을 스톤으로 재현했습니다. 내구성이 뛰어나면서도 아늑한 느낌을 줍니다.',
    spec: '규격: 150x900mm / 두께: 10mm',
  },
  {
    id: 'wall-5',
    name: '마이크로 시멘트 그레이',
    tag: '모던 인더스트리얼',
    imageUrl: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=800&q=80',
    description: '시크하고 모던한 콘크리트 질감을 연출합니다. 카페나 스튜디오 바닥 및 벽면에 인기입니다.',
    spec: '시공 방식: 미장 / 용량: 18kg',
  },
  {
    id: 'wall-6',
    name: '포인트 컬러 패널',
    tag: '브랜드 컬러 포인트',
    imageUrl: 'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?auto=format&fit=crop&w=800&q=80',
    description: '브랜드 아이덴티티를 강조할 수 있는 다채로운 컬러 패널입니다.',
    spec: '규격: 주문 제작 가능',
  },
];

export const FLOOR_PRODUCTS: ProductVisual[] = [
  {
    id: 'floor-1',
    name: '헤링본 데코타일 우드',
    tag: '카페 · 편의점 바닥',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
    description: '클래식한 헤링본 패턴으로 공간에 깊이감을 더해줍니다. 내구성이 좋아 상업 공간에 적합합니다.',
    spec: '규격: 100x600mm / 박스당 3.3㎡',
  },
  {
    id: 'floor-2',
    name: '논슬립 스톤 패턴',
    tag: '주방 · 물 사용 구역',
    imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80',
    description: '미끄럼 방지 코팅이 되어 있어 주방이나 입구 쪽에 시공하기 좋습니다.',
    spec: '규격: 450x450mm / 박스당 3.3㎡',
  },
  {
    id: 'floor-3',
    name: '모던 콘크리트 패턴',
    tag: '미니멀 인테리어',
    imageUrl: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=800&q=80',
    description: '차가운 콘크리트 느낌을 주어 세련된 분위기를 연출합니다.',
    spec: '규격: 600x600mm / 박스당 3.3㎡',
  },
  {
    id: 'floor-4',
    name: '체크 패턴 타일',
    tag: '포인트 존 바닥',
    imageUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
    description: '레트로한 감성의 체크 패턴입니다. 매장 입구 포인트로 활용하기 좋습니다.',
    spec: '규격: 300x300mm / 박스당 3.3㎡',
  },
  {
    id: 'floor-5',
    name: '라이트 그레이 데코타일',
    tag: '깔끔한 베이커리',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
    description: '밝고 깨끗한 느낌을 주어 좁은 매장을 넓어 보이게 합니다.',
    spec: '규격: 450x450mm / 박스당 3.3㎡',
  },
  {
    id: 'floor-6',
    name: '다크 우드 패턴',
    tag: '와인바 · 라운지',
    imageUrl: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=80',
    description: '중후하고 고급스러운 분위기를 연출하는 어두운 우드 패턴입니다.',
    spec: '규격: 150x900mm / 박스당 3.3㎡',
  },
];

export const WALL_CASES: CaseVisual[] = [
  {
    id: 'wall-case-1',
    title: '소프트스톤 벽면 카페 시공',
    imageUrl: 'https://images.unsplash.com/photo-1507120410856-1f35574c3b45?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'wall-case-2',
    title: '사무실 회의실 포인트 벽',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'wall-case-3',
    title: '브랜드 포토존 연출',
    imageUrl: 'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'wall-case-4',
    title: '작은 매장 벽면 리모델링',
    imageUrl: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1000&q=80',
  },
];

export const FLOOR_CASES: CaseVisual[] = [
  {
    id: 'floor-case-1',
    title: '카페 바닥 데코타일 시공',
    imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'floor-case-2',
    title: '편의점 상권 바닥 교체',
    imageUrl: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'floor-case-3',
    title: '베이커리 바닥 리뉴얼',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'floor-case-4',
    title: '미니멀 바닥 콘셉트',
    imageUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1000&q=80',
  },
];