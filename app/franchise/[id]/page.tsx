'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BuildingOfficeIcon, ChartBarIcon, BanknotesIcon, DocumentTextIcon, 
  ExclamationTriangleIcon, CheckBadgeIcon, MapPinIcon,
  ArrowTrendingUpIcon, MegaphoneIcon, AcademicCapIcon, ChatBubbleLeftRightIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ComposedChart, Line 
} from 'recharts';

import RollingBanner from '@/components/home/RollingBanner';
import InquiryModal from '@/components/InquiryModal';
import { FranchiseDetail, FRANCHISE_MOCK_DATA } from '@/lib/franchise-data';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 3.3㎡당 매출 입력값 상태 관리
  const [inputPerPyeong, setInputPerPyeong] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: dbData } = await supabase.from('franchises').select('*').eq('id', id).maybeSingle();

      if (dbData) {
        const mappedData: FranchiseDetail = {
          id: dbData.id,
          name: dbData.name,
          companyName: dbData.company_name,
          ceoName: dbData.ceo_name,
          address: dbData.address,
          contact: dbData.contact,
          logoUrl: dbData.logo_url,
          heroImage: dbData.hero_image, 
          category: dbData.category,
          
          financials: dbData.financials,
          legalStatus: dbData.legal_status,
          storeTrends: dbData.store_trends,
          storeSummary: dbData.store_summary || FRANCHISE_MOCK_DATA.storeSummary,
          regionalStores: dbData.regional_stores,
          
          avgRevenue: typeof dbData.avg_revenue === 'object' ? dbData.avg_revenue : { total: dbData.avg_revenue || 0, perPyeong: 0 },
          initialCosts: dbData.initial_costs,
          ongoingCosts: dbData.ongoing_costs,
          contract: dbData.contract
        };
        setData(mappedData);
        
        if (mappedData.avgRevenue?.perPyeong) {
            setInputPerPyeong(mappedData.avgRevenue.perPyeong);
        }
      } else {
        const fallbackData = { 
          ...FRANCHISE_MOCK_DATA, 
          id: id,
          name: `(임시) ${FRANCHISE_MOCK_DATA.name}` 
        };
        setData(fallbackData);
        if (fallbackData.avgRevenue?.perPyeong) {
            setInputPerPyeong(fallbackData.avgRevenue.perPyeong);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-slate-50 text-slate-500 font-medium">데이터 불러오는 중...</div>;
  if (!data) return <div className="min-h-screen flex justify-center items-center bg-slate-50 text-slate-500">데이터를 불러올 수 없습니다.</div>;

  const formatMoney = (val: number) => `${(val || 0).toLocaleString()}만원`;
  const formatNumber = (val: number) => `${val?.toLocaleString() || 0}개`;

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans text-slate-800">
      
      <InquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} category="가맹 문의" targetBrand={data.name} />

      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
         <div className="max-w-6xl mx-auto px-4 h-12 flex items-center">
            <Link href="/franchise/explore" className="text-[10px] md:text-sm font-bold text-slate-500 hover:text-slate-900 transition-all bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">
               뒤로가기
            </Link>
         </div>
      </header>

      {/* 배너 */}
      <div className="relative w-full h-44 md:h-60 bg-slate-800 overflow-hidden shadow-xl mb-4 md:mb-8">
         {data.heroImage ? (
            <>
               <Image 
                 src={data.heroImage} 
                 alt="Brand Banner" 
                 fill
                 priority
                 className="object-cover"
                 sizes="(max-width: 768px) 100vw, 1200px"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
            </>
         ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500 font-bold">
               <RollingBanner location="franchise" />
            </div>
         )}
         
         <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-end gap-4 md:gap-6">
               <div className="w-16 h-16 md:w-32 md:h-32 bg-slate-800 border-2 border-slate-700 shadow-2xl rounded-2xl flex items-center justify-center overflow-hidden p-1 md:p-2 backdrop-blur-sm shrink-0">
                  {data.logoUrl && !data.logoUrl.includes('placeholder') ? 
                      <div className="relative w-full h-full">
                        <Image src={data.logoUrl} alt="Logo" fill className="object-contain rounded-xl" sizes="(max-width: 768px) 64px, 128px"/>
                      </div> : 
                      <span className="text-[10px] md:text-lg font-black text-slate-600 tracking-widest">LOGO</span>
                  }
               </div>
               
               <div className="flex-1 mb-0.5 md:mb-1">
                  <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-3">
                     <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-wide rounded-full shadow-lg border border-indigo-400/30">{data.category}</span>
                     {data.legalStatus.hasViolation && <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] md:text-xs font-bold rounded-full flex items-center gap-1 shadow-md animate-pulse"><ExclamationTriangleIcon className="w-3.5 h-3.5"/> 법위반 이력</span>}
                  </div>
                  <h1 className="text-xl md:text-5xl font-black text-white mb-1 md:mb-2 tracking-tight drop-shadow-xl">{data.name}</h1>
                  <p className="text-slate-300 font-medium text-xs md:text-base">{data.companyName} <span className="mx-1 md:mx-2 text-slate-500">|</span> 대표: {data.ceoName}</p>
               </div>
            </div>
         </div>
      </div>

      {/* 탭 */}
      <div className="sticky top-12 z-40 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 shadow-sm pt-2">
        <div className="max-w-6xl mx-auto px-4">
           <div className="flex gap-2">
              {TABS.map((tab) => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 md:py-4 text-[11px] md:text-sm font-bold flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 transition-all rounded-t-lg
                       ${activeTab === tab.id 
                       ? 'bg-slate-800 text-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] -translate-y-1' 
                       : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                    }`}
                 >
                    <tab.icon className={`w-4 h-4 md:w-5 md:h-5 ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-400'}`}/> 
                    {tab.label}
                 </button>
              ))}
           </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12">
          
          {activeTab === 'overview' && (
             <div className="space-y-6 md:space-y-8 animate-fade-in">
                <Section title="가맹본부 요약" icon={BuildingOfficeIcon}>
                   <div className="grid grid-cols-4 gap-2 md:gap-4">
                      <InfoCard label="상호명" value={data.companyName} />
                      <InfoCard label="대표자" value={data.ceoName} />
                      <InfoCard label="연락처" value={data.contact} />
                      <InfoCard label="본사 주소" value={data.address} />
                   </div>
                </Section>

                <Section title="최근 3년 재무 흐름 (단위: 천원)" icon={ChartBarIcon}>
                   <div className="h-64 md:h-80 w-full mt-4 p-2 md:p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={data.financials} margin={{top:20, right:0, left:-20, bottom:0}} barSize={30}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155"/>
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill:'#94A3B8', fontSize:10, fontWeight:'bold'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill:'#64748B', fontSize:10}} />
                            <Tooltip cursor={{fill: '#1E293B'}} contentStyle={{backgroundColor:'#0F172A', color:'#E2E8F0', borderRadius:'12px', border:'1px solid #334155', boxShadow:'0 10px 15px -3px rgb(0 0 0 / 0.4)', fontSize:'11px'}} formatter={(val:number) => val.toLocaleString()} />
                            <Legend wrapperStyle={{paddingTop:'20px', fontSize:'11px'}} formatter={(value) => <span className="text-slate-300">{value}</span>} />
                            <Bar dataKey="totalSales" name="본사 매출" fill="#6366F1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="operatingProfit" name="영업이익" fill="#22D3EE" radius={[4, 4, 0, 0]} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </Section>
                
                <Section title="법적 리스크 점검" icon={ExclamationTriangleIcon}>
                   {data.legalStatus.hasViolation ? (
                      <div className="p-4 md:p-6 bg-red-900/30 border-2 border-red-900/50 rounded-2xl text-red-300 font-bold shadow-lg flex items-start gap-3">
                         <ExclamationTriangleIcon className="w-5 h-5 md:w-6 md:h-6 text-red-500 shrink-0" />
                         <div>
                            <p className="text-red-400 mb-1">🚨 위반 내역 발견</p>
                            <p className="text-xs md:text-sm font-medium">{data.legalStatus.violationDetail}</p>
                         </div>
                      </div>
                   ) : (
                      <div className="p-4 md:p-6 bg-emerald-900/30 border-2 border-emerald-900/50 rounded-2xl text-emerald-300 font-bold shadow-lg flex items-center gap-3 text-sm md:text-base">
                         <CheckBadgeIcon className="w-5 h-5 md:w-6 md:h-6 text-emerald-500"/> 
                         최근 3년간 위반 사실 없음 (Clean Brand)
                      </div>
                   )}
                </Section>
             </div>
          )}

          {activeTab === 'status' && (
             <div className="space-y-6 md:space-y-8 animate-fade-in">
                <Section title="가맹점 변동 추이" icon={ChartBarIcon}>
                   <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
                     <StatusCard label="전체 가맹점" value={data.storeSummary ? formatNumber(data.storeSummary.total) : '-'} diff={data.storeSummary?.totalDiff} />
                     <StatusCard label="신규 개점" value={data.storeSummary ? formatNumber(data.storeSummary.new) : '-'} diff={data.storeSummary?.newDiff} valueColor="text-blue-400" />
                     <StatusCard label="계약 종료" value={data.storeSummary ? formatNumber(data.storeSummary.closed) : '-'} diff={data.storeSummary?.closedDiff} isNegativeGood valueColor="text-red-400" />
                   </div>
                   <div className="h-64 md:h-96 w-full mt-6 p-2 md:p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                      <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={data.storeTrends} margin={{top:20, right:10, bottom:0, left:-10}}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155"/>
                            <XAxis dataKey="year" scale="point" padding={{ left: 30, right: 30 }} tick={{fill:'#94A3B8', fontSize:10, fontWeight:'bold'}} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="left" orientation="left" stroke="#64748B" axisLine={false} tickLine={false} tick={{fontSize:10}} domain={[0, 'dataMax * 1.15']} />
                            <YAxis yAxisId="right" orientation="right" stroke="#64748B" axisLine={false} tickLine={false} tick={{fontSize:10}} domain={[0, 'dataMax * 1.15']} />
                            <Tooltip cursor={{fill: '#1E293B'}} contentStyle={{backgroundColor:'#0F172A', color:'#E2E8F0', borderRadius:'12px', border:'1px solid #334155', boxShadow:'0 10px 15px -3px rgb(0 0 0 / 0.4)', fontSize:'11px'}} />
                            <Legend wrapperStyle={{paddingTop:'20px', fontSize:'11px'}} formatter={(value) => <span className="text-slate-300">{value}</span>} />
                            <Bar yAxisId="left" dataKey="totalStores" name="전체 가맹점" fill="#475569" barSize={30} radius={[4, 4, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="newStores" name="신규" stroke="#22D3EE" strokeWidth={3} dot={{r:3, fill:'#22D3EE'}} />
                            <Line yAxisId="right" type="monotone" dataKey="closedStores" name="종료" stroke="#F87171" strokeWidth={3} dot={{r:3, fill:'#F87171'}} />
                         </ComposedChart>
                      </ResponsiveContainer>
                   </div>
                </Section>

                <Section title="지역별 가맹점 분포 (전국)" icon={MapPinIcon}>
                   <div className="h-[600px] md:h-[800px] w-full mt-4">
                      {data.regionalStores && data.regionalStores.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={data.regionalStores} layout="vertical" margin={{top:0, right:30, left:0, bottom:0}} barSize={12}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155"/>
                                <XAxis type="number" hide domain={[0, 'dataMax * 1.15']} />
                                <YAxis dataKey="region" type="category" width={40} tick={{fill:'#94A3B8', fontSize:10, fontWeight:'bold'}} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor:'#0F172A', color:'#E2E8F0', borderRadius:'8px', border:'1px solid #334155', fontSize:'11px'}} />
                                <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#CBD5E1', fontSize: 10, fontWeight:'bold', formatter: (val: number) => val.toLocaleString() }} />
                             </BarChart>
                          </ResponsiveContainer>
                      ) : (
                          <div className="h-full flex items-center justify-center text-slate-500 text-sm">지역별 데이터가 없습니다.</div>
                      )}
                   </div>
                </Section>
             </div>
          )}

          {activeTab === 'cost' && (
             <div className="space-y-6 md:space-y-8 animate-fade-in">
                
                <Section title="초기 창업 비용 (예상)" icon={BanknotesIcon}>
                   <div className="overflow-hidden rounded-2xl border-2 border-slate-700/50 shadow-xl">
                      <table className="w-full text-xs md:text-sm text-left">
                         <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider">
                            <tr><th className="p-3 md:p-5 border-b border-slate-700">구분</th><th className="p-3 md:p-5 border-b border-slate-700 text-right">평균 비용</th></tr>
                         </thead>
                         <tbody className="divide-y divide-slate-700/50 bg-slate-900/30">
                            <tr><td className="p-3 md:p-5 text-slate-300 font-medium">가맹비</td><td className="p-3 md:p-5 text-right font-bold text-white">{formatMoney(data.initialCosts.joinFee)}</td></tr>
                            <tr className="bg-slate-900/60"><td className="p-3 md:p-5 text-slate-300 font-medium">교육비</td><td className="p-3 md:p-5 text-right font-bold text-white">{formatMoney(data.initialCosts.eduFee)}</td></tr>
                            <tr><td className="p-3 md:p-5 text-slate-300 font-medium">보증금</td><td className="p-3 md:p-5 text-right font-bold text-white">{formatMoney(data.initialCosts.deposit)}</td></tr>
                            <tr className="bg-slate-900/60"><td className="p-3 md:p-5 text-slate-300 font-medium">인테리어</td><td className="p-3 md:p-5 text-right font-bold text-white">{formatMoney(data.initialCosts.interior)}</td></tr>
                            <tr><td className="p-3 md:p-5 text-slate-300 font-medium">기타</td><td className="p-3 md:p-5 text-right font-bold text-white">{formatMoney(data.initialCosts.other)}</td></tr>
                            <tr className="bg-gradient-to-r from-slate-900 to-slate-800">
                               <td className="p-4 md:p-6 font-black text-sm md:text-lg text-white">예상 합계</td>
                               <td className="p-4 md:p-6 text-right">
                                  <div className="text-sm md:text-2xl font-black text-[#00FF00] drop-shadow-[0_0_15px_rgba(0,255,0,0.4)]">{formatMoney(data.initialCosts.totalAvg)}</div>
                               </td>
                            </tr>
                         </tbody>
                      </table>
                   </div>
                </Section>

                {/* [NEW] 2. 가맹점 매출 데이터 (높이/정렬/폰트 통일, 안내문구 삭제) */}
                <Section title="가맹점 연평균 매출" icon={ArrowTrendingUpIcon}>
                   {/* 모바일 2열 배치 (grid-cols-2) */}
                   <div className="grid grid-cols-2 gap-3 md:gap-6 mb-6">
                      {/* 전체 평균 매출 카드 (높이 고정, 중앙 정렬) */}
                      <div className="p-4 md:p-8 bg-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 text-center h-40 md:h-48">
                         <p className="text-[10px] md:text-sm font-bold text-slate-400 uppercase break-keep">가맹점 전체 평균 매출 (연간)</p>
                         {/* 폰트 사이즈 통일: text-xl md:text-2xl */}
                         <p className="text-xl md:text-2xl font-black text-white">
                            {formatMoney(typeof data.avgRevenue === 'object' ? data.avgRevenue?.total : data.avgRevenue || 0)}
                         </p>
                      </div>
                      
                      {/* 3.3㎡ 매출 입력 카드 (높이 고정, 중앙 정렬, 안내문구 삭제) */}
                      <div className="p-4 md:p-8 bg-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 text-center h-40 md:h-48">
                         <p className="text-[10px] md:text-sm font-bold text-indigo-400 uppercase break-keep">3.3㎡(1평)당 평균 매출</p>
                         <div className="flex items-center gap-1 justify-center w-full">
                             <input 
                                type="text" 
                                value={inputPerPyeong ? inputPerPyeong.toLocaleString() : ''} 
                                onChange={(e) => {
                                    const val = Number(e.target.value.replaceAll(',', ''));
                                    if (!isNaN(val)) setInputPerPyeong(val);
                                }}
                                // 폰트 사이즈 통일, p-0 유지
                                className="text-xl md:text-2xl font-black text-indigo-400 bg-transparent border-b border-indigo-500/50 focus:border-indigo-400 focus:outline-none w-32 md:w-40 text-center p-0"
                                placeholder="0"
                             />
                             <span className="text-sm md:text-xl font-bold text-slate-500 mb-1 shrink-0">만원</span>
                         </div>
                         {/* 안내 텍스트 삭제됨 */}
                      </div>
                   </div>

                   {/* [NEW] 예상 매출 계산기 결과 */}
                   <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
                      <h4 className="text-xs md:text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                         <CalculatorIcon className="w-4 h-4 md:w-5 md:h-5 text-yellow-400"/> 표준 평수 예상 매출 (자동 계산)
                      </h4>
                      
                      {/* 모바일 2열 배치, 높이/정렬 통일 */}
                      <div className="grid grid-cols-2 gap-3 md:gap-6">
                         <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-center hover:border-slate-600 transition-colors flex flex-col items-center justify-center h-32 md:h-40">
                            <p className="text-[10px] md:text-xs text-slate-400 font-bold mb-1">20평 기준/년</p>
                            {/* 폰트 사이즈 통일: text-xl md:text-2xl */}
                            <p className="text-xl md:text-2xl font-black text-white">
                               {formatMoney(inputPerPyeong * 20)}
                            </p>
                         </div>
                         <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-center hover:border-slate-600 transition-colors flex flex-col items-center justify-center h-32 md:h-40">
                            <p className="text-[10px] md:text-xs text-slate-400 font-bold mb-1">30평 기준/년</p>
                            {/* 폰트 사이즈 통일: text-xl md:text-2xl */}
                            <p className="text-xl md:text-2xl font-black text-yellow-400">
                               {formatMoney(inputPerPyeong * 30)}
                            </p>
                         </div>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-4 text-center break-keep">
                         * 해당 수치는 3.3㎡당 평균 매출을 기준으로 단순 환산한 추정치이며, 실제 매장 구조와 상권에 따라 달라질 수 있습니다.
                      </p>
                   </div>

                   <p className="text-[10px] md:text-xs text-slate-500 mt-2 md:mt-3 text-right flex items-center justify-end gap-1">
                      <ExclamationTriangleIcon className="w-3 h-3" /> 공정거래위원회 정보공개서 기준 (변동 가능)
                   </p>
                </Section>

                <Section title="운영 중 부담 (월 고정비)" icon={ChartBarIcon}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <HighlightCard title="로열티 (Royalty)" value={data.ongoingCosts.royalty} icon={BanknotesIcon} />
                      <HighlightCard title="광고/판촉비 분담" value={data.ongoingCosts.adFee} icon={MegaphoneIcon} />
                   </div>
                </Section>
             </div>
          )}

          {activeTab === 'contract' && (
             <div className="space-y-6 md:space-y-8 animate-fade-in">
                <Section title="계약 중요 조건" icon={DocumentTextIcon}>
                   <div className="grid grid-cols-3 gap-2 md:gap-6 mb-4 md:mb-6">
                      <InfoCard label="최초 계약" value={`${data.contract.termInitial}년`} accentColor="text-indigo-400" />
                      <InfoCard label="연장 단위" value={`${data.contract.termRenewal}년`} accentColor="text-indigo-400" />
                      <InfoCard label="갱신 비용" value={data.contract.renewalCost} accentColor="text-indigo-400" />
                   </div>
                   <div className="p-4 md:p-8 bg-slate-900/50 border-2 border-slate-700/50 rounded-2xl shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4">
                         {data.contract.areaProtection ? 
                            <span className="bg-indigo-600 text-white text-[10px] md:text-xs px-2 md:px-3 py-1 font-black uppercase rounded-full shadow-md">Exclusive</span> :
                            <span className="bg-slate-600 text-slate-300 text-[10px] md:text-xs px-2 md:px-3 py-1 font-black uppercase rounded-full">Non-Exclusive</span>
                         }
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
                         <MapPinIcon className="w-6 h-6 md:w-8 md:h-8 text-indigo-400"/>
                         <h4 className="text-lg md:text-xl font-bold text-white">영업지역 보호</h4>
                      </div>
                      <p className="text-sm md:text-xl font-black text-indigo-400 mb-2">{data.contract.areaProtection ? "보호함 (독점권)" : "보호 안 함"}</p>
                      <p className="text-xs md:text-lg text-slate-400 font-medium border-t border-slate-700/50 pt-2 md:pt-4 mt-2 md:mt-4">{data.contract.areaDesc}</p>
                   </div>
                </Section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                   <Section title="교육 및 훈련" icon={AcademicCapIcon}>
                      <ul className="space-y-4 md:space-y-6 p-2">
                         <DetailListItem label="교육 기간" value={`${data.contract.training.days}일`} />
                         <DetailListItem label="비용 부담" value={data.contract.training.costBearer} />
                         <li className="bg-slate-900/50 p-4 md:p-5 rounded-xl border border-slate-700/50 mt-2">
                            <p className="text-xs md:text-sm font-bold text-slate-400 mb-2">상세 내용</p>
                            <p className="text-xs md:text-base text-slate-200 leading-relaxed">{data.contract.training.contents}</p>
                         </li>
                      </ul>
                   </Section>
                   <Section title="마케팅/운영 통제" icon={MegaphoneIcon}>
                      <ul className="space-y-4 md:space-y-6 p-2">
                         <DetailListItem label="광고비 비율" value={data.contract.marketing.ratio} />
                         <DetailListItem label="가격 통제" value={data.contract.qualityControl.priceControl ? '있음' : '없음'} valueColor={data.contract.qualityControl.priceControl ? 'text-red-400' : 'text-blue-400'} />
                         <li className="bg-slate-900/50 p-4 md:p-5 rounded-xl border border-slate-700/50 mt-2">
                            <p className="text-xs md:text-sm font-bold text-slate-400 mb-2">활동 내용</p>
                            <p className="text-xs md:text-base text-slate-200 leading-relaxed">{data.contract.marketing.desc}</p>
                         </li>
                      </ul>
                   </Section>
                </div>
             </div>
          )}
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-slate-50 border-t border-slate-200 p-4 z-50">
         <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-base font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
         >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            가맹 문의하기
         </button>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: any) {
   return (
      <section className="bg-slate-800 shadow-xl rounded-3xl border border-slate-700/50 overflow-hidden relative group">
         <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
         <h3 className="text-sm md:text-xl font-black mb-4 md:mb-8 flex items-center gap-3 uppercase tracking-tight px-6 md:px-8 py-4 md:py-6 bg-slate-900/30 border-b border-slate-700/50 text-white">
            <Icon className="w-5 h-5 md:w-7 md:h-7 text-indigo-400"/> 
            <span className="drop-shadow-md">{title}</span>
         </h3>
         <div className="px-4 md:px-8 pb-6 md:pb-10">{children}</div>
      </section>
   )
}

