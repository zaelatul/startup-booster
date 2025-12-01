// 교체 — app/market/promo/[id]/page.tsx

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMarketPromoById } from '@/lib/marketPromos';

type PageProps = {
  // ✅ Next 16: params 는 Promise 형태
  params: Promise<{ id: string }>;
};

// ✅ async 컴포넌트 + params await
export default async function MarketPromoDetailPage(props: PageProps) {
  const { id } = await props.params;

  const promo = getMarketPromoById(id);

  // id 가 MARKET_PROMOS 에 없으면 404
  if (!promo) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="mx-auto max-w-4xl px-5 py-10">
        {/* 상단: 뒤로가기 */}
        <Link
          href="/market"
          className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
        >
          <span aria-hidden>←</span>
          상권분석으로 돌아가기
        </Link>

        {/* 상세 카드 */}
        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white">
              {promo.badge}
            </span>
            <span>상권분석 상단 롤링 배너의 상세 안내입니다.</span>
          </div>

          <h1 className="mt-3 text-xl font-semibold text-slate-900">
            {promo.title}
          </h1>
          <p className="mt-2 text-sm text-slate-700">{promo.description}</p>

          {/* 상세 이미지 – 롤링배너와 같은 imageUrl 사용 */}
          {promo.imageUrl && (
            <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
              <img
                src={promo.imageUrl}
                alt={promo.title}
                className="h-full w-full max-h-[480px] object-cover"
              />
            </div>
          )}

          <p className="mt-4 text-[11px] text-slate-500">
            이 이미지는 상권분석 상단 롤링 배너와 연동된 홍보용 이미지입니다.
            추후에는 특정 프랜차이즈 홍보 이미지, 이벤트 포스터 등으로
            교체하여 사용하실 수 있습니다.
          </p>
        </section>
      </main>
    </div>
  );
}
