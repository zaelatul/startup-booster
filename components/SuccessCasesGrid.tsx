import React, { useMemo, useState } from "react";

/** 유지보수용 타입 */
export type SuccessCase = {
  id: string;
  brand: string;        // 브랜드명
  branch: string;       // 지점/매장명
  openedAt: string;     // 창업일자(YYYY-MM-DD)
  avgSales: string;     // 평균매출(표시용 문자열)
  profitRate: string;   // 수익률(표시용 문자열, %)
  netProfit: string;    // 순이익(표시용 문자열)
  image: string;        // 이미지 URL
  note?: string;        // 한 줄 요약/비고
};

/** 샘플 데이터: 실제 연동 시 DB/관리자 입력으로 교체 */
const SAMPLE_CASES: SuccessCase[] = [
  {
    id: "olive-1",
    brand: "올리브영",
    branch: "강남역점",
    openedAt: "2024-03-15",
    avgSales: "5,200만원",
    profitRate: "18%",
    netProfit: "620만원",
    image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    note: "상권 리뉴얼 후 퇴근 시간대 매출 상승.",
  },
  {
    id: "bbq-1",
    brand: "BBQ 치킨",
    branch: "부산해운대점",
    openedAt: "2023-11-05",
    avgSales: "4,200만원",
    profitRate: "16%",
    netProfit: "480만원",
    image: "https://images.unsplash.com/photo-1604908554027-7155a6543b57?q=80&w=1200&auto=format&fit=crop",
    note: "배달/포장 채널 최적화로 회전율↑",
  },
  {
    id: "daulwish-1",
    brand: "다울위시",
    branch: "수원정자점",
    openedAt: "2024-07-01",
    avgSales: "1,600만원",
    profitRate: "28%",
    netProfit: "270만원",
    image: "https://images.unsplash.com/photo-1604908177073-8ce1f1f9b4e6?q=80&w=1200&auto=format&fit=crop",
    note: "야간 무인 운영 + 아파트 밀집 수요.",
  },
  // 필요 시 계속 추가…
];

type Props = {
  /** 외부에서 데이터 주입 가능 (없으면 샘플 사용) */
  cases?: SuccessCase[];
  /** 페이지당 노출 개수(더보기 단위). 기본 3 */
  pageSize?: number;
};

export default function SuccessCasesGrid({ cases, pageSize = 3 }: Props) {
  const rows = useMemo(() => cases ?? SAMPLE_CASES, [cases]);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const visibleRows = rows.slice(0, visibleCount);
  const hasMore = visibleCount < rows.length;

  const handleMore = () =>
    setVisibleCount((v) => Math.min(v + pageSize, rows.length));

  return (
    <section aria-label="성공 창업 매장 사례" className="w-full">
      {/* 섹션 타이틀 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">성공 창업 매장 사례</h2>
        {/* (선택) 관리자 버튼/링크 자리는 유지 */}
      </div>

      {/* 3열 그리드: 한 행 3개 고정 */}
      <div
        className="grid grid-cols-3 gap-6"
        data-testid="success-grid"
      >
        {visibleRows.map((c) => (
          <article
            key={c.id}
            data-testid="case-card"
            className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={c.image}
                alt={`${c.brand} ${c.branch} 매장 이미지`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-medium">
                {c.brand} · {c.branch}
              </h3>

              {/* 배지들 */}
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-700">
                <span className="px-2 py-1 rounded-full bg-gray-100">
                  창업일자 {c.openedAt}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100">
                  평균매출 {c.avgSales}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100">
                  수익률 {c.profitRate}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100">
                  순이익 {c.netProfit}
                </span>
              </div>

              {c.note && (
                <p className="mt-3 text-sm text-gray-600">{c.note}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* 더보기 */}
      <div className="mt-6">
        {hasMore ? (
          <button
            type="button"
            onClick={handleMore}
            data-testid="load-more"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 border border-gray-300 hover:bg-gray-50"
            aria-label="사례 더보기"
          >
            더보기
            <span aria-hidden>＋3</span>
          </button>
        ) : (
          <p className="text-sm text-gray-500 select-none">
            더 볼 사례가 없습니다.
          </p>
        )}
      </div>

      {/* 고지문구(샘플/검증) */}
      <p className="mt-8 text-xs text-gray-500">
        ※ 본 섹션은 **검증된 사례**를 소개하기 위한 레이아웃입니다. (실데이터 연동 전까지는 샘플)
      </p>
    </section>
  );
}