function InfoCard({ label, value, fullWidth, accentColor = "text-white" }: { label: string, value: string, fullWidth?: boolean, accentColor?: string }) {
   return (
      <div className={`p-2 md:p-6 bg-slate-900/50 border border-slate-700/50 shadow-lg rounded-xl md:rounded-2xl ${fullWidth ? 'col-span-full' : ''} text-center flex flex-col justify-center`}>
         <p className="text-[8px] md:text-xs font-bold text-slate-500 uppercase mb-1 md:mb-2">{label}</p>
         <p className={`text-[9px] md:text-xl font-black ${accentColor} break-keep whitespace-normal leading-tight`}>{value}</p>
      </div>
   )
}

function StatusCard({ label, value, diff, isNegativeGood, valueColor = "text-white" }: any) {
   return (
      <div className="p-3 md:p-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-center shadow-lg">
         <p className="text-[10px] md:text-xs text-slate-500 font-bold mb-1 md:mb-2 uppercase">{label}</p>
         <p className={`text-sm md:text-2xl font-black ${valueColor} mb-1 md:mb-2`}>{value}</p>
         <div className="flex justify-center items-center gap-1 md:gap-2 bg-slate-900/80 py-1 md:py-2 rounded-lg">
            {diff !== 0 && <span className={`text-[10px] md:text-xs font-bold ${diff > 0 ? 'text-red-400' : 'text-blue-400'}`}>{diff > 0 ? '▲' : '▼'} {Math.abs(diff)}</span>}
         </div>
      </div>
   )
}

function HighlightCard({ title, value, icon: Icon }: any) {
   return (
      <div className="p-4 md:p-8 bg-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg flex items-center gap-4 md:gap-6">
         <div className="w-10 h-10 md:w-16 md:h-16 bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 md:w-8 md:h-8 text-indigo-400"/>
         </div>
         <div>
            <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase mb-1">{title}</p>
            <p className="text-sm md:text-xl font-black text-white">{value}</p>
         </div>
      </div>
   )
}

function DetailListItem({ label, value, valueColor = "text-white" }: any) {
   return (
      <li className="flex justify-between items-center border-b border-slate-700/50 pb-3 md:pb-4 px-2">
         <span className="text-xs md:text-sm text-slate-400 font-bold flex items-center gap-2">
            <CheckBadgeIcon className="w-3 h-3 md:w-4 md:h-4 text-indigo-500"/> {label}
         </span>
         <span className={`text-sm md:text-lg ${valueColor} font-black`}>{value}</span>
      </li>
   )
}