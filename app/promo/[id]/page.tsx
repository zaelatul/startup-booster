// 신규 — app/promo/[id]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { PROMO_ITEMS, findPromoById } from "@/lib/promos";

type ParamsPromise = Promise<{ id: string }>;

export default async function PromoDetailPage({
  params,
}: {
  params: ParamsPromise;
}) {
  const { id } = await params;
  const promo = findPromoById(id);

  if (!promo) {
    return notFound();
  }

  return (
    <main className="flex w-full justify-center bg-slate-50">
      <div className="w-full max-w-4xl px-4 py-10 md:px-6 lg:px-8">
        {/* 상단 뒤로가기 */}
        <div className="mb-4 text-sm text-slate-500">
          <Link href="/" className="hover:underline">
            ← 홈으로
          </Link>
        </div>

        {/* 제목 + 태그 */}
        <div className="mb-6 flex flex-col gap-3">
          <span className="inline-flex w-fit items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
            {promo.tag}
          </span>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            {promo.title}
          </h1>
        </div>

        {/* 큰 이미지 */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-slate-200 shadow">
          <img
            src={promo.imageUrl}
            alt={promo.title}
            className="h-64 w-full object-cover md:h-80"
          />
        </div>

        {/* 본문 설명 */}
        <article className="prose prose-sm max-w-none text-slate-800 prose-p:leading-relaxed">
          {promo.description.split("\n").map((line, idx) =>
            line.trim().length === 0 ? (
              <p key={idx}>&nbsp;</p>
            ) : (
              <p key={idx}>{line}</p>
            )
          )}
        </article>

        {/* 외부 링크가 있는 경우 */}
        {promo.externalUrl && (
          <div className="mt-8">
            <Link
              href={promo.externalUrl}
              target="_blank"
              className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              제휴/이벤트 자세히 보러 가기 →
            </Link>
          </div>
        )}

        {/* 하단 안내문 */}
        <p className="mt-10 text-xs text-slate-500">
          * 이 화면에 표시되는 내용은 이해를 돕기 위한 예시입니다. 실제 제휴 조건이나
          이벤트 내용은 반드시 최신 공지와 제휴사 안내문을 다시 확인해 주세요.
        </p>
      </div>
    </main>
  );
}

/**
 * SSG/캐시를 사용할 경우를 대비한 기본 export.
 * (지금은 PROMO_ITEMS 더미 데이터라 별도 설정은 하지 않음)
 */
export function generateStaticParams() {
  return PROMO_ITEMS.map((item) => ({ id: item.id }));
}
