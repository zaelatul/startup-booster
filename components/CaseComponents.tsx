'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, AreaChart, Area, CartesianGrid, LabelList } from 'recharts';
import { MapPinIcon, CurrencyDollarIcon, HomeModernIcon, CalculatorIcon, BanknotesIcon, SparklesIcon, MagnifyingGlassPlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { formatMoney, getCleanImageUrl } from '@/lib/utils'; 

// 타입 정의
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
  return (
    <section className="bg-slate-800 rounded-xl md:rounded-2xl shadow-xl border border-slate-700 p-3 md:p-6 text-white">
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-slate-700/40 rounded-lg md:rounded-xl border border-slate-600/30"><MapPinIcon className="w-4 h-4 md:w-6 md:h-6 text-slate-400 mb-1"/><p className="text-[9px] md:text-xs text-slate-400 mb-0.5 font-bold">소재지</p><p className="font-bold text-white text-[10px] md:text-sm break-keep leading-tight">{data.area.split(' ')[0]} {data.area.split(' ')[1]}</p></div>
        <div className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-slate-700/40 rounded-lg md:rounded-xl border border-slate-600/30"><CurrencyDollarIcon className="w-4 h-4 md:w-6 md:h-6 text-indigo-400 mb-1"/><p className="text-[9px] md:text-xs text-slate-400 mb-0.5 font-bold">월 매출</p><p className="text-sm md:text-xl font-bold text-white">{formatMoney(data.detail.monthlyRevenue)}</p></div>
        <div className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-slate-700/40 rounded-lg md:rounded-xl border border-slate-600/30"><CalculatorIcon className="w-4 h-4 md:w-6 md:h-6 text-emerald-400 mb-1"/><p className="text-[9px] md:text-xs text-emerald-400 mb-0.5 font-bold">월 순이익</p><p className="text-base md:text-2xl font-black text-emerald-400">{formatMoney(data.detail.netProfit)}</p></div>
        <div className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-slate-700/40 rounded-lg md:rounded-xl border border-slate-600/30"><BanknotesIcon className="w-4 h-4 md:w-6 md:h-6 text-yellow-400 mb-1"/><p className="text-[9px] md:text-xs text-slate-400 mb-0.5 font-bold">총 창업비용</p><p className="text-sm md:text-lg font-bold text-slate-200">{formatMoney(data.detail.investCost)}</p></div>
        <div className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-slate-700/40 rounded-lg md:rounded-xl border border-slate-600/30"><HomeModernIcon className="w-4 h-4 md:w-6 md:h-6 text-indigo-300 mb-1"/><p className="text-[9px] md:text-xs text-slate-400 mb-0.5 font-bold">매장</p><div className="text-center"><p className="text-sm md:text-2xl font-extrabold text-white leading-none mb-1">{data.detail.storeSize}평</p><p className="text-[8px] md:text-xs text-slate-400 mt-2">보증금 {formatMoney(data.detail.rent.deposit)} {data.detail.rent.monthly > 0 && ` / 월세 ${formatMoney(data.detail.rent.monthly)}`}</p></div></div>
        <div className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-slate-700/40 rounded-lg md:rounded-xl border border-slate-600/30"><div className="mb-0.5"><span className="text-lg md:text-4xl font-black text-emerald-400 drop-shadow-md">{data.detail.profitMargin}%</span></div><p className="text-[9px] md:text-xs text-slate-400 font-bold">수익률</p></div>
      </div>
      {data.metricsComment && <div className="mt-4 md:mt-6 bg-slate-700/50 border border-slate-600 rounded-lg p-3 flex gap-2 shadow-inner"><div className="mt-0.5"><SparklesIcon className="w-4 h-4 text-yellow-400" /></div><p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">{data.metricsComment}</p></div>}
    </section>
  );
}

// 2. 이미지 갤러리 (Gallery)
export function CaseGallery({ data }: { data: CaseItem }) {
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  return (
    <>
      {zoomImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in" onClick={() => setZoomImage(null)}>
           <button onClick={() => setZoomImage(null)} className="absolute top-6 right-6 text-white bg-white/20 p-2 rounded-full hover:bg-white/40"><XMarkIcon className="w-6 h-6" /></button>
           <img src={zoomImage} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      <section className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {data.storeImages.map((img, i) => (
            <div key={i} className="relative aspect-video bg-slate-200 rounded-xl md:rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-slate-200" onClick={() => setZoomImage(getCleanImageUrl(img.url))}>
              <img src={getCleanImageUrl(img.url)} onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400?text=No+Image'; }} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
              <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent flex items-end"><span className="text-white text-[10px] md:text-xs font-bold px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/20 shadow-sm">{img.label}</span></div>
              <div className="absolute top-3 right-3 bg-black/30 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"><MagnifyingGlassPlusIcon className="w-4 h-4 text-white"/></div>
            </div>
          ))}
        </div>
        {data.menuImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2 md:gap-4">
              {data.menuImages.map((img, i) => (
              <div key={i} className="relative aspect-square bg-slate-100 rounded-lg md:rounded-xl overflow-hidden shadow-md cursor-pointer group hover:ring-2 hover:ring-indigo-500 transition-all" onClick={() => setZoomImage(getCleanImageUrl(img.url))}>
                  <img src={getCleanImageUrl(img.url)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400?text=No+Img'; }}/>
                  <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent"><span className="text-white text-[9px] font-bold px-2 py-0.5 bg-black/30 backdrop-blur-sm rounded border border-white/10">{img.label}</span></div>
              </div>
              ))}
          </div>
        )}
      </section>
    </>
  );
}

// 3. 매출 차트 (Revenue)
export function CaseRevenue({ data }: { data: CaseItem }) {
  return (
    <section className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-slate-100 p-4 md:p-8">
      <h3 className="font-bold text-sm md:text-lg text-slate-900 mb-4 flex items-center gap-2"><span className="w-1 h-4 md:w-1.5 md:h-6 bg-indigo-500 rounded-full shadow-sm"></span>분기별 매출 추이</h3>
      <div style={{ width: '100%', height: '300px' }} className="mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.quarterlyRevenue} margin={{top:10, right:0, left:-20, bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:10, fontWeight:'bold'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize:10}} />
            <Tooltip cursor={{fill:'#f8fafc'}} contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize:'12px'}} formatter={(value:any)=>`${formatMoney(value)}`} />
            <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} animationDuration={2000}><LabelList dataKey="value" position="top" formatter={(val:number) => formatMoney(val)} style={{fontSize:9, fill:'#64748b', fontWeight:'bold'}} /></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {data.quarterComment && <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex gap-2 shadow-sm"><div className="mt-0.5"><span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">POINT</span></div><p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{data.quarterComment}</p></div>}
    </section>
  );
}

