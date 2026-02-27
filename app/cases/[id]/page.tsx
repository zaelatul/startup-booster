'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { CalendarDaysIcon, ChatBubbleLeftRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import ReviewSection from '@/components/franchise/ReviewSection';

// ✅ [연동 확인] 공용 InquiryPopup을 불러옵니다.
import InquiryPopup from '@/components/brand-detail/InquiryPopup';
import { CaseMetrics, CaseGallery, CaseRevenue, CaseLocation, CaseItem, CaseOwnerComment } from '@/components/CaseComponents';
import { extractMainImageUrl, getCleanImageUrl, normalizeImages } from '@/lib/utils';

export default function CaseDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [caseData, setCaseData] = useState<CaseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  ), []);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const { data, error } = await supabase.from('success_cases').select('*').eq('id', id).single();
      if (error || !data) { setLoading(false); return; }

      setCaseData({
        id: data.id,
        brand: data.brand_name,
        branch: data.branch_name,
        category: data.category || '기타',
        area: data.area,
        startupYear: data.startup_year,
        mainImage: extractMainImageUrl(data.main_image),
        storeImages: normalizeImages(data.store_images, '매장'),
        menuImages: normalizeImages(data.menu_images, '메뉴'),
        ownerComment: data.owner_comment,
        quarterComment: data.analysis_json?.quarterComment,
        metricsComment: data.metrics_comment,
        summary: data.summary,
        successPoint: data.success_point,
        detail: {
          monthlyRevenue: Number(data.monthly_sales) || 0,
          netProfit: Number(data.net_profit) || 0,
          investCost: Number(data.invest_cost) || 0,
          storeSize: Number(data.store_size) || 0,
          profitMargin: Number(data.profit_margin) || 0,
          rent: { deposit: Number(data.deposit) || 0, monthly: Number(data.monthly_rent) || 0 }
        },
        quarterlyRevenue: data.analysis_json?.quarterlyRevenue?.map((v:number, i:number) => ({ name: `${i+1}분기`, value: v })) || [],
        footTraffic: {
            dailyAvg: data.analysis_json?.footTraffic?.dailyAvg || 0,
            trafficLevel: data.analysis_json?.footTraffic?.trafficLevel || '보통',
            competitors: data.analysis_json?.footTraffic?.competitors || 0,
            competitorLevel: data.analysis_json?.footTraffic?.competitorLevel || '보통',
            comment: data.analysis_json?.footTraffic?.comment,
            weekRatio: [
              { name: '주중', value: data.analysis_json?.footTraffic?.weekRatio?.week || 70 },
              { name: '주말', value: data.analysis_json?.footTraffic?.weekRatio?.weekend || 30 }
            ],
            dayRatio: data.analysis_json?.footTraffic?.dayRatio || [],
            timeRatio: data.analysis_json?.footTraffic?.timeRatio || []
        }
      });
      setLoading(false);
    }
    loadData();
  }, [id, supabase]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold">데이터를 불러오는 중...</div>;
  if (!caseData) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold">정보가 없습니다.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-900 font-sans tracking-tight">
      <Script 
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT_ID}&libraries=services&autoload=false`} 
        strategy="afterInteractive" 
        onLoad={() => {
          if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
              setMapLoaded(true);
            });
          }
        }}
      />
      
      {isModalOpen && (
        <InquiryPopup 
          brandId={`case-${caseData.id}`} 
          brandName={caseData.brand} 
          category="성공사례" 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      <header className="relative h-48 md:h-64 flex flex-col items-center justify-center text-white overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10"></div>
        <div className="absolute inset-0 bg-cover bg-center z-0 scale-105" style={{ backgroundImage: `url('${getCleanImageUrl(caseData.mainImage)}')` }}></div>
        <Link href="/cases" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/90 hover:text-white bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full backdrop-blur-md text-xs md:text-sm transition-all border border-white/10 font-bold">
          <ChevronLeftIcon className="w-4 h-4"/> 목록
        </Link>
        <div className="relative z-20 text-center px-4 w-full max-w-6xl mx-auto font-black drop-shadow-lg">
          <h1 className="text-2xl md:text-5xl mb-2 md:mb-4">{caseData.brand} <span className="text-indigo-400">{caseData.branch}</span></h1>
          <div className="inline-flex items-center gap-2 bg-indigo-600/90 px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-white/20">
            <CalendarDaysIcon className="w-4 h-4 md:w-5 md:h-5 text-white"/><span className="text-xs md:text-base tracking-widest">SINCE {caseData.startupYear}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 -mt-10 md:-mt-16 relative z-30 space-y-8 md:space-y-12">
        <CaseMetrics data={caseData} />
        <CaseGallery data={caseData} />
        
        <div className="w-full bg-white rounded-3xl shadow-sm p-4 md:p-8 overflow-hidden min-h-[350px]">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2 border-l-4 border-indigo-500 pl-3 leading-none">분기별 매출 추이</h3>
            <CaseRevenue data={caseData} />
        </div>
        
        <div className="w-full bg-white rounded-3xl shadow-sm p-4 md:p-8 min-h-[450px]">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2 border-l-4 border-indigo-500 pl-3 leading-none">매장소재 행정동 상권/유동인구</h3>
            <CaseLocation data={caseData} mapLoaded={mapLoaded} />
        </div>

        <CaseOwnerComment 
          comment={caseData.ownerComment} 
          branch={caseData.branch} 
          contentClassName="text-[11px] md:text-sm lg:text-base" 
        />

        <div className="review-wrapper"><ReviewSection franchiseId={`case-${caseData.id}`} /></div>

        {/* ✅ [수정] 다크블루 색상 적용, PC에서만 텍스트 키우고 가로폭 30% 줄임 */}
        <section className="fixed bottom-20 md:bottom-0 left-0 right-0 z-50 max-w-6xl mx-auto px-2 pb-[env(safe-area-inset-bottom)] bg-gradient-to-t from-slate-50/80 to-transparent md:bg-none">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="w-full md:w-[70%] md:mx-auto bg-indigo-900 hover:bg-indigo-800 text-white text-[10px] md:text-base font-black py-2 md:py-3 rounded-2xl shadow-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <ChatBubbleLeftRightIcon className="w-3 h-3 md:w-5 md:h-5" /> {caseData.brand} 창업 조건 문의하기
            </button>
        </section>
      </main>
    </div>
  );
}