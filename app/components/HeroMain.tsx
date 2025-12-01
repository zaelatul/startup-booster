// 교체 — app/components/HeroMain.tsx
'use client';

import Link from 'next/link';

type HeroMainProps = {
  heroTitle: string;
  heroSubtitle: string;
};

/** 히어로 문구 색상 — 이 한 줄만 바꾸면 색상 변경 가능 */
export const HERO_COLOR_CLASS = 'text-slate-900';

/** 기본 문구 (props 비었을 때 사용) */
const DEFAULT_TITLE =
  '창업부스터는 실제 데이터를 기반으로\n창업 인사이트를 제공합니다';
const DEFAULT_SUBTITLE =
  '상권·프랜차이즈·셀프 인테리어까지, 창업 전에 꼭 보고 싶은 정보를 한 화면에서 비교해 볼 수 있어요.';

/**
 * 홈 상단 히어로 + 오른쪽 카드 + 바로 실행 영역
 */
export default function HeroMain({ heroTitle, heroSubtitle }: HeroMainProps) {
  // 빈 문자열이 들어와도 안전하게 기본 문구 사용
  const safeTitle = (heroTitle && heroTitle.trim()) || DEFAULT_TITLE;
  const [titleLine1, titleLine2] = safeTitle.split('\n');
  const safeSubtitle = (heroSubtitle && heroSubtitle.trim()) || DEFAULT_SUBTITLE;

  return (
    <section className="relative mt-6 grid gap-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
      {/* 상단 옅은 실사 이미지 - 더 잘 보이게 opacity ↑, blur 제거 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-28 opacity-40 md:h-36">
        <img
          src="https://images.pexels.com/photos/3739653/pexels-photo-3739653.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="창업팀이 데이터를 보며 회의하는 모습"
          className="h-full w-full object-cover"
        />
      </div>
      {/* 메탈 톤 그라데이션 오버레이 (이미지가 완전히 가려지지 않게 투명도 조정) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-slate-100/60 via-white/90 to-white" />

      {/* 왼쪽 텍스트 */}
      <div className="relative z-10 flex flex-col justify-center gap-4 p-6 md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          예비·재창업자 분들을 위한 데이터 기반 창업 도구입니다.
        </div>
        <div>
          <h1
            className={`text-2xl font-extrabold tracking-tight md:text-3xl ${HERO_COLOR_CLASS}`}
          >
            <span>{titleLine1}</span>
            {titleLine2 && (
              <>
                <br />
                <span>{titleLine2}</span>
              </>
            )}
          </h1>
          <p className="mt-3 text-sm font-normal text-slate-700 md:text-base">
            {safeSubtitle}
          </p>
        </div>
      </div>

      {/* 오른쪽 미니 카드들 + 바로 실행 영역 (기존 레이아웃 유지) */}
      <div className="relative z-10 flex flex-col justify-center gap-3 border-l border-slate-200 bg-white/80 p-6 md:p-8">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>오늘 살펴보신 상권(예시)</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
              예시 지표
            </span>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-slate-600">상권 활성도</span>
              <span className="font-semibold text-slate-900">높음</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-slate-600">최근 1년 매출 지수</span>
              <span className="font-semibold text-emerald-600">+8.2%</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-slate-600">동일 업종 경쟁도</span>
              <span className="font-semibold text-amber-600">보통</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
            <p className="text-slate-500">추천 출발점</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              상권분석에서
              <br />
              동 선택부터 시작해 보시겠습니까?
            </p>
          </div>

          {/* 바로 실행 영역 - 옅은 메탈 그레이 배경 + 흰색 버튼 */}
          <div className="rounded-2xl bg-slate-400 p-4 text-slate-100 shadow-sm">
            <p className="text-xs font-medium text-slate-100">바로 실행</p>
            <p className="mt-1 text-[11px] text-slate-200">
              자주 사용하실 기능을 한 번에 실행하실 수 있습니다.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <QuickActionButton
                href="/magazine"
                icon="📰"
                label="창업매거진"
              />
              <QuickActionButton
                href="/mbti"
                icon="🔍"
                label="MBTI로 보는 창업"
              />
              <QuickActionButton
                href="/interior"
                icon="🛠"
                label="셀프 인테리어"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 히어로 오른쪽 바로실행 버튼 - 흰 배경 + 메탈 라인 + 크게 */
function QuickActionButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-w-[9rem] flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-400 bg-white px-4 py-3 text-xs font-semibold text-slate-800 shadow-sm hover:border-slate-500 hover:bg-slate-50 md:text-sm"
    >
      <span className="text-base md:text-lg">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  );
}
