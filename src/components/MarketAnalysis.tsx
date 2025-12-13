'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, LabelList
} from 'recharts';

// --- 데이터 타입 정의 ---
export interface MarketAnalysisData {
  grade: string;
  summaryReport: {
    growthTitle: string;
    growthDesc: string;
    stabilityTitle: string;
    stabilityDesc: string;
    compTitle: string;
    compDesc: string;
  };
  profitTrend: { quarter: string; index: number }[];
  ageDist: { name: string; value: number }[];
  genderDist: { name: string; value: number }[];
  population: { name: string; value: number | string; label?: string }[];
  costStructure: { name: string; value: number; label: string }[];
  timeIndex: { name: string; value: number }[];
  kpiCards: { title: string; value: string; desc: string; badge?: string }[];
}

// --- 색상 상수 ---
const COLOR_MALE = '#3B82F6';
const COLOR_FEMALE = '#F97316';
const AGE_COLORS = ['#94A3B8', '#64748B', '#475569', '#334155', '#1E293B', '#0F172A'];
const COST_BAR_COLOR = '#F59E0B'; 
const POP_BAR_COLOR = '#10B981'; 

const INDUSTRY_DATA = [
  { code: '', label: '전체 업종' },
  { code: '한식음식점', label: '한식' },
  { code: '커피-음료', label: '카페/커피' },
  { code: '치킨전문점', label: '치킨/호프' },
  { code: '분식전문점', label: '분식' },
  { code: '일식음식점', label: '일식' },
  { code: '양식음식점', label: '양식' },
  { code: '제과점', label: '베이커리/제과' },
  { code: '패스트푸드점', label: '패스트푸드' },
  { code: '호프-간이주점', label: '술집/주점' },
  { code: '편의점', label: '편의점' },
  { code: '슈퍼마켓', label: '슈퍼마켓' },
  { code: '미용실', label: '미용실' },
  { code: '피부관리실', label: '피부관리' },
  { code: '네일숍', label: '네일아트' },
  { code: '세탁소', label: '세탁소' },
  { code: '일반교습학원', label: '학원(입시/보습)' },
  { code: '예술학원', label: '학원(예체능)' },
  { code: '스포츠 강습', label: '헬스/필라테스' },
  { code: '일반의원', label: '병원/의원' },
  { code: '의약품', label: '약국' },
  { code: '꽃집', label: '화초/꽃집' },
  { code: '인테리어', label: '인테리어' }
];

const REGION_DATA: any = { 
    '서울특별시': { '강남구': ['역삼1동', '청담동', '신사동', '논현1동', '삼성1동'], '종로구': ['청운효자동', '사직동', '삼청동', '종로1.2.3.4가동'], '마포구': ['서교동', '연남동', '망원1동'] }, 
    '경기도': { '수원시 장안구': ['율천동', '정자1동', '조원1동'] }
};

// [PART 1] 검색 필터
export const MarketFilters = ({ onSearch }: { onSearch: (addr: string, code: string) => void }) => {
  const [sido, setSido] = useState('서울특별시');
  const [gungu, setGungu] = useState('강남구');
  const [dong, setDong] = useState('역삼1동');
  const [industry, setIndustry] = useState('한식');

  const handleSearchClick = () => { onSearch(`${sido} ${gungu} ${dong}`, industry); };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
          <h2 className="text-xl font-extrabold text-slate-900">STEP 01. 상권분석 설정</h2>
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">✅ 행정동 & 공공데이터 기준</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <select className="p-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm" value={sido} onChange={(e)=>setSido(e.target.value)}>{Object.keys(REGION_DATA).map(r => <option key={r} value={r}>{r}</option>)}</select>
        <select className="p-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm" value={gungu} onChange={(e)=>setGungu(e.target.value)}>{Object.keys(REGION_DATA[sido] || {}).map(g => <option key={g} value={g}>{g}</option>)}</select>
        <select className="p-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm" value={dong} onChange={(e)=>setDong(e.target.value)}>{(REGION_DATA[sido]?.[gungu] || []).map((d: string) => <option key={d} value={d}>{d}</option>)}</select>
        <select className="p-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm" value={industry} onChange={(e)=>setIndustry(e.target.value)}>{INDUSTRY_DATA.map((ind) => <option key={ind.code} value={ind.code}>{ind.label}</option>)}</select>
      </div>
      <button onClick={handleSearchClick} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">선택한 조건으로 분석 시작</button>
    </section>
  );
};

