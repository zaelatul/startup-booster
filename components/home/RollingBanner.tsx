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

  // 배너 높이: 모바일 100px / 웹 250px (50% 축소 유지)
  if (loading) return <div className="w-full h-[100px] md:h-[250px] bg-slate-100 animate-pulse rounded-lg"></div>;
  if (banners.length === 0) return null;

  return (
    <>
      <div className="w-full h-[100px] md:h-[250px] relative overflow-hidden group rounded-lg md:rounded-2xl shadow-sm">
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
            <SwiperSlide key={banner.id} className="relative w-full h-full bg-slate-900 cursor-pointer" onClick={() => setZoomBanner(banner)}>
                <div className="absolute inset-0">
                    <Image 
                    src={banner.image_url} 
                    alt={banner.title} 
                    fill 
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div className="absolute top-2 right-2 bg-black/20 p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <MagnifyingGlassPlusIcon className="w-4 h-4 text-white/80" />
                </div>

                <div className="absolute bottom-0 left-0 p-4 w-full text-left">
                    {banner.subtitle && (
                        <span className="inline-block px-1.5 py-0.5 bg-indigo-600/90 text-white text-[9px] font-bold rounded mb-1">
                            {banner.subtitle}
                        </span>
                    )}
                    <h2 className="text-sm md:text-3xl font-bold text-white leading-tight drop-shadow-md truncate pr-8">
                        {banner.title}
                    </h2>
                </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <style jsx global>{`
          .swiper-pagination-bullet { background: white !important; opacity: 0.5; width: 4px; height: 4px; margin: 0 3px !important; }
          .swiper-pagination-bullet-active { background: #6366f1 !important; opacity: 1; width: 12px; border-radius: 10px; }
          .swiper-pagination { bottom: 10px !important; text-align: right !important; padding-right: 12px; }
        `}</style>
      </div>

      {/* [NEW] 상세 이미지 팝업 (Detail Image 우선 노출) */}
      {zoomBanner && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 animate-fade-in" onClick={() => setZoomBanner(null)}>
           <button onClick={() => setZoomBanner(null)} className="absolute top-6 right-6 text-white bg-white/20 p-2 rounded-full hover:bg-white/40 transition-all z-50">
              <XMarkIcon className="w-6 h-6" />
           </button>

           <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              {/* 👇 여기가 핵심: detail_image_url이 있으면 그거 보여주고, 없으면 그냥 배너 이미지 보여줌 */}
              <Image 
                src={zoomBanner.detail_image_url || zoomBanner.image_url} 
                alt={zoomBanner.title} 
                fill 
                className="object-contain" 
              />
           </div>

           <div className="absolute bottom-10 left-0 w-full text-center p-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-white text-xl font-bold mb-2">{zoomBanner.title}</h3>
              {zoomBanner.subtitle && <p className="text-slate-300 text-sm mb-6">{zoomBanner.subtitle}</p>}
              
              {zoomBanner.link_url && (
                  <Link href={zoomBanner.link_url} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:scale-105">
                      자세히 보기 <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  </Link>
              )}
           </div>
        </div>
      )}
    </>
  );
}