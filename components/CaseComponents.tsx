'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, AreaChart, Area, CartesianGrid, LabelList } from 'recharts';
import { MapPinIcon, CurrencyDollarIcon, HomeModernIcon, CalculatorIcon, BanknotesIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { formatMoney, getCleanImageUrl } from '@/lib/utils';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

// ✅ [수정] 엉아 요청: 10,000 이상은 '억' (소수점 2자리), 미만은 '만원' (콤마 포함)
const formatCompactMoney = (value: number) => {
  if (!value && value !== 0) return '-';
  if (value >= 10000) {
    return Number((value / 10000).toFixed(2)) + '억';
  }
  return value.toLocaleString() + '만원';
};

export type CaseItem = {
  id: string; brand: string; branch: string; category: string; area: string; startupYear: string;
  mainImage: string; storeImages: { url: string; label: string }[]; menuImages: { url: string; label: string }[];
  ownerComment: string; quarterComment: string; metricsComment: string; summary: string; successPoint: string;
  detail: { monthlyRevenue: number; netProfit: number; investCost: number; storeSize: number; profitMargin: number; rent: { deposit: number; monthly: number; }; };
  quarterlyRevenue: { name: string; value: number }[];
  footTraffic: { dailyAvg: number; trafficLevel: string; competitors: number; competitorLevel: string; comment: string; weekRatio: { name: string; value: number }[]; dayRatio: { day: string; value: number }[]; timeRatio: { time: string; value: number }[]; };
};

// 1. 핵심 지표 (Metrics)
export function CaseMetrics({ data }: { data: CaseItem }) {
  const { domRef, isVisible } = useScrollAnimation();
  const cCls = "font-bold text-white text-[10px] md:text-sm break-keep leading-tight";
  
  return (
    <section 
      ref={domRef}
      className={`bg-slate-800 rounded-xl md:rounded-2xl shadow-xl border border-slate-700 p-3 md:p-6 text-white transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
    >
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {[
          { label: '소재지', icon: MapPinIcon, val: `${data.area.split(' ')[0]} ${data.area.split(' ')[1]}`, color: 'text-slate-400' },
          { label: '월 매출', icon: CurrencyDollarIcon, val: formatMoney(data.detail.monthlyRevenue), color: 'text-indigo-400' },
          { label: '월 순이익', icon: CalculatorIcon, val: formatMoney(data.detail.netProfit), color: 'text-emerald-400' },
          { label: '총 창업비용', icon: BanknotesIcon, val: formatMoney(data.detail.investCost), color: 'text-yellow-400' },
          { label: '매장', icon: HomeModernIcon, val: `${data.detail.storeSize}평`, color: 'text-indigo-300', isStore: true },
          { label: '수익률', icon: null as any, val: `${data.detail.profitMargin}%`, color: 'text-emerald-400' }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-slate-700/40 rounded-lg md:rounded-xl border border-slate-600/30">
            {item.icon ? <item.icon className={`w-4 h-4 md:w-6 md:h-6 ${item.color} mb-1`}/> : <div className="w-4 h-4 md:w-6 md:h-6 flex items-center justify-center mb-1"><span className={`${item.color} font-black text-xs md:text-lg`}>%</span></div>}
            <p className="text-[9px] md:text-xs text-slate-400 mb-0.5 font-bold">{item.label}</p>
            <p className={cCls}>{item.val}</p>
            {item.isStore && (
              <p className="text-[7px] md:text-[10px] text-indigo-200/60 mt-0.5 font-medium">
                보증금 {formatCompactMoney(data.detail.rent.deposit)} / 월세 {formatCompactMoney(data.detail.rent.monthly)}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ✅ [수정] Analysis 배지를 위로 올려서 모바일 쏠림 현상 해결 */}
      {data.metricsComment && (
        <div className="mt-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 md:p-4 flex flex-col gap-2">
           <div className="w-fit"><span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">Analysis</span></div>
           <p className="text-[11px] md:text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">{data.metricsComment}</p>
        </div>
      )}
    </section>
  );
}

// 2. 갤러리 (Gallery)
export function CaseGallery({ data }: { data: CaseItem }) {
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const { domRef, isVisible } = useScrollAnimation();

  return (
    <>
      {zoomImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setZoomImage(null)}>
           <button onClick={() => setZoomImage(null)} className="absolute top-6 right-6 text-white"><XMarkIcon className="w-6 h-6" /></button>
           <img src={zoomImage} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" alt="Zoomed" />
        </div>
      )}
      <section ref={domRef} className={`space-y-4 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid grid-cols-2 gap-4">
          {data.storeImages.map((img, i) => (
            <div key={i} className="relative aspect-video bg-slate-200 rounded-xl overflow-hidden cursor-pointer shadow-md group border border-slate-200" onClick={() => setZoomImage(getCleanImageUrl(img.url))}>
              <img src={getCleanImageUrl(img.url)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={img.label}/>
              <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent flex items-end"><span className="text-white text-[10px] md:text-xs font-bold px-2.5 py-1 bg-black/40 rounded-lg border border-white/20 shadow-sm">{img.label}</span></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {data.menuImages.map((img, i) => (
            <div key={i} className="relative aspect-square bg-slate-100 rounded-lg md:rounded-xl overflow-hidden cursor-pointer shadow-sm group" onClick={() => setZoomImage(getCleanImageUrl(img.url))}>
              <img src={getCleanImageUrl(img.url)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={img.label}/>
              <div className="absolute bottom-0 left-0 w-full p-1 bg-gradient-to-t from-black/70 to-transparent flex items-end"><span className="text-white text-[8px] font-bold px-1.5 py-0.5 bg-black/30 rounded border border-white/10 shadow-sm">{img.label}</span></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// 3. 매출 차트 (Revenue)
export function CaseRevenue({ data }: { data: CaseItem }) {
  const [mounted, setMounted] = useState(false);
  const { domRef, isVisible } = useScrollAnimation();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="h-[300px] bg-slate-50 animate-pulse rounded-2xl" />;
  
  return (
    <div ref={domRef} className="space-y-4">
      <div className="w-full h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart key={isVisible ? 'v_active' : 'v_inactive'} data={data.quarterlyRevenue} margin={{top:25, right:5, left:-20, bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:10, fontWeight:'bold'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize:10}} />
            <Tooltip cursor={{fill:'#f8fafc'}} formatter={(v: number) => formatCompactMoney(v)} />
            <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} animationDuration={1500}>
              {/* ✅ [수정] 차트 위 수치 자동 변환 적용 */}
              <LabelList dataKey="value" position="top" formatter={(val: number) => formatCompactMoney(val)} fill="#64748b" fontSize={10} fontWeight="bold" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {data.quarterComment && (
        <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex flex-col md:flex-row gap-2">
          <div className="shrink-0"><span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">ANALYSIS</span></div>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{data.quarterComment}</p>
        </div>
      )}
    </div>
  );
}

// 4. 상권 분석 (Location)
export function CaseLocation({ data, mapLoaded }: { data: CaseItem; mapLoaded: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [pc, setPc] = useState(false);
  const { domRef, isVisible } = useScrollAnimation();

  useEffect(() => { setMounted(true); if (typeof window !== 'undefined') setPc(window.innerWidth > 768); }, []);

  useEffect(() => {
    if (!mapLoaded || typeof window === 'undefined') return;
    const kakao = (window as any).kakao;
    if (!kakao?.maps?.services?.Geocoder) return;
    const container = document.getElementById('mini-map');
    if (!container) return;
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(data.area, (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        const map = new window.kakao.maps.Map(container, { center: coords, level: 4 });
        new window.kakao.maps.Marker({ map, position: coords });
        map.relayout();
      }
    });
  }, [mapLoaded, data.area]);

  const weekVal = data.footTraffic.weekRatio.find((x) => x.name === '주중')?.value || 0;
  const weekendVal = data.footTraffic.weekRatio.find((x) => x.name === '주말')?.value || 0;

  if (!mounted) return <div className="h-[600px] bg-slate-50 animate-pulse rounded-2xl" />;

  return (
    <div className="space-y-4">
      {/* ✅ [수정] 제목-서브텍스트 간격 밀착 해결 (-mt-4를 사용하여 적절히 띄움) */}
      <p className="text-[10px] md:text-xs text-slate-500 font-bold pl-3 -mt-4 mb-2 relative z-10">
        * [소상공인진흥공단 상권분석 데이터 기준]
      </p>

      <div className="bg-slate-800 rounded-xl shadow-md p-3 text-white flex items-center justify-around relative">
        <div className="flex-1 text-center">
          <p className="text-[8px] md:text-[10px] text-slate-400 font-bold mb-1">일 평균 유동인구</p>
          <div className="flex items-center justify-center gap-1">
            <p className="text-sm md:text-3xl font-black">{data.footTraffic.dailyAvg?.toLocaleString()}</p>
            <span className="text-[7px] md:text-[9px] px-1 py-0.5 rounded border bg-blue-500/20 text-blue-300 border-blue-500/30 font-bold">{data.footTraffic.trafficLevel}</span>
          </div>
        </div>
        <div className="w-[2px] h-10 md:h-14 bg-white/10 mx-2 rounded-full"></div>
        <div className="flex-1 text-center">
          <p className="text-[8px] md:text-[10px] text-slate-400 font-bold mb-1">경쟁점 수</p>
          <div className="flex items-center justify-center gap-1">
            <p className="text-sm md:text-3xl font-black text-yellow-400">{data.footTraffic.competitors}개</p>
            <span className="text-[7px] md:text-[9px] px-1 py-0.5 rounded border bg-red-500/20 text-red-300 border-red-500/30 font-bold">{data.footTraffic.competitorLevel}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ✅ [수정] 주중/주말 차트: 애니메이션 싹 삭제하고 고정 색상으로 표시 */}
        <div className="bg-white rounded-xl p-4 border border-slate-100 h-[180px] md:h-auto flex flex-col justify-between shadow-sm">
          <h4 className="text-xs font-bold text-slate-600 mb-2">방문 비율 (주중/주말)</h4>
          <div className="h-20 md:h-32 w-full mb-3 flex gap-1 items-end">
            {[...Array(10)].map((_, i) => {
              const isActive = i < Math.round(weekVal / 10);
              return (
                <div 
                  key={i} 
                  className="flex-1 rounded-sm shadow-sm h-full" 
                  style={{ backgroundColor: isActive ? '#4f46e5' : '#e2e8f0' }} 
                />
              )
            })}
          </div>
          <div className="flex justify-between items-center text-[10px] md:text-xs font-bold pt-2 border-t border-slate-100">
            <span className="text-indigo-600 font-black">주중 {weekVal}%</span>
            <span className="text-slate-400 font-bold">주말 {weekendVal}%</span>
          </div>
        </div>
        <div id="mini-map" className="bg-white rounded-xl border border-slate-100 h-[180px] md:h-[224px] shadow-sm" />
      </div>

      {/* 요일별 차트: 스크롤 감지 시 재생 */}
      <div ref={domRef} className="bg-white rounded-xl p-4 border border-slate-100 h-64 md:h-80 mb-4 shadow-sm overflow-hidden">
        <h4 className="text-xs md:text-sm font-bold text-slate-700 mb-2 text-center">요일별 방문 추이</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart key={isVisible ? 'day-active' : 'day-inactive'} data={data.footTraffic.dayRatio} margin={{ top: 20, right: 5, left: -30, bottom: 10 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: pc ? 14 : 9, fontWeight: 'bold', fill: '#64748b' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={18} animationDuration={1200}>
              {data.footTraffic.dayRatio?.map((e: any, idx: number) => (
                <Cell key={idx} fill={e.value === Math.max(...data.footTraffic.dayRatio.map((d) => d.value)) ? '#4f46e5' : '#cbd5e1'} />
              ))}
              <LabelList dataKey="value" position="top" fill="#64748b" fontWeight="bold" fontSize={pc ? 14 : 9} formatter={(v: any) => `${v}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 시간대 차트: 스크롤 감지 시 재생 */}
      <div className="bg-white rounded-xl p-4 border border-slate-100 h-64 md:h-80 shadow-sm overflow-hidden">
        <h4 className="text-xs md:text-sm font-bold text-slate-700 mb-2 text-center">시간대별 유동인구 집중도</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart key={isVisible ? 'time-active' : 'time-inactive'} data={data.footTraffic.timeRatio} margin={{ top: 20, right: 5, left: -25, bottom: 10 }}>
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: pc ? 12 : 8, fontWeight: 'bold', fill: '#64748b' }} interval={0} />
            <Area type="monotone" dataKey="value" stroke="#4f46e5" fillOpacity={0.3} fill="#4f46e5" animationDuration={1200}>
              <LabelList dataKey="value" position="top" fill="#64748b" fontWeight="bold" fontSize={pc ? 12 : 8} formatter={(v: any) => `${v}%`} />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {data.footTraffic.comment && (
        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex flex-col md:flex-row gap-2">
          <div className="shrink-0"><span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">ANALYSIS</span></div>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{data.footTraffic.comment}</p>
        </div>
      )}
    </div>
  );
}

// 5. 점주 인터뷰 (Owner Comment)
export function CaseOwnerComment({ comment, branch, contentClassName }: { comment: string; branch: string; contentClassName?: string }) {
  return (
    <section className="bg-slate-900 rounded-[2.5rem] p-6 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
      <div className="absolute top-0 right-8 text-[12rem] md:text-[18rem] font-serif leading-none text-white/5 -mt-12 select-none italic">”</div>
      <div className="relative z-10">
        <h3 className="text-indigo-400 font-black text-xs md:text-sm mb-4 md:mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> 사장님의 한마디
        </h3>
        <p className={`${contentClassName || "text-[11px] md:text-sm lg:text-base"} font-medium leading-relaxed text-slate-300 whitespace-pre-wrap italic`}>
          "{comment}"
        </p>
        <div className="mt-8 md:mt-12 flex items-center gap-4 border-t border-white/10 pt-6">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-black text-sm md:text-xl shadow-lg">CEO</div>
          <p className="text-sm md:text-lg font-black text-white ml-4">{branch} 점주님</p>
        </div>
      </div>
    </section>
  );
}