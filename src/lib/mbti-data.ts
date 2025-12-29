// web/src/lib/mbti-data.ts

// 1. 타입 정의
export type MbtiResult = {
  type: string;
  title: string;
  description: string;
  tags: string[];
  recommend: string[];
};

export type Question = {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  type: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
};

// 2. 배너 데이터 (페이지에서 import해서 씀)
export const MBTI_BANNERS = [
  {
    id: 1,
    title: "나의 창업 MBTI는?",
    subtitle: "성격 유형으로 알아보는 나에게 딱 맞는 프랜차이즈 업종 추천",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 2,
    title: "데이터가 말해주는 성향",
    subtitle: "3분 만에 알아보는 나의 사장님 스타일 분석 보고서",
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=2070&q=80",
  },
];

// 3. 질문 리스트 (12문항)
export const QUESTIONS: Question[] = [
  { id: 1, text: "주말에 친구들과 약속이 취소되었다면?", optionA: "아싸! 집에서 푹 쉬어야지 (혼자만의 시간)", optionB: "아쉽다.. 다른 친구한테 연락해볼까? (나가고 싶음)", type: 'I' }, // A=I, B=E
  { id: 2, text: "새로운 모임에 나갔을 때 나는?", optionA: "먼저 말을 걸고 분위기를 주도한다", optionB: "누가 말 걸기 전까지 조용히 있는다", type: 'E' },
  { id: 3, text: "일할 때 더 선호하는 방식은?", optionA: "혼자 집중해서 처리하는 게 편하다", optionB: "팀원들과 토론하며 진행하는 게 좋다", type: 'I' },
  
  { id: 4, text: "멍 때릴 때 주로 하는 생각은?", optionA: "오늘 저녁 뭐 먹지? (현실적)", optionB: "내가 만약 100억 부자가 된다면? (상상)", type: 'S' },
  { id: 5, text: "가게를 차린다면 더 중요하게 보는 건?", optionA: "정확한 데이터와 입지 분석 (사실)", optionB: "브랜드의 컨셉과 미래 비전 (의미)", type: 'S' },
  { id: 6, text: "업무 지침을 받을 때?", optionA: "구체적이고 명확한 가이드라인이 좋다", optionB: "큰 틀만 주고 자율성을 주는 게 좋다", type: 'S' },

  { id: 7, text: "친구가 힘든 일을 털어놓았을 때?", optionA: "그래서 어떻게 됐어? 해결책을 같이 고민한다", optionB: "헐 어떡해.. 많이 힘들었겠다 ㅠㅠ (공감)", type: 'T' },
  { id: 8, text: "의사결정을 내릴 때 나는?", optionA: "논리적인 근거와 효율성이 우선이다", optionB: "사람들의 감정과 관계가 중요하다", type: 'T' },
  { id: 9, text: "직원을 채용할 때 더 끌리는 사람은?", optionA: "일 잘하고 능력 있는 사람", optionB: "성격 좋고 팀워크 좋은 사람", type: 'T' },

  { id: 10, text: "여행 계획을 짤 때 나는?", optionA: "시간 단위로 엑셀 정리 (철저함)", optionB: "비행기표만 끊고 가서 생각한다 (즉흥)", type: 'J' },
  { id: 11, text: "갑작스러운 일정 변경이 생기면?", optionA: "스트레스 받는다. 계획이 틀어지는 게 싫다", optionB: "오히려 좋아! 새로운 기회일 수도?", type: 'J' },
  { id: 12, text: "책상을 정리하는 스타일은?", optionA: "항상 깔끔하게 정돈되어 있다", optionB: "필요한 건 어딘가에 다 있다 (나만의 질서)", type: 'J' },
];

