// 교체 — components/home/HomeHero.tsx
"use client";

import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="mt-10 md:mt-14">
      <div
        className="
          relative overflow-hidden rounded-[32px]
          border border-slate-100 bg-white
          shadow-[0_24px_80px_rgba(15,23,42,0.10)]
        "
      >
        {/* 배경 이미지 + 그라데이션 레이어 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {/* 실제 창업 관련 이미지 — public/hero-startup.jpg 에 넣어두면 됨 */}
          <div
            className="
              absolute inset-0
              bg-[url('/hero-startup.jpg')]  /* public 폴더 기준 경로 */
              bg-cover bg-center
              opacity-70
            "
          />
          {/* 텍스트 가독성을 위한 밝은 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/95 to-white/98" />

          {/* 살짝 포인트 주는 컬러 블러 */}
          <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="absolute bottom-[-80px] right-[-40px] h-64 w-64 rounded-full bg-indigo-400/35 blur-3xl" />
        </div>

        {/* 실제 콘텐츠 레이어 */}
        <div className="relative z-10 px-8 py-10 md:px-12 md:py-12 lg:px-16 lg:py-14">
          {/* 상단 작은 배지 */}
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-medium text-slate-50 shadow-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>BETA · 창업부스터</span>
          </div>

          {/* 메인 카피 */}
          <h1 className="mt-5 text-2xl font-semibold leading-snug text-slate-900 md:text-3xl lg:text-[32px]">
            창업부스터는 실제 데이터를 기반으로
            <br className="hidden md:block" />
            창업 인사이트를 제공합니다
          </h1>

          {/* 보조 설명 (짧게) */}
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-700">
            상권·프랜차이즈·셀프 인테리어·스토리까지, 창업 전에 꼭 보고
            싶은 정보를 한 화면에서 비교해 볼 수 있어요.
          </p>

          {/* CTA 버튼 2개만 유지: 창업매거진 / MBTI */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/magazine"
              className="
                inline-flex items-center justify-center
                rounded-full bg-slate-900 px-5 py-2.5
                text-sm font-semibold text-white
                shadow-sm transition
                hover:bg-slate-800
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-slate-900/70
                focus-visible:ring-offset-2
                focus-visible:ring-offset-white
              "
            >
              창업 매거진 보기
            </Link>

            <Link
              href="/mbti"
              className="
                inline-flex items-center justify-center
                rounded-full border border-slate-900/15
                bg-white/80 px-5 py-2.5
                text-sm font-semibold text-slate-900
                shadow-sm transition
                hover:border-slate-900/40 hover:bg-slate-50
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-slate-900/60
                focus-visible:ring-offset-2
                focus-visible:ring-offset-white
              "
            >
              MBTI로 보는 창업
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
