'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RollingBanner from '@/components/home/RollingBanner';
import RecentViews from '@/components/home/RecentViews'; 
import InquiryModal from '@/components/InquiryModal';
import { 
  CheckCircleIcon, ChartBarIcon, ChevronRightIcon, ChevronLeftIcon,
  FireIcon, EnvelopeIcon, SparklesIcon, BookOpenIcon
} from '@heroicons/react/24/solid';
import { createBrowserClient } from '@supabase/ssr';

export default function Home() {
  const caseRef = useRef<HTMLDivElement>(null);
  const popularRef = useRef<HTMLDivElement>(null);
  const magazineRef = useRef<HTMLDivElement>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      
      const { data: franchiseData } = await supabase
        .from('popular_franchises') 
        .select('*')
        .eq('is_active', true) 
        .order('priority', { ascending: false }) 
        .order('created_at', { ascending: false }) 
        .limit(9);

      const { data: magazineData } = await supabase
        .from('magazines')
        .select('*')
        .eq('is_published', true) 
        .order('created_at', { ascending: false })
        .limit(9);

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
    return `${(v/1000).toFixed(0)}천만`; 
  };

  const getJsonVal = (json: any, key: string) => {
    if (!json) return 0;
    if (typeof json === 'number') return json; 
    const obj = typeof json === 'string' ? JSON.parse(json) : json;
    return obj?.[key] || 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <InquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} category="메인 배너 문의" />

      {/* 1. 메인 히어로 */}
      <section className="w-full relative overflow-hidden bg-[#0F172A]">
         <div className="absolute inset-0 z-0">
            <Image src="/images/franchise-hero.jpg" alt="배경" fill className="object-cover opacity-60 md:opacity-80" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/50 via-[#0F172A]/30 to-[#0F172A]/10 md:from-[#0F172A]/80 md:to-transparent"></div>
         </div>
         <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-24 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
               <div className="flex-1 text-center md:text-left w-full">
                  <div className="flex justify-center md:justify-start mb-3">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-800/60 border border-slate-500/30 text-[10px] md:text-xs font-bold text-blue-300 backdrop-blur-sm shadow-sm">BETA v1.0</span>
                  </div>
                  <h1 className="text-xl md:text-5xl font-extrabold text-white leading-snug mb-3 md:mb-4 drop-shadow-xl shadow-black md:drop-shadow-none">
                     데이터로 증명된<br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200 md:from-blue-400 md:to-indigo-400 drop-shadow-md md:drop-shadow-none">창업 성공의 지름길</span>
                  </h1>
                  <p className="text-slate-100 md:text-slate-400 text-xs md:text-base mb-6 md:mb-8 leading-relaxed px-2 md:px-0 font-bold md:font-normal drop-shadow-md md:drop-shadow-none">
                     1,000개 이상의 실제 창업 데이터와 프랜차이즈 분석.<br className="md:hidden" />
                     예비 사장님의 성공적인 시작을 함께합니다.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                     <Link href="/magazine" className="px-5 py-3 md:px-6 md:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs md:text-sm transition-all shadow-lg flex items-center gap-2 border border-indigo-400/30"><BookOpenIcon className="w-4 h-4" /> 창업매거진</Link>
                     <Link href="/mbti" className="px-5 py-3 md:px-6 md:py-3 rounded-xl bg-slate-900/60 md:bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs md:text-sm border border-slate-500/50 md:border-slate-700 transition-all flex items-center gap-2 backdrop-blur-sm shadow-lg"><SparklesIcon className="w-4 h-4 text-yellow-400" /> 창업 MBTI</Link>
                  </div>
               </div>
               <div className="flex-1 w-full max-w-lg hidden md:block"></div>
            </div>
         </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 -mt-6 md:-mt-16 relative z-20 space-y-10 md:space-y-16">
        
        {/* 2. 핵심 메뉴 */}
        <section className="grid grid-cols-2 gap-3 md:gap-5">
            <Link href="/cases" className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#1E293B] p-5 md:p-8 text-white shadow-xl border border-slate-600/50 transition-all active:scale-95">
                <div className="absolute -bottom-3 -right-3 md:top-0 md:right-0 md:p-4 opacity-10 group-hover:opacity-20 transition-opacity"><CheckCircleIcon className="w-16 h-16 md:w-40 md:h-40 text-indigo-400" /></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <span className="inline-block rounded-md bg-indigo-500/20 px-2 py-0.5 md:px-2.5 md:py-1 text-[10px] md:text-xs text-indigo-300 font-bold mb-2 md:mb-4 border border-indigo-500/30">🔥 필독</span>
                        <h2 className="text-sm md:text-3xl font-bold mb-1 md:mb-2 leading-tight">실제 성공 사례</h2>
                        <p className="text-slate-400 text-[10px] md:text-sm">검증된 사장님들의<br/>리얼 인터뷰</p>
                    </div>
                    <div className="mt-3 md:mt-6"><span className="inline-flex items-center gap-1 text-[10px] md:text-sm font-bold text-indigo-300 group-hover:text-white transition-colors">보러가기 <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4"/></span></div>
                </div>
            </Link>
            <Link href="/franchise/explore" className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#1E293B] p-5 md:p-8 text-white shadow-xl border border-slate-600/50 transition-all active:scale-95">
                 <div className="absolute -bottom-3 -right-3 md:top-0 md:right-0 md:p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ChartBarIcon className="w-16 h-16 md:w-40 md:h-40 text-purple-400" /></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <span className="inline-block rounded-md bg-purple-500/20 px-2 py-0.5 md:px-2.5 md:py-1 text-[10px] md:text-xs text-purple-300 font-bold mb-2 md:mb-4 border border-purple-500/30">📊 분석</span>
                        <h2 className="text-sm md:text-3xl font-bold mb-1 md:mb-2 leading-tight">프랜차이즈 분석</h2>
                        <p className="text-slate-400 text-[10px] md:text-sm">매출, 폐업률 등<br/>핵심 지표 비교</p>
                    </div>
                    <div className="mt-3 md:mt-6"><span className="inline-flex items-center gap-1 text-[10px] md:text-sm font-bold text-purple-300 group-hover:text-white transition-colors">분석하기 <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4"/></span></div>
                </div>
            </Link>
        </section>

        {/* 3. 프랜차이즈 실제 성공사례 */}
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
                            <Link href={`/cases/${item.id}`} key={item.id} className="group flex-shrink-0 bg-white rounded-xl md:rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all snap-start
                                min-w-[32%] max-w-[32%] md:min-w-[280px] md:max-w-[320px]"
                            >
                                <div className="relative h-20 md:h-44 bg-slate-200 overflow-hidden">
                                    {item.main_image ? <Image src={item.main_image} alt={item.brand_name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-[8px] md:text-sm text-slate-400">No Img</div>}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:from-black/60 md:opacity-60"></div>
                                    <div className="absolute bottom-1 left-1.5 md:hidden"><span className="text-[9px] font-bold text-white leading-none">{item.brand_name}</span></div>
                                    <div className="absolute top-3 left-3 hidden md:block"><span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 shadow-sm">성공사례</span></div>
                                </div>
                                <div className="p-2 md:p-5 space-y-1 md:space-y-0">
                                    <div className="mb-3 md:mb-4 hidden md:block"><h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-1">{item.brand_name}</h3><span className="text-xs text-slate-500">{item.branch_name}</span></div>
                                    <div className="md:space-y-2 md:bg-slate-50 md:p-4 md:rounded-2xl">
                                        <div className="flex justify-between items-center text-[9px] md:text-sm"><span className="text-slate-400 md:text-slate-500">매출</span><span className="font-bold text-slate-800 md:text-slate-900">{formatMoney(item.monthly_sales)}</span></div>
                                        <div className="flex justify-between items-center text-[9px] md:text-sm"><span className="text-slate-400 md:text-slate-500">순수익</span><span className="font-bold text-emerald-600">{formatMoney(item.net_profit)}</span></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <button onClick={() => scroll(caseRef, 'right')} className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hidden md:flex items-center justify-center hover:scale-110"><ChevronRightIcon className="w-4 h-4 md:w-6 md:h-6" /></button>
                </div>
            )}
        </section>

        {/* 4. 요즘 뜨는 인기 브랜드 */}
        <section className="relative group/section py-4 md:py-10 border-y border-slate-100 md:border-slate-200">
            <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-6 px-1"><FireIcon className="w-4 h-4 md:w-6 md:h-6 text-red-500" /><div><h3 className="text-base md:text-2xl font-bold text-slate-900">요즘 뜨는 인기 브랜드</h3><p className="text-[10px] md:text-xs text-slate-500 mt-0.5 md:mt-1">많이 찾아본 브랜드 TOP 10</p></div></div>
            
            {loading ? <div className="h-20 md:h-40 flex items-center justify-center text-xs md:text-sm text-slate-400">로딩 중...</div> : popularFranchises.length === 0 ? <div className="h-20 md:h-40 flex items-center justify-center text-xs md:text-sm text-slate-400">데이터 없음</div> : (
                <div className="relative">
                    <button onClick={() => scroll(popularRef, 'left')} className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hidden md:flex items-center justify-center hover:scale-110"><ChevronLeftIcon className="w-4 h-4 md:w-6 md:h-6" /></button>
                    
                    <div ref={popularRef} className="flex gap-2 md:gap-5 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory scroll-smooth">
                        {popularFranchises.map((brand) => (
                            <Link key={brand.id} href={`/franchise/popular/${brand.id}`} className="group flex-shrink-0 bg-white rounded-xl md:rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all snap-start
                                min-w-[32%] max-w-[32%] md:min-w-[280px] md:max-w-[320px]"
                            >
                                <div className="relative h-20 md:h-44 bg-slate-200 overflow-hidden">
                                    {brand.main_image ? <Image src={brand.main_image} alt={brand.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-[8px] md:text-sm text-slate-500">No Img</div>}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:from-black/60 md:opacity-60"></div>
                                    <div className="absolute bottom-1 left-1.5 md:hidden"><span className="text-[9px] font-bold text-white leading-none">{brand.name}</span></div>
                                    <div className="absolute top-3 left-3 hidden md:block"><span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 shadow-sm">{brand.category}</span></div>
                                </div>
                                <div className="p-2 md:p-5 space-y-1 md:space-y-0">
                                    <div className="mb-3 md:mb-4 hidden md:block"><h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-1">{brand.name}</h3><span className="text-xs text-slate-500">{brand.slogan || brand.category}</span></div>
                                    <div className="md:space-y-2 md:bg-slate-50 md:p-4 md:rounded-2xl">
                                        <div className="flex justify-between items-center text-[9px] md:text-sm"><span className="text-slate-400 md:text-slate-500">평균매출</span><span className="font-bold text-slate-800 md:text-slate-900">{formatMoney(brand.avg_sales)}</span></div>
                                        <div className="flex justify-between items-center text-[9px] md:text-sm"><span className="text-slate-400 md:text-slate-500">창업비용</span><span className="font-bold text-slate-600 md:text-slate-700">{formatMoney(brand.startup_cost)}</span></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <button onClick={() => scroll(popularRef, 'right')} className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hidden md:flex items-center justify-center hover:scale-110"><ChevronRightIcon className="w-4 h-4 md:w-6 md:h-6" /></button>
                </div>
            )}
        </section>

        {/* 5. 롤링 배너 */}
        <section><RollingBanner location="main" /></section>

        {/* 6. 매거진 */}
        <section>
            <div className="flex items-end justify-between mb-3 md:mb-6 px-1"><div><h3 className="text-base md:text-2xl font-bold text-slate-900 flex items-center gap-1 md:gap-2"><BookOpenIcon className="w-4 h-4 md:w-6 md:h-6 text-indigo-600"/> 창업 매거진</h3><p className="text-[10px] md:text-sm text-slate-500 mt-0.5 md:mt-1">창업 트렌드</p></div><Link href="/magazine" className="text-[10px] md:text-sm font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-0.5 md:gap-1 transition-colors">더보기 <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4"/></Link></div>
            
            {magazines.length > 0 ? (
                <div className="relative">
                    <button onClick={() => scroll(magazineRef, 'left')} className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hidden md:flex items-center justify-center hover:scale-110"><ChevronLeftIcon className="w-4 h-4 md:w-6 md:h-6" /></button>
                    
                    <div ref={magazineRef} className="flex gap-2 md:gap-6 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory scroll-smooth">
                        {magazines.map((article) => (
                            <Link key={article.id} href={`/magazine/${article.id}`} className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md md:hover:shadow-lg transition-all md:hover:-translate-y-1 block flex-shrink-0 snap-start
                                min-w-[32%] max-w-[32%] md:min-w-[300px] md:flex md:items-center"
                            >
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
                    <button onClick={() => scroll(magazineRef, 'right')} className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-slate-600 shadow-md border border-slate-100 hidden md:flex items-center justify-center hover:scale-110"><ChevronRightIcon className="w-4 h-4 md:w-6 md:h-6" /></button>
                </div>
            ) : <div className="py-6 md:py-10 text-center text-xs md:text-sm text-slate-400 bg-slate-50 rounded-xl md:rounded-2xl">등록된 매거진이 없습니다.</div>}
        </section>

        {/* 7. 최근 본 창업 사례 (모바일 50% 축소 적용) */}
        <div className="bg-indigo-50/60 rounded-2xl md:rounded-3xl py-2 px-3 md:py-4 md:px-5 border border-indigo-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-indigo-200/20 rounded-full blur-2xl md:blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
             {/* [핵심 수정] 
                w-[200%] : 너비를 2배로 잡고
                scale-[0.5] : 0.5배로 축소 -> 결과적으로 1배 너비에 0.5배 크기 콘텐츠
                -mb-[25%] : 축소된 만큼 남는 하단 공백 제거 (약 25% 정도 당김)
             */}
             <div className="w-[200%] scale-[0.5] origin-top-left -mb-[25%] md:w-full md:scale-100 md:mb-0 md:origin-top-left">
                <RecentViews /> 
             </div>
        </div>

        {/* 8. 상담 배너 */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl md:shadow-2xl flex flex-col md:flex-row items-center text-center md:text-left gap-3 md:gap-8 relative overflow-hidden mb-6 md:mb-10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none hidden md:block"></div>
            <div className="relative z-10 md:flex-1">
                <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] md:text-xs font-bold mb-2 md:mb-4 border border-indigo-500/30">🚀 무료 상담</span>
                <h2 className="text-lg md:text-4xl font-extrabold text-white mb-1 md:mb-4 leading-snug md:leading-normal">
                    궁금한 점이 있나요?<br className="md:hidden"/>
                    <span className="text-indigo-400"> 전문가가 답변드립니다.</span>
                </h2>
                <p className="text-slate-400 text-[10px] md:text-sm leading-6 hidden md:block">
                    성공 사례, 프랜차이즈 상세 정보 등<br/>무엇이든 물어보세요.
                </p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="relative z-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 md:py-4 md:px-8 rounded-lg md:rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 text-xs md:text-base flex items-center gap-1 md:gap-2 whitespace-nowrap"><EnvelopeIcon className="w-3 h-3 md:w-5 md:h-5"/> 문의하기</button>
        </section>

      </main>
    </div>
  );
}