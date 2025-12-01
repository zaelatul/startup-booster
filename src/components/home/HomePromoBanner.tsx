// 교체 — src/components/home/HomePromoBanner.tsx
'use client';

import Link from 'next/link';

type HomePromo = {
  id: string;
  tag: string;
  title: string;
  description: string;
  highlight: string;
  imageUrl: string;
  detailUrl: string;
};

const MOCK_PROMO: HomePromo = {
  id: 'softpos-package',
  tag: '제휴·프로모션 소식',
  title: '소프트포트 회원 전용, POS·키오스크 패키지 할인',
  description:
    '창업 준비에 꼭 필요한 POS·키오스크를 창업부스터 제휴가로 제공해 드립니다.',
  highlight: '관리자 페이지에서 배너를 직접 등록·관리합니다.',
  imageUrl:
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
  detailUrl: '/promos/softpos-package',
};

export default function HomePromoBanner() {
  const promo = MOCK_PROMO;

  return (
    <section className="mt-10 overflow-hidden rounded-3xl bg-slate-950 text-slate-50 shadow-xl">
      {/* 상단 라벨/설명 */}
      <div className="flex items-center justify-between px-6 pt-4 text-[11px] text-slate-300">
        <div className="inline-flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-emerald-50">
            프랜차이즈·창업부스터 소식
          </span>
          <span>{promo.tag}</span>
        </div>
        <div className="inline-flex items-center gap-1 text-slate-500">
          <span className="h-1 w-1 rounded-full bg-slate-500" />
          <span className="h-1 w-1 rounded-full bg-slate-500" />
          <span className="h-1 w-1 rounded-full bg-slate-500" />
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-6 px-6 pb-6 pt-3 md:flex-row">
        {/* 왼쪽 텍스트 영역 */}
        <div className="flex-1 space-y-3">
          <p className="text-xs font-semibold text-emerald-300">{promo.tag}</p>
          <h3 className="text-lg font-semibold leading-relaxed text-slate-50 md:text-xl">
            {promo.title}
          </h3>
          <p className="text-xs leading-relaxed text-slate-300">
            {promo.description}
          </p>
          <p className="text-[11px] text-slate-400">{promo.highlight}</p>

          {/* CTA 버튼 – 줄바꿈 방지 */}
          <div className="pt-2">
            <Link
              href={promo.detailUrl}
              className="inline-flex items-center justify-center rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-white hover:shadow-md whitespace-nowrap"
            >
              <span>자세히 보기</span>
              <span className="ml-1 text-[10px]">→</span>
            </Link>
          </div>
        </div>

        {/* 오른쪽 이미지 영역 */}
        <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-900 md:h-44 md:w-2/5 lg:h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={promo.imageUrl}
            alt={promo.title}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-transparent to-slate-950/20" />
        </div>
      </div>
    </section>
  );
}
