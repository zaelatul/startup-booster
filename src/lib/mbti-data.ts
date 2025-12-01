// web/src/lib/mbti-data.ts

export const MBTI_BANNERS = [
  {
    id: 1,
    title: '내 성향에 딱 맞는 창업 아이템은?',
    subtitle: '데이터로 분석하는 나만의 창업 DNA 찾기',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 2,
    title: '재미로 보는 사장님 유형 테스트',
    subtitle: '나는 리더형일까? 실무형일까? 3분 만에 확인해보세요.',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
  },
];

export type Question = {
  id: number; // number로 통일
  text: string;
  type: 'EI' | 'SN' | 'TF' | 'JP';
  optionA: string;
  optionB: string;
};

export const QUESTIONS: Question[] = [
  { id: 1, type: 'EI', text: '손님이 많은 매장이 좋나요, 조용한 매장이 좋나요?', optionA: '시끌벅적하고 사람 많은 곳에서 에너지가 난다', optionB: '조용한 환경에서 한 분 한 분 집중하는 게 좋다' },
  { id: 2, type: 'EI', text: '홍보와 소통은 어떤 편인가요?', optionA: 'SNS, 단톡방 등에서 적극적으로 홍보할 수 있다', optionB: '필요할 때만 조용히 알리는 편이다' },
  { id: 3, type: 'SN', text: '서비스나 상품을 고를 때 어떤 기준이 더 중요하나요?', optionA: '이미 검증된 베스트셀러나 유명 상품이 더 믿음이 간다', optionB: '새로운 컨셉이나 독특한 아이템을 시도해 보고 싶다' },
  { id: 4, type: 'SN', text: '매장 운영 방식을 생각할 때', optionA: '실제 숫자와 경험 위주로 구체적인 계획을 세운다', optionB: '장기적인 그림과 브랜드의 성장 가능성을 먼저 그려본다' },
  { id: 5, type: 'TF', text: '어려운 결정을 할 때 더 먼저 보는 것은?', optionA: '매출, 비용, 손익 등 객관적인 숫자와 논리', optionB: '직원·고객의 감정, 관계, 매장 분위기' },
  { id: 6, type: 'TF', text: '직원 알바와의 관계에서 더 중요한 것은?', optionA: '명확한 역할 분담과 성과에 따른 보상 구조', optionB: '가족 같은 분위기와 팀워크가 좋은 환경' },
  { id: 7, type: 'JP', text: '하루 일정을 어떻게 운영하는 편인가요?', optionA: '하루 일을 미리 계획하고 체크리스트대로 하는 편이다', optionB: '상황에 따라 유연하게 바꾸며 대응하는 편이다' },
  { id: 8, type: 'JP', text: '새로운 아이템을 도입할 때', optionA: '절차와 매뉴얼을 완벽히 만들고 진행해야 마음이 편하다', optionB: '일단 시도해 보고 반응을 보면서 조정한다' },
];

export type MbtiResult = {
  type: string;
  title: string;
  description: string;
  tags: string[];
  recommend: string[];
};

