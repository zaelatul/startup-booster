'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { PlusIcon, ClockIcon, CalendarIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { MAGAZINE_ARTICLES as DUMMY_ARTICLES } from '@/lib/magazine-data'; 

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const INITIAL_LIMIT = 6;
const LOAD_MORE_STEP = 6;

export default function MagazinePage() {
  const [articles, setArticles] = useState<any[]>([]); 
  const [banners, setBanners] = useState<any[]>([]); 
  const [visibleLimit, setVisibleLimit] = useState(INITIAL_LIMIT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      const { data: articleData } = await supabase
        .from('magazines')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (articleData && articleData.length > 0) {
        const formatted = articleData.map(item => ({
            id: item.id,
            title: item.title,
            description: item.subtitle || '',
            category: item.category,
            date: new Date(item.created_at).toLocaleDateString(),
            author: item.author,
            readTime: item.read_time || '3분',
            thumbnailUrl: item.thumbnail_url || 'https://via.placeholder.com/400x300'
        }));
        setArticles(formatted);
      } else {
        setArticles(DUMMY_ARTICLES);
      }

      const { data: bannerData } = await supabase
        .from('banners')
        .select('*')
        .eq('location', 'magazine') 
        .eq('is_active', true)
        .order('sort_order');
        
      if (bannerData && bannerData.length > 0) {
          setBanners(bannerData);
      }

      setLoading(false);
    }
    fetchData();
  }, []);
  
  const visibleArticles = articles.slice(0, visibleLimit);
  const hasMore = visibleLimit < articles.length;
  const handleLoadMore = () => setVisibleLimit((prev) => prev + LOAD_MORE_STEP);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-3 py-6 md:px-6 lg:px-8 space-y-8 md:space-y-12">
        
        {/* 1. 상단 홍보용 롤링 배너 */}
        {banners.length > 0 && (
            <section className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg bg-slate-900">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0} slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }} navigation={true} loop={banners.length > 1}
                // [재수정] 높이 다시 축소 (h-40: 모바일 / h-64: PC)
                className="h-40 md:h-64"
            >
                {banners.map((banner) => (
                <SwiperSlide key={banner.id}>
                    <Link href={banner.link_url || '#'} className="relative block h-full w-full group cursor-pointer">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${banner.image_url})` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent md:bg-gradient-to-r" />
                    
                    {/* [재수정] 좁아진 높이에 맞춰 PC 패딩 및 텍스트 크기 축소 */}
                    <div className="relative z-10 flex h-full flex-col justify-end p-5 md:justify-center md:p-10 md:w-2/3">
                        <span className="inline-block w-fit mb-1 md:mb-2 rounded-full bg-indigo-600/90 px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs font-bold text-white shadow-sm backdrop-blur-sm">SPECIAL PICK</span>
                        {/* 폰트 크기 축소: 3xl~4xl -> 2xl~3xl */}
                        <h2 className="text-base md:text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-1 md:mb-3 drop-shadow-md line-clamp-1 md:line-clamp-2">{banner.title}</h2>
                        {/* 서브텍스트 크기 축소: base~lg -> sm */}
                        <p className="text-[10px] md:text-sm text-slate-200 mb-3 md:mb-6 opacity-90 line-clamp-1 md:line-clamp-2 leading-relaxed">{banner.subtitle}</p>
                        <div className="hidden md:block"><span className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-5 py-2.5 text-xs font-bold hover:bg-indigo-50 transition-colors shadow-lg">지금 읽어보기 <ChevronRightIcon className="w-3.5 h-3.5" /></span></div>
                    </div>
                    </Link>
                </SwiperSlide>
                ))}
            </Swiper>
            </section>
        )}

        {/* 2. 최신 아티클 리스트 */}
        <section>
          <div className="flex items-end justify-between mb-4 md:mb-6 px-1">
            <h2 className="text-base md:text-2xl font-bold text-slate-900">최신 창업 인사이트</h2>
            <span className="text-[10px] md:text-xs text-slate-500 font-medium">총 {articles.length}개의 글</span>
          </div>

          {/* 3열 그리드 (모바일 포함) */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 lg:gap-8">
            {visibleArticles.map((article) => (
                <Link key={article.id} href={`/magazine/${article.id}`} className="group flex flex-col h-full bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                {/* 썸네일 높이 축소 (h-28) */}
                <div className="relative h-28 md:h-52 w-full overflow-hidden bg-slate-200">
                    <img src={article.thumbnailUrl} alt={article.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-2 left-2 md:top-4 md:left-4"><span className="inline-block px-1.5 py-0.5 md:px-3 md:py-1 rounded md:rounded-lg bg-white/95 text-[8px] md:text-[10px] font-bold text-slate-900 shadow-sm backdrop-blur-md">{article.category}</span></div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                {/* 패딩 및 텍스트 크기 축소 */}
                <div className="flex flex-col flex-1 p-3 md:p-6">
                    <h3 className="text-xs md:text-lg font-bold text-slate-900 leading-snug mb-1 md:mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors h-8 md:h-auto">{article.title}</h3>
                    <p className="text-[10px] md:text-sm text-slate-500 line-clamp-2 mb-2 md:mb-5 flex-1 leading-relaxed hidden md:block">{article.description}</p>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between pt-2 md:pt-4 border-t border-slate-50 text-[9px] md:text-[11px] text-slate-400 gap-1">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-0.5"><CalendarIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />{article.date}</span>
                            <span className="flex items-center gap-0.5 hidden md:flex"><ClockIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />{article.readTime}</span>
                        </div>
                        <span className="font-medium text-slate-500 line-clamp-1">{article.author}</span>
                    </div>
                </div>
                </Link>
            ))}
          </div>

          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="mt-8 md:mt-12 text-center">
              <button onClick={handleLoadMore} className="inline-flex items-center gap-1.5 px-6 py-2.5 md:px-8 md:py-3 rounded-full bg-white border border-slate-200 text-slate-600 text-xs md:text-sm font-bold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm active:scale-95">
                <PlusIcon className="w-3.5 h-3.5 md:w-4 md:h-4" /> 아티클 더보기 ({visibleLimit}/{articles.length})
              </button>
            </div>
          )}
        </section>
        <div className="pb-12"></div>
      </div>
    </main>
  );
}