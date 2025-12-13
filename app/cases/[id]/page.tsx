'use client';

import React from 'react';
import Script from 'next/script';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, LabelList
} from 'recharts';
import { 
  MapPinIcon, CurrencyDollarIcon, HomeModernIcon, CalculatorIcon, 
  ClockIcon, CalendarDaysIcon, ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';

// -------------------------------------------------------------------------
// [관리자 입력 데이터 모델]
// -------------------------------------------------------------------------
const CASE_DATA = {
  id: 1,
  brandName: "메가커피",
  branchName: "강남역삼점",
  startupDate: "2022년 05월",
  heroImage: "/images/store_hero.jpg",
  
  location: "서울 강남구 역삼동",
  monthlyRevenue: 5800, // 만원
  rent: { deposit: 5000, monthly: 250 }, // 보증금 / 월세
  netProfit: 1250,      // 만원
  profitMargin: 21.5,   // %

  images: {
    store: ["/images/store_1.jpg", "/images/store_2.jpg"],
    menu: ["/images/menu_1.jpg", "/images/menu_2.jpg", "/images/menu_3.jpg", "/images/menu_4.jpg"]
  },

  quarterlyRevenue: [
    { name: '1분기', value: 4200 },
    { name: '2분기', value: 5500 },
    { name: '3분기', value: 5800 },
    { name: '4분기', value: 4500 },
  ],
  quarterComment: "여름 성수기(2~3분기)에 매출이 30% 이상 급증하는 패턴을 보입니다. 겨울철에는 따뜻한 디저트 메뉴로 객단가를 방어했습니다.",

  footTraffic: {
    dailyAvg: 15400, // 일 평균 유동인구
    competitors: 12, // 경쟁 업소 수
    comment: "평일 점심시간대 오피스 인구가 폭발적으로 유입되는 전형적인 오피스 상권입니다. 주말에는 유동인구가 급감하므로 평일 5일에 집중하는 전략이 유효합니다.",
    
    weekRatio: [
      { name: '주중', value: 75 },
      { name: '주말', value: 25 }
    ],
    
    dayRatio: [
      { day: '월', value: 18 }, { day: '화', value: 18 }, { day: '수', value: 17 },
      { day: '목', value: 17 }, { day: '금', value: 20 }, { day: '토', value: 6 }, { day: '일', value: 4 }
    ],

    timeRatio: [
      { time: '05~09', value: 10 },
      { time: '09~13', value: 45 },
      { time: '13~17', value: 25 },
      { time: '17~21', value: 15 },
      { time: '21~01', value: 5 },
      { time: '01~05', value: 0 },
    ],
    
    lat: 37.4979,
    lng: 127.0276
  },

  ownerComment: "오피스 상권 특성상 평일 점심 장사에 모든 걸 걸어야 합니다. 임대료가 낮은 이면도로를 선택한 대신, 배달 깃발을 공격적으로 꽂아 저녁 매출을 보완했습니다."
};

const COLORS = {
  primary: '#4f46e5',
  secondary: '#f59e0b',
  accent: '#10b981',
  pie: ['#4f46e5', '#94a3b8']
};

export default function CaseDetailPage() {
  
  const loadMap = () => {
    if (!window.kakao || !window.kakao.maps) return;
    const container = document.getElementById('mini-map');
    const options = { 
      center: new window.kakao.maps.LatLng(CASE_DATA.footTraffic.lat, CASE_DATA.footTraffic.lng), 
      level: 3 
    };
    const map = new window.kakao.maps.Map(container, options);
    const marker = new window.kakao.maps.Marker({ position: options.center });
    marker.setMap(map);
  };

  // 문의하기 버튼 클릭 핸들러 (브랜드명 포함)
  const handleInquiry = () => {
    // 나중에 실제 문의 페이지로 이동하거나 모달을 띄울 때 brandName을 같이 넘깁니다.
    alert(`'${CASE_DATA.brandName}' 창업 조건 문의 페이지로 이동합니다.`);
    // 예: router.push(`/inquiry?brand=${CASE_DATA.brandName}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Script 
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT_ID}&autoload=false`} 
        strategy="afterInteractive"
        onReady={() => window.kakao.maps.load(loadMap)}
      />

      {/* 1. 히어로 영역 */}
      <header className="relative h-72 flex flex-col items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url('/images/franchise-hero.jpg')` }}
        ></div>
        
        <div className="relative z-20 text-center animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight drop-shadow-lg">
            {CASE_DATA.brandName} <span className="text-indigo-300">{CASE_DATA.branchName}</span>
          </h1>
          <div className="inline-flex items-center gap-2 bg-black/30 px-5 py-2 rounded-full border border-white/20 backdrop-blur-md">
            <CalendarDaysIcon className="w-4 h-4 text-indigo-300"/>
            <span className="text-sm font-bold text-white tracking-wide">SINCE {CASE_DATA.startupDate}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-12 relative z-30 space-y-10">
        
        {/* 2. 핵심 5대 지표 (메탈 그레이 카드) */}
        <section className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6 text-white">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-x-0 md:divide-x divide-slate-600">
            <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center text-center p-2">
              <MapPinIcon className="w-6 h-6 text-slate-400 mb-2"/>
              <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">소재지</p>
              <p className="font-bold text-white text-sm break-keep">{CASE_DATA.location}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2">
              <CurrencyDollarIcon className="w-6 h-6 text-indigo-400 mb-2"/>
              <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">월 평균 매출</p>
              <p className="text-xl font-bold text-white">{CASE_DATA.monthlyRevenue.toLocaleString()}만</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2">
              <HomeModernIcon className="w-6 h-6 text-slate-400 mb-2"/>
              <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">월 임대료 (보증금/월세)</p>
              <p className="text-lg font-bold text-slate-200">
                {CASE_DATA.rent.deposit.toLocaleString()} / {CASE_DATA.rent.monthly.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 bg-slate-700/50 rounded-xl md:bg-transparent">
              <CalculatorIcon className="w-6 h-6 text-emerald-400 mb-2"/>
              <p className="text-xs text-emerald-400 mb-1 font-bold uppercase tracking-wider">월 순이익</p>
              <p className="text-2xl font-black text-emerald-400">{CASE_DATA.netProfit.toLocaleString()}만</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 flex items-center justify-center mb-2">
                <span className="text-xs font-bold text-indigo-400">{CASE_DATA.profitMargin}%</span>
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">수익률</p>
            </div>
          </div>
        </section>

        {/* 3. 매장 & 메뉴 이미지 */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CASE_DATA.images.store.map((img, i) => (
              <div key={i} className="aspect-video bg-slate-200 rounded-2xl relative overflow-hidden shadow-sm group">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">매장 사진 {i+1}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {CASE_DATA.images.menu.map((img, i) => (
              <div key={i} className="aspect-square bg-slate-100 rounded-xl relative overflow-hidden shadow-sm hover:ring-2 hover:ring-indigo-500 transition-all">
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs">메뉴 {i+1}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 분기별 매출 */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
          <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            분기별 평균 매출 추이 (계절성)
          </h3>
          <div className="h-64 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CASE_DATA.quarterlyRevenue} margin={{top:10, right:10, left:-20, bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:12, fontWeight:'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize:12}} />
                <Tooltip cursor={{fill:'#f8fafc'}} contentStyle={{borderRadius:'12px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(value:any)=>`${value.toLocaleString()}만원`} />
                <Bar dataKey="value" fill={COLORS.primary} radius={[6, 6, 0, 0]} barSize={40}>
                   <LabelList dataKey="value" position="top" formatter={(val:number) => `${(val/10000).toFixed(1)}억`} style={{fontSize:11, fill:'#64748b', fontWeight:'bold'}} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">
             <div className="mt-1"><span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">POINT</span></div>
             <p className="text-sm text-slate-700 leading-relaxed font-medium">{CASE_DATA.quarterComment}</p>
          </div>
        </section>

        {/* 5. 유동인구 & 상권 입체 분석 */}
        <section className="bg-slate-50 rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-6">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
            유동인구 & 상권 입체 분석
          </h3>
          
          {/* [수정 완료] 핵심 지표 배너 (메탈 그레이 + 텍스트 크기 조정) */}
          <div className="bg-slate-800 rounded-2xl p-6 text-center shadow-lg border border-slate-700 mb-8">
             <h4 className="text-xs text-indigo-400 font-bold mb-3 tracking-wider uppercase">핵심 상권 지표</h4>
             <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-xl md:text-2xl font-bold text-white leading-tight">
                <span>일 평균 유동인구 <span className="text-indigo-400 ml-1">{CASE_DATA.footTraffic.dailyAvg.toLocaleString()}명</span></span>
                <span className="hidden md:inline text-slate-600 font-thin">|</span>
                <span>행정동 지역내 경쟁점 <span className="text-red-400 ml-1">{CASE_DATA.footTraffic.competitors}개</span></span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
             
             {/* 좌측 컬럼 */}
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white rounded-2xl p-4 h-48 flex flex-col shadow-sm border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-500 mb-2 text-center">주중 vs 주말</h4>
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie data={CASE_DATA.footTraffic.weekRatio} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={5} dataKey="value">
                                 {CASE_DATA.footTraffic.weekRatio.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS.pie[index % COLORS.pie.length]} />
                                 ))}
                                 <LabelList dataKey="value" position="outside" formatter={(val:number)=>`${val}%`} style={{fontSize:11, fontWeight:'bold', fill:'#64748b'}} stroke="none" />
                              </Pie>
                           </PieChart>
                        </ResponsiveContainer>
                      </div>
                   </div>
                   <div className="bg-white rounded-2xl p-4 h-48 flex flex-col shadow-sm border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-500 mb-2 text-center">요일별 추이</h4>
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={CASE_DATA.footTraffic.dayRatio}>
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:11}} />
                              <Tooltip cursor={{fill:'transparent'}} />
                              <Bar dataKey="value" fill={COLORS.secondary} radius={[3,3,0,0]} />
                           </BarChart>
                        </ResponsiveContainer>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-2xl p-1 overflow-hidden border border-slate-100 shadow-sm">
                   <div id="mini-map" className="w-full h-48 rounded-xl relative">
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">지도 로딩중...</div>
                   </div>
                   <div className="p-3 flex items-center gap-1 text-xs text-slate-500 font-bold">
                      <MapPinIcon className="w-4 h-4 text-red-500"/> {CASE_DATA.location}
                   </div>
                </div>
             </div>

             {/* 우측 컬럼 */}
             <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col h-full">
                <h4 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-1"><ClockIcon className="w-4 h-4 text-indigo-500"/> 시간대별 집중도</h4>
                <div className="flex-1 min-h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={CASE_DATA.footTraffic.timeRatio} margin={{top:20, right:20, left:0, bottom:0}}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                         <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize:11}} padding={{left:10, right:10}} />
                         <Tooltip contentStyle={{borderRadius:'8px'}} />
                         <Line type="monotone" dataKey="value" stroke={COLORS.accent} strokeWidth={3} dot={{r:4, fill:'#fff', strokeWidth:2, stroke:COLORS.accent}}>
                            <LabelList dataKey="value" position="top" offset={10} formatter={(val:number)=>`${val}%`} style={{fontSize:11, fontWeight:'bold', fill:COLORS.accent}} />
                         </Line>
                      </LineChart>
                   </ResponsiveContainer>
                </div>
                <p className="text-xs text-center text-slate-400 mt-4">* 점심/저녁 피크타임 점유율을 확인하세요.</p>
             </div>
          </div>

          <div className="bg-white border-2 border-emerald-100 rounded-xl p-4 flex gap-3 shadow-sm">
             <div className="mt-1"><span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">ANALYSIS</span></div>
             <p className="text-sm text-slate-700 leading-relaxed font-medium">{CASE_DATA.footTraffic.comment}</p>
          </div>
        </section>

        {/* 6. 점주 코멘트 */}
        <section className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
           <div className="absolute top-0 right-0 text-[10rem] font-serif leading-none text-white/5 -mr-4 -mt-8">”</div>
           <div className="relative z-10">
              <h3 className="text-indigo-400 font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Owner's Comment
              </h3>
              <p className="text-lg md:text-xl font-medium leading-relaxed opacity-90">
                 "{CASE_DATA.ownerComment}"
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                 <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold shadow-lg">CEO</div>
                 <div>
                    <p className="text-sm font-bold text-white">{CASE_DATA.branchName} 점주님</p>
                    <p className="text-xs text-indigo-300">현재 2년차 안정적 운영 중</p>
                 </div>
              </div>
           </div>
        </section>

        {/* [추가] 7. 창업 문의 버튼 (브랜드명 연동) */}
        <section className="sticky bottom-4 z-50 animate-bounce-in">
           <button 
              onClick={handleInquiry}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold py-4 rounded-xl shadow-2xl shadow-indigo-500/40 flex items-center justify-center gap-2 transition-all active:scale-95"
           >
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
              {CASE_DATA.brandName} 창업 조건 문의하기
           </button>
        </section>

      </main>
    </div>
  );
}