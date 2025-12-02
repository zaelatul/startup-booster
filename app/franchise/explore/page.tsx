'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BRANDS } from '@/lib/reco';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/solid';

type AnyBrand = any;
const INITIAL_LIMIT = 12; 
const LOAD_MORE_STEP = 8; 

// 배너 데이터
const PROMO_BANNERS = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070', title: '🚀 2024 상반기 창업 트렌드', description: '지금 가장 주목받는 프랜차이즈 핵심 정보', link: '#', bgColor: 'bg-[#1E293B]', textColor: 'text-white' },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1559925393-8be15074f927?q=80&w=2070', title: '☕ 카페 창업 A to Z', description: '성공적인 카페 창업을 위한 가이드', link: '#', bgColor: 'bg-[#0F172A]', textColor: 'text-white' },
];

// 유틸 함수
function safeNumber(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
function fmtKRWShort(value?: number): string {
  if (!value) return '-';
  const v = Math.round(value);
  if (v >= 100_000_000) return `${(v / 100_000_000).toFixed(1)}억`;
  return `${(v / 10000).toLocaleString()}만`;
}
function fmtPCT(value?: number): string {
  if (value === undefined) return '-';
  return `${Number(value).toFixed(1)}%`;
}

// 뷰모델 변환
type ExploreBrand = {
  id: string; name: string; primaryCategoryLabel: string; midCategoryName?: string;
  avgSales?: number; avgSalesShort: string; openRateRecent?: number; closeRateRecent?: number;
  profitMargin?: number; storesTotal?: number; establishedYear?: number;
  heroImage?: string; detailHref: string; startupCost?: number; 
};

function toExploreBrand(raw: AnyBrand): ExploreBrand {
  const id = raw?.id ?? raw?.brandId ?? 'unknown';
  const name = raw?.name ?? raw?.brandName ?? '브랜드명 없음';
  const avgSales = safeNumber(raw?.avgSales ?? raw?.average_sales);
  const storesTotal = safeNumber(raw?.stores ?? raw?.branch_count);
  const feeJoin = safeNumber(raw?.feeJoin ?? raw?.franchise_fee) || 0;
  const feeTraining = safeNumber(raw?.feeTraining ?? raw?.training_fee) || 0;
  
  let heroImage = raw?.mainImage ?? raw?.image_url;

  return {
    id: String(id),
    name,
    primaryCategoryLabel: raw?.category ?? '업종미상',
    midCategoryName: raw?.midCategoryName,
    avgSales,
    avgSalesShort: fmtKRWShort(avgSales),
    openRateRecent: safeNumber(raw?.openRateRecent),
    closeRateRecent: safeNumber(raw?.closeRateRecent ?? 0),
    profitMargin: safeNumber(raw?.profitMargin),
    storesTotal,
    establishedYear: safeNumber(raw?.establishedYear ?? raw?.established_year),
    heroImage,
    detailHref: `/franchise/brand/${id}`,
    startupCost: feeJoin + feeTraining,
  };
}

export default function FranchiseExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState<string>('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [visibleLimit, setVisibleLimit] = useState<number>(INITIAL_LIMIT);

  const MIDDLE_CATS = [
    { key: '한식', label: '🍚 한식' }, { key: '치킨', label: '🍗 치킨' }, 
    { key: '커피', label: '☕ 카페' }, { key: '분식', label: '🍢 분식' },
    { key: '주류', label: '🍺 호프/주점' }, { key: '패스트푸드', label: '🍔 버거/피자' }, 
    { key: '일식', label: '🍣 일식' }, { key: '중식', label: '🥟 중식' },
    { key: '제과제빵', label: '🍞 베이커리' }, { key: '편의점', label: '🏪 편의점/마트' },
    { key: '화장품', label: '💄 화장품' }, { key: '이미용', label: '💇‍♀️ 미용/뷰티' },
    { key: '의류', label: '👕 의류/패션' }, { key: '도소매', label: '🛒 도소매/유통' },
    { key: '서비스', label: '🛠 서비스/기타' },
  ];

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
    const cats = searchParams.getAll('cat');
    if(cats.length) setSelectedCats(cats);
  }, [searchParams]);

  // [데이터 로드]
  const filteredBrands = useMemo(() => {
    let rawList = (BRANDS as AnyBrand[]) || [];

    // [데이터 뻥튀기] 더보기 버튼 테스트용
    if (rawList.length > 0) {
      const expandedList = [];
      for (let i = 0; i < 20; i++) {
        rawList.forEach((original) => {
          expandedList.push({
            ...original,
            id: `${original.id}-${i}`, 
          });
        });
      }
      rawList = expandedList;
    }

    let list = rawList.map(toExploreBrand);
    
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(b => b.name.toLowerCase().includes(q) || b.primaryCategoryLabel.toLowerCase().includes(q));
    }

    if (selectedCats.length > 0) {
      list = list.filter(b => selectedCats.some(c => b.primaryCategoryLabel.includes(c)));
    }

    return list;
  }, [query, selectedCats]);

  // [핵심] 화면에 보여줄 데이터 자르기 (이게 없어서 에러 났었음!)
  const visibleBrands = filteredBrands.slice(0, visibleLimit);

  const toggleCategory = (key: string) => {
    const newCats = selectedCats.includes(key) ? [] : [key]; 
    setSelectedCats(newCats);
    setVisibleLimit(INITIAL_LIMIT);
  };

  const scrollMenu = (dir: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">프랜차이즈 찾기</h1>
            <span className="bg-[#1E293B] text-white text-[10px] px-2 py-0.5 rounded font-bold">BETA</span>
          </div>
        </header>

        <section className="mb-8 rounded-2xl overflow-hidden shadow-lg border border-slate-700/10">
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4000 }} loop={true} className="h-40 md:h-56">
            {PROMO_BANNERS.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className={`relative w-full h-full ${banner.bgColor} flex items-center px-8`}>
                   <div className="relative z-10 max-w-lg">
                      <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur rounded text-[10px] text-white font-bold mb-2">추천 창업</span>
                      <h2 className="text-xl md:text-3xl font-bold text-white mb-1">{banner.title}</h2>
                      <p className="text-xs md:text-sm text-slate-300">{banner.description}</p>
                   </div>
                   <div className="absolute right-0 top-0 w-1/2 h-full opacity-40 mix-blend-overlay" style={{backgroundImage: `url(${banner.imageUrl})`, backgroundSize: 'cover'}} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="브랜드명 또는 업종(예: 편의점) 검색" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl border-none shadow-md text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 placeholder:font-normal"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        </div>

        <div className="relative group mb-8">
           <button onClick={() => scrollMenu('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 shadow rounded-full flex items-center justify-center text-slate-600 md:hidden"><ChevronLeftIcon className="w-4 h-4"/></button>
           <div ref={scrollContainerRef} className="flex gap-2 overflow-x-auto scrollbar-hide px-1 pb-1">
              {MIDDLE_CATS.map((cat) => (
                <button 
                  key={cat.key} 
                  onClick={() => toggleCategory(cat.key)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                    selectedCats.includes(cat.key) ? 'bg-[#1E293B] text-white ring-2 ring-slate-700' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
           </div>
           <button onClick={() => scrollMenu('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 shadow rounded-full flex items-center justify-center text-slate-600 md:hidden"><ChevronRightIcon className="w-4 h-4"/></button>
        </div>

        <section>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {visibleBrands.map((b) => (
                <Link key={b.id} href={b.detailHref} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all hover:-translate-y-1">
                   <div className="relative h-32 bg-slate-200 overflow-hidden">
                      {b.heroImage ? (
                        <img src={b.heroImage} alt={b.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">NO IMAGE</div>
                      )}
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm border border-white/10">
                        {b.primaryCategoryLabel}
                      </div>
                   </div>
                   
                   <div className="p-4 bg-[#1E293B] border-t border-slate-700">
                      <h3 className="font-bold text-white text-sm md:text-base mb-3 line-clamp-1 group-hover:text-indigo-400 transition-colors">{b.name}</h3>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-slate-400">평균 매출</span>
                           <span className="font-bold text-indigo-300">{b.avgSalesShort}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-slate-400">가맹점 수</span>
                           <span className="font-bold text-slate-200">{b.storesTotal}개</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-slate-400">폐업률</span>
                           <span className={`font-bold ${Number(b.closeRateRecent) > 5 ? 'text-red-400' : 'text-emerald-400'}`}>{fmtPCT(b.closeRateRecent)}</span>
                        </div>
                      </div>
                   </div>
                </Link>
              ))}
           </div>
           
           {visibleBrands.length === 0 && (
             <div className="py-20 text-center">
               <p className="text-slate-500 font-bold">검색 결과가 없습니다.</p>
               <button onClick={() => { setQuery(''); setSelectedCats([]); setVisibleLimit(INITIAL_LIMIT); }} className="mt-4 px-6 py-2 bg-slate-200 rounded-full text-sm font-bold text-slate-700">초기화</button>
             </div>
           )}

           {visibleBrands.length < filteredBrands.length && (
             <div className="mt-10 text-center pb-10">
               <button 
                 onClick={() => setVisibleLimit(prev => prev + LOAD_MORE_STEP)} 
                 className="inline-flex items-center gap-2 px-10 py-3.5 bg-white border-2 border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all active:scale-95"
               >
                 <PlusIcon className="w-4 h-4" />
                 더 보기 ({visibleBrands.length} / {filteredBrands.length})
               </button>
             </div>
           )}
        </section>
      </div>
    </main>
  );
}