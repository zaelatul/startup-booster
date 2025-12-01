export type MagazineArticle = {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string; // 리스트용 썸네일
  date: string;
  readTime: string;
  author: string;
  // 상세 페이지용 데이터
  contentTitle?: string;
  contentParagraphs: string[]; // 본문 단락들
  contentImages: string[]; // 본문 중간에 들어갈 이미지들
};

export type PromoBanner = {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
};

// [상단 롤링 배너 데이터]
export const MAGAZINE_BANNERS: PromoBanner[] = [
  {
    id: 'banner-1',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=2070&q=80',
    title: '2025년 창업 트렌드 리포트',
    subtitle: '성공하는 사장님들은 미리 준비하는 내년도 핵심 키워드 5선',
    link: '/magazine/mag-1',
  },
  {
    id: 'banner-2',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2070&q=80',
    title: '소자본 창업의 정석',
    subtitle: '3천만원으로 시작해 월 매출 5천만원 만든 현실적인 방법',
    link: '/magazine/mag-2',
  },
  {
    id: 'banner-3',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2070&q=80',
    title: '프랜차이즈 계약 전 필수 체크리스트',
    subtitle: '도장 찍기 전에 이것만 확인해도 폐업 확률 절반으로 뚝!',
    link: '/magazine/mag-3',
  },
];

// [매거진 기사 목록 데이터] (상세 내용 포함)
// 더보기 테스트를 위해 데이터를 충분히 생성
const SAMPLE_ARTICLES_RAW = [
  {
    id: 'mag-1',
    category: '뜨는 브랜드',
    title: '점포 수는 적지만 매출 지표가 예쁜 브랜드 5선',
    description: '광고비 대신 재료비에 투자하는 알짜배기 브랜드들을 소개합니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    date: '2025.10.20',
    readTime: '6분',
    author: '김창업 에디터',
    contentParagraphs: [
      '창업 시장에서 "유명한 브랜드"가 꼭 "돈 잘 버는 브랜드"는 아닙니다. 화려한 마케팅 뒤에 숨겨진 진짜 실속 있는 브랜드들은 따로 있죠.',
      '오늘은 점포 수는 50개 미만이지만, 점포당 평균 매출은 대형 프랜차이즈를 상회하는 "강소 브랜드" 5곳을 집중 분석했습니다.',
      '이들의 공통점은 무엇일까요? 바로 "재방문율"입니다. 한 번 온 손님을 단골로 만드는 그들만의 디테일한 전략을 파헤쳐 봅니다.',
    ],
    contentImages: [
      'https://images.unsplash.com/photo-1559925393-8be15074f927?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'mag-2',
    category: '시장 흐름',
    title: '2025년 편의점·카페 상권, 어디까지 포화일까?',
    description: '데이터로 보는 상권 포화도와 아직 기회가 남은 블루오션 지역 분석.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    date: '2025.10.15',
    readTime: '4분',
    author: '박데이터 분석가',
    contentParagraphs: [
      '한 집 건너 편의점, 두 집 건너 카페. 이제 더 이상 들어갈 자리가 없다고 생각하시나요?',
      '하지만 데이터는 다른 이야기를 하고 있습니다. 주거 밀집 지역과 오피스 상권의 경계, 그리고 새롭게 뜨는 신도시 상권에는 여전히 공급이 수요를 따라가지 못하는 구간이 존재합니다.',
      '이번 리포트에서는 소상공인 시장 진흥공단의 최신 데이터를 기반으로, 경쟁 강도가 낮으면서도 유동 인구가 꾸준히 증가하는 "히든 상권"을 지도와 함께 공개합니다.',
    ],
    contentImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'mag-3',
    category: '성공 인터뷰',
    title: '폐업 후 다시 치킨집, 두 번째 창업에서 달라진 점',
    description: '첫 실패를 딛고 일어선 사장님의 솔직한 회고록. "이것만 알았더라면..."',
    thumbnailUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    date: '2025.09.10',
    readTime: '8분',
    author: '이현장 기자',
    contentParagraphs: [
      '"첫 가게는 제 욕심으로 채웠고, 두 번째 가게는 손님의 욕심으로 채웠습니다."',
      '3년 전, 호기롭게 시작했던 첫 치킨집이 1년 만에 문을 닫았을 때 김철수 사장님은 빚 5천만 원만 남았다고 합니다. 하지만 포기하지 않고 배달 기사로 일하며 2년간 상권을 다시 공부했죠.',
      '다시 오픈한 10평짜리 작은 가게가 어떻게 월 매출 4천만 원을 달성하게 되었는지, 그 처절하고도 생생한 재기 성공기를 인터뷰에 담았습니다.',
    ],
    contentImages: [
      'https://images.unsplash.com/photo-1513639776629-7b611594629b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'mag-4',
    category: '브랜드 인사이트',
    title: '배달 의존도 낮은 동네 밀착형 F&B가 뜨는 이유',
    description: '배달비 부담 없는 홀 매출 90% 맛집들의 비밀 레시피.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    date: '2025.09.30',
    readTime: '5분',
    author: '최트렌드 에디터',
    contentParagraphs: [
      '배달 앱 수수료 인상 이슈로 인해, 다시금 "홀 영업"에 집중하는 브랜드들이 주목받고 있습니다.',
      '동네 사랑방 역할을 자처하며, 슬리퍼 신고 편하게 들를 수 있는 코지(Cozy)한 인테리어와 가성비 메뉴로 승부하는 곳들이죠.',
    ],
    contentImages: [
      'https://images.unsplash.com/photo-1542125387-c71274d94f0a?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'mag-5',
    category: '시장 흐름',
    title: '임대료는 올랐는데 매출은 그대로인 골목, 탈출 전략은?',
    description: '젠트리피케이션 위기, 옮길까 버틸까? 데이터로 판단하는 기준.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=800&q=80',
    date: '2025.09.28',
    readTime: '5분',
    author: '정부동산 전문가',
    contentParagraphs: [
      '임대료 상승은 자영업자에게 가장 큰 고정비 리스크입니다. 하지만 무작정 가게를 옮기는 것도 능사는 아닙니다.',
    ],
    contentImages: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

// 데이터를 뻥튀기하여 무한 스크롤 테스트 (30개로 증식)
export const MAGAZINE_ARTICLES: MagazineArticle[] = Array.from({ length: 30 }).map((_, idx) => {
  const original = SAMPLE_ARTICLES_RAW[idx % SAMPLE_ARTICLES_RAW.length];
  return {
    ...original,
    id: `${original.id}-${idx}`, // 고유 ID 생성
  };
});