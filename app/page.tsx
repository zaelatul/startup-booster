'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RollingBanner from '@/components/home/RollingBanner';
import RecentViews from '@/components/home/RecentViews'; 
import Footer from '@/components/layout/Footer';
import VisitorCounter from '@/components/home/VisitorCounter'; 
import { 
  CheckCircleIcon, ChartBarIcon, ChevronRightIcon, ChevronLeftIcon,
  FireIcon, SparklesIcon, BookOpenIcon, XMarkIcon,
  LightBulbIcon, ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/react/24/solid';
import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export default function Home() {
  const caseRef = useRef<HTMLDivElement>(null);
  const popularRef = useRef<HTMLDivElement>(null);
  const magazineRef = useRef<HTMLDivElement>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiryCategory, setInquiryCategory] = useState('메인');

  const [cases, setCases] = useState<any[]>([]);
  const [popularFranchises, setPopularFranchises] = useState<any[]>([]);
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: caseData } = await supabase.from('success_cases').select('*').order('created_at', { ascending: false }).limit(9);
      const { data: franchiseData } = await supabase.from('popular_franchises').select('*').eq('is_active', true).order('priority', { ascending: false }).order('created_at', { ascending: false }).limit(9);
      const { data: magazineData } = await supabase.from('magazines').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(9);

      if (caseData) setCases(caseData);
      if (franchiseData) setPopularFranchises(franchiseData);
      if (magazineData) setMagazines(magazineData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.8; 
      ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };
  
  const formatMoney = (v: any) => {
    if (!v) return '-';
    if (v >= 10000) return `${(v/10000).toFixed(1)}억`;
    return `${v.toLocaleString()}만`; 
  };

  const handleOpenInquiry = (category: string) => {
    setInquiryCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {isModalOpen && (
        <InquiryPopup title={inquiryCategory === '제안' ? '서비스 제안하기' : '궁금한 점 문의하기'} category={inquiryCategory} onClose={() => setIsModalOpen(false)} />
      )}

      {/* 1. 메인 히어로 (초소형 콤팩트 사이즈 적용) */}
      <section className="w-full relative overflow-hidden bg-[#0F172A]">
         <VisitorCounter />

         {/* 배경 데코레이션 */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none"></div>

         {/* ✅ [수정 1] 상하 여백 대폭 축소: pt-6 pb-10 (모바일), md:py-10 (PC) */}
         <div className="mx-auto max-w-6xl px-5 pt-6 pb-10 md:py-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-0 md:gap-16">
               
               {/* [PC] 텍스트 영역 / [모바일] 하단 겹침 */}
               {/* ✅ [수정 2] 모바일에서 -mt-12로 더 끌어올려 간섭 효과 강화 */}
               <div className="flex-1 text-center md:text-left w-full order-2 md:order-1 relative z-20 -mt-12 md:mt-0">
                  <h1 className="text-2xl md:text-5xl font-extrabold text-white leading-tight mb-2 md:mb-6 drop-shadow-xl">
                     데이터로 증명된<br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">창업 성공의 지름길</span>
                  </h1>
                  <p className="text-slate-300 text-xs md:text-lg mb-5 leading-relaxed font-medium break-keep drop-shadow-md">
                     실제 데이터와 정밀 분석으로<br className="md:hidden" /> 예비 사장님의 성공적인 시작을 함께합니다.
                  </p>
                  
                  <div className="flex justify-center md:justify-start gap-3">
                     <Link href="/magazine" className="group px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-white text-white hover:text-indigo-600 font-bold text-xs md:text-sm transition-all shadow-lg border border-transparent hover:border-indigo-600 flex items-center gap-2">
                        <BookOpenIcon className="w-4 h-4 group-hover:text-indigo-600" /> 창업매거진
                     </Link>
                     <Link href="/mbti" className="group px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-white text-white hover:text-slate-900 font-bold text-xs md:text-sm transition-all flex items-center gap-2 shadow-lg border border-slate-700 hover:border-slate-200">
                        <SparklesIcon className="w-4 h-4 text-yellow-400" /> 창업 MBTI
                     </Link>
                  </div>
               </div>

               {/* [PC] 이미지 영역 / [모바일] 상단 */}
               {/* ✅ [수정 3] PC 이미지 최대 너비 축소: max-w-[480px] -> max-w-[380px] */}
               <div className="flex-1 w-full max-w-full md:max-w-[380px] order-1 md:order-2">
                  {/* ✅ [수정 4] 모바일 이미지 높이 축소: h-52 -> h-44 (176px) */}
                  <div className="relative w-full h-44 md:h-auto md:aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-700/50 rotate-1 hover:rotate-0 transition-transform duration-700 animate-float">
                     <Image 
                         src="/images/franchise-hero.jpg" 
                         alt="성공적인 창업" 
                         fill 
                         className="object-cover object-center"
                         priority 
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent pointer-events-none opacity-80 md:opacity-40"></div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 2. 핵심 메뉴 (Stack & Overlap 유지) */}
      <main className="max-w-6xl mx-auto px-4 -mt-8 relative z-30 space-y-12 md:space-y-16 pb-20">
        <section className="grid grid-cols-2 gap-3 md:gap-6">
            
            {/* 성공사례 카드 */}
            <Link href="/cases" className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#1E293B] p-5 md:p-8 text-white shadow-xl border border-slate-700 transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-500/50">
                <div className="absolute top-0 right-0 p-3 md:p-4 opacity-10 group-hover:opacity-20 transition-opacity"><CheckCircleIcon className="w-20 h-20 md:w-32 md:h-32 text-indigo-400" /></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <span className="inline-block rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 text-[10px] md:text-xs text-indigo-300 font-bold mb-3">🔥 필독</span>
                        <h2 className="text-base md:text-2xl font-bold mb-1 md:mb-2 leading-tight break-keep">실제 성공 사례</h2>
                        <p className="text-slate-400 text-[10px] md:text-sm font-medium break-keep">검증된 사장님들의<br/>생생한 인터뷰</p>
                    </div>
                    <div className="mt-4 md:mt-8"><span className="inline-flex items-center gap-1.5 text-[10px] md:text-sm font-bold text-indigo-400 group-hover:text-white transition-colors">보러가기 <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4"/></span></div>
                </div>
            </Link>

            {/* 프랜차이즈 분석 카드 */}
            <Link href="/franchise/explore" className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#1E293B] p-5 md:p-8 text-white shadow-xl border border-slate-700 transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-purple-500/50">
                 <div className="absolute top-0 right-0 p-3 md:p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ChartBarIcon className="w-20 h-20 md:w-32 md:h-32 text-purple-400" /></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <span className="inline-block rounded-full bg-purple-500/20 border border-purple-500/30 px-2.5 py-0.5 text-[10px] md:text-xs text-purple-300 font-bold mb-3">📊 분석</span>
                        <h2 className="text-base md:text-2xl font-bold mb-1 md:mb-2 leading-tight break-keep">프랜차이즈 분석</h2>
                        <p className="text-slate-400 text-[10px] md:text-sm font-medium break-keep">매출, 창업비용 등<br/>핵심 데이터 비교</p>
                    </div>
                    <div className="mt-4 md:mt-8"><span className="inline-flex items-center gap-1.5 text-[10px] md:text-sm font-bold text-purple-400 group-hover:text-white transition-colors">분석하기 <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4"/></span></div>
                </div>
            </Link>
        </section>

        {/* ... (이하 나머지 섹션은 기존 코드와 100% 동일하므로 생략) ... */}
        {/* 기존 섹션들 (성공사례 리스트, 인기 브랜드, 배너, 매거진 등) 그대로 유지 */}
        <section className="relative group/section">
            <div className="flex items-end justify-between mb-3 md:mb-6 px-1">
                <div><h3 className="text-base md:text-2xl font-bold text-slate-900">프랜차이즈 실제 성공사례</h3><p className="text-[10px] md:text-sm text-slate-500 mt-0.5 md:mt-1">검증된 사장님들의 이야기</p></div>
                <Link href="/cases" className="text-[10px] md:text-sm font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-0.5 md:gap-1 transition-colors">전체 <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4"/></Link>
            </div>
            
            {loading ? <div className="h-20 md:h-40 flex items-center justify-center text-xs md:text-sm text-slate-400">로딩 중...</div> : cases.length === 0 ? <div className="h-20 md:h-40 flex items-center justify-center text-xs md:text-sm text-slate-400">데이터 없음</div> : (
                <div className="relative">
                    <button onClick={() => scroll(caseRef, 'left')} className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hidden md:flex items-center justify-center hover:scale-110"><ChevronLeftIcon className="w-4 h-4 md:w-6 md:h-6" /></button>
                    <div ref={caseRef} className="flex gap-2 md:gap-5 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory scroll-smooth">
                        {cases.map((item) => (
                            <Link href={`/cases/${item.id}`} key={item.id} className="group flex-shrink-0 bg-slate-800 rounded-xl md:rounded-3xl overflow-hidden shadow-lg border border-slate-700 hover:shadow-xl hover:border-slate-600 transition-all snap-start min-w-[32%] max-w-[32%] md:min-w-[280px] md:max-w-[320px]">
                                <div className="relative h-20 md:h-44 bg-slate-700 overflow-hidden">
                                    {item.main_image ? <Image src={item.main_image} alt={item.brand_name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-[8px] md:text-sm text-slate-400">No Img</div>}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                                    <div className="absolute bottom-1 left-1.5 md:hidden"><span className="text-[9px] font-bold text-white leading-none shadow-sm">{item.brand_name}</span></div>
                                    <div className="absolute top-3 left-3 hidden md:block"><span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 shadow-sm">성공사례</span></div>
                                </div>
                                <div className="p-2 md:p-5 space-y-1 md:space-y-0">
                                    <div className="mb-3 md:mb-4 hidden md:block"><h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight mb-1">{item.brand_name}</h3><span className="text-xs text-slate-400">{item.branch_name}</span></div>
                                    <div className="md:space-y-2 md:bg-slate-700/50 md:p-4 md:rounded-2xl border border-transparent md:border-slate-600/30">
                                        <div className="flex justify-between items-center text-[9px] md:text-sm"><span className="text-slate-400">매출</span><span className="font-bold text-slate-200">{formatMoney(item.monthly_sales)}</span></div>
                                        <div className="flex justify-between items-center text-[9px] md:text-sm"><span className="text-slate-400">순수익</span><span className="font-bold text-emerald-400">{formatMoney(item.net_profit)}</span></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <button onClick={() => scroll(caseRef, 'right')} className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hidden md:flex items-center justify-center hover:scale-110"><ChevronRightIcon className="w-4 h-4 md:w-6 md:h-6" /></button>
                </div>
            )}
        </section>

        <section className="relative group/section py-4 md:py-10 border-y border-slate-100 md:border-slate-200">
            <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-6 px-1"><FireIcon className="w-4 h-4 md:w-6 md:h-6 text-red-500" /><div><h3 className="text-base md:text-2xl font-bold text-slate-900">요즘 뜨는 인기 브랜드</h3><p className="text-[10px] md:text-xs text-slate-500 mt-0.5 md:mt-1">많이 찾아본 브랜드 TOP 10</p></div></div>
            {loading ? <div className="h-20 md:h-40 flex items-center justify-center text-xs md:text-sm text-slate-400">로딩 중...</div> : popularFranchises.length === 0 ? <div className="h-20 md:h-40 flex items-center justify-center text-xs md:text-sm text-slate-400">데이터 없음</div> : (
                <div className="relative">
                    <button onClick={() => scroll(popularRef, 'left')} className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hidden md:flex items-center justify-center hover:scale-110"><ChevronLeftIcon className="w-4 h-4 md:w-6 md:h-6" /></button>
                    <div ref={popularRef} className="flex gap-2 md:gap-5 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory scroll-smooth">
                        {popularFranchises.map((brand) => (
                            <Link key={brand.id} href={`/franchise/popular/${brand.id}`} className="group flex-shrink-0 bg-slate-800 rounded-xl md:rounded-3xl overflow-hidden shadow-lg border border-slate-700 hover:shadow-xl hover:border-slate-600 transition-all snap-start min-w-[32%] max-w-[32%] md:min-w-[280px] md:max-w-[320px]">
                                <div className="relative h-20 md:h-44 bg-slate-700 overflow-hidden">
                                    {brand.main_image ? <Image src={brand.main_image} alt={brand.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-[8px] md:text-sm text-slate-500">No Img</div>}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                                    <div className="absolute bottom-1 left-1.5 md:hidden"><span className="text-[9px] font-bold text-white leading-none shadow-sm">{brand.name}</span></div>
                                    <div className="absolute top-3 left-3 hidden md:block"><span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 shadow-sm">{brand.category}</span></div>
                                </div>
                                <div className="p-2 md:p-5 space-y-1 md:space-y-0">
                                    <div className="mb-3 md:mb-4 hidden md:block"><h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight mb-1">{brand.name}</h3><span className="text-xs text-slate-400">{brand.slogan || brand.category}</span></div>
                                    <div className="md:space-y-2 md:bg-slate-700/50 md:p-4 md:rounded-2xl border border-transparent md:border-slate-600/30">
                                        <div className="flex justify-between items-center text-[9px] md:text-sm"><span className="text-slate-400">평균매출</span><span className="font-bold text-slate-200">{formatMoney(brand.avg_sales)}</span></div>
                                        <div className="flex justify-between items-center text-[9px] md:text-sm"><span className="text-slate-400">창업비용</span><span className="font-bold text-slate-300">{formatMoney(brand.startup_cost)}</span></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <button onClick={() => scroll(popularRef, 'right')} className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hidden md:flex items-center justify-center hover:scale-110"><ChevronLeftIcon className="w-4 h-4 md:w-6 md:h-6" /></button>
                </div>
            )}
        </section>

        <section><RollingBanner location="main" /></section>

        <section>
            <div className="flex items-end justify-between mb-3 md:mb-6 px-1"><div><h3 className="text-base md:text-2xl font-bold text-slate-900 flex items-center gap-1 md:gap-2"><BookOpenIcon className="w-4 h-4 md:w-6 md:h-6 text-indigo-600"/> 창업 매거진</h3><p className="text-[10px] md:text-sm text-slate-500 mt-0.5 md:mt-1">창업 트렌드</p></div><Link href="/magazine" className="text-[10px] md:text-sm font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-0.5 md:gap-1 transition-colors">더보기 <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4"/></Link></div>
            {magazines.length > 0 ? (
                <div className="relative">
                    <button onClick={() => scroll(magazineRef, 'left')} className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hidden md:flex items-center justify-center hover:scale-110"><ChevronLeftIcon className="w-4 h-4 md:w-6 md:h-6" /></button>
                    <div ref={magazineRef} className="flex gap-2 md:gap-6 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory scroll-smooth">
                        {magazines.map((article) => (
                            <Link key={article.id} href={`/magazine/${article.id}`} className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md md:hover:shadow-lg transition-all md:hover:-translate-y-1 block flex-shrink-0 snap-start min-w-[32%] max-w-[32%] md:min-w-[300px] md:flex md:items-center">
                                <div className="relative w-full aspect-[4/3] md:w-32 md:h-32 md:aspect-auto bg-slate-200 overflow-hidden md:shrink-0">
                                    {article.thumbnail_url ? <Image src={article.thumbnail_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : null}
                                    <div className="absolute top-1 left-1 md:top-2 md:left-2"><span className="bg-white/90 backdrop-blur px-1 py-0.5 md:px-2 md:py-1 rounded text-[8px] md:text-[10px] font-bold text-slate-900">{article.category}</span></div>
                                </div>
                                <div className="p-2 md:p-4 h-16 md:h-32 flex flex-col justify-between md:flex-1">
                                    <h4 className="font-bold text-slate-900 text-[10px] md:text-lg leading-snug line-clamp-2 md:line-clamp-1 group-hover:text-indigo-600 transition-colors">{article.title}</h4>
                                    <p className="text-sm text-slate-500 line-clamp-2 hidden md:block mt-1">{article.subtitle || article.title}</p>
                                    <div className="md:mt-3 md:pt-3 md:border-t md:border-slate-50 text-[8px] md:text-xs text-slate-400 flex justify-between mt-auto">
                                        <span className="hidden md:block">{article.author}</span>
                                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <button onClick={() => scroll(magazineRef, 'right')} className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hidden md:flex items-center justify-center hover:scale-110"><ChevronLeftIcon className="w-4 h-4 md:w-6 md:h-6" /></button>
                </div>
            ) : <div className="py-6 md:py-10 text-center text-xs md:text-sm text-slate-400 bg-slate-50 rounded-xl md:rounded-2xl">등록된 매거진이 없습니다.</div>}
        </section>

        <div className="bg-indigo-50/60 rounded-2xl md:rounded-3xl py-2 px-3 md:py-4 md:px-5 border border-indigo-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-indigo-200/20 rounded-full blur-2xl md:blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
             <div className="relative w-full">
                <RecentViews /> 
             </div>
        </div>

        <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl mb-6 md:mb-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-12">
               <div className="text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] md:text-xs font-bold text-indigo-300 mb-3 md:mb-4 backdrop-blur-md">
                     <SparklesIcon className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                     <span>Customer Center</span>
                  </div>
                  <h2 className="text-[17px] md:text-3xl font-bold text-white leading-snug break-keep tracking-tight">
                     궁금하신 사항 또는 제안 내용을<br className="md:hidden" /> 저희에게 알려주세요.
                  </h2>
                  <p className="mt-2 md:mt-4 text-xs md:text-sm text-slate-400 font-medium break-keep leading-relaxed">
                     창업에 관한 사항, 성공사례 공유, 앱개선 요청 등<br className="hidden md:block"/> 무엇이든 문의/제안주세요.
                  </p>
               </div>
               <div className="flex w-full md:w-auto gap-3 shrink-0">
                  <button onClick={() => handleOpenInquiry('일반문의')} className="flex-1 md:flex-none py-3.5 px-6 md:py-4 md:px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm md:text-base shadow-lg shadow-indigo-900/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap">
                     <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                     문의하기
                  </button>
                  <button onClick={() => handleOpenInquiry('제안')} className="flex-1 md:flex-none py-3.5 px-6 md:py-4 md:px-8 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-bold text-sm md:text-base backdrop-blur-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap">
                     <LightBulbIcon className="w-5 h-5 text-yellow-300" />
                     제안하기
                  </button>
               </div>
            </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

// InquiryPopup 컴포넌트는 기존과 동일
function InquiryPopup({ title, category, onClose }: { title: string; category: string; onClose: () => void }) {
    const [form, setForm] = useState({ name: '', phone: '', email: '', content: '' });
    const [loading, setLoading] = useState(false);
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  
    const handleSubmit = async () => {
      if (!form.name || !form.phone) return alert('이름과 연락처는 필수입니다.');
      setLoading(true);
  
      try {
        const { error } = await supabase.from('inquiries').insert([
          {
            brand_id: 'main', 
            brand_name: '메인 페이지 접수', 
            user_name: form.name,
            user_phone: form.phone,
            email: form.email,
            content: form.content,
            category: category 
          }
        ]);
  
        if (error) throw error;
  
        alert('성공적으로 접수되었습니다!\n소중한 의견 감사합니다.');
        onClose();
      } catch (err: any) {
        console.error(err);
        alert('접수 중 오류가 발생했습니다: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
            <div><p className="text-xs text-indigo-300 font-bold mb-1">고객 센터</p><h3 className="text-xl font-black">{title}</h3></div>
            <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><XMarkIcon className="w-6 h-6 text-white"/></button>
          </div>
          <div className="p-6 space-y-4">
            <div><label className="block text-xs font-bold text-slate-500 mb-1">이름 / 닉네임 <span className="text-red-500">*</span></label><input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-800" placeholder="홍길동" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-slate-500 mb-1">연락처 <span className="text-red-500">*</span></label><input type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-800" placeholder="010-1234-5678" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-slate-500 mb-1">이메일 (선택)</label><input type="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-800" placeholder="example@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-slate-500 mb-1">내용 (선택)</label><textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-800 h-24 resize-none" placeholder="문의 또는 제안하실 내용을 자유롭게 적어주세요." value={form.content} onChange={e => setForm({...form, content: e.target.value})}></textarea></div>
            <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 text-lg mt-2 flex justify-center">{loading ? '접수 중...' : '접수하기'}</button>
          </div>
        </div>
      </div>
    );
  }