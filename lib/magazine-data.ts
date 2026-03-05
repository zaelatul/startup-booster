// web/src/lib/magazine-data.ts

export type MagazineArticle = {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  date: string;
  readTime: string;
  author: string;
  contentTitle?: string;
  content?: string; // [추가] 비교표 태그 사용을 위한 전체 본문 필드
  contentParagraphs?: string[];
  contentImages?: string[];
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
    title: '2026년 창업 트렌드 리포트',
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

// [매거진 기사 원본]
const SAMPLE_ARTICLES_RAW = [
  {
    id: 'japanese-food-battle-2026', // [신규 추가] 일식 브랜드 비교 기사
    category: '창업 분석',
    title: '막상막하 일식 전문점 창업 대표 브랜드 비교',
    description: '모토이시 vs 후라토식당, 알짜배기 일식 창업의 승자는?',
    thumbnailUrl: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?auto=format&fit=crop&w=800&q=80',
    date: '2026.03.05',
    readTime: '5분',
    author: '창업부스터 에디터',
    content: `비교적 낮은 창업비용과 상대적으로 높은 매출의 일식전문점 두개 브랜드를 비교해 보았습니다.
    
일식 창업은 계절을 타지 않고 꾸준한 수요가 있는 것이 장점입니다. 특히 오늘 비교할 두 브랜드는 각기 다른 매력으로 시장을 점유하고 있습니다. 

[COMPARE: motoishi, furato] 

위 지표에서 보듯 두 브랜드 모두 투자 대비 매출 효율이 매우 높습니다. 모토이시는 와규라는 차별화된 아이템으로 탄탄한 팬층을 확보하고 있고, 후라토식당은 큐카츠와 오므라이스라는 대중적인 메뉴로 안정적인 운영을 보여줍니다.`,
  },
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
    ],
  },
  {
    id: 'mag-2',
    category: '시장 흐름',
    title: '2026년 편의점·카페 상권, 어디까지 포화일까?',
    description: '데이터로 보는 상권 포화도와 아직 기회가 남은 블루오션 지역 분석.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    date: '2025.10.15',
    readTime: '4분',
    author: '박데이터 분석가',
    contentParagraphs: [
      '한 집 건너 편의점, 두 집 건너 카페. 이제 더 이상 들어갈 자리가 없다고 생각하시나요?',
      '하지만 데이터는 다른 이야기를 하고 있습니다. 주거 밀집 지역과 오피스 상권의 경계에 여전히 기회가 있습니다.',
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
      '다시 오픈한 10평짜리 작은 가게가 어떻게 월 매출 4천만 원을 달성하게 되었는지 인터뷰에 담았습니다.',
    ],
  },
];

// [데이터 생성] 30개로 뻥튀기 (무한 스크롤 테스트용)
export const MAGAZINE_ARTICLES: MagazineArticle[] = Array.from({ length: 30 }).map((_, idx) => {
  const original = SAMPLE_ARTICLES_RAW[idx % SAMPLE_ARTICLES_RAW.length];
  return {
    ...original,
    id: `${original.id}-${idx}`, // 고유 ID 부여
  };
});