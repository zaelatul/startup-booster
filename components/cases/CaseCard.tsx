// 교체 — src/components/cases/CaseCard.tsx
import Link from 'next/link';

type AnyCase = any;

type CaseCardProps = {
  item?: AnyCase;
  caseItem?: AnyCase;
  data?: AnyCase;
  href?: string;
};

export default function CaseCard(props: CaseCardProps) {
  const source: AnyCase = props.item ?? props.caseItem ?? props.data ?? {};

  // 최대한 안전하게 필드 추출 (없는 경우도 대비)
  const region: string =
    source.region ||
    source.area ||
    source.location ||
    source.city ||
    '';

  const title: string =
    source.title ||
    source.storeName ||
    source.name ||
    [source.brand, source.branch].filter(Boolean).join(' ') ||
    '';

  const monthlySales: string =
    source.monthlySales ||
    source.salesText ||
    source.sales ||
    source.monthly_sales ||
    '';

  const profitRate: string =
    source.profitRate ||
    source.profitText ||
    source.margin ||
    source.profit_rate ||
    '';

  const summary: string =
    source.summary || source.description || source.memo || '';

  const imageUrl: string =
    source.imageUrl ||
    source.image_url ||
    source.image ||
    '/images/cases/sample-store-01.jpg'; // 없으면 기본 샘플

  const linkHref: string =
    props.href ||
    source.href ||
    source.link ||
    (source.slug ? `/cases/${source.slug}` : '#');

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-transform hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
      {/* 상단 이미지 영역 — background-image 사용 */}
      <div
        className="relative h-24 w-full bg-slate-100 bg-cover bg-center sm:h-28"
        style={{ backgroundImage: `url(${imageUrl})` }}
        aria-label={title ? `${title} 매장 사진` : '매장 사진'}
      />

      {/* 텍스트 영역 */}
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        {region && (
          <p className="text-[11px] font-semibold text-emerald-500 sm:text-xs">
            {region}
          </p>
        )}

        {title && (
          <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
            {title}
          </h3>
        )}

        {/* 월매출 / 수익률 배지 — 기존 색 그대로 */}
        {(monthlySales || profitRate) && (
          <div className="mt-2 flex flex-col gap-2">
            {monthlySales && (
              <div className="flex items-center justify-between rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-50 sm:text-xs">
                <span className="opacity-70">월 매출(평균)</span>
                <span className="font-semibold text-emerald-300">
                  {monthlySales}
                </span>
              </div>
            )}
            {profitRate && (
              <div className="flex items-center justify-between rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-50 sm:text-xs">
                <span className="opacity-70">수익률(예시)</span>
                <span className="font-semibold text-emerald-300">
                  {profitRate}
                </span>
              </div>
            )}
          </div>
        )}

        {summary && (
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500 sm:text-xs">
            {summary}
          </p>
        )}

        {/* 하단 상세보기 링크 */}
        <div className="mt-4">
          <Link
            href={linkHref}
            className="text-[11px] font-semibold text-emerald-500 underline-offset-2 hover:underline sm:text-xs"
          >
            상세 사례 보기 →
          </Link>
        </div>
      </div>
    </article>
  );
}
