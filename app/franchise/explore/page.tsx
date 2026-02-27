'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import { FRANCHISE_CATEGORIES } from '@/lib/franchise-data'; 
import { 
 MagnifyingGlassIcon, FireIcon, 
 CurrencyDollarIcon, UserGroupIcon, ChartBarIcon, ChevronDownIcon
} from '@heroicons/react/24/solid';
import RollingBanner from '@/components/home/RollingBanner';

const QUICK_FILTERS = [
  { id: 'default', name: '✨ 추천순', icon: FireIcon }, 
  { id: 'revenue', name: '💰 평균 매출순', icon: ChartBarIcon },
  { id: 'revenuePerPyeong', name: '📈 평당 매출순', icon: ChartBarIcon },
  { id: 'stores_desc', name: '🛡️ 가맹점순', icon: UserGroupIcon },
  { id: 'startup_asc', name: '🪙 소자본순', icon: CurrencyDollarIcon },
];

export default function FranchiseExplorePage() {
  const [dbList, setDbList] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
   
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
   
  const INITIAL_COUNT = 12; 
  const LOAD_STEP = 12; 
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT); 

  // ✅ [수정됨] useMemo 안에도 안전장치 추가! (빌드 에러 방지)
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  ), []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('franchises')
        .select('*')
        .order('priority', { ascending: false }) 
        .order('created_at', { ascending: false });

      if (data) {
        const mappedData = data.map((item) => {
            let avgSales = 0;
            let avgSalesPerPyeong = 0;

            if (typeof item.avg_revenue === 'object') {
                avgSales = item.avg_revenue?.total || item.avg_revenue?.nationwide || 0;
                avgSalesPerPyeong = item.avg_revenue?.perPyeong || 0;
            } else {
                avgSales = item.avg_revenue || 0;
                avgSalesPerPyeong = item.avg_revenue_pyeong || 0; 
            }

            // ✅ [핵심 수정] 상세 페이지와 100% 동일한 이름표(Key)를 찾아서 합산 로직 적용
            const costs = item.initial_costs || {};
            const baseSizeM2 = item.base_size_m2 || 0;
            
            // 1. 개별 항목 추출 (snake_case와 camelCase 모두 대응하여 데이터 유실 방지)
            const joinFee = costs.join_fee || costs.joinFee || 0;
            const eduFee = costs.edu_fee || costs.eduFee || 0;
            const deposit = costs.deposit || 0;
            const other = costs.other || 0;
            const interiorPerPy = costs.interior || 0;

            // 2. 인테리어 총액 계산: (기준면적 / 3.3) * 평당 비용
            const calculatedInterior = Math.round((baseSizeM2 / 3.3) * interiorPerPy);
            
            // 3. 전체 합산: 가맹비 + 교육비 + 보증금 + 기타비용 + 인테리어비
            const calculatedStartupCost = joinFee + eduFee + deposit + other + calculatedInterior;

            return {
                id: item.id,
                name: item.name,
                category: item.category || '기타',
                description: item.description || '',
                avgSales: avgSales,
                avgSalesPerPyeong: avgSalesPerPyeong,
                startupCost: calculatedStartupCost, // ✅ 이제 정확히 126,260(1.26억)이 나옴
                storeCount: item.store_summary?.total || 0,
                heroImage: item.hero_image || item.logo_url, 
                tags: item.tags || [],
                isHot: item.is_popular || false, 
                priority: item.priority || 0, 
                rankChange: 0 
            };
        });
        setDbList(mappedData);
      } else {
        console.error('데이터 가져오기 실패:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  const filteredList = useMemo(() => {
    let result = dbList.filter((brand) => {
      const catName = FRANCHISE_CATEGORIES.find(c => c.id === activeCategory)?.name;
      const isCategoryMatch = activeCategory === 'all' || brand.category === catName;
      const isSearchMatch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
      return isCategoryMatch && isSearchMatch;
    });

    return result.sort((a, b) => {
      if (sortBy === 'default') {
        if (a.priority !== b.priority) {
            return b.priority - a.priority; 
        }
        if (a.isHot && !b.isHot) return -1;
        if (!a.isHot && b.isHot) return 1;
        return 0;
      }
      if (sortBy === 'revenue') return b.avgSales - a.avgSales;
      if (sortBy === 'revenuePerPyeong') return b.avgSalesPerPyeong - a.avgSalesPerPyeong;
      if (sortBy === 'stores_desc') return b.storeCount - a.storeCount;
      if (sortBy === 'startup_asc') return a.startupCost - b.startupCost;
      return 0;
    });
  }, [dbList, activeCategory, searchTerm, sortBy]);

  const visibleList = filteredList.slice(0, visibleCount);
  const hasMore = visibleCount < filteredList.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_STEP);
  };

  const formatMoney = (val: number) => {
    if (!val) return '-';
    if (val >= 100000) {
       const eok = Math.floor((val / 100000) * 100) / 100;
       return `${eok}억`;
    }
    const man = Math.round(val / 10);
    return `${man.toLocaleString()}만원`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. 상단 롤링 배너 (사이즈 통일) */}
      <div className="max-w-6xl mx-auto px-0 md:px-4 mt-0 md:mt-6">
         <div className="w-full aspect-[1920/500] overflow-hidden shadow-sm md:rounded-2xl">
            <RollingBanner location="franchise" />
         </div>
      </div>

      {/* 2. 컨트롤 헤더 */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm mt-2 md:mt-4">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center mb-1">
             <h1 className="text-lg md:text-2xl font-bold text-slate-900">프랜차이즈 분석</h1>
             <span className="text-xs font-bold text-slate-500">총 {filteredList.length}개</span>
          </div>
          
          <p className="text-[10px] md:text-xs font-bold text-emerald-600 mb-3 break-keep leading-snug">
            [창업비용 : 각 브랜드별 제공된 &apos;정보공개서&apos; 기준의 평수/비용을 반영]
          </p>
          
          <div className="relative mb-3">
            <input 
              type="text" 
              placeholder="브랜드명 검색 (예: 메가커피)" 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl border-none text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FRANCHISE_CATEGORIES.map((cat) => (
              <button
                key={cat.id} 
                onClick={() => { setActiveCategory(cat.id); setVisibleCount(INITIAL_COUNT); }}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${
                  activeCategory === cat.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 리스트 영역 */}
      <main className="max-w-6xl mx-auto px-2 md:px-4 py-4 md:py-6">
        
        {/* 빠른 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
            {QUICK_FILTERS.map((filter) => (
            <button
                key={filter.id}
                onClick={() => setSortBy(filter.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] md:text-xs font-bold whitespace-nowrap border ${
                sortBy === filter.id
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
            >
                <filter.icon className={`w-3 h-3 ${sortBy === filter.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                {filter.name}
            </button>
            ))}
        </div>

        {loading && <div className="py-20 text-center text-slate-400 text-xs">로딩 중...</div>}

        {!loading && visibleList.length > 0 ? (
          <>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-5">
              {visibleList.map((brand) => (
                <Link 
                  href={`/franchise/brand/${brand.id}`} 
                  key={brand.id} 
                  className="bg-white rounded-xl border border-slate-300 overflow-hidden hover:shadow-xl hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 group block"
                >
                  <div className="relative h-20 md:h-40 bg-slate-100">
                    {brand.heroImage ? (
                      <Image 
                        src={brand.heroImage} 
                        alt={brand.name} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                        sizes="(max-width: 768px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Img</div>
                    )}
                    <div className="absolute top-1 left-1 flex gap-0.5">
                      {brand.priority > 0 && <span className="bg-indigo-600 text-white px-1 py-0.5 rounded-[4px] text-[8px] font-bold shadow-md">PICK</span>}
                      {brand.isHot && <span className="bg-red-600 text-white px-1 py-0.5 rounded-[4px] text-[8px] font-bold shadow-md">HOT</span>}
                    </div>
                  </div>
                  
                  <div className="p-2 md:p-4 bg-gradient-to-b from-slate-700 to-slate-800 border-t border-slate-600">
                    <h3 className="text-xs md:text-lg font-bold text-white mb-1 truncate leading-tight tracking-wide drop-shadow-sm">
                      {brand.name}
                    </h3>
                    
                    <p className="hidden md:block text-xs text-slate-300 line-clamp-1 mb-3">{brand.description}</p>
                    
                    <div className="flex flex-col gap-0.5 md:gap-2">
                      <div className="flex justify-between items-center text-[9px] md:text-xs">
                        <span className="text-slate-400 font-medium">연평균 매출</span>
                        <span className={`font-bold ${sortBy === 'revenue' ? 'text-indigo-300' : 'text-white'}`}>
                          {formatMoney(brand.avgSales)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[9px] md:text-xs">
                        <span className="text-slate-400 font-medium">평당매출</span>
                        <span className={`font-bold ${sortBy === 'revenuePerPyeong' ? 'text-indigo-300' : 'text-slate-200'}`}>
                          {formatMoney(brand.avgSalesPerPyeong)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[9px] md:text-xs">
                        <span className="text-slate-400 font-medium">창업비용</span>
                        <span className={`font-bold ${sortBy === 'startup_asc' ? 'text-indigo-300' : 'text-white'}`}>
                          {formatMoney(brand.startupCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
               <div className="mt-8 mb-8 text-center">
                  <button 
                    onClick={handleLoadMore}
                    className="inline-flex items-center gap-1 px-6 py-2.5 bg-white border border-slate-300 rounded-full text-slate-600 text-xs md:text-sm font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
                  >
                      더보기 ({Math.min(visibleCount, filteredList.length)}/{filteredList.length}) <ChevronDownIcon className="w-3 h-3" />
                  </button>
               </div>
            )}
          </>
        ) : !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-slate-400 font-bold mb-1 text-sm">검색 결과가 없습니다.</p>
            <p className="text-xs text-slate-400">다른 키워드로 검색해보세요.</p>
          </div>
        )}
      </main>
    </div>
  );
}