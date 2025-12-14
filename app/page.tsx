'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RollingBanner from '@/components/home/RollingBanner';
import { CheckCircleIcon, ChartBarIcon, ChevronRightIcon, FireIcon } from '@heroicons/react/24/solid';
import { CASES } from '@/lib/cases';
import { POPULAR_FRANCHISES } from '@/lib/reco';

export default function Home() {
  const formatMoney = (value: number | string) => {
    if (!value) return '-';
    const num = Number(value);
    if (num >= 10000) return `${(num / 10000).toFixed(1)}억`;
    return `${num.toLocaleString()}만`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. 다크 히어로 섹션 */}
      <section className="w-full bg-[#0F172A] py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="mx-auto max-w-6xl px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-bold text-blue-400 mb-4">
                BETA v1.0
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                실제 데이터를 근거로<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  검증된 창업 성공 전략
                </span>을 만나보세요
              </h1>
              <p className="text-slate-400 text-sm md:text-base mb-6 leading-relaxed">
                상권분석부터 실제 점주 데이터까지, 창업 전에 꼭 봐야 하는 정보를<br className="hidden md:block" />
                한 화면에서 비교해 보세요.
              </p>
              <div className="flex gap-3 justify-center md:justify-start">
                <Link href="/franchise/explore" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all">
                  프랜차이즈 찾기
                </Link>
                <Link href="/magazine" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all">
                  창업 꿀팁 보는 방법
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full max-w-md hidden md:block">
               <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                 {/* 이미지 경로가 없다면 public/images에 파일을 넣거나, 아래 주소를 수정하세요 */}
                 <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500">
                    <img src="/images/franchise-hero.jpg" alt="Hero" className="object-cover w-full h-full opacity-80" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 -mt-10 relative z-20 space-y-12">
        
        {/* 2. 핵심 메뉴 (2개로 압축) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* [LEFT] 성공 사례 */}
            <Link href="/cases" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CheckCircleIcon className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <span className="inline-block rounded-md bg-white/20 px-2 py-1 text-[10px] font-bold mb-3">🔥 예비 창업자 필독</span>
                    <h2 className="text-2xl font-bold mb-2">프랜차이즈 창업<br/>실제 성공 사례</h2>
                    <p className="text-indigo-200 text-sm mb-6">검증된 데이터 보러가기 ➔</p>
                </div>
            </Link>

            {/* [RIGHT] 프랜차이즈 분석 */}
            <Link href="/franchise/explore" className="group relative overflow-hidden rounded-2xl bg-white p-8 text-slate-900 shadow-lg border border-slate-100 transition-all hover:-translate-y-1 hover:border-indigo-100">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ChartBarIcon className="w-32 h-32 text-indigo-600" />
                </div>
                <div className="relative z-10">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 mb-3">📊 브랜드 데이터 비교</span>
                    <h2 className="text-2xl font-bold mb-2">프랜차이즈<br/>분석</h2>
                    <p className="text-slate-500 text-sm mb-6 group-hover:text-indigo-600 transition-colors">인기 순위 및 매출 확인 ➔</p>
                </div>
            </Link>
        </section>

        {/* 3. 롤링 배너 */}
        <section><RollingBanner /></section>

        {/* 4. 성공 사례 리스트 */}
        <section>
            <div className="flex items-end justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">프랜차이즈 창업 실제 성공 사례</h3>
                    <p className="text-sm text-slate-500 mt-1">데이터로 검증된 사장님들의 진짜 이야기를 확인하세요.</p>
                </div>
                <Link href="/cases" className="text-xs font-bold text-slate-400 hover:text-indigo-600">전체보기 ➔</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {CASES.slice(0, 4).map((item) => (
                    <Link key={item.id} href={`/cases/${item.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="aspect-[2/1] bg-slate-200 relative">
                             {/* 이미지 */}
                             {item.mainImage ? (
                                <img src={item.mainImage} alt={item.brand} className="w-full h-full object-cover" />
                             ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">NO IMAGE</div>
                             )}
                             <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                                <span className="text-white font-bold text-lg">{item.brand}</span>
                             </div>
                        </div>
                        <div className="p-5">
                            <h4 className="font-bold text-slate-900 mb-2 truncate">{item.slogan || `${item.branch} 성공 사례`}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-4">{item.description || '성공 비결을 확인해보세요.'}</p>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-600 text-[10px] font-bold">월 순수익 {formatMoney(item.netProfit)}</span>
                                <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">매출 2배 상승</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>

        {/* 5. 인기 프랜차이즈 */}
        <section>
            <div className="flex items-center gap-2 mb-6">
                <FireIcon className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-bold text-slate-900">최근 인기있는 프랜차이즈</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {POPULAR_FRANCHISES.slice(0, 4).map((brand) => (
                    <Link key={brand.id} href={`/franchise/popular/${brand.id}`} className="block bg-[#1E293B] rounded-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all z-10"></div>
                        <div className="aspect-square bg-slate-700 relative">
                            <img src={brand.mainImage} alt={brand.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                             <p className="text-[10px] text-slate-300 mb-1">{brand.category}</p>
                             <p className="text-white font-bold text-lg">{brand.name}</p>
                             <div className="mt-2 flex justify-between text-[10px] text-slate-300 border-t border-slate-600 pt-2">
                                <span>평균 매출</span>
                                <span className="text-white font-bold">{formatMoney(brand.avgSales)}</span>
                             </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>

        {/* 6. 상담 배너 */}
        <section className="bg-[#0F172A] rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div>
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-3">🚀 무료 창업 상담</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                    궁금한 점,<br/>
                    <span className="text-indigo-400">한방에 해결해 드립니다!</span>
                </h2>
                <p className="text-slate-400 text-sm">프랜차이즈 추천부터 상권 분석, 인테리어 견적까지.<br/>창업부스터가 검증된 전문가를 연결해 드립니다.</p>
            </div>
            <div className="w-full md:w-auto bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 min-w-[300px]">
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <label className="text-[10px] text-slate-400 block mb-1">관심 분야</label>
                            <select className="w-full bg-slate-800 text-white text-xs p-2 rounded border border-slate-600">
                                <option>스터디카페/독서실</option>
                            </select>
                        </div>
                        <div className="w-1/2">
                             <label className="text-[10px] text-slate-400 block mb-1">연락처</label>
                             <input type="text" placeholder="010-0000-0000" className="w-full bg-slate-800 text-white text-xs p-2 rounded border border-slate-600" />
                        </div>
                    </div>
                    <div>
                         <label className="text-[10px] text-slate-400 block mb-1">카테고리</label>
                         <select className="w-full bg-slate-800 text-white text-xs p-2 rounded border border-slate-600">
                             <option>프랜차이즈 정보</option>
                         </select>
                    </div>
                     <div className="flex gap-2">
                        <div className="w-1/2">
                            <label className="text-[10px] text-slate-400 block mb-1">이름</label>
                            <input type="text" placeholder="홍길동" className="w-full bg-slate-800 text-white text-xs p-2 rounded border border-slate-600" />
                        </div>
                        <div className="w-1/2">
                             <label className="text-[10px] text-slate-400 block mb-1">연락처</label>
                             <input type="text" placeholder="010-0000-0000" className="w-full bg-slate-800 text-white text-xs p-2 rounded border border-slate-600" />
                        </div>
                    </div>
                     <div>
                         <label className="text-[10px] text-slate-400 block mb-1">기타 문의 (선택)</label>
                         <input type="text" placeholder="궁금한 내용을 자유롭게 적어주세요" className="w-full bg-slate-800 text-white text-xs p-2 rounded border border-slate-600" />
                    </div>
                    <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg text-sm mt-2 hover:bg-indigo-500">문의하기</button>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}