// [PART 2] KPI 카드
export const MarketKPIs = ({ data }: { data: MarketAnalysisData }) => {
  if (!data || !data.kpiCards) return null;
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-slate-900 mb-4 ml-1">📊 분석 요약</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpiCards.map((card, idx) => (
          <div key={idx} className="rounded-2xl shadow-lg border border-slate-700 p-6 flex flex-col justify-between bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-slate-300 tracking-wider">{card.title}</span>
                {card.badge && <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold backdrop-blur-sm">{card.badge}</span>}
                </div>
                <div className="text-3xl font-extrabold mb-2">{card.value}</div>
                <div className="text-[11px] text-slate-400 font-medium">{card.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// [PART 3] 상세 차트
export const MarketCharts = ({ data }: { data: MarketAnalysisData }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const detailTabs = [{ key: 'profit', label: '수익·트렌드' },{ key: 'customer', label: '고객 분석' },{ key: 'structure', label: '구조·비용' },{ key: 'competition', label: '경쟁·집객' },{ key: 'summary', label: '⭐ 종합 리포트' },];

  if (!data || !data.profitTrend) return <div className="p-10 text-center text-slate-500">데이터 로딩 중...</div>;

  return (
    <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex gap-2 overflow-x-auto scrollbar-hide">
        {detailTabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}>{tab.label}</button>
        ))}
      </div>

      <div className="p-6 md:p-8 min-h-[400px]">
        {/* 1. 수익·트렌드 */}
        {activeTab === 'profit' && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-6">📈 예상 점포당 월 매출 추이 (단위: 만원)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.profitTrend} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="quarter" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis unit="만" tick={{fontSize: 12}} axisLine={false} tickLine={false} width={80} tickFormatter={(value) => value.toLocaleString()} />
                  <Tooltip contentStyle={{borderRadius:'12px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}} formatter={(value: number) => [`${value.toLocaleString()} 만원`, '매출']} />
                  <Line type="monotone" dataKey="index" stroke="#1E293B" strokeWidth={3} dot={{r:6, fill:'#fff', strokeWidth:3}} activeDot={{r:8}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 2. 고객 분석 */}
        {activeTab === 'customer' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">👥 연령대별 유동인구 비율</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data.ageDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                        {data.ageDist.map((entry, index) => <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />)}
                        <LabelList dataKey="name" position="outside" style={{fontSize:'11px', fill:'#64748B'}} />
                        </Pie>
                        <Tooltip formatter={(val:number)=>`${val}%`} />
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                </div>
                <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">👫 성별 유동인구 비율</h3>
                <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data.genderDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                        <Cell fill={COLOR_MALE} /><Cell fill={COLOR_FEMALE} />
                        <LabelList dataKey="value" position="inside" fill="#fff" formatter={(val:number)=>`${val}%`} style={{fontSize:'12px', fontWeight:'bold'}} />
                        </Pie>
                        <Tooltip formatter={(val:number)=>`${val}%`} />
                    </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-sm font-bold text-slate-500">성별 구성</span></div>
                </div>
                </div>
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-900 mb-6">👨‍👩‍👧‍👦 배후지 인구 구성 (거주 vs 유동)</h3>
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.population} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} formatter={(val: number) => `${val.toLocaleString()}명`} />
                    <Bar dataKey="value" fill={POP_BAR_COLOR} radius={[0, 8, 8, 0]} barSize={40}>
                        <LabelList dataKey="label" position="right" style={{ fill: '#334155', fontSize: '12px', fontWeight: 'bold' }} />
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </div>
          </div>
        )}

        {/* 3. 구조·비용 */}
        {activeTab === 'structure' && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-6">💰 업종별 표준 비용 구조 (예시)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.costStructure}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize:12}} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{fill:'transparent'}} formatter={(val:number)=>`${val}%`} />
                  <Bar dataKey="value" fill={COST_BAR_COLOR} radius={[8,8,0,0]} barSize={60}>
                    <LabelList dataKey="label" position="top" style={{fill:'#334155', fontSize:'12px', fontWeight:'bold'}} />
                    {data.costStructure.map((entry, index) => (<Cell key={`cell-${index}`} fill={index === 0 ? '#F59E0B' : '#CBD5E1'} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* 4. 경쟁 */}
        {activeTab === 'competition' && (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4 text-4xl">🏗️</div>
            <h3 className="text-lg font-bold text-slate-700">경쟁/집객 분석 준비 중</h3>
            <p className="text-slate-400 text-sm mt-2">반경 내 경쟁 점포 분포를 시각화할 예정입니다.</p>
          </div>
        )}

        {/* 5. 종합 리포트 */}
        {activeTab === 'summary' && (
          <div className="rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                      <div>
                          <span className="text-indigo-400 font-bold text-xs tracking-wider uppercase mb-2 block">Premium Report</span>
                          <h3 className="text-3xl font-extrabold mb-2">AI 상권 진단 결과</h3>
                          <p className="text-slate-400 text-sm">유동인구 데이터를 중심으로 한 심층 분석입니다.</p>
                      </div>
                      <div className="text-right">
                          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">{data.grade}</div>
                          <div className="text-sm text-slate-400 font-medium mt-1">Class</div>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                         <h4 className="font-bold text-lg text-white mb-2 flex items-center gap-2"><span className="text-indigo-400">●</span> 성장성</h4>
                         <p className="text-white font-bold mb-1">{data.summaryReport.growthTitle}</p>
                         <p className="text-slate-300 text-sm leading-relaxed">{data.summaryReport.growthDesc}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                         <h4 className="font-bold text-lg text-white mb-2 flex items-center gap-2"><span className="text-emerald-400">●</span> 안정성</h4>
                         <p className="text-white font-bold mb-1">{data.summaryReport.stabilityTitle}</p>
                         <p className="text-slate-300 text-sm leading-relaxed">{data.summaryReport.stabilityDesc}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                         <h4 className="font-bold text-lg text-white mb-2 flex items-center gap-2"><span className="text-orange-400">●</span> 경쟁 강도</h4>
                         <p className="text-white font-bold mb-1">{data.summaryReport.compTitle}</p>
                         <p className="text-slate-300 text-sm leading-relaxed">{data.summaryReport.compDesc}</p>
                      </div>
                  </div>
              </div>
          </div>
        )}
      </div>
    </section>
  );
};