'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { CalendarDaysIcon, ChatBubbleLeftRightIcon, ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/solid';
import ReviewSection from '@/components/franchise/ReviewSection';

// 분리한 파일들 가져오기
import { CaseMetrics, CaseGallery, CaseRevenue, CaseLocation, CaseItem } from '@/components/CaseComponents';
import { extractMainImageUrl, getCleanImageUrl, normalizeImages } from '@/lib/utils';

export default function CaseDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [caseData, setCaseData] = useState<CaseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const { data, error } = await supabase.from('success_cases').select('*').eq('id', id).single();
      if (error) { setLoading(false); return; }

      if (data) {
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

        // ✅ [추가됨] 최근 본 창업 사례 저장 로직 (LocalStorage)
        try {
            const recentItem = {
                id: `case-${data.id}`, // 중복 방지용 고유키
                brand: data.brand_name,
                branch: data.branch_name,
                image: extractMainImageUrl(data.main_image), // 이미지 URL 추출
                url: `/cases/${data.id}` // 다시 방문할 링크
            };

            const existing = JSON.parse(localStorage.getItem('recent_views') || '[]');
            // 이미 있는 건 지우고 (중복제거)
            const filtered = existing.filter((item: any) => item.id !== recentItem.id);
            // 맨 앞에 추가해서 저장 (최대 10개)
            localStorage.setItem('recent_views', JSON.stringify([recentItem, ...filtered].slice(0, 10)));
        } catch (e) {
            console.error("최근 본 내역 저장 실패:", e);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [id, supabase]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">로딩 중...</div>;
  if (!caseData) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">데이터 없음</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      <Script 
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT_ID}&autoload=false&libraries=services`} 
        strategy="afterInteractive" 
        onReady={() => window.kakao.maps.load(() => setMapLoaded(true))}
      />
      
      {isModalOpen && <InquiryPopup brandId={`case-${caseData.id}`} brandName={`${caseData.brand} (${caseData.branch})`} category="성공사례" onClose={() => setIsModalOpen(false)} supabase={supabase} />}

      <header className="relative h-36 md:h-56 flex flex-col items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url('${getCleanImageUrl(caseData.mainImage)}')` }}></div>
        <Link href="/cases" className="absolute top-4 left-4 z-20 flex items-center gap-1 text-white/80 hover:text-white bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm text-xs md:text-sm"><ChevronLeftIcon className="w-3 h-3 md:w-4 md:h-4"/> 목록</Link>
        <div className="relative z-20 text-center px-4 w-full max-w-6xl mx-auto">
          <h1 className="text-xl md:text-5xl font-black mb-1 md:mb-3 truncate px-4">{caseData.brand} <span className="text-indigo-300">{caseData.branch}</span></h1>
          <div className="inline-flex items-center gap-1.5 bg-black/30 px-3 py-1 md:px-5 md:py-2 rounded-full border border-white/20 backdrop-blur-md shadow-lg">
            <CalendarDaysIcon className="w-3 h-3 md:w-4 md:h-4 text-indigo-300"/><span className="text-xs md:text-sm font-bold text-white tracking-wide">SINCE {caseData.startupYear}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 md:px-4 -mt-8 md:-mt-12 relative z-30 space-y-6 md:space-y-10">
        <CaseMetrics data={caseData} />
        <CaseGallery data={caseData} />
        <CaseRevenue data={caseData} />
        
        <CaseLocation data={caseData} mapLoaded={mapLoaded} />

        <section className="bg-slate-900 rounded-2xl p-5 md:p-8 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 text-[6rem] md:text-[10rem] font-serif leading-none text-white/5 -mr-2 -mt-4">”</div>
            <div className="relative z-10">
              <h3 className="text-indigo-400 font-bold text-xs mb-2 uppercase tracking-wider flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm"></span> Owner's Comment</h3>
              <p className="text-sm md:text-xl font-medium leading-relaxed opacity-90 whitespace-pre-wrap">"{caseData.ownerComment}"</p>
              <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs md:text-base shadow-lg">CEO</div>
                  <div><p className="text-xs md:text-sm font-bold text-white">{caseData.branch} 점주님</p></div>
              </div>
            </div>
        </section>

        <div className="review-wrapper"><ReviewSection franchiseId={`case-${caseData.id}`} /></div>

        <section className="sticky bottom-4 z-50 animate-bounce-in max-w-6xl mx-auto px-1">
            <button onClick={() => setIsModalOpen(true)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-base md:text-lg font-bold py-3 md:py-4 rounded-xl shadow-2xl shadow-indigo-500/40 flex items-center justify-center gap-2 transition-all active:scale-95"><ChatBubbleLeftRightIcon className="w-5 h-5" />{caseData.brand} 창업 조건 문의하기</button>
        </section>
      </main>
    </div>
  );
}

function InquiryPopup({ brandId, brandName, category, onClose, supabase }: { brandId: string; brandName: string; category: string; onClose: () => void; supabase: any }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', content: '' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!form.name || !form.phone) return alert('필수 입력!');
    setLoading(true);
    try {
      const { error } = await supabase.from('inquiries').insert([{ brand_id: brandId, brand_name: brandName, user_name: form.name, user_phone: form.phone, email: form.email, content: form.content, category: category }]);
      if (error) throw error;
      alert('문의 접수 완료!'); onClose();
    } catch (err: any) { alert('오류: ' + err.message); } finally { setLoading(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center"><h3>{brandName} 문의</h3><button onClick={onClose}><XMarkIcon className="w-6 h-6 text-white"/></button></div>
        <div className="p-6 space-y-4">
          <input type="text" className="w-full p-3 border rounded-xl" placeholder="이름" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input type="tel" className="w-full p-3 border rounded-xl" placeholder="연락처" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <textarea className="w-full p-3 border rounded-xl h-24" placeholder="문의내용" value={form.content} onChange={e => setForm({...form, content: e.target.value})}></textarea>
          <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl">{loading ? '전송 중...' : '문의하기'}</button>
        </div>
      </div>
    </div>
  );
}