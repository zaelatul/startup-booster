'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import { LightBulbIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// --- 데이터 타입 ---
export interface MarketAnalysisData {
  profitTrend: { quarter: string; index: number }[];
  ageDist: { name: string; value: number }[];
  genderDist: { name: string; value: number }[];
  population: { name: string; value: number }[];
  costStructure: { name: string; value: number }[];
  timeIndex: { name: string; value: number }[];
  kpiCards: { title: string; value: string; desc: string }[];
}

const COLOR_ORANGE = '#F97316'; 
const COLOR_MALE = '#3B82F6';   
const COLOR_FEMALE = '#F97316'; 
const COLOR_DEEP_BLUE = '#0F172A';
const COLOR_PINK_PURPLE = '#EC4899';
const ageColors = ['#0F172A', '#1E3A8A', '#4B5563', '#9CA3AF', '#E5E7EB'];

type DetailTabKey = 'profit' | 'customer' | 'structure' | 'competition' | 'time' | 'summary';

const detailTabs: { key: DetailTabKey; label: string }[] = [
  { key: 'profit', label: '수익·트렌드' },
  { key: 'customer', label: '고객 분석' },
  { key: 'structure', label: '구조·비용' },
  { key: 'competition', label: '경쟁·집객' },
  { key: 'time', label: '시간대' },
  { key: 'summary', label: '종합 리포트' },
];

// [주소 로직 데이터]
const REGION_DATA: any = {
  '서울특별시': { districts: ['강남구', '서초구', '중구', '마포구'] },
  '경기도': { districts: ['수원시 권선구', '수원시 팔달구', '성남시 분당구', '용인시 수지구'] }
};

// ------------------------------------------------------------------
// [1] 인구 분석 로직 (자동 생성기) 🧠
// ------------------------------------------------------------------
function analyzePopulation(popData: any[]) {
  const resident = popData.find(p => p.name.includes('거주'))?.value || 1;
  const floating = popData.find(p => p.name.includes('유동'))?.value || 1;
  const workplace = popData.find(p => p.name.includes('직장'))?.value || 0;

  const ratio = floating / resident;

  if (ratio >= 1.5) {
    return {
      type: 'floating',
      title: '유동 인구가 북적이는 활발한 상권!',
      desc: `거주 인구(${resident/10000}만)보다 유동 인구(${floating/10000}만)가 약 ${ratio.toFixed(1)}배 더 많습니다. 외부 유입이 많아 테이크아웃이나 트렌디한 매장이 유리합니다.`,
      color: 'text-green-900',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      Icon: LightBulbIcon
    };
  } else if (workplace > resident) {
    return {
      type: 'office',
      title: '직장인 중심의 오피스 상권',
      desc: '평일 점심 장사가 핵심입니다. 저녁 회식이나 점심 간단식을 공략하는 전략이 필요합니다.',
      color: 'text-blue-900',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      Icon: CheckCircleIcon
    };
  } else {
    return {
      type: 'residential',
      title: '안정적인 주거 밀집 상권',
      desc: '단골 확보가 중요한 지역입니다. 배달 영업과 가족 단위 손님을 타겟팅하면 안정적인 매출이 가능합니다.',
      color: 'text-indigo-900',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      Icon: CheckCircleIcon
    };
  }
}

// ------------------------------------------------------------------
// [2] 비용 분석 로직 (자동 생성기) 🧠
// ------------------------------------------------------------------
function analyzeCost(costData: any[]) {
  const rent = costData.find(c => c.name === '임대료')?.value || 0;
  
  if (rent >= 30) {
    return {
      status: 'warning',
      title: `임대료 비중이 매우 높습니다 (${rent}%)`,
      desc: '일반적인 권장 수준(10~15%)을 크게 초과합니다. 고정비 부담을 줄이기 위해 회전율을 극한으로 높이거나, 배달 비중을 높여 공간 효율을 찾아야 합니다.',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100',
      iconColor: 'text-orange-500',
      textColor: 'text-orange-900',
      Icon: ExclamationTriangleIcon
    };
  } else if (rent >= 20) {
    return {
      status: 'caution',
      title: `임대료 부담이 조금 있는 편입니다 (${rent}%)`,
      desc: '매출이 떨어지면 타격이 클 수 있습니다. 손익분기점을 꼼꼼히 계산해보세요.',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-100',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-900',
      Icon: LightBulbIcon
    };
  } else {
    return {
      status: 'good',
      title: `고정비 구조가 아주 건강합니다 (${rent}%)`,
      desc: '임대료 부담이 적어 순수익을 남기기 좋은 환경입니다. 재료나 서비스에 더 투자해서 경쟁력을 높이세요!',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-900',
      Icon: CheckCircleIcon
    };
  }
}


interface Props {
  data: MarketAnalysisData;
}

