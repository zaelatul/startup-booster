// 교체 — src/components/home/FranchiseSuccessSection.tsx
'use client';

import Link from 'next/link';
import { CASES } from '@/lib/cases';
import CaseCard from '@/components/cases/CaseCard';

export default function FranchiseSuccessSection() {
  const previewCases = CASES.slice(0, 6);

  return (
    <section className="w-full py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-6 lg:px-8">
        {/* 제목 영역 */}
        <header className="flex flex-col gap-2">
          {/* 여기가 제일 중요한 제목 — 글자 크게 */}
          <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
            프랜차이즈 실제 창업 성공 사례
          </h2>
          {/* 부제는 살짝 작은 글자 */}
          <p className="text-xs text-slate-500 md:text-sm">
            실제 매장을 운영 중인 점주의 창업 사례입니다.
          </p>
        </header>

        {/* 카드 그리드 — 홈에서는 3x2 고정 미리보기 */}
        <div
          className="
            grid gap-4
            max-[480px]:grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {previewCases.map((item: any) => (
            <CaseCard key={item.id ?? item.title} item={item} />
          ))}
        </div>

        {/* 전체 보기 버튼 */}
        <div className="mt-4 flex justify-center">
          <Link
            href="/cases"
            className="
              inline-flex items-center rounded-full
              border border-slate-200 bg-white
              px-6 py-2 text-xs font-medium text-slate-700
              hover:bg-slate-50
            "
          >
            프랜차이즈 실제 창업 사례 더 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
