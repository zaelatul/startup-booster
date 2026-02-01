'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import RollingBanner from '@/components/home/RollingBanner';

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [category, setCategory] = useState('전체');
  const categories = [
    '전체', '한식', '치킨', '카페', '분식', '호프/주점', '버거/피자', '일식', '중식', 
    '베이커리', '편의점/마트', '화장품', '미용/뷰티', '의류/패션', '도소매/유통', '서비스/기타'
  ];

  const [visibleCount, setVisibleCount] = useState(12);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 화면 크기에 따라 초기 노출 개수 설정 (모바일 9개, PC 12개)
  const getInitialCount = () => {
    if (typeof window === 'undefined') return 12;
    return window.innerWidth < 1024 ? 9 : 12;
  };

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      let query = supabase.from('success_cases').select('*').order('created_at', { ascending: false });
      
      if (category !== '전체') {
        query = query.eq('category', category);
      }

      const { data } = await query;
      if (data) setCases(data);
      setLoading(false);
    };

    fetchCases();
    setVisibleCount(getInitialCount());
  }, [category]);

  // 더보기 버튼 로직 (모바일 6개, PC 8개 추가)
  const handleLoadMore = () => {
    const isMobile = window.innerWidth < 1024;
    setVisibleCount((prev) => prev + (isMobile ? 6 : 8));
  };

  const formatMoney = (v: number) => {
    if (!v && v !== 0) return '-';
    if (v >= 10000) {
        const eok = (v / 10000).toFixed(1).replace('.0', '');
        return `${eok}억`;
    }
    return `${v.toLocaleString()}만`; 
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. 홍보 배너 */}
      <div className="w-full max-w-6xl mx-auto md:px-6 md:mt-6">
        <section className="w-full aspect-[1920/500] overflow-hidden relative bg-slate-900 md:rounded-2xl shadow-sm">
           <div className="absolute inset-0 w-full h-full [&>div]:h-full">
              <RollingBanner location="main" /> 
           </div>
           <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
        </section>
      </div>

      {/* 2. 헤더 & 업종 카테고리 */}
      <div className="bg-white pb-4 pt-6 px-4 shadow-sm border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto">
            <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 mb-2">실제 검증된 성공사례 모음</h1>
            <p className="text-xs md:text-sm text-slate-500 mb-4">실제 점주님들의 생생한 매출표와 인터뷰를 확인하세요.</p>
            
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
            {categories.map((cat) => (
                <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap px-3 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all border ${
                    category === cat 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
                >
                {cat}
                </button>
            ))}
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 py-6 md:py-10 md:px-6">
        <div className="flex justify-between items-center mb-4 md:mb-6">
           <span className="text-xs md:text-base font-bold text-slate-500">
             <span className="text-indigo-600 font-extrabold">{category}</span> 관련 <span className="text-slate-800">{cases.length}</span>건의 사례
           </span>
        </div>

        {loading ? (
          <div className="h-60 flex items-center justify-center text-slate-400 text-sm">로딩 중...</div>
        ) : cases.length === 0 ? (
          <div className="h-60 flex items-center justify-center text-slate-400 text-sm">등록된 사례가 없습니다.</div>
        ) : (
          <>
            {/* 3. 리스트 영역 */}
            {/* ✅ [유지] grid-cols-3 (모바일 3열) / gap-1.5 (좁은 간격) */}
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-1.5 md:gap-6">
              {cases.slice(0, visibleCount).map((item) => (
                <Link 
                  key={item.id} 
                  href={`/cases/${item.id}`}
                  className="group bg-[#1e293b] rounded-lg md:rounded-2xl overflow-hidden shadow-lg border border-slate-700/50 hover:shadow-2xl transition-all hover:-translate-y-1 block"
                >
                  <div className="relative w-full aspect-[4/3] bg-slate-800 overflow-hidden">
                    {item.main_image ? (
                      <Image 
                        src={item.main_image} 
                        alt={item.brand_name} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                        sizes="(max-width: 768px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] md:text-sm text-slate-500 bg-slate-800">No Image</div>
                    )}
                    <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3 z-10">
                        <span className="bg-black/60 backdrop-blur-sm text-white px-1 py-0.5 md:px-2.5 md:py-1 rounded text-[8px] md:text-xs font-bold border border-white/10">
                            {item.category || '기타'}
                        </span>
                    </div>
                  </div>

                  <div className="p-1.5 md:p-5">
                    <div className="mb-1.5 md:mb-4">
                        <h3 className="text-[11px] md:text-xl font-bold text-white leading-tight truncate mb-0.5 md:mb-1">{item.brand_name}</h3>
                        <p className="text-[9px] md:text-sm text-slate-400 truncate">{item.branch_name}</p>
                    </div>
                    
                    {/* ✅ [수정] 텍스트 전체 노출 (월매출, 순이익, 창업비용) */}
                    {/* 공간 확보를 위해 padding을 줄이고(-tracking) 폰트 사이즈를 축소(text-[8px]) */}
                    <div className="bg-[#0f172a] rounded md:rounded-lg p-1.5 md:p-3 space-y-1 md:space-y-1.5 border border-slate-700/50">
                        <div className="flex justify-between items-center text-[8px] md:text-sm">
                            <span className="text-slate-400 font-medium tracking-tighter shrink-0">월매출</span>
                            <span className="font-bold text-slate-200 tracking-tight">{formatMoney(item.monthly_sales)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[8px] md:text-sm">
                            <span className="text-slate-400 font-medium tracking-tighter shrink-0">순이익</span>
                            <span className="font-extrabold text-emerald-400 tracking-tight">{formatMoney(item.net_profit)}</span>
                        </div>
                        {/* ✅ [수정] 창업비용 숨김 해제 (모바일에서도 보임) */}
                        <div className="flex justify-between items-center text-[8px] md:text-sm border-t border-slate-700 pt-1 mt-1">
                            <span className="text-slate-500 font-medium tracking-tighter shrink-0">창업비용</span>
                            <span className="font-bold text-indigo-300 tracking-tight">{formatMoney(item.invest_cost)}</span>
                        </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {visibleCount < cases.length && (
              <div className="mt-8 md:mt-12 flex justify-center">
                <button 
                  onClick={handleLoadMore}
                  className="px-8 py-3 md:px-12 md:py-4 bg-white border border-slate-200 rounded-full text-slate-600 text-xs md:text-base font-bold shadow-sm hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 transition-all"
                >
                  더보기 ({cases.length - visibleCount}개 남음) <ChevronDownIcon className="w-3 h-3 md:w-5 md:h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}