'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlusIcon, ClockIcon, CalendarIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { MAGAZINE_ARTICLES, MAGAZINE_BANNERS } from '@/lib/magazine-data';

// Swiper (롤링 배너용)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// [설정] 초기 노출 개수 및 더보기 추가 개수 (3열 그리드 기준)
const INITIAL_LIMIT = 6;
const LOAD_MORE_STEP = 6;

export default function MagazinePage() {
  const [visibleLimit, setVisibleLimit] = useState(INITIAL_LIMIT);
  
  // 현재 보이는 기사 목록
  const visibleArticles = MAGAZINE_ARTICLES.slice(0, visibleLimit);
  const hasMore = visibleLimit < MAGAZINE_ARTICLES.length;

  const handleLoadMore = () => {
    setVisibleLimit((prev) => prev + LOAD_MORE_STEP);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8 space-y-12">
        
        {/* 1. 상단 홍보용 롤링 배너 */}
        <section className="relative overflow-hidden rounded-3xl shadow-xl bg-slate-900">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            loop={true}
            className="h-80 md:h-96"
          >
            {MAGAZINE_BANNERS.map((banner) => (
              <SwiperSlide key={banner.id}>
                <Link href={banner.link} className="relative block h-full w-full group">
                  {/* 배경 이미지 */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${banner.imageUrl})` }}
                  />
                  {/* 텍스트 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent md:bg-gradient-to-r" />
                  
                  <div className="relative z-10 flex h-full flex-col justify-end p-8 md:justify-center md:p-16 md:w-2/3">
                    <span className="inline-block w-fit mb-3 rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                      EDITOR'S PICK
                    </span>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
                      {banner.title}
                    </h2>
                    <p className="text-sm md:text-lg text-slate-200 mb-8 opacity-90 line-clamp-2 leading-relaxed">
                      {banner.subtitle}
                    </p>
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-6 py-3 text-sm font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                        지금 읽어보기 <ChevronRightIcon className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* 2. 최신 아티클 리스트 (카드 뉴스 스타일) */}
        <section>
          <div className="flex items-end justify-between mb-6 px-1">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              최신 창업 인사이트
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              총 {MAGAZINE_ARTICLES.length}개의 글
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleArticles.map((article) => (
              <Link 
                key={article.id} 
                href={`/magazine/${article.id}`}
                className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* 이미지 영역 */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-200">
                  <img 
                    src={article.thumbnailUrl} 
                    alt={article.title} 
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 rounded-lg bg-white/95 text-[10px] font-bold text-slate-900 shadow-sm backdrop-blur-md">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* 텍스트 영역 */}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-5 flex-1 leading-relaxed">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-[11px] text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                    </div>
                    <span className="font-medium text-slate-500">{article.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 무한 더보기 버튼 */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button 
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm active:scale-95"
              >
                <PlusIcon className="w-4 h-4" />
                아티클 더보기 ({visibleLimit}/{MAGAZINE_ARTICLES.length})
              </button>
            </div>
          )}
        </section>
        
        {/* [구독 폼 삭제됨] */}
        <div className="pb-12"></div>
      </div>
    </main>
  );
}