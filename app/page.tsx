'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';

// 컴포넌트 임포트
import RollingBanner from '@/components/home/RollingBanner';
import { 
  ChevronRightIcon, 
  ChevronLeftIcon,
  MapPinIcon, 
  ChartBarIcon, 
  WrenchScrewdriverIcon,
  FireIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  StarIcon // 성공사례 아이콘용 추가
} from '@heroicons/react/24/solid';

// 데이터 임포트
import { POPULAR_FRANCHISES } from '@/lib/reco';
import { CASES } from '@/lib/cases';

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const popularScrollRef = useRef<HTMLDivElement>(null);

  // 상담 신청 폼 상태
  const [inquiryForm, setInquiryForm] = useState({
    category: '프랜차이즈 정보', 
    name: '',
    contact: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const formatMoney = (value: string | number) => {
    if (typeof value === 'string') return value;
    if (!value) return '-';
    if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
    return `${(value / 10000).toLocaleString()}만`;
  };

  // 상담 신청 핸들러
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.contact) return alert('이름과 연락처는 필수입니다.');

    setIsSubmitting(true);
    
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase
        .from('common_inquiries')
        .insert([inquiryForm]);

      if (error) {
        alert('신청 중 오류가 발생했습니다: ' + error.message);
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
    setInquiryForm({ category: '프랜차이즈 정보', name: '', contact: '', content: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* 1. 다크 히어로 섹션 (기존 유지) */}
      <section className="w-full bg-[#0F172A] py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-2.5 py-0.5 rounded bg-slate-800 border border-slate-600 text-[10px] font-bold text-blue-400 mb-3">BETA v1.0</span>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">실제 데이터를 근거로<br /><span className="text-blue-400">검증된 창업 성공 전략</span>을 만나보세요</h1>
              <p className="text-slate-400 text-xs md:text-sm mb-5 leading-relaxed">상권·프랜차이즈·셀프 인테리어까지, 창업 전에 꼭 보고 싶은 정보를<br className="hidden md:block" />한 화면에서 비교해 보세요.</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Link href="/magazine" className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md hover:-translate-y-0.5">창업 매거진 보기</Link>
                <Link href="/mbti" className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 transition-all hover:-translate-y-0.5">MBTI로 보는 창업</Link>
              </div>
            </div>
            <div className="flex-1 w-full max-w-sm hidden md:block">
              <div className="relative h-40 w-full rounded-xl overflow-hidden shadow-lg border border-slate-600/50 transform hover:scale-[1.02] transition-transform duration-500">
                 <Image src="/images/franchise-hero.jpg" alt="성공한 사장님" fill className="object-cover" priority />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="w-full flex justify-center">
        <div className="w-full max-w-6xl px-4 py-12 md:px-6 lg:px-8 space-y-20">
          
          {/* 2. 핵심 서비스 카드 (3개 -> 2개로 변경 및 디자인 유지) */}
          <section className="-mt-20 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* [1] 프랜차이즈 창업 실제 성공 사례 (메인 강조) */}
              <Link href="/cases" className="group block p-8 rounded-2xl bg-[#1E293B] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-600/50 relative overflow-hidden">
                {/* 배경 효과 추가 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all"></div>
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                            <CheckCircleIcon className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 leading-snug">프랜차이즈 창업<br/>실제 성공 사례</h3>
                        <p className="text-sm text-slate-300 mb-2 leading-relaxed">
                            데이터로 검증된 사장님들의<br/>진짜 성공 스토리를 확인하세요.
                        </p>
                    </div>
                    <span className="text-xs font-bold text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all group-hover:text-white mt-4">
                        성공 비결 보러가기 <ChevronRightIcon className="w-4 h-4" />
                    </span>
                </div>
              </Link>

              {/* [2] 프랜차이즈 분석 (기존 유지) */}
              <Link href="/franchise/explore" className="group block p-8 rounded-2xl bg-[#1E293B] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-600/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-all"></div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-5 group-hover:bg-purple-500 transition-colors">
                            <ChartBarIcon className="w-6 h-6 text-purple-400 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 leading-snug">프랜차이즈<br/>분석</h3>
                        <p className="text-sm text-slate-300 mb-2 leading-relaxed">
                            과장 광고에 현혹되지 마시고<br/>객관적인 데이터를 비교하세요.
                        </p>
                    </div>
                    <span className="text-xs font-bold text-purple-400 flex items-center gap-1 group-hover:gap-2 transition-all group-hover:text-white mt-4">
                        데이터 비교하기 <ChevronRightIcon className="w-4 h-4" />
                    </span>
                </div>
              </Link>

              {/* [HIDDEN] 상권분석 & 셀프인테리어 (추후 오픈 예정) */}
              {/* <Link href="/market" className="...">상권분석</Link>
              <Link href="/interior" className="...">셀프 인테리어</Link>
              */}
            </div>
          </section>

          {/* 3. 롤링 배너 */}
          <section><RollingBanner /></section>

          {/* 4. 성공 사례 섹션 (텍스트 수정됨) */}
          <section className="relative group/section">
            <div className="flex items-end justify-between mb-6">
              <div>
                  {/* 요청하신 텍스트 수정 적용 */}
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">프랜차이즈 창업 실제 성공 사례</h2>
                  <p className="mt-2 text-xs md:text-sm text-slate-500">실제 데이터와 현장 스토리로 보는 브랜드별 창업 사례입니다.</p>
              </div>
              <Link href="/cases" className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">전체 사례 보기 <ChevronRightIcon className="w-3 h-3" /></Link>
            </div>
            <div className="relative">
              <button onClick={() => scroll(scrollRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 p-2 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hover:bg-slate-50 hover:scale-110 transition-all hidden md:flex"><ChevronLeftIcon className="w-5 h-5" /></button>
              <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x scroll-smooth">
                {CASES.slice(0, 6).map((item) => (
                  <Link href={`/cases/${item.id}`} key={item.id} className="group flex-shrink-0 w-[280px] md:w-[300px] bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 snap-center border border-slate-700">
                    <div className="relative h-40 bg-slate-700 overflow-hidden">
                      {item.mainImage ? (<img src={item.mainImage} alt={item.brand} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />) : (<div className="flex h-full items-center justify-center text-slate-500 text-xs">이미지 없음</div>)}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute top-3 left-4"><span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 shadow-sm">{item.category}</span></div>
                    </div>
                    <div className="p-5 bg-[#1E293B] text-white h-full relative z-10">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-none mb-1">{item.brand}</h3>
                        <span className="text-[11px] text-slate-400 font-normal">{item.branch}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-700/50 p-2 rounded-lg text-center border border-slate-600/30"><p className="text-[10px] text-slate-400">평균 매출</p><p className="text-xs font-bold text-white">{formatMoney(item.monthlySales)}</p></div>
                        <div className="bg-slate-700/50 p-2 rounded-lg text-center border border-slate-600/30"><p className="text-[10px] text-slate-400">월 순이익</p><p className="text-xs font-bold text-emerald-400">{formatMoney(item.netProfit)}</p></div>
                        <div className="bg-slate-700/50 p-2 rounded-lg text-center border border-slate-600/30"><p className="text-[10px] text-slate-400">창업 비용</p><p className="text-xs font-bold text-slate-200">{formatMoney(item.investCost)}</p></div>
                        <div className="bg-slate-700/50 p-2 rounded-lg text-center border border-slate-600/30"><p className="text-[10px] text-slate-400">창업 년도</p><p className="text-xs font-bold text-slate-200">{item.startupYear}년</p></div>
                      </div>
                      <div className="mt-4 flex items-center justify-end pt-3 border-t border-slate-700/50"><span className="text-[11px] font-bold text-blue-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">상세 리포트 보기 <ChevronRightIcon className="w-3 h-3" /></span></div>
                    </div>
                  </Link>
                ))}
              </div>
              <button onClick={() => scroll(scrollRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 p-2 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hover:bg-slate-50 hover:scale-110 transition-all hidden md:flex"><ChevronRightIcon className="w-5 h-5" /></button>
            </div>
          </section>

          {/* 5. 인기 프랜차이즈 (기존 유지) */}
          <section className="relative group/section">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-red-500 font-bold text-xs tracking-wider uppercase mb-1 block flex items-center gap-1">
                  <FireIcon className="w-4 h-4" /> HOT TREND
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">최근 인기있는 프랜차이즈</h2>
                <p className="mt-2 text-xs md:text-sm text-slate-500">예비 창업자들이 가장 많이 찾아본 브랜드를 모았습니다.</p>
              </div>
            </div>
            <div className="relative">
              <button onClick={() => scroll(popularScrollRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 p-2 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hover:bg-slate-50 hover:scale-110 transition-all hidden md:flex"><ChevronLeftIcon className="w-5 h-5" /></button>
              <div ref={popularScrollRef} className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x scroll-smooth">
                {POPULAR_FRANCHISES.map((item) => (
                  <Link href={`/franchise/popular/${item.id}`} key={item.id} className="group flex-shrink-0 min-w-[42vw] md:min-w-[260px] max-w-[45vw] md:max-w-[260px] bg-[#1E293B] rounded-2xl overflow-hidden shadow-lg border border-slate-700 hover:ring-2 hover:ring-indigo-500 transition-all snap-center flex flex-col">
                    <div className="relative h-32 bg-slate-800 overflow-hidden shrink-0">
                      <img src={item.mainImage} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] to-transparent"></div>
                      <div className="absolute top-2 left-2"><span className="bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10">{item.category}</span></div>
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div className="mb-3">
                        <h3 className="text-base font-bold text-white leading-tight mb-1 group-hover:text-indigo-400 transition-colors">{item.name}</h3>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{item.slogan || '성공 창업의 지름길'}</p>
                      </div>
                      <div className="space-y-1.5 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between items-center text-[11px]">
                           <span className="text-slate-400">평균 매출</span>
                           <span className="font-bold text-white">{formatMoney(item.avgSales)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                           <span className="text-slate-400">수익률</span>
                           <span className="font-bold text-emerald-400">{item.profitMargin}%</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                           <span className="text-slate-400">창업 비용</span>
                           <span className="font-bold text-slate-200">{formatMoney(item.startupCostTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <button onClick={() => scroll(popularScrollRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 p-2 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hover:bg-slate-50 hover:scale-110 transition-all hidden md:flex"><ChevronRightIcon className="w-5 h-5" /></button>
            </div>
          </section>

          {/* 6. 통합 상담 신청 배너 (기존 유지) */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] to-indigo-950 p-6 md:p-8 shadow-2xl border border-slate-700/50">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>

             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 text-center md:text-left">
                   <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-3 py-1 text-indigo-300 text-xs font-bold mb-4">
                      <EnvelopeIcon className="w-4 h-4" /> 무료 창업 상담
                   </div>
                   <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                      궁금한 점,<br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">한방에 해결해 드립니다!</span>
                   </h2>
                   <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                      프랜차이즈 추천부터 상권 분석, 인테리어 견적까지.<br/>
                      창업부스터가 검증된 전문가를 연결해 드립니다.
                   </p>
                </div>

                <div className="w-full md:w-[400px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                   {isSubmitted ? (
                      <div className="h-60 flex flex-col items-center justify-center text-center animate-fadeIn">
                         <CheckCircleIcon className="w-16 h-16 text-emerald-500 mb-4" />
                         <h3 className="text-xl font-bold text-white mb-2">신청 완료!</h3>
                         <p className="text-slate-300 text-sm">담당자가 확인 후<br/>빠른 시일 내에 연락드리겠습니다.</p>
                      </div>
                   ) : (
                      <form onSubmit={handleInquirySubmit} className="space-y-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">관심 분야</label>
                            <select 
                               className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none"
                               value={inquiryForm.category}
                               onChange={e => setInquiryForm({...inquiryForm, category: e.target.value})}
                            >
                               <option value="프랜차이즈 정보">프랜차이즈 정보</option>
                               <option value="인기 프랜차이즈">인기 프랜차이즈</option>
                               <option value="셀프 인테리어">셀프 인테리어</option>
                               <option value="기타 문의">기타 문의</option>
                            </select>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            <div><label className="block text-xs font-bold text-slate-400 mb-1">이름</label><input type="text" className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="홍길동" value={inquiryForm.name} onChange={e => setInquiryForm({...inquiryForm, name: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-slate-400 mb-1">연락처</label><input type="tel" className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="010-0000-0000" value={inquiryForm.contact} onChange={e => setInquiryForm({...inquiryForm, contact: e.target.value})} /></div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">문의 내용 (선택)</label>
                            <textarea className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none h-20 resize-none" placeholder="궁금한 내용을 자유롭게 적어주세요." value={inquiryForm.content} onChange={e => setInquiryForm({...inquiryForm, content: e.target.value})} />
                         </div>
                         <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                            {isSubmitting ? '접수 중...' : '문의하기'}
                         </button>
                      </form>
                   )}
                </div>
             </div>
          </section>

        </div>
      </main>
    </div>
  );
}