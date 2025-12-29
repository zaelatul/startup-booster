'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js'; 
import { FRANCHISE_CATEGORIES } from '@/lib/franchise-data'; 
import { 
  MagnifyingGlassIcon, FunnelIcon, FireIcon, PlusIcon, 
  CurrencyDollarIcon, UserGroupIcon, ChartBarIcon, ChevronDownIcon
} from '@heroicons/react/24/solid';
import RollingBanner from '@/components/home/RollingBanner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const QUICK_FILTERS = [
  { id: 'default', name: '✨ 추천순', icon: FireIcon },
  { id: 'stores_desc', name: '🛡️ 가맹점순', icon: UserGroupIcon },
  { id: 'startup_asc', name: '💰 소자본순', icon: CurrencyDollarIcon },
];

export default function FranchiseExplorePage() {
  const [dbList, setDbList] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  
  const INITIAL_COUNT = 6;
  const LOAD_STEP = 6;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT); 

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('franchises')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        const mappedData = data.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category || '기타',
          description: item.description || '',
          avgSales: item.avg_revenue?.nationwide || 0,
          startupCost: item.initial_costs?.totalAvg || 0,
          storeCount: item.store_summary?.total || 0,
          heroImage: item.hero_image || item.logo_url, 
          tags: item.tags || [],
          isHot: item.is_popular || false, 
          rankChange: 0 
        }));
        setDbList(mappedData);
      } else {
        console.error('데이터 가져오기 실패:', error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredList = useMemo(() => {
    let result = dbList.filter((brand) => {
      const catName = FRANCHISE_CATEGORIES.find(c => c.id === activeCategory)?.name;
      const isCategoryMatch = activeCategory === 'all' || brand.category === catName;
      const isSearchMatch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
      return isCategoryMatch && isSearchMatch;
    });

    return result.sort((a, b) => {
      if (sortBy === 'default') {
        if (a.isHot && !b.isHot) return -1;
        if (!a.isHot && b.isHot) return 1;
        return b.avgSales - a.avgSales;
      }
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
    if (val >= 10000) return `${(val / 10000).toFixed(1)}억`;
    return `${(val / 1000).toFixed(0)}천`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. 상단 롤링 배너 */}
      <div className="max-w-6xl mx-auto px-0 md:px-4 mt-0 md:mt-6">
         <div className="h-20 md:h-44 overflow-hidden shadow-sm md:rounded-2xl">
            <RollingBanner location="franchise" />
         </div>
      </div>

      {/* 2. 컨트롤 헤더 */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm mt-2 md:mt-4">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center mb-3">
             <h1 className="text-lg md:text-2xl font-bold text-slate-900">프랜차이즈 분석</h1>
             <span className="text-xs font-bold text-slate-500">총 {filteredList.length}개</span>
          </div>
          
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
            {/* 3열 그리드 */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-5">
              {visibleList.map((brand) => (
                <Link 
                  href={`/franchise/${brand.id}`} 
                  key={brand.id} 
                  // [수정] 테두리 강화 및 호버 효과 추가
                  // 1. border-slate-300: 기본 테두리를 더 진하게
                  // 2. hover:border-indigo-500: 호버 시 테두리 색상 변경
                  // 3. hover:-translate-y-1: 호버 시 살짝 떠오름
                  // 4. hover:shadow-xl: 호버 시 그림자 강화
                  // 5. duration-300: 부드러운 전환
                  className="bg-white rounded-xl border border-slate-300 overflow-hidden hover:shadow-xl hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 group block"
                >
                  {/* 이미지 영역 */}
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
                      {brand.isHot && <span className="bg-red-600 text-white px-1 py-0.5 rounded-[4px] text-[8px] font-bold shadow-md">HOT</span>}
                    </div>
                  </div>
                  
                  {/* 정보 영역: 7단계 메탈 그레이 (Dark Slate) */}
                  <div className="p-2 md:p-4 bg-gradient-to-b from-slate-700 to-slate-800 border-t border-slate-600">
                    <h3 className="text-xs md:text-lg font-bold text-white mb-1 truncate leading-tight tracking-wide drop-shadow-sm">
                      {brand.name}
                    </h3>
                    
                    <p className="hidden md:block text-xs text-slate-300 line-clamp-1 mb-3">{brand.description}</p>
                    
                    <div className="flex flex-col gap-0.5 md:gap-2">
                      <div className="flex justify-between items-center text-[9px] md:text-xs">
                        <span className="text-slate-400 font-medium">평균매출</span>
                        <span className={`font-bold ${sortBy === 'default' ? 'text-indigo-300' : 'text-white'}`}>
                          {formatMoney(brand.avgSales)}
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

            {/* 더보기 버튼 */}
            {hasMore && (
               <div className="mt-8 mb-8 text-center">
                  <button 
                    onClick={handleLoadMore}
                    className="inline-flex items-center gap-1 px-6 py-2.5 bg-white border border-slate-300 rounded-full text-slate-600 text-xs md:text-sm font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
                  >
                      더보기 ({visibleCount}/{filteredList.length}) <ChevronDownIcon className="w-3 h-3" />
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