// [핵심] 16개 유형 전체 데이터
export const MBTI_RESULTS: Record<string, MbtiResult> = {
  'ISTJ': { type: 'ISTJ', title: '신중한 관리자형', description: '책임감이 강하고 현실적입니다. 체계적인 시스템이 갖춰진 안정적인 브랜드를 선호합니다.', tags: ['#원칙주의', '#꼼꼼함'], recommend: ['스터디카페', '편의점', '세탁소'] },
  'ISFJ': { type: 'ISFJ', title: '섬세한 조력자형', description: '성실하고 온화하며 협조적입니다. 고객과의 깊은 유대감을 형성하는 서비스업이 잘 맞습니다.', tags: ['#친절왕', '#세심함'], recommend: ['디저트 카페', '플라워샵', '네일아트'] },
  'INFJ': { type: 'INFJ', title: '통찰력 있는 선지자형', description: '사람에 대한 관심이 많고 통찰력이 뛰어납니다. 가치 지향적인 브랜드나 상담 관련 업종이 어울립니다.', tags: ['#의미추구', '#통찰력'], recommend: ['심리상담센터', '북카페', '친환경샵'] },
  'INTJ': { type: 'INTJ', title: '용의주도한 전략가형', description: '독창적인 아이디어와 비전이 있습니다. 시스템을 구축하고 전략적으로 운영하는 사업이 적합합니다.', tags: ['#전략가', '#시스템'], recommend: ['무인매장', 'IT기반서비스', '컨설팅'] },
  'ISTP': { type: 'ISTP', title: '만능 재주꾼형', description: '손재주가 좋고 도구 사용에 능숙합니다. 기술 기반이나 전문적인 스킬이 필요한 업종에서 두각을 나타냅니다.', tags: ['#기술자', '#효율성'], recommend: ['공방', '수리점', '인테리어'] },
  'ISFP': { type: 'ISFP', title: '호기심 많은 예술가형', description: '미적 감각이 뛰어나고 자유로운 영혼입니다. 감각적인 인테리어가 돋보이는 트렌디한 매장이 잘 맞습니다.', tags: ['#감각적', '#트렌드'], recommend: ['패션쇼룸', '감성카페', '베이커리'] },
  'INFP': { type: 'INFP', title: '열정적인 중재자형', description: '이타적이고 낭만적입니다. 자신의 가치관을 실현할 수 있는 소규모 개인 브랜드나 커뮤니티형 공간이 좋습니다.', tags: ['#진정성', '#스토리'], recommend: ['독립서점', '소품샵', '공방'] },
  'INTP': { type: 'INTP', title: '논리적인 사색가형', description: '지적 호기심이 많고 분석적입니다. 복잡한 문제를 해결하거나 전문 지식을 활용하는 분야가 적합합니다.', tags: ['#분석적', '#아이디어'], recommend: ['전문컨설팅', '보드게임카페', '무인매장'] },
  'ESTP': { type: 'ESTP', title: '수완 좋은 활동가형', description: '에너지가 넘치고 순발력이 뛰어납니다. 유동인구가 많은 곳에서 빠르게 회전되는 요식업이나 판매업이 천직입니다.', tags: ['#행동파', '#장사꾼'], recommend: ['푸드트럭', '주점', '패스트푸드'] },
  'ESFP': { type: 'ESFP', title: '자유로운 영혼의 연예인형', description: '사교적이고 낙천적입니다. 사람들과 어울리는 것을 좋아하며, 분위기를 주도하는 핫플레이스 사장님이 될 수 있습니다.', tags: ['#인싸력', '#분위기'], recommend: ['파티룸', '이색주점', '엔터테인먼트'] },
  'ENFP': { type: 'ENFP', title: '재기발랄한 활동가형', description: '열정적이고 상상력이 풍부합니다. 톡톡 튀는 아이디어로 손님을 끌어모으는 마케팅 천재가 될 자질이 있습니다.', tags: ['#아이디어뱅크', '#열정'], recommend: ['마케팅대행', '이벤트카페', '팝업스토어'] },
  'ENTP': { type: 'ENTP', title: '뜨거운 논쟁을 즐기는 변론가형', description: '도전을 두려워하지 않고 혁신을 추구합니다. 기존 시장의 판도를 뒤집는 새로운 아이템에 도전해보세요.', tags: ['#도전', '#혁신'], recommend: ['스타트업', '신규프랜차이즈', '복합문화공간'] },
  'ESTJ': { type: 'ESTJ', title: '엄격한 관리자형', description: '현실적이고 사실적이며 체계적입니다. 규칙을 준수하고 효율을 극대화하는 대형 프랜차이즈 운영에 최적화되어 있습니다.', tags: ['#관리끝판왕', '#효율'], recommend: ['대형프랜차이즈', '마트', '패스트푸드'] },
  'ESFJ': { type: 'ESFJ', title: '사교적인 외교관형', description: '친절하고 협조적이며 동료애가 많습니다. 고객 서비스가 핵심인 접객업에서 단골을 만드는 능력이 탁월합니다.', tags: ['#서비스마인드', '#친절'], recommend: ['패밀리레스토랑', '뷰티샵', '카페'] },
  'ENFJ': { type: 'ENFJ', title: '정의로운 사회운동가형', description: '카리스마와 충성심을 가지고 사람들을 이끕니다. 직원들과 함께 성장하는 조직 문화를 만드는 데 능숙합니다.', tags: ['#리더십', '#동기부여'], recommend: ['교육사업', '피트니스센터', '대형매장'] },
  'ENTJ': { type: 'ENTJ', title: '대담한 통솔자형', description: '대담하고 상상력이 풍부하며 강한 의지의 소유자입니다. 큰 목표를 세우고 공격적으로 확장하는 사업가 기질이 다분합니다.', tags: ['#사업가', '#확장'], recommend: ['프랜차이즈본사', '부동산', '투자업'] },
  // 안전장치
  'DEFAULT': { type: 'ENTP', title: '열정적인 도전자', description: '당신은 무한한 가능성을 가진 예비 창업가입니다.', tags: ['#도전', '#가능성'], recommend: ['다양한 프랜차이즈 탐색'] }
};

export function calculateMbti(answers: Record<number, string>): MbtiResult {
  let e=0, i=0, s=0, n=0, t=0, f=0, j=0, p=0;
  
  // 질문 개수만큼 반복 (방어 코드 추가)
  QUESTIONS.forEach((q) => {
    const ans = answers[q.id];
    if (!ans) return;
    
    if (q.type === 'EI') ans === 'A' ? e++ : i++;
    if (q.type === 'SN') ans === 'A' ? s++ : n++;
    if (q.type === 'TF') ans === 'A' ? t++ : f++;
    if (q.type === 'JP') ans === 'A' ? j++ : p++;
  });

  const type = [
    e >= i ? 'E' : 'I',
    s >= n ? 'S' : 'N',
    t >= f ? 'T' : 'F',
    j >= p ? 'J' : 'P',
  ].join('');

  return MBTI_RESULTS[type] || MBTI_RESULTS['DEFAULT'];
}