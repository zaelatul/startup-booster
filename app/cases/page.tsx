'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RollingBanner from '@/components/home/RollingBanner';
import { CASES, CaseItem } from '@/lib/cases';
import { MapPinIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/solid';

// 한 번에 6개씩 보여줌
const PAGE_STEP = 6;

export default function CasesPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_STEP);
  
  // 현재 보여줄 데이터 슬라이싱
  const visibleCases = CASES.slice(0, visibleCount);
  
  // 더 보여줄 게 있는지 체크
  const canLoadMore = visibleCount < CASES.length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        
        {/* 상단 배너 */}
        <section className="mb-10">
          <RollingBanner />
        </section>

        {/* 타이틀 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">SUCCESS STORY</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            프랜차이즈 창업 성공 사례
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            실제 점주님들의 매출표와 인터뷰를 통해 성공 노하우를 확인하세요.
          </p>
        </div>

        {/* 카드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCases.map((item: CaseItem) => (
            <Link 
              key={item.id} 
              href={`/cases/${item.id}`}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all hover:-translate-y-1"
            >
              {/* 이미지 영역 */}
              <div className="relative h-52 w-full bg-slate-200 overflow-hidden">
                <Image 
                  src={item.mainImage} 
                  alt={item.brand} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent opacity-80"></div>
                
                {/* 이미지 위 텍스트 */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1 text-slate-300 text-xs mb-1">
                    <MapPinIcon className="w-3 h-3" /> {item.area}
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
                    {item.brand} {item.branch}
                  </h3>
                </div>
              </div>

              {/* 정보 영역 */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <p className="text-sm text-slate-600 font-medium mb-4 line-clamp-2 leading-relaxed">
                    "{item.summary}"
                  </p>
                  
                  {/* 핵심 지표 박스 (메탈 그레이) */}
                  <div className="bg-[#1E293B] rounded-xl p-4 text-white">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-600/50">
                      <span className="text-xs text-slate-400">월 평균 매출</span>
                      <span className="text-sm font-bold text-indigo-400">{item.monthlySales}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">순수익률</span>
                      <span className="text-sm font-bold text-emerald-400">{item.profitMargin}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    성공 비결 보러가기 <ChevronRightIcon className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* [수정] 더보기 버튼 (이제 데이터가 많아서 무조건 보임!) */}
        {canLoadMore && (
          <div className="mt-12 text-center pb-20">
            <button
              onClick={() => setVisibleCount(prev => prev + PAGE_STEP)}
              className="inline-flex items-center gap-2 px-10 py-3.5 bg-white border-2 border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all active:scale-95"
            >
              <PlusIcon className="w-4 h-4" /> 
              더 많은 사례 보기 ({visibleCount}/{CASES.length})
            </button>
          </div>
        )}
      </div>
    </main>
  );
}