// 4. 지도 및 상권 분석 (Location)
export function CaseLocation({ data, mapLoaded }: { data: CaseItem; mapLoaded: boolean }) {
  const [mapError, setMapError] = useState('');
  useEffect(() => {
    if (mapLoaded && data && window.kakao && window.kakao.maps) {
        const container = document.getElementById('mini-map');
        if (!container || !data.area) return;
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(data.area, function(result: any, status: any) {
          if (status === window.kakao.maps.services.Status.OK) { drawMap(result[0].y, result[0].x); } 
          else {
            const shortAddress = data.area.split(' ').slice(0, 2).join(' ');
            geocoder.addressSearch(shortAddress, function(res2: any, stat2: any) {
                if (stat2 === window.kakao.maps.services.Status.OK) { drawMap(res2[0].y, res2[0].x); } 
                else { setMapError('위치를 찾을 수 없습니다.'); }
            });
          }
        });
        function drawMap(lat: any, lng: any) {
            const coords = new window.kakao.maps.LatLng(lat, lng);
            const map = new window.kakao.maps.Map(container, { center: coords, level: 4 });
            new window.kakao.maps.Marker({ map: map, position: coords });
            setMapError('');
        }
    }
  }, [mapLoaded, data]);

  const weekVal = data.footTraffic.weekRatio.find(x => x.name === '주중')?.value || 0;
  const weekendVal = data.footTraffic.weekRatio.find(x => x.name === '주말')?.value || 0;
  
  return (
    <section className="bg-slate-50 rounded-2xl md:rounded-3xl shadow-lg border border-slate-100 p-4 md:p-8">
      {/* ✅ [수정] 색상을 text-slate-600으로 변경하여 더 진하게 표시 */}
      <h3 className="font-bold text-sm md:text-lg text-slate-900 flex items-center gap-2 mb-1">
        <span className="w-1 h-4 md:w-1.5 md:h-6 bg-emerald-500 rounded-full shadow-sm"></span>
        매장 소재 행정동 상권 입체 분석
      </h3>
      <p className="text-[10px] md:text-xs text-slate-600 font-bold mb-4 pl-3">
        * [소상공인진흥공단 상권분석 데이터 기준]
      </p>

      <div className="bg-slate-800 rounded-xl shadow-md border border-slate-700 p-4 mb-4 text-white">
          <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center p-4 bg-slate-700/40 rounded-lg border border-slate-600/30"><p className="text-[10px] text-slate-400 mb-1 font-bold">일 평균 유동인구</p><div className="flex items-center gap-1"><p className="text-xl md:text-3xl font-black text-white drop-shadow-md">{data.footTraffic.dailyAvg?.toLocaleString()}</p><span className="text-[9px] px-1.5 py-0.5 rounded border bg-blue-500/20 text-blue-300 border-blue-500/30">{data.footTraffic.trafficLevel}</span></div></div>
              <div className="flex flex-col items-center justify-center p-4 bg-slate-700/40 rounded-lg border border-slate-600/30"><p className="text-[10px] text-slate-400 mb-1 font-bold">경쟁점 수</p><div className="flex items-center gap-1"><p className="text-xl md:text-3xl font-black text-yellow-400 drop-shadow-md">{data.footTraffic.competitors}개</p><span className="text-[9px] px-1.5 py-0.5 rounded border bg-red-500/20 text-red-300 border-red-500/30">{data.footTraffic.competitorLevel}</span></div></div>
          </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
         <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
            <h4 className="text-xs font-bold text-slate-600 mb-2">방문 비율 (주중/주말)</h4>
            <div className="h-16 md:h-32 w-full mb-3 flex gap-1.5 items-end">{[...Array(10)].map((_, i) => (<div key={i} className={`flex-1 rounded-md transition-all duration-700 ease-out`} style={{ backgroundColor: i < Math.round(weekVal/10) ? '#4f46e5' : '#e2e8f0', height: '100%' }} />))}</div>
            <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-100"><span className="text-indigo-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span>주중 {weekVal}%</span><span className="text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span>주말 {weekendVal}%</span></div>
         </div>
         <div className="bg-white rounded-xl p-1 overflow-hidden border border-slate-100 shadow-sm relative">
             <div className="h-32 md:h-[224px] rounded-lg relative overflow-hidden">{mapError && <div className="absolute inset-0 z-10 bg-slate-100 flex items-center justify-center text-xs text-red-500 font-bold p-4 text-center">{mapError}</div>}<div id="mini-map" className="w-full h-full bg-slate-100"></div></div>
             <p className="text-[10px] md:text-xs text-slate-500 font-bold text-center py-2 bg-slate-50 border-t border-slate-100">📍 {data.area}</p>
         </div>
      </div>
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm h-64 md:h-80 mb-4">
          <h4 className="text-xs md:text-sm font-bold text-slate-700 mb-2 text-center">요일별 방문 추이</h4>
          <div style={{ width: '100%', height: '90%' }}>
              <ResponsiveContainer width="100%" height="100%"><BarChart data={data.footTraffic.dayRatio} margin={{top:20, bottom:0}}><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:10, fontWeight:'bold'}} /><Tooltip cursor={{fill:'transparent'}} contentStyle={{borderRadius:'8px', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize:'11px'}} formatter={(val:any)=>`${val}%`}/><Bar dataKey="value" radius={[4,4,0,0]} animationDuration={2000}>{data.footTraffic.dayRatio?.map((entry:any, index:number) => (<Cell key={`cell-${index}`} fill={entry.value === Math.max(...data.footTraffic.dayRatio.map(d=>d.value)) ? '#4f46e5' : '#cbd5e1'} />))}<LabelList dataKey="value" position="top" formatter={(v:any)=>`${v}%`} style={{fontSize:10, fontWeight:'bold', fill:'#64748b'}} /></Bar></BarChart></ResponsiveContainer>
          </div>
      </div>
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm h-64 md:h-80">
          <h4 className="text-xs md:text-sm font-bold text-slate-700 mb-2 text-center">시간대별 유동인구 집중도</h4>
          {data.footTraffic.timeRatio && data.footTraffic.timeRatio.length > 0 ? (
              <div style={{ width: '100%', height: '90%' }}>
                  <ResponsiveContainer width="100%" height="100%"><AreaChart data={data.footTraffic.timeRatio} margin={{top:20, right:10, left:-20, bottom:0}}><defs><linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize:10, fontWeight:'bold'}} interval={0} /><YAxis hide /><Tooltip contentStyle={{borderRadius:'8px', fontSize:'11px'}} formatter={(val:any)=>`${val}%`} /><Area type="monotone" dataKey="value" stroke="#4f46e5" fillOpacity={1} fill="url(#colorTime)" animationDuration={2000}><LabelList dataKey="value" position="top" formatter={(v:any)=>`${v}%`} style={{fontSize:10, fontWeight:'bold', fill:'#64748b'}} /></Area></AreaChart></ResponsiveContainer>
              </div>
          ) : <div className="h-full flex items-center justify-center text-slate-400 text-xs">데이터 없음</div>}
      </div>
    </section>
  );
}