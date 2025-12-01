// 신규 — src/lib/promos.ts

export type PromoItem = {
  id: string;          // URL slug (/promo/[id])
  tag: string;         // 제휴 / 프랜차이즈 / 이벤트 등
  title: string;       // 배너 큰 제목
  summary: string;     // 홈 롤링배너에서 한 줄 요약
  description: string; // 상세 페이지용 긴 설명
  imageUrl: string;    // 큰 이미지 (임시: /images/.. or https://..)
  externalUrl?: string; // 필요하면 외부 링크
};

/**
 * TODO(실데이터 연동):
 *  - 나중에 Supabase 의 banners(혹은 promos) 테이블로 치환.
 *  - 관리자 페이지에서는 이 배열 대신 DB 를 읽어와서 관리하게 된다.
 */
export const PROMO_ITEMS: PromoItem[] = [
  {
    id: "partner-softland",
    tag: "제휴사",
    title: "소프트랜드 회원 전용, POS·키오스크 패키지 할인",
    summary:
      "창업 초기에 꼭 필요한 POS·키오스크를 창업부스터 제휴가로 제공하는 프로모션입니다.",
    description:
      "소프트랜드는 전국 1만여 개 매장에서 사용하는 POS·키오스크 전문 업체입니다.\n\n" +
      "이번 제휴 프로모션을 통해 창업부스터 이용자는 초기 도입 비용을 낮추고, " +
      "정산·매출 집계·포인트 적립까지 한 번에 관리할 수 있습니다.\n\n" +
      "- 대상: 창업부스터 회원 중 신규 매장 오픈 예정 점주\n" +
      "- 혜택: POS·키오스크 패키지 최대 25% 할인 + 3개월 무상 A/S\n" +
      "- 기간: 2025년 12월 31일까지(예시)\n\n" +
      "실제 조건과 혜택은 제휴사 정책에 따라 달라질 수 있으니, 상세 문의 후 결정해 주세요.",
    imageUrl:
      "https://images.pexels.com/photos/5717973/pexels-photo-5717973.jpeg?auto=compress&cs=tinysrgb&w=1600",
    externalUrl: undefined,
  },
  {
    id: "franchise-week",
    tag: "프랜차이즈",
    title: "프랜차이즈 위크: 정보공개서 기반 상위 브랜드 집중 소개",
    summary:
      "실제 정보공개서 데이터를 기반으로 안정형·성장형 프랜차이즈를 한 번에 모아서 보여드립니다.",
    description:
      "프랜차이즈 위크는 공정위 정보공개서 데이터를 바탕으로 폐업률·점포 수·가맹 점주 부담 등을 " +
      "종합적으로 확인할 수 있는 기획 코너입니다.\n\n" +
      "이번 기획에서는 폐업률이 낮고 점포 수가 일정 수준 이상인 브랜드를 중심으로, " +
      "업종별 대표 브랜드를 모았습니다.\n\n" +
      "각 브랜드별로 다음 항목을 함께 제공합니다.\n" +
      "- 최근 3년 간 점포 수 추이(증가/감소)\n" +
      "- 가맹점 평균 매출(공개된 범위 내)\n" +
      "- 가맹점주 부담 비용 구조 요약\n\n" +
      "실제 투자 결정 전에는 반드시 최신 공시자료와 본사 상담 내용을 함께 확인해 주세요.",
    imageUrl:
      "https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: "opening-event-2025",
    tag: "이벤트",
    title: "2025 창업부스터 런칭 기념, 상권·프랜차이즈 무료 컨설팅 이벤트",
    summary:
      "선착순 신청한 예비 창업자에게 상권분석 리포트 + 프랜차이즈 후보군 리스트를 무료로 제공하는 이벤트입니다.",
    description:
      "창업부스터 정식 런칭을 기념하여, 예비 창업자 대상 무료 컨설팅 이벤트를 진행합니다.\n\n" +
      "- 제공 내용:\n" +
      "  · 희망 지역 기준 상권분석 요약 리포트(인구·유동·경쟁·지표 등)\n" +
      "  · 업종 선호도와 예산에 맞는 프랜차이즈 후보 5개 내외 추천\n" +
      "- 신청 대상: 창업 예정자 또는 재창업 준비 중인 점주\n" +
      "- 신청 방법: 창업부스터 앱 내 이벤트 신청 폼(예정)\n\n" +
      "이벤트를 통해 받은 리포트는 참고용이며, 실제 계약 전에는 반드시 현장 점검과 추가 상담을 함께 받으셔야 합니다.",
    imageUrl:
      "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

export function findPromoById(id: string): PromoItem | undefined {
  return PROMO_ITEMS.find((item) => item.id === id);
}