export const MarketAnalysis: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<DetailTabKey>('profit');
  const [selectedSiDo, setSelectedSiDo] = useState('서울특별시');
  const [districts, setDistricts] = useState<string[]>(REGION_DATA['서울특별시'].districts);

  const handleSiDoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const siDo = e.target.value;
    setSelectedSiDo(siDo);
    setDistricts(REGION_DATA[siDo]?.districts || []);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up pb-10">
      
      {/* STEP 01: 검색 필터 */}
      <section className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">STEP 01. 상권분석 설정</h2>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              ✅ 공공데이터 기준
            </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">시/도</label>
            <select 
              className="w-full rounded-2xl border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-all hover:bg-slate-100 cursor-pointer"
              onChange={handleSiDoChange}
              value={selectedSiDo}
            >
               <option value="서울특별시">서울특별시</option>
               <option value="경기도">경기도</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">시/군/구</label>
            <select className="w-full rounded-2xl border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-all hover:bg-slate-100 cursor-pointer">
               {districts.map((d) => (<option key={d} value={d}>{d}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">행정동</label>
            <select className="w-full rounded-2xl border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-all hover:bg-slate-100 cursor-pointer">
               <option>구운동</option><option>인계동</option><option>역삼동</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">업종</label>
            <select className="w-full rounded-2xl border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-700 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-all hover:bg-slate-100 cursor-pointer">
               <option>음식점 {'>'} 한식</option><option>음식점 {'>'} 카페</option>
            </select>
          </div>
        </div>
        <button type="button" className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-200 transition-all transform active:scale-95">
          선택한 조건으로 분석 시작
        </button>
      </section>

      {/* KPI 지표 */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4 ml-1">상권 핵심 지표</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.kpiCards.map((card) => (
            <div key={card.title} className="flex flex-col justify-between rounded-2xl bg-[#1E293B] p-6 shadow-lg border border-slate-700 hover:-translate-y-1 transition-transform duration-300">
              <div>
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-extrabold text-white mb-2 tracking-tight">{card.value}</p>
              </div>
              <div className="mt-2 pt-3 border-t border-slate-600/50">
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium opacity-90">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 지도 영역 */}
      <section className="rounded-3xl bg-white p-1 shadow-sm border border-slate-100 overflow-hidden relative">
         <div className="absolute top-5 left-5 z-10">
            <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm border border-slate-200">
               📍 지도 기반 분석
            </span>
         </div>
         <div className="h-[300px] md:h-[400px] bg-slate-100 w-full rounded-[20px] flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="text-center z-10 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                <p className="text-4xl mb-2">🗺️</p>
                <p className="font-bold text-slate-600">지도 API 연동 대기 중</p>
                <p className="text-xs text-slate-500 mt-1">경쟁 업체 및 상권 영역이 여기에 표시됩니다.</p>
            </div>
         </div>
      </section>

      {/* 상세 분석 탭 */}
      <section className="rounded-3xl bg-white shadow-sm border border-slate-100 overflow-hidden pt-1">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 p-1">
            {detailTabs.map((tab) => (
                <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold transition-all shadow-sm ${
                    activeTab === tab.key 
                    ? 'bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-2' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
                >
                {tab.label}
                </button>
            ))}
           </div>
        </div>

        <div className="p-6 md:p-8 min-h-[400px]">
           {activeTab === 'profit' && <ProfitTrendSection data={data.profitTrend} />}
           {activeTab === 'customer' && <CustomerSection ageData={data.ageDist} genderData={data.genderDist} popData={data.population} />}
           {activeTab === 'structure' && <StructureCostSection data={data.costStructure} />}
           {activeTab === 'competition' && <CompetitionSection />}
           {activeTab === 'time' && <TimeSection data={data.timeIndex} />}
           {activeTab === 'summary' && <SummarySection />}
        </div>
      </section>
    </div>
  );
};

// --- 하위 차트 컴포넌트 ---

const ProfitTrendSection = ({ data }: { data: any[] }) => (
  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
    <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center">
        📈 분기별 매출 지수 추이
        <span className="ml-2 text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500">100 기준</span>
    </h3>
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 30, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dy={15} />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} domain={['dataMin - 10', 'auto']} />
          <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
          <Line type="monotone" dataKey="index" stroke={COLOR_DEEP_BLUE} strokeWidth={4} dot={{ r: 6, strokeWidth: 3, fill: '#fff' }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    
    {/* 분석 코멘트 */}
    <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3">
        <LightBulbIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
            <p className="text-xs font-bold text-indigo-900 mb-1">매출 상승세가 뚜렷해요!</p>
            <p className="text-xs text-indigo-700 leading-relaxed">
                최근 4분기 동안 매출 지수가 지속적으로 상승하고 있습니다. (92 → 108) <br/>
                상권이 활성화되고 있거나, 해당 업종의 수요가 늘어나고 있다는 긍정적인 신호입니다.
            </p>
        </div>
    </div>
  </div>
);

const CustomerSection = ({ ageData, genderData, popData }: { ageData: any[], genderData: any[], popData: any[] }) => {
  // [자동 분석] 인구 분석 결과 가져오기
  const popAnalysis = analyzePopulation(popData);
  const PopIcon = popAnalysis.Icon;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-4">🎂 연령대별 방문 비율</h3>
              <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                      <Pie 
                        data={ageData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" cy="50%" 
                        innerRadius={60} 
                        outerRadius={90} 
                        paddingAngle={3}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} 
                      >
                      {ageData.map((entry, index) => <Cell key={`cell-${index}`} fill={ageColors[index % ageColors.length]} strokeWidth={0} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 8 }} />
                  </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-4">👫 성별 방문 비율</h3>
              <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                      <Pie 
                        data={genderData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" cy="50%" 
                        innerRadius={60} 
                        outerRadius={90} 
                        paddingAngle={3}
                        label={({ value }) => `${value}%`}
                      >
                          {genderData.map((entry, index) => (
                            <Cell key={index} fill={entry.name === '남성' ? COLOR_MALE : COLOR_FEMALE} strokeWidth={0} />
                          ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 8 }} />
                  </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-xs text-slate-400">주요 고객</p>
                      <p className="text-xl font-bold text-slate-800">{genderData[0].value > genderData[1].value ? '남성' : '여성'}</p>
                  </div>
              </div>
          </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-4">👥 배후지 인구 구성</h3>
          <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popData} margin={{ top: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tickFormatter={(v) => `${v/1000}k`} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 8 }} cursor={{fill: '#f1f5f9'}} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#10B981" barSize={60} />
                  </BarChart>
              </ResponsiveContainer>
          </div>
          
          {/* [자동 반영] 인구 분석 코멘트 */}
          <div className={`mt-4 p-4 ${popAnalysis.bgColor} border border-transparent rounded-xl flex gap-3`}>
              <PopIcon className={`w-5 h-5 ${popAnalysis.iconColor} flex-shrink-0 mt-0.5`} />
              <div>
                  <p className={`text-xs font-bold ${popAnalysis.color} mb-1`}>{popAnalysis.title}</p>
                  <p className={`text-xs ${popAnalysis.color} leading-relaxed`}>{popAnalysis.desc}</p>
              </div>
          </div>
      </div>
    </div>
  );
};

const StructureCostSection = ({ data }: { data: any[] }) => {
  // [자동 분석] 비용 분석 결과 가져오기
  const costAnalysis = analyzeCost(data);
  const CostIcon = costAnalysis.Icon;

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
      <h3 className="text-sm font-bold text-slate-900 mb-6">💰 예상 비용 구조</h3>
      <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} fill={COLOR_ORANGE} barSize={50} />
              </BarChart>
          </ResponsiveContainer>
      </div>

      {/* [자동 반영] 비용 분석 코멘트 */}
      <div className={`mt-4 p-4 ${costAnalysis.bgColor} border ${costAnalysis.borderColor} rounded-xl flex gap-3`}>
          <CostIcon className={`w-5 h-5 ${costAnalysis.iconColor} flex-shrink-0 mt-0.5`} />
          <div>
              <p className={`text-xs font-bold ${costAnalysis.textColor} mb-1`}>{costAnalysis.title}</p>
              <p className={`text-xs ${costAnalysis.textColor} leading-relaxed`}>{costAnalysis.desc}</p>
          </div>
      </div>
    </div>
  );
};

// ... (나머지 TimeSection, CompetitionSection, SummarySection 등은 기존 코드 유지)
const TimeSection = ({ data }: { data: any[] }) => (
  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
    <h3 className="text-sm font-bold text-slate-900 mb-6">⏰ 시간대별 매출 집중도</h3>
    <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill={COLOR_PINK_PURPLE} barSize={50} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  </div>
);

const CompetitionSection = () => (
    <div className="bg-slate-50 rounded-2xl p-10 border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm mb-4">🏗️</div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">경쟁·집객 분석 준비 중</h3>
        <p className="text-sm text-slate-500 max-w-sm">지도 API가 연결되면 반경 500m 내의 동일 업종 점포 수와 주요 집객 시설(지하철, 관공서 등)을 분석해 드립니다.</p>
    </div>
);

const SummarySection = () => (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl p-10 border border-slate-200 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm mb-4">📑</div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">종합 리포트 생성 대기</h3>
        <p className="text-sm text-slate-500 max-w-sm">모든 데이터가 수집되면 상권의 활성도, 성장성, 안정성을 종합적으로 평가하여 등급(S~D)을 산출합니다.</p>
    </div>
);