// 4. 결과 데이터 (16가지 유형)
const RESULTS: Record<string, MbtiResult> = {
  // 분석가형 (NT)
  INTJ: { type: "INTJ", title: "전략가형 사장님", description: "철저한 계획과 전략으로 승부합니다. 시스템이 잘 갖춰진 창업이 어울려요.", tags: ["계획적", "전략", "시스템"], recommend: ["스터디카페", "무인매장", "컨설팅"] },
  INTP: { type: "INTP", title: "연구가형 사장님", description: "남들이 보지 못하는 혁신적인 아이디어로 승부합니다.", tags: ["아이디어", "혁신", "분석"], recommend: ["IT/스타트업", "전문서점", "공방"] },
  ENTJ: { type: "ENTJ", title: "대장부형 사장님", description: "강력한 리더십으로 조직을 이끌고 목표를 달성합니다.", tags: ["리더십", "추진력", "목표"], recommend: ["프랜차이즈 본사", "대형학원", "유통업"] },
  ENTP: { type: "ENTP", title: "발명가형 사장님", description: "끊임없는 도전과 변화를 즐깁니다. 트렌디한 아이템이 딱이에요.", tags: ["도전", "다재다능", "변화"], recommend: ["마케팅 대행", "팝업스토어", "복합문화공간"] },

  // 외교관형 (NF)
  INFJ: { type: "INFJ", title: "옹호자형 사장님", description: "확고한 신념과 가치를 가지고 브랜드를 운영합니다.", tags: ["신념", "통찰력", "가치"], recommend: ["심리상담센터", "독립서점", "친환경샵"] },
  INFP: { type: "INFP", title: "중재자형 사장님", description: "자신만의 감성과 스토리가 담긴 가게를 운영합니다.", tags: ["감성", "예술", "진정성"], recommend: ["감성카페", "플라워샵", "작가공방"] },
  ENFJ: { type: "ENFJ", title: "언변가형 사장님", description: "사람을 이끄는 카리스마와 공감 능력이 뛰어납니다.", tags: ["카리스마", "소통", "영향력"], recommend: ["교육사업", "커뮤니티운영", "게스트하우스"] },
  ENFP: { type: "ENFP", title: "활동가형 사장님", description: "열정적이고 창의적인 에너지로 손님을 끌어당깁니다.", tags: ["열정", "창의", "에너지"], recommend: ["이벤트기획", "테마파크", "파티룸"] },

  // 관리자형 (SJ)
  ISTJ: { type: "ISTJ", title: "현실주의자형 사장님", description: "사실에 근거하여 사고하며, 매뉴얼 준수에 완벽합니다.", tags: ["성실", "책임감", "원칙"], recommend: ["편의점", "세무/회계", "프랜차이즈 가맹점"] },
  ISFJ: { type: "ISFJ", title: "수호자형 사장님", description: "성실하고 온화하게 고객과 직원을 챙깁니다.", tags: ["헌신", "섬세", "안정"], recommend: ["베이커리", "브런치카페", "약국"] },
  ESTJ: { type: "ESTJ", title: "경영자형 사장님", description: "사무적, 실용적, 현실적으로 사업체를 관리합니다.", tags: ["관리", "효율", "규칙"], recommend: ["대형식당", "부동산", "헬스장"] },
  ESFJ: { type: "ESFJ", title: "사교적인 사장님", description: "타고난 협력자로서 친절함으로 단골을 만듭니다.", tags: ["친절", "사교", "서비스"], recommend: ["헤어샵", "네일샵", "레스토랑"] },

  // 탐험가형 (SP)
  ISTP: { type: "ISTP", title: "장인형 사장님", description: "손재주가 뛰어나고 도구 사용에 능숙합니다.", tags: ["기술", "손재주", "독립"], recommend: ["정비소", "목공방", "전문요리점"] },
  ISFP: { type: "ISFP", title: "모험가형 사장님", description: "예술적 감각이 뛰어나고 자유로운 영혼의 소유자입니다.", tags: ["예술", "감각", "여유"], recommend: ["디저트카페", "타투샵", "패션매장"] },
  ESTP: { type: "ESTP", title: "사업가형 사장님", description: "위험을 감수하고 문제를 해결하는 능력이 탁월합니다.", tags: ["수완", "에너지", "즉흥"], recommend: ["영업대행", "스포츠센터", "주점/포차"] },
  ESFP: { type: "ESFP", title: "연예인형 사장님", description: "즉흥적이고 넘치는 에너지로 주변을 즐겁게 합니다.", tags: ["스타성", "유쾌", "매력"], recommend: ["유튜버", "엔터테인먼트", "뷰티샵"] },
};

// 5. 계산 함수 (페이지에서 호출)
export function calculateMbti(answers: Record<number, string>): MbtiResult {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  QUESTIONS.forEach((q) => {
    const answer = answers[q.id];
    if (!answer) return;

    if (q.type === 'E' || q.type === 'I') {
      // 1,2번 문제 등: A선택시 타입 그대로 점수, B선택시 반대 타입 점수
      // 편의상 질문 데이터의 type을 'A선택시 점수'로 간주
      if (answer === 'A') scores[q.type]++;
      else scores[q.type === 'E' ? 'I' : 'E']++;
    } else if (q.type === 'S' || q.type === 'N') {
       if (answer === 'A') scores[q.type]++;
       else scores[q.type === 'S' ? 'N' : 'S']++;
    } else if (q.type === 'T' || q.type === 'F') {
       if (answer === 'A') scores[q.type]++;
       else scores[q.type === 'T' ? 'F' : 'T']++;
    } else if (q.type === 'J' || q.type === 'P') {
       if (answer === 'A') scores[q.type]++;
       else scores[q.type === 'J' ? 'P' : 'J']++;
    }
  });

  const ei = scores.E >= scores.I ? 'E' : 'I';
  const sn = scores.S >= scores.N ? 'S' : 'N';
  const tf = scores.T >= scores.F ? 'T' : 'F';
  const jp = scores.J >= scores.P ? 'J' : 'P';

  const resultType = `${ei}${sn}${tf}${jp}`;
  return RESULTS[resultType] || RESULTS['ISTJ'];
}