// components/home/HomeFranchiseCases.tsx
'use client';

import Link from 'next/link';
import { CASES, type CaseItem } from '@/lib/cases';

type NormalizedCase = {
  id: string;
  brand: string;
  branch?: string;
  monthlySalesLabel: string;
  profitRateLabel: string;
  paybackLabel: string;
  areaLabel: string;
  note?: string;
  imageUrl: string;
};

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/3735152/pexels-photo-3735152.jpeg?auto=compress&cs=tinysrgb&w=1200';

function normalizeCase(item: CaseItem | any): NormalizedCase {
  const id: string = item.id ?? item.slug ?? item.code ?? 'unknown-case';

  const brand: string =
    item.brand ??
    item.brandName ??
    item.title ??
    item.name ??
    '브랜드명 미정';

  const branch: string | undefined =
    item.branch ??
    item.shopName ??
    item.branchName ??
    item.storeName ??
    undefined;

  const monthlySalesLabel: string =
    item.monthlySalesLabel ??
    item.monthlySalesText ??
    item.monthly_sales_text ??
    item.monthlySales ??
    item.monthly_sales ??
    '-';

  const profitRateLabel: string =
    item.profitRateLabel ??
    item.profitRateText ??
    item.profit_rate_text ??
    item.profitRate ??
    item.profit_rate ??
    '-';

  const paybackLabel: string =
    item.paybackLabel ??
    item.paybackText ??
    item.payback_months_text ??
    item.paybackMonths ??
    item.payback_months ??
    '-';

  const areaLabel: string =
    item.areaLabel ??
    item.areaText ??
    item.storeAreaText ??
    item.store_area_text ??
    '-';

  const note: string | undefined =
    item.shortNote ??
    item.summary ??
    item.short_summary ??
    undefined;

  const imageUrl: string =
    item.mainImage ??
    item.coverImage ??
    item.image ??
    item.thumbnail ??
    FALLBACK_IMAGE;

  return {
    id,
    brand,
    branch,
    monthlySalesLabel,
    profitRateLabel,
    paybackLabel,
    areaLabel,
    note,
    imageUrl,
  };
}

export default function HomeFranchiseCases() {
  const normalized: NormalizedCase[] = (CASES as any[]).map(normalizeCase);

  return (
    <section className="mt-12 rounded-3xl bg-slate-950 px-5 py-8 text-slate-50 sm:px-7 lg:px-8">
      {/* 섹션 헤더 */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-[11px] font-medium text-sky-300">
            프랜차이즈 실제 창업사례
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
            프랜차이즈 실제 창업 성공사례
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
            공정위 정보공개서와 실제 매장 데이터를 바탕으로 한 예시 케이스입니다. 이후
            실데이터 연동 시 자동으로 교체됩니다.
          </p>
        </div>
        <div className="text-right text-[11px] text-slate-400 sm:text-xs">
          <p>현재 노출 사례: {normalized.length}개</p>
          <p className="mt-1">
            ※ 데이터 연동 후 실제 공시자료 기반 수치로 자동 교체됩니다.
          </p>
        </div>
      </header>

      {/* 카드 그리드 - 모바일 2열, 데스크톱 3열 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {normalized.map((item) => (
          <Link
            key={item.id}
            href={`/cases/${item.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-slate-900/80 ring-1 ring-slate-800 transition hover:-translate-y-1 hover:bg-slate-900 hover:ring-sky-500/60"
          >
            {/* 상단 이미지 */}
            <div className="relative h-40 w-full overflow-hidden bg-slate-800 sm:h-44">
              {/* img로 처리(Next 이미지 설정 필요 없음) */}
              <img
                src={item.imageUrl || FALLBACK_IMAGE}
                alt={`${item.brand} 매장 이미지`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>

            {/* 본문 */}
            <div className="flex flex-1 flex-col px-4 py-4">
              {/* 브랜드/지점명 */}
              <div className="mb-3">
                <p className="text-[11px] text-slate-400">오늘의 실제 사례</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {item.brand}
                  {item.branch ? ` · ${item.branch}` : ''}
                </p>
              </div>

              {/* 핵심 지표 4칸 */}
              <div className="grid gap-2 text-xs text-slate-200">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-slate-800/80 px-3 py-2">
                    <p className="text-[11px] text-slate-400">월 매출(평균)</p>
                    <p className="mt-1 text-sm font-semibold text-slate-50">
                      {item.monthlySalesLabel}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 px-3 py-2">
                    <p className="text-[11px] text-slate-400">수익률(추정)</p>
                    <p className="mt-1 text-sm font-semibold text-slate-50">
                      {item.profitRateLabel}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-slate-800/80 px-3 py-2">
                    <p className="text-[11px] text-slate-400">투자 회수 예상</p>
                    <p className="mt-1 text-sm font-semibold text-slate-50">
                      {item.paybackLabel}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 px-3 py-2">
                    <p className="text-[11px] text-slate-400">매장 규모(약)</p>
                    <p className="mt-1 text-sm font-semibold text-slate-50">
                      {item.areaLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* 하단 요약 & 안내 문구 */}
              <div className="mt-3 flex-1 text-[11px] leading-relaxed text-slate-300">
                {item.note ? (
                  <p className="line-clamp-2">{item.note}</p>
                ) : (
                  <p className="line-clamp-2">
                    상세 페이지에서 입지·운영 방식·투자 구조까지 실제 창업자의
                    코멘트와 함께 볼 수 있어요.
                  </p>
                )}
              </div>

              <p className="mt-3 text-[10px] text-slate-500">
                ※ 실제 매출·수익률은 상권·입지·운영 방식에 따라 크게 달라질 수 있습니다.
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 하단 더보기 CTA – 항상 노출 */}
      <div className="mt-6 flex justify-end">
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 rounded-full border border-sky-500/70 bg-slate-900/60 px-4 py-2 text-xs font-medium text-sky-100 shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition hover:border-sky-300 hover:bg-slate-900 hover:text-white"
        >
          프랜차이즈 실제 창업 사례 더보기
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
