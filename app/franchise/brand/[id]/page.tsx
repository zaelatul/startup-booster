'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  ChartBarIcon, BanknotesIcon, DocumentTextIcon, BuildingOfficeIcon, 
  ExclamationTriangleIcon, CheckBadgeIcon
} from '@heroicons/react/24/solid';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line 
} from 'recharts';

import RollingBanner from '@/components/home/RollingBanner';
import { FRANCHISE_MOCK_DATA, FranchiseDetail } from '@/lib/franchise-data';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TABS = [
  { id: 'overview', label: '기업 개요', icon: BuildingOfficeIcon },
  { id: 'status', label: '가맹 현황', icon: ChartBarIcon },
  { id: 'cost', label: '비용/수익', icon: BanknotesIcon },
  { id: 'contract', label: '계약/조건', icon: DocumentTextIcon },
];

export default function FranchiseDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<FranchiseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // 1. 진짜 DB에서 데이터 조회
      const { data: dbData } = await supabase.from('franchises').select('*').eq('id', id).maybeSingle();
      
      if (dbData) {
        // 2. DB 데이터를 화면에 맞는 형태(FranchiseDetail 타입)로 변환
        const mappedData: FranchiseDetail = {
           id: dbData.id,
           name: dbData.name,
           companyName: dbData.company_name,
           ceoName: dbData.ceo_name,
           address: dbData.address,
           contact: dbData.contact,
           logoUrl: dbData.logo_url,
           category: dbData.category,
           
           // JSON 컬럼들은 그대로 사용
           financials: dbData.financials,
           legalStatus: dbData.legal_status || { hasViolation: false }, // 방어 코드
           storeTrends: dbData.store_trends,
           storeSummary: dbData.store_summary,
           regionalStores: dbData.regional_stores,
           avgRevenue: dbData.avg_revenue,
           initialCosts: dbData.initial_costs,
           ongoingCosts: dbData.ongoing_costs,
           contract: dbData.contract
        };
        setData(mappedData);
      } else {
        // 3. 데이터가 없으면 Mock 데이터 (개발 중 확인용)
        console.log("DB에 데이터가 없어 Mock 데이터를 사용합니다.");
        setData(FRANCHISE_MOCK_DATA);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex justify-center items-center">데이터 로딩중...</div>;
  if (!data) return <div className="min-h-screen flex justify-center items-center">정보를 찾을 수 없습니다.</div>;

  const formatMoney = (val: number) => `${(val || 0).toLocaleString()}만원`;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. 상단 롤링 배너 */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
         <RollingBanner location="franchise" />
      </div>

      {/* 2. 브랜드 헤더 */}
      <header className="bg-white border-b border-slate-200 mt-6">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center gap-6">
           <div className="w-24 h-24 rounded-2xl border border-slate-200 p-2 bg-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-400 relative overflow-hidden">
              {data.logoUrl && data.logoUrl.startsWith('http') ? <img src={data.logoUrl} className="object-contain w-full h-full"/> : 'LOGO'}
           </div>
           <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                 <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg">{data.category}</span>
                 {data.legalStatus?.hasViolation && <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg flex items-center gap-1"><ExclamationTriangleIcon className="w-3 h-3"/> 법위반 이력</span>}
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{data.name}</h1>
              <p className="text-sm text-slate-500 font-medium">{data.companyName} | 대표자: {data.ceoName}</p>
           </div>
           <div className="flex flex-col gap-2 w-full md:w-auto">
              <button className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-500 transition-all">가맹 상담 신청</button>
              <button className="w-full px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all">정보공개서 보기</button>
           </div>
        </div>
        
        {/* 탭 네비게이션 */}
        <div className="max-w-6xl mx-auto px-4 mt-4">
           <div className="flex border-b border-slate-200">
              {TABS.map((tab) => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                 >
                    <tab.icon className="w-5 h-5"/> {tab.label}
                 </button>
              ))}
           </div>
        </div>
      </header>

      {/* 3. 탭 컨텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
         
         {/* 탭 1: 기업 개요 */}
         {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
               <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><BuildingOfficeIcon className="w-5 h-5 text-indigo-500"/> 가맹본부 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <InfoItem label="상호명" value={data.companyName} />
                     <InfoItem label="대표자" value={data.ceoName} />
                     <InfoItem label="사업자등록번호" value="123-45-67890 (예시)" />
                     <InfoItem label="연락처" value={data.contact} />
                     <InfoItem label="본사 주소" value={data.address} fullWidth />
                  </div>
               </section>

               <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><ChartBarIcon className="w-5 h-5 text-emerald-500"/> 최근 3년 재무 현황 (단위: 천원)</h3>
                  <div className="h-80 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.financials} margin={{top:20, right:30, left:20, bottom:5}}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                           <XAxis dataKey="year" />
                           <YAxis />
                           <Tooltip formatter={(val:number) => val.toLocaleString()} contentStyle={{borderRadius:'12px'}} />
                           <Legend />
                           <Bar dataKey="totalSales" name="전체 매출액" fill="#6366f1" radius={[4,4,0,0]} />
                           <Bar dataKey="operatingProfit" name="영업이익" fill="#10b981" radius={[4,4,0,0]} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </section>

               <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><ExclamationTriangleIcon className="w-5 h-5 text-red-500"/> 법 위반 및 제재 이력</h3>
                  {data.legalStatus?.hasViolation ? (
                     <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 font-bold">🚨 위반 내역: {data.legalStatus.violationDetail}</div>
                  ) : (
                     <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 font-bold flex items-center gap-2"><CheckBadgeIcon className="w-5 h-5"/> 최근 3년간 위반 사실 없음</div>
                  )}
               </section>
            </div>
         )}

         {/* 탭 2: 가맹 현황 */}
         {activeTab === 'status' && (
            <div className="space-y-8 animate-fade-in">
               <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">가맹점 변동 추이</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-2 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={data.storeTrends}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="year" />
                              <YAxis />
                              <Tooltip contentStyle={{borderRadius:'12px'}}/>
                              <Legend />
                              <Line type="monotone" dataKey="totalStores" name="전체 가맹점" stroke="#6366f1" strokeWidth={3} />
                              <Line type="monotone" dataKey="newStores" name="신규 개점" stroke="#10b981" strokeWidth={2} />
                              <Line type="monotone" dataKey="closedStores" name="계약 종료/해지" stroke="#ef4444" strokeWidth={2} />
                           </LineChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="space-y-4">
                        <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                           <p className="text-xs text-indigo-500 font-bold mb-1">총 가맹점 수 (최신)</p>
                           <p className="text-3xl font-black text-indigo-700">{(data.storeTrends?.[2]?.totalStores || 0).toLocaleString()}개</p>
                        </div>
                        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                           <p className="text-xs text-emerald-500 font-bold mb-1">신규 개점 (최신)</p>
                           <p className="text-3xl font-black text-emerald-700">+{(data.storeTrends?.[2]?.newStores || 0)}</p>
                        </div>
                     </div>
                  </div>
               </section>
            </div>
         )}

         {/* 탭 3: 비용 및 수익 */}
         {activeTab === 'cost' && (
            <div className="space-y-8 animate-fade-in">
               <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">초기 창업 비용 (예상)</h3>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-bold"><tr><th className="p-4">구분</th><th className="p-4 text-right">금액 (단위: 만원)</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                           <tr><td className="p-4">가맹비</td><td className="p-4 text-right">{formatMoney(data.initialCosts?.joinFee)}</td></tr>
                           <tr><td className="p-4">교육비</td><td className="p-4 text-right">{formatMoney(data.initialCosts?.eduFee)}</td></tr>
                           <tr><td className="p-4">보증금</td><td className="p-4 text-right">{formatMoney(data.initialCosts?.deposit)}</td></tr>
                           <tr><td className="p-4">인테리어 (평당)</td><td className="p-4 text-right">{formatMoney(data.initialCosts?.interior)}</td></tr>
                           <tr><td className="p-4">기타</td><td className="p-4 text-right">{formatMoney(data.initialCosts?.other)}</td></tr>
                           <tr className="bg-indigo-50 font-bold text-indigo-900"><td className="p-4">합계</td><td className="p-4 text-right text-lg">{formatMoney(data.initialCosts?.totalAvg)}</td></tr>
                        </tbody>
                     </table>
                  </div>
               </section>
               <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">수익 및 운영 비용</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200"><p className="text-sm font-bold text-slate-500 mb-2">연평균 매출</p><p className="text-3xl font-black text-slate-900">{formatMoney(data.avgRevenue?.nationwide)}</p></div>
                     <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200"><p className="text-sm font-bold text-slate-500 mb-2">로열티</p><p className="text-xl font-bold text-slate-900">{data.ongoingCosts?.royalty}</p></div>
                  </div>
               </section>
            </div>
         )}

         {/* 탭 4: 계약 및 조건 */}
         {activeTab === 'contract' && (
            <div className="space-y-8 animate-fade-in">
               <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">계약 조건</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <InfoItem label="최초 계약" value={`${data.contract?.termInitial}년`} />
                     <InfoItem label="연장 계약" value={`${data.contract?.termRenewal}년 단위`} />
                     <InfoItem label="영업지역 보호" value={data.contract?.areaProtection ? "보호함 (독점권)" : "보호 안 함"} fullWidth />
                  </div>
               </section>
            </div>
         )}

      </main>
    </div>
  );
}

function InfoItem({ label, value, fullWidth }: { label: string, value: string, fullWidth?: boolean }) {
   return (<div className={`p-4 bg-slate-50 rounded-xl border border-slate-100 ${fullWidth ? 'col-span-1 md:col-span-2' : ''}`}><p className="text-xs font-bold text-slate-500 mb-1">{label}</p><p className="text-base font-bold text-slate-900 break-keep">{value}</p></div>)
}