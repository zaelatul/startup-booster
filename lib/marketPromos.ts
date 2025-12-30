// 신규 — src/lib/marketPromos.ts

export type MarketPromo = {
  id: string;
  badge: string;
  title: string;
  description: string;
  href: string;      // 배너를 탭했을 때 이동할 주소
  imageUrl?: string; // 상세/배너에 쓸 이미지
};

/**
 * ▶ 롤링 배너 내용은 여기에서만 관리하면 됩니다.
 *  - badge: 좌측 작은 뱃지
 *  - title: 굵은 제목
 *  - description: 설명
 *  - href: 상세 페이지 주소
 *  - imageUrl: 이미지 URL (없으면 이미지 영역 숨김)
 */
export const MARKET_PROMOS: MarketPromo[] = [
  {
    id: 'hot-area',
    badge: '추천 상권',
    title: '이번 달 문의가 많은 행정동을 확인해 보실 수 있습니다.',
    description:
      '창업 관심이 높은 동들을 모아 보고, 나에게 맞는 후보지를 미리 체크해 보세요.',
    href: '/market/promo/hot-area',
    imageUrl:
      'https://images.pexels.com/photos/3739653/pexels-photo-3739653.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'franchise-link',
    badge: '프랜차이즈 연동',
    title: '상권에서 바로 프랜차이즈 분석 페이지로 이동하실 수 있습니다.',
    description:
      '관심 지역을 정하셨다면, 해당 상권에서 유리한 프랜차이즈를 함께 비교해 보세요.',
    href: '/market/promo/franchise-link',
    imageUrl:
      'https://images.pexels.com/photos/4109139/pexels-photo-4109139.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'magazine',
    badge: '창업 매거진',
    title: '성공·실패 사례를 보면서 상권을 더 입체적으로 이해하실 수 있습니다.',
    description:
      '비슷한 상권의 실제 사례를 참고하시면서 내 상황에 맞는 전략을 세워 보세요.',
    href: '/market/promo/magazine',
    imageUrl:
      'https://images.pexels.com/photos/590011/pexels-photo-590011.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

export function getMarketPromoById(id: string) {
  return MARKET_PROMOS.find((p) => p.id === id);
}
