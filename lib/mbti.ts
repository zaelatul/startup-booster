// lib/mbti.ts — 질문/가중치/알고리즘 모듈

export type Axis = "EI" | "SN" | "TF" | "JP";
export type Choice = 1 | 2 | 3 | 4 | 5;

export type MbtiQuestion = {
  id: string;
  axis: Axis;               // EI/SN/TF/JP
  pos: "first" | "second";  // first=E/S/T/J, second=I/N/F/P
  text: string;
  weight?: number;          // 중요 문항 가중치(기본 1)
};

// 질문은행(원하면 이 JSON만 교체)
export const QUESTION_BANK: MbtiQuestion[] = [
  // EI (3)
  { id: "Q1", axis: "EI", pos: "first",  text: "사람을 자주 만나며 일할 때 힘이 난다.", weight: 1.2 },
  { id: "Q2", axis: "EI", pos: "second", text: "혼자 집중해서 정리·분석하는 시간이 더 좋다." },
  { id: "Q3", axis: "EI", pos: "first",  text: "현장 소통·영업이 즐겁다." },
  // SN (2)
  { id: "Q4", axis: "SN", pos: "first",  text: "수치·데이터 같은 '현재 사실'을 중시한다." },
  { id: "Q5", axis: "SN", pos: "second", text: "새로운 아이디어·트렌드에 빠르게 반응한다." },
  // TF (3)
  { id: "Q6", axis: "TF", pos: "first",  text: "결정은 손익(숫자) 기준이 더 편하다." },
  { id: "Q7", axis: "TF", pos: "second", text: "고객·직원의 감정/경험을 우선 고려한다." },
  { id: "Q8", axis: "TF", pos: "first",  text: "가격·원가·마진 계산이 재미있다." },
  // JP (2)
  { id: "Q9", axis: "JP", pos: "first",  text: "체계·매뉴얼·체크리스트대로 움직이는 게 좋다." },
  { id: "Q10", axis: "JP", pos: "second", text: "상황 보며 유연하게 바꾸는 편이 맞다." },
];

export const DESC_MAP: Record<string, string> = {
  ESTJ: "데이터와 시스템 중심의 운영형 창업가",
  ESTP: "현장 실행·적응이 빠른 실전형 창업가",
  ESFJ: "고객 경험과 팀 케어에 강한 서비스형 창업가",
  ESFP: "트렌드와 소통에 강한 체험형 창업가",
  ENTJ: "목표·수익 관리에 강한 리더형 창업가",
  ENTP: "새로운 조합과 실험을 즐기는 혁신형 창업가",
  ENFJ: "브랜딩·커뮤니케이션에 강한 코치형 창업가",
  ENFP: "아이디어·네트워킹이 강한 확산형 창업가",
  ISTJ: "규율·매뉴얼 중심의 효율형 창업가",
  ISTP: "문제 해결·개선에 강한 기술형 창업가",
  ISFJ: "세심한 서비스와 안정 운영 지향",
  ISFP: "감각·경험 기반의 따뜻한 운영 지향",
  INTJ: "전략·구조 설계에 강한 설계형 창업가",
  INTP: "분석·모델링에 강한 연구형 창업가",
  INFJ: "가치·미션 중심의 공감형 창업가",
  INFP: "스토리·브랜딩에 강한 감수성형 창업가",
};

// 축 점수 계산
export function scoreAxes(answers: Record<string, Choice>) {
  const axes: Record<Axis, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
  for (const q of QUESTION_BANK) {
    const v = answers[q.id];
    if (!v) continue;
    const w = q.weight ?? 1;
    const unit = ((v - 3) / 2) * w; // 1..5 -> -1..+1, 가중치 반영
    axes[q.axis] += q.pos === "first" ? unit : -unit;
  }
  return axes;
}

// 축 → 타입
export function axesToType(a: Record<Axis, number>) {
  return (a.EI >= 0 ? "E" : "I") + (a.SN >= 0 ? "S" : "N") + (a.TF >= 0 ? "T" : "F") + (a.JP >= 0 ? "J" : "P");
}

// 업종 추천(근거 점수 포함)
export function recommend(a: Record<Axis, number>) {
  const score = { Retail: 0, "F&B": 0, Service: 0 } as Record<"Retail" | "F&B" | "Service", number>;
  // 근거 규칙: E/S/T/J → Retail 가점, E/S/P → F&B 가점, I/N/F/J → Service 가점
  score.Retail += Math.max(0, a.EI) * 2 + Math.max(0, a.SN) + Math.max(0, a.TF) + Math.max(0, a.JP);
  score["F&B"] += Math.max(0, a.EI) * 2 + Math.max(0, a.SN) + Math.max(0, -a.JP);
  score.Service += Math.max(0, -a.EI) * 2 + Math.max(0, -a.SN) + Math.max(0, -a.TF) + Math.max(0, a.JP);

  const ordered = (Object.keys(score) as Array<"Retail" | "F&B" | "Service">).sort((x, y) => score[y] - score[x]);
  const why = {
    Retail:  `E/S/T/J 비중이 높음 → 매뉴얼·현장 중심 적합 (점수 ${score.Retail.toFixed(2)})`,
    "F&B":   `E/S와 유연성(P) 성향 → 실전/적응형 적합 (점수 ${score["F&B"].toFixed(2)})`,
    Service: `I/N/F 및 체계(J) 성향 → 상담/케어형 적합 (점수 ${score.Service.toFixed(2)})`,
  };
  return { ordered, score, why };
}

// 답변 → 최종 결과
export function computeFromAnswers(answers: Record<string, Choice>) {
  const axes = scoreAxes(answers);
  const type = axesToType(axes);
  const { ordered } = recommend(axes);
  return {
    type,
    description: DESC_MAP[type] || "당신의 강점을 살린 창업 스타일입니다.",
    recommended: ordered.slice(0, 2) as Array<"Retail" | "F&B" | "Service">,
  };
}

// 타입만으로도 결과 생성(공유 링크에서 사용)
export function recommendFromType(type: string) {
  // 타입 → 축 대략치 역추정(간단 가중)
  const a: Record<Axis, number> = {
    EI: type[0] === "E" ? 1 : -1,
    SN: type[1] === "S" ? 1 : -1,
    TF: type[2] === "T" ? 1 : -1,
    JP: type[3] === "J" ? 1 : -1,
  };
  const { ordered } = recommend(a);
  return {
    type,
    description: DESC_MAP[type] || "당신의 강점을 살린 창업 스타일입니다.",
    recommended: ordered.slice(0, 2) as Array<"Retail" | "F&B" | "Service">,
  };
}
