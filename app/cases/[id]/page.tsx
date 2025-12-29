'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, AreaChart, Area, CartesianGrid, LabelList
} from 'recharts';
import { 
  MapPinIcon, CurrencyDollarIcon, HomeModernIcon, CalculatorIcon, 
  CalendarDaysIcon, ChatBubbleLeftRightIcon, ChevronLeftIcon,
  BanknotesIcon, SparklesIcon, XMarkIcon, MagnifyingGlassPlusIcon
} from '@heroicons/react/24/solid';
import { CASES, CaseItem } from '@/lib/cases';
import InquiryModal from '@/components/InquiryModal';
import RollingBanner from '@/components/home/RollingBanner';
import ReviewSection from '@/components/franchise/ReviewSection';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const COLORS = {
  barDefault: '#cbd5e1', // slate-300
  barHighlight: '#6366f1', // indigo-600
};

export default function CaseDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [caseData, setCaseData] = useState<CaseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [animationTrigger, setAnimationTrigger] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const { data } = await supabase.from('success_cases').select('*').eq('id', id).single();
      if (data) {
        setCaseData({
          id: data.id,
          brand: data.brand_name,
          branch: data.branch_name,
          category: '기타',
          area: data.area,
          startupYear: data.startup_year,
          mainImage: data.main_image,
          storeImages: data.store_images || [],
          menuImages: data.menu_images || [],
          ownerComment: data.owner_comment,
          quarterComment: data.analysis_json?.quarterComment,
          metricsComment: data.metrics_comment,
          summary: data.summary,
          successPoint: data.success_point,
          monthlySales: '', netProfit: '', profitMargin: '', tags: [],
          
          detail: {
            monthlyRevenue: data.monthly_sales,
            netProfit: data.net_profit,
            investCost: data.invest_cost,
            storeSize: data.store_size || 0,
            profitMargin: data.profit_margin,
            rent: { deposit: data.deposit, monthly: data.monthly_rent }
          },
          
          quarterlyRevenue: data.analysis_json?.quarterlyRevenue?.map((v:number, i:number) => ({ name: `${i+1}분기`, value: v })) || [],
          
          footTraffic: {
             dailyAvg: data.analysis_json?.footTraffic?.dailyAvg || 0,
             trafficLevel: data.analysis_json?.footTraffic?.trafficLevel || '보통',
             competitors: data.analysis_json?.footTraffic?.competitors || 0,
             competitorLevel: data.analysis_json?.footTraffic?.competitorLevel || '보통',
             comment: data.analysis_json?.footTraffic?.comment,
             lat: 0, lng: 0,
             weekRatio: [
                { name: '주중', value: data.analysis_json?.footTraffic?.weekRatio?.week || 70 },
                { name: '주말', value: data.analysis_json?.footTraffic?.weekRatio?.weekend || 30 }
             ],
             dayRatio: data.analysis_json?.footTraffic?.dayRatio || [],
             timeRatio: data.analysis_json?.footTraffic?.timeRatio || []
          }
        });
        setTimeout(() => setAnimationTrigger(true), 500);
      } else {
        const fileData = CASES.find((c) => c.id === id);
        setCaseData(fileData || null);
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  const loadMap = () => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services || !caseData) return;
    const container = document.getElementById('mini-map');
    if (!container) return;
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(caseData.area, function(result: any, status: any) {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        const map = new window.kakao.maps.Map(container, { center: coords, level: 3 });
        new window.kakao.maps.Marker({ map: map, position: coords });
      }
    });
  };

  const renderRatioBlocks = (weekPercent: number) => {
    const totalBlocks = 10;
    const filledBlocks = Math.round(weekPercent / 10);
    return (
      <div className="flex gap-1.5 w-full h-full items-end">
        {[...Array(totalBlocks)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-md transition-all duration-700 ease-out`}
            style={{
                backgroundColor: animationTrigger 
                    ? (i < filledBlocks ? '#4f46e5' : '#e2e8f0') 
                    : '#e2e8f0',
                height: animationTrigger ? '100%' : '20%',
                transitionDelay: `${i * 50}ms`
            }}
          />
        ))}
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">로딩 중...</div>;
  if (!caseData) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">데이터 없음</div>;

  const weekVal = caseData.footTraffic.weekRatio.find(x => x.name === '주중')?.value || 0;
  const weekendVal = caseData.footTraffic.weekRatio.find(x => x.name === '주말')?.value || 0;
  const maxDayValue = Math.max(...(caseData.footTraffic.dayRatio?.map(d => d.value) || [0]));

  return (
    // [수정] 배경색 밝게 복구 (bg-slate-50)
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      <Script src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT_ID}&autoload=false&libraries=services`} strategy="afterInteractive" onReady={() => window.kakao.maps.load(loadMap)}/>
      
      <InquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} category="성공사례 문의" targetBrand={`${caseData.brand} ${caseData.branch}`} />

      {zoomImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in" onClick={() => setZoomImage(null)}>
           <button onClick={() => setZoomImage(null)} className="absolute top-6 right-6 text-white bg-white/20 p-2 rounded-full hover:bg-white/40 transition-all">
              <XMarkIcon className="w-6 h-6" />
           </button>
           <img src={zoomImage} alt="확대 이미지" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* 헤더 */}
      <header className="relative h-36 md:h-56 flex flex-col items-center justify-center text-white overflow-hidden cursor-pointer group" onClick={() => setZoomImage(caseData.mainImage)}>
        <div className="absolute inset-0 bg-black/50 z-10 group-hover:bg-black/40 transition-all"></div>
        <div className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${caseData.mainImage}')` }}></div>
        
        <Link href="/cases" className="absolute top-4 left-4 z-20 flex items-center gap-1 text-white/80 hover:text-white bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm transition-all hover:bg-black/40 text-xs md:text-sm" onClick={(e) => e.stopPropagation()}>
            <ChevronLeftIcon className="w-3 h-3 md:w-4 md:h-4"/> 목록
        </Link>
        
        <div className="absolute top-4 right-4 z-20 bg-black/30 p-2 rounded-full backdrop-blur-sm">
            <MagnifyingGlassPlusIcon className="w-5 h-5 text-white/80" />
        </div>

        <div className="relative z-20 text-center animate-fade-in-up px-4 pointer-events-none">
          <h1 className="text-xl md:text-5xl font-black mb-1 md:mb-3 tracking-tight drop-shadow-lg">{caseData.brand} <span className="text-indigo-300">{caseData.branch}</span></h1>
          <div className="inline-flex items-center gap-1.5 bg-black/30 px-3 py-1 md:px-5 md:py-2 rounded-full border border-white/20 backdrop-blur-md shadow-lg">
            <CalendarDaysIcon className="w-3 h-3 md:w-4 md:h-4 text-indigo-300"/>
            <span className="text-xs md:text-sm font-bold text-white tracking-wide">SINCE {caseData.startupYear}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 md:px-4 -mt-8 md:-mt-12 relative z-30 space-y-6 md:space-y-10">
        
        {/* 핵심 지표 (어두운 카드 배경 유지) */}
        <section className="bg-slate-800 rounded-xl md:rounded-2xl shadow-xl border border-slate-700 p-3 md:p-6 text-white">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-slate-700/40 rounded-lg md:rounded-xl border border-slate-600/30">
              <MapPinIcon className="w-4 h-4 md:w-6 md:h-6 text-slate-400 mb-1"/><p className="text-[9px] md:text-xs text-slate-400 mb-0.5 font-bold">소재지</p><p className="font-bold text-white text-[10px] md:text-sm break-keep leading-tight">{caseData.area.split(' ')[0]} {caseData.area.split(' ')[1]}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-slate-700/40 rounded-lg md:rounded-xl border border-slate-600/30">
              <CurrencyDollarIcon className="w-4 h-4 md:w-6 md:h-6 text-indigo-400 mb-1"/><p className="text-[9px] md:text-xs text-slate-400 mb-0.5 font-bold">매출액</p><p className="text-sm md:text-xl font-bold text-white">{caseData.detail.monthlyRevenue.toLocaleString()}만</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-slate-700/40 rounded-lg md:rounded-xl border border-slate-600/30">
              <CalculatorIcon className="w-4 h-4 md:w-6 md:h-6 text-emerald-400 mb-1"/><p className="text-[9px] md:text-xs text-emerald-400 mb-0.5 font-bold">순이익</p><p className="text-base md:text-2xl font-black text-emerald-400">{caseData.detail.netProfit.toLocaleString()}만</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-slate-700/40 rounded-lg md:rounded-xl border border-slate-600/30">
              <BanknotesIcon className="w-4 h-4 md:w-6 md:h-6 text-yellow-400 mb-1"/><p className="text-[9px] md:text-xs text-slate-400 mb-0.5 font-bold">창업비용</p><p className="text-sm md:text-lg font-bold text-slate-200">{caseData.detail.investCost ? `${(caseData.detail.investCost / 10000).toFixed(1)}억` : '-'}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-slate-700/40 rounded-lg md:rounded-xl border border-slate-600/30">
              <HomeModernIcon className="w-4 h-4 md:w-6 md:h-6 text-indigo-300 mb-1"/><p className="text-[9px] md:text-xs text-slate-400 mb-0.5 font-bold">매장</p>
              <div className="text-center"><p className="text-sm md:text-2xl font-extrabold text-white leading-none">{caseData.detail.storeSize}평</p><p className="text-[8px] md:text-xs text-slate-400 mt-0.5">보증금 {caseData.detail.rent.deposit / 1000}천</p></div>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-slate-700/40 rounded-lg md:rounded-xl border border-slate-600/30">
              <div className="mb-0.5"><span className="text-lg md:text-4xl font-black text-emerald-400 drop-shadow-md">{caseData.detail.profitMargin}%</span></div><p className="text-[9px] md:text-xs text-slate-400 font-bold">수익률</p>
            </div>
          </div>
          
          {caseData.metricsComment && <div className="mt-4 md:mt-6 bg-slate-700/50 border border-slate-600 rounded-lg p-3 flex gap-2 shadow-inner"><div className="mt-0.5"><SparklesIcon className="w-4 h-4 text-yellow-400" /></div><p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">{caseData.metricsComment}</p></div>}
        </section>

        {/* 이미지 갤러리 */}
        <section className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {caseData.storeImages.map((img: any, i: number) => (
              <div key={i} className="relative aspect-video bg-slate-200 rounded-xl md:rounded-2xl overflow-hidden shadow-md group cursor-pointer" onClick={() => setZoomImage(img.url)}>
                <img src={img.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/50 to-transparent"><span className="text-white text-xs font-bold px-2 py-1 bg-black/30 rounded backdrop-blur-sm shadow-sm">{img.label || '매장'}</span></div>
                <div className="absolute top-2 right-2 bg-black/40 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><MagnifyingGlassPlusIcon className="w-4 h-4 text-white"/></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {caseData.menuImages.map((img: any, i: number) => (
              <div key={i} className="relative aspect-square bg-slate-100 rounded-lg md:rounded-xl overflow-hidden shadow-md cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all" onClick={() => setZoomImage(img.url)}>
                <img src={img.url} className="w-full h-full object-cover"/>
              </div>
            ))}
          </div>
        </section>

        {/* 분기별 매출 (밝은 배경에 흰색 컨테이너) */}
        <section className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-slate-100 p-4 md:p-8">
          <h3 className="font-bold text-sm md:text-lg text-slate-900 mb-4 flex items-center gap-2"><span className="w-1 h-4 md:w-1.5 md:h-6 bg-indigo-500 rounded-full shadow-sm"></span>분기별 매출 추이</h3>
          <div className="h-32 md:h-64 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caseData.quarterlyRevenue} margin={{top:10, right:0, left:-20, bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:10, fontWeight:'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize:10}} />
                <Tooltip cursor={{fill:'#f8fafc'}} contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize:'12px'}} formatter={(value:any)=>`${value.toLocaleString()}만원`} />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24}>
                   <LabelList dataKey="value" position="top" formatter={(val:number) => val >= 10000 ? `${(val/10000).toFixed(1)}억` : val} style={{fontSize:9, fill:'#64748b', fontWeight:'bold'}} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {caseData.quarterComment && <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex gap-2 shadow-sm"><div className="mt-0.5"><span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">POINT</span></div><p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{caseData.quarterComment}</p></div>}
        </section>

        {/* 상권 분석 */}
        <section className="bg-slate-50 rounded-2xl md:rounded-3xl shadow-lg border border-slate-100 p-4 md:p-8">
          <h3 className="font-bold text-sm md:text-lg text-slate-900 flex items-center gap-2 mb-4"><span className="w-1 h-4 md:w-1.5 md:h-6 bg-emerald-500 rounded-full shadow-sm"></span>매장 소재 행정동 상권 입체 분석</h3>
          
          <div className="bg-slate-800 rounded-xl shadow-md border border-slate-700 p-4 mb-4 text-white">
              <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <p className="text-[10px] text-slate-400 mb-1 font-bold">일 평균 유동인구</p>
                      {/* [수정] 텍스트 크게 키우고 밝은색(White/Yellow)으로 포인트 강조 */}
                      <div className="flex items-center gap-1">
                          <p className="text-xl md:text-3xl font-black text-white drop-shadow-md">{caseData.footTraffic.dailyAvg?.toLocaleString()}</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded border bg-blue-500/20 text-blue-300 border-blue-500/30">{caseData.footTraffic.trafficLevel}</span>
                      </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <p className="text-[10px] text-slate-400 mb-1 font-bold">경쟁점 수</p>
                      {/* [수정] 텍스트 크게 키우고 밝은색으로 포인트 강조 */}
                      <div className="flex items-center gap-1">
                          <p className="text-xl md:text-3xl font-black text-yellow-400 drop-shadow-md">{caseData.footTraffic.competitors}개</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded border bg-red-500/20 text-red-300 border-red-500/30">{caseData.footTraffic.competitorLevel}</span>
                      </div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
                <h4 className="text-xs font-bold text-slate-600 mb-2">방문 비율 (주중/주말)</h4>
                <div className="h-16 md:h-32 w-full mb-3">
                    {renderRatioBlocks(weekVal)}
                </div>
                <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-100">
                    <span className="text-indigo-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span>주중 {weekVal}%</span>
                    <span className="text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span>주말 {weekendVal}%</span>
                </div>
             </div>
             
             <div className="bg-white rounded-xl p-1 overflow-hidden border border-slate-100 shadow-sm">
                 <div className="h-32 md:h-[224px] rounded-lg relative overflow-hidden">
                     <div id="mini-map" className="w-full h-full"></div>
                 </div>
                 <p className="text-[10px] md:text-xs text-slate-500 font-bold text-center py-2 bg-slate-50 border-t border-slate-100">
                   📍 {caseData.area}
                 </p>
             </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm h-48 md:h-64 mb-4">
              <h4 className="text-xs md:text-sm font-bold text-slate-700 mb-2 text-center">요일별 방문 추이</h4>
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={caseData.footTraffic.dayRatio} margin={{top:20, bottom:0}}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:10, fontWeight:'bold'}} />
                    <Tooltip cursor={{fill:'transparent'}} contentStyle={{borderRadius:'8px', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize:'11px'}} formatter={(val:any)=>`${val}%`}/>
                    <Bar dataKey="value" radius={[4,4,0,0]}>
                       {caseData.footTraffic.dayRatio?.map((entry:any, index:number) => (<Cell key={`cell-${index}`} fill={entry.value === maxDayValue ? '#4f46e5' : '#cbd5e1'} />))}
                       <LabelList dataKey="value" position="top" formatter={(v:any)=>`${v}%`} style={{fontSize:10, fontWeight:'bold', fill:'#64748b'}} />
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
          </div>

          {/* 시간대별 차트 */}
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm h-48 md:h-64">
              <h4 className="text-xs md:text-sm font-bold text-slate-700 mb-2 text-center">시간대별 유동인구 집중도</h4>
              {caseData.footTraffic.timeRatio && caseData.footTraffic.timeRatio.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={caseData.footTraffic.timeRatio} margin={{top:20, right:10, left:-20, bottom:0}}>
                        <defs>
                           <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize:10, fontWeight:'bold'}} interval={0} />
                        <YAxis hide />
                        <Tooltip contentStyle={{borderRadius:'8px', fontSize:'11px'}} formatter={(val:any)=>`${val}%`} />
                        <Area type="monotone" dataKey="value" stroke="#4f46e5" fillOpacity={1} fill="url(#colorTime)">
                            <LabelList dataKey="value" position="top" formatter={(v:any)=>`${v}%`} style={{fontSize:10, fontWeight:'bold', fill:'#64748b'}} />
                        </Area>
                     </AreaChart>
                  </ResponsiveContainer>
              ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs">데이터 없음</div>
              )}
          </div>

        </section>

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

        <div className="review-wrapper">
            <ReviewSection franchiseId={`case-${caseData.id}`} />
        </div>

        <section className="sticky bottom-4 z-50 animate-bounce-in max-w-6xl mx-auto px-1">
           <button onClick={() => setIsModalOpen(true)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-base md:text-lg font-bold py-3 md:py-4 rounded-xl shadow-2xl shadow-indigo-500/40 flex items-center justify-center gap-2 transition-all active:scale-95">
               <ChatBubbleLeftRightIcon className="w-5 h-5" />
               {caseData.brand} 창업 조건 문의하기
           </button>
        </section>
      </main>
    </div>
  );
}