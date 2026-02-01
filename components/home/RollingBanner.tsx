'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { XMarkIcon, MagnifyingGlassPlusIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function RollingBanner({ location }: { location: string }) {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [zoomBanner, setZoomBanner] = useState<any | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchBanners = async () => {
      const { data } = await supabase
        .from('banners')
        .select('*')
        .eq('location', location)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (data && data.length > 0) {
        setBanners(data);
      }
      setLoading(false);
    };

    fetchBanners();
  }, [location]);

  if (loading) return <div className="w-full aspect-[1920/500] bg-slate-100 animate-pulse rounded-lg"></div>;
  if (banners.length === 0) return null;

  return (
    <>
      <div className="w-full aspect-[1920/500] relative overflow-hidden group rounded-lg md:rounded-2xl shadow-sm bg-slate-50 border border-slate-100">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ 
              clickable: true,
              modifierClass: 'swiper-pagination-custom-' 
          }}
          navigation={false} 
          loop={banners.length > 1}
          className="w-full h-full"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id} className="relative w-full h-full cursor-pointer flex items-center justify-center" onClick={() => setZoomBanner(banner)}>
                
                <div className="absolute inset-0 z-10">
                    <Image 
                      src={banner.image_url} 
                      // ✅ [수정] 제목이 없으면 '배너 이미지'라는 기본값 사용 (에러 해결!)
                      alt={banner.title || '배너 이미지'} 
                      fill 
                      // ✅ [수정] sizes 속성 추가 (경고 해결!)
                      sizes="100vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      priority 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>

                <div className="absolute top-2 right-2 bg-black/20 p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <MagnifyingGlassPlusIcon className="w-3 h-3 md:w-4 md:h-4 text-white/80" />
                </div>

                <div className="absolute bottom-0 left-0 p-3 md:p-6 w-full text-left z-20">
                    {banner.subtitle && (
                        <span className="inline-block px-1.5 py-0.5 bg-indigo-600/90 text-white text-[8px] md:text-[10px] font-bold rounded mb-0.5 md:mb-1 shadow-sm">
                            {banner.subtitle}
                        </span>
                    )}
                    {/* 제목이 있을 때만 글씨 보여주기 */}
                    {banner.title && (
                        <h2 className="text-[11px] md:text-base font-bold text-white leading-tight drop-shadow-md truncate pr-8">
                            {banner.title}
                        </h2>
                    )}
                </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <style jsx global>{`
          .swiper-pagination-bullet { background: white !important; opacity: 0.5; width: 3px; height: 3px; margin: 0 2px !important; }
          .swiper-pagination-bullet-active { background: #6366f1 !important; opacity: 1; width: 8px; border-radius: 10px; }
          .swiper-pagination { bottom: 8px !important; text-align: right !important; padding-right: 10px; }
        `}</style>
      </div>

      {zoomBanner && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-center overflow-y-auto animate-fade-in" onClick={() => setZoomBanner(null)}>
           
           <button onClick={() => setZoomBanner(null)} className="fixed top-4 right-4 md:top-6 md:right-6 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-all z-[110]">
              <XMarkIcon className="w-6 h-6" />
           </button>

           <div className="relative w-full max-w-3xl min-h-screen py-10 px-4 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              
              <div className="w-full bg-white rounded-lg shadow-2xl overflow-hidden mb-6">
                  {/* 일반 img 태그지만 안전하게 처리 */}
                  <img 
                    src={zoomBanner.detail_image_url || zoomBanner.image_url} 
                    alt={zoomBanner.title || '상세 이미지'} 
                    className="w-full h-auto object-contain"
                  />
              </div>

              <div className="text-center text-white pb-10">
                  <h3 className="text-2xl font-bold mb-2">{zoomBanner.title}</h3>
                  {zoomBanner.subtitle && <p className="text-slate-300 text-sm mb-6">{zoomBanner.subtitle}</p>}
                  
                  {zoomBanner.link_url && (
                      <Link href={zoomBanner.link_url} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:scale-105">
                          자세히 보기 <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                      </Link>
                  )}
              </div>
           </div>
        </div>
      )}
    </>
  );
}