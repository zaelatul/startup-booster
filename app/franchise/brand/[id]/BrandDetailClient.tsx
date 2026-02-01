'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ChartBarIcon, CurrencyDollarIcon, BuildingStorefrontIcon, 
  DocumentTextIcon, CheckBadgeIcon, 
  ArrowTrendingUpIcon, BanknotesIcon, CalculatorIcon,
  ChartPieIcon, MegaphoneIcon, MapPinIcon, AcademicCapIcon, ExclamationTriangleIcon,
  BuildingOfficeIcon, ClockIcon, ChevronLeftIcon, ChatBubbleOvalLeftEllipsisIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';

import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell, LabelList 
} from 'recharts';

import InquiryPopup from '@/components/brand-detail/InquiryPopup';

const TABS = [
  { key: 'summary', label: '기업 개요', icon: BuildingOfficeIcon },
  { key: 'store', label: '가맹 현황', icon: ChartBarIcon },
  { key: 'finance', label: '비용/수익', icon: BanknotesIcon },
  { key: 'analysis', label: '계약/조건', icon: DocumentTextIcon }, 
];

const PIE_COLORS = ['#818CF8', '#34D399', '#F472B6', '#FBBF24']; 

export default function BrandDetailClient({ vm }: { vm: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('summary');
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // [핵심] 차트 데이터 연도별 오름차순 정렬 (2022 -> 2025)
  // 데이터가 뒤죽박죽 들어와도 차트가 꼬이지 않게 방지
  const sortedFinancials = useMemo(() => {
      if (!vm.financials) return [];
      return [...vm.financials].sort((a: any, b: any) => Number(a.year) - Number(b.year));
  }, [vm.financials]);

  const sortedStoreTrends = useMemo(() => {
      if (!vm.storeTrends) return [];
      return [...vm.storeTrends].sort((a: any, b: any) => Number(a.year) - Number(b.year));
  }, [vm.storeTrends]);

  const fmtMoney = (val: number) => {
    if (!val && val !== 0) return '0원';
    if (val === 0) return '0원';
    
    const isNegative = val < 0;
    const absVal = Math.abs(val);

    let result = '';
    if (absVal >= 100000) {
      const eok = Math.floor((absVal / 100000) * 100) / 100; 
      result = `${eok}억`;
    } else {
      const man = Math.round(absVal / 10);
      result = `${man.toLocaleString()}만원`; 
    }
    
    return isNegative ? `-${result}` : result;
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto pb-32"> 
        
        {/* 뒤로가기 */}
        <div className="py-4 px-2 md:px-0">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors font-bold text-sm md:text-base">
            <ChevronLeftIcon className="w-5 h-5"/> 뒤로가기
          </button>
        </div>

        {/* 1. 브랜드 헤더 */}
        <div className="relative w-full h-44 md:h-60 bg-slate-800 overflow-hidden shadow-xl mb-4 md:mb-8 rounded-3xl">
          {vm.heroImage ? (
              <>
                <Image 
                    src={vm.heroImage} 
                    alt="Brand Banner" 
                    fill 
                    priority 
                    quality={100} 
                    className="object-cover object-center" 
                    sizes="(max-width: 768px) 100vw, 1200px" 
                />
              </>
          ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500 font-bold">No Image</div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-end gap-3 md:gap-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <div className="w-14 h-14 md:w-32 md:h-32 bg-slate-800 border-2 border-slate-700 shadow-2xl rounded-2xl flex items-center justify-center overflow-hidden p-1 md:p-2 backdrop-blur-sm shrink-0">
                    {vm.logoUrl ? <div className="relative w-full h-full"><Image src={vm.logoUrl} alt="Logo" fill className="object-contain rounded-xl" sizes="(max-width: 768px) 64px, 128px"/></div> : <span className="text-[10px] md:text-lg font-black text-slate-600 tracking-widest">LOGO</span>}
                </div>
                <div className="flex-1 w-full md:w-auto overflow-hidden">
                    <div className="flex items-center gap-1.5 md:gap-3 mb-1 md:mb-3">
                      <span className="px-1.5 py-0.5 md:px-2 md:py-0.5 bg-indigo-600 text-white text-[9px] md:text-xs font-bold uppercase tracking-wide rounded-full shadow-lg border border-indigo-400/30 whitespace-nowrap">{vm.category}</span>
                      {vm.riskBadges?.length > 0 && <span className="px-1.5 py-0.5 md:px-2 md:py-0.5 bg-red-600 text-white text-[9px] md:text-xs font-bold rounded-full flex items-center gap-1 shadow-md animate-pulse whitespace-nowrap"><ExclamationTriangleIcon className="w-3 h-3 md:w-3.5 md:h-3.5"/> 법위반</span>}
                    </div>
                    <h1 className="text-xl md:text-5xl font-black text-white mb-0.5 md:mb-2 tracking-tight drop-shadow-xl whitespace-nowrap truncate">{vm.name}</h1>
                    <div className="flex items-center text-slate-100 font-medium text-[10px] md:text-base whitespace-nowrap shadow-black drop-shadow-md">
                        <span className="truncate max-w-[120px] md:max-w-none">{vm.hqName}</span>
                        <span className="mx-1.5 opacity-80">|</span>
                        <span className="truncate">대표: {vm.ceoName}</span>
                    </div>
                </div>
              </div>
          </div>
        </div>

        {/* 2. 탭 메뉴 */}
        <div className="sticky top-[64px] z-30 bg-slate-50/95 backdrop-blur pt-2 pb-4">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex justify-between overflow-x-auto">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                const Icon = tab.icon;
                return (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${isActive ? 'bg-[#1E293B] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>
                      <Icon className="w-4 h-4" />{tab.label}
                    </button>
                )
              })}
          </div>
        </div>

        {/* 3. 컨텐츠 */}
        <div className="space-y-6 animate-fade-in-up px-4 md:px-0">
          {activeTab === 'summary' && (
              <>
                <Section title="가맹본부 요약" icon={BuildingOfficeIcon}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InfoCard label="상호명" value={vm.hqName} />
                        <InfoCard label="대표자" value={vm.ceoName} />
                        <InfoCard label="연락처" value={vm.contact} />
                        <InfoCard label="본사 주소" value={vm.address} />
                    </div>
                </Section>
                <Section title="최근 재무 흐름 (단위: 원)" icon={ChartBarIcon}>
                    <div className="h-64 md:h-80 w-full mt-4 p-2 md:p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                      <ResponsiveContainer width="100%" height="100%">
                          {/* [수정] 정렬된 데이터 사용 */}
                          <BarChart data={sortedFinancials} margin={{top:20, right:20, left:-10, bottom:0}} barSize={30}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5}/>
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill:'#94A3B8', fontSize:12, fontWeight:'bold'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill:'#64748B', fontSize:10}} />
                            <Tooltip cursor={{fill: '#1E293B'}} contentStyle={{backgroundColor:'#0F172A', color:'#E2E8F0', borderRadius:'12px', border:'1px solid #334155'}} formatter={(val:number) => fmtMoney(val)} />
                            <Legend wrapperStyle={{paddingTop:'20px', fontSize:'11px'}} formatter={(value:any) => <span className="text-slate-300">{value}</span>} />
                            
                            <Bar dataKey="totalSales" name="본사 매출" fill="#6366F1" radius={[4, 4, 0, 0]} animationDuration={2000}>
                                <LabelList dataKey="totalSales" position="top" style={{ fill: '#A5B4FC', fontSize: '10px', fontWeight: 'bold' }} formatter={(val: number) => fmtMoney(val)} />
                            </Bar>
                            <Bar dataKey="operatingProfit" name="영업이익" fill="#22D3EE" radius={[4, 4, 0, 0]} animationDuration={2000}>
                                <LabelList dataKey="operatingProfit" position="top" style={{ fill: '#67E8F9', fontSize: '10px', fontWeight: 'bold' }} formatter={(val: number) => fmtMoney(val)} />
                            </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                    </div>
                </Section>
                <Section title="법적 리스크 점검" icon={ExclamationTriangleIcon}>
                    {vm.legalStatus.hasViolation ? (
                        <div className="p-4 bg-red-900/30 border border-red-900/50 rounded-xl text-red-300 font-bold flex items-start gap-3">
                            <ExclamationTriangleIcon className="w-5 h-5 shrink-0"/> <div><p className="mb-1">🚨 위반 내역 발견</p><p className="text-sm font-normal">{vm.legalStatus.violationDetail}</p></div>
                        </div>
                    ) : (<div className="p-4 bg-emerald-900/30 border border-emerald-900/50 rounded-xl text-emerald-300 font-bold flex items-center gap-3"><CheckBadgeIcon className="w-5 h-5"/> 최근 3년간 위반 사실 없음 (Clean Brand)</div>)}
                </Section>
              </>
          )}

          {activeTab === 'store' && (
              <div className="space-y-6 md:space-y-8 animate-fade-in">
                <Section title="가맹점 변동 추이" icon={ChartBarIcon}>
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
                      <StatusCard label="전체 가맹점" value={`${vm.storeSummary?.total?.toLocaleString()}개`} diff={vm.storeSummary?.totalDiff} />
                      <StatusCard label="신규 개점" value={`${vm.storeSummary?.new?.toLocaleString()}개`} diff={vm.storeSummary?.newDiff} valueColor="text-blue-400" />
                      <StatusCard label="계약 종료" value={`${vm.storeSummary?.closed?.toLocaleString()}개`} diff={vm.storeSummary?.closedDiff} isNegativeGood valueColor="text-red-400" />
                    </div>
                    <div className="h-72 md:h-96 w-full mt-6 p-4 bg-slate-900/50 rounded-3xl border border-slate-700/50 shadow-inner relative overflow-hidden">
                      <ResponsiveContainer width="100%" height="100%">
                          {/* [수정] 정렬된 데이터 사용 */}
                          <BarChart data={sortedStoreTrends} margin={{top:20, right:10, bottom:0, left:-10}} barGap={0}>
                            <defs><linearGradient id="totalBarGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" stopOpacity={0.8}/><stop offset="100%" stopColor="#4338CA" stopOpacity={0.3}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3}/>
                            <XAxis dataKey="year" tick={{fill:'#94A3B8', fontSize:11, fontWeight:'bold'}} axisLine={false} tickLine={false} dy={10} />
                            
                            <YAxis orientation="left" stroke="#6366F1" axisLine={false} tickLine={false} tick={{fontSize:11, fill:'#818CF8', fontWeight:'bold'}} />
                            
                            <Tooltip cursor={{fill: '#1E293B', opacity: 0.4}} contentStyle={{backgroundColor:'#0F172A', color:'#E2E8F0', borderRadius:'16px', border:'1px solid #334155', fontSize:'12px'}} formatter={(value:any, name:any) => [`${value}개`, name]} />
                            <Legend wrapperStyle={{paddingTop:'20px', fontSize:'12px'}} formatter={(value:any) => <span className="text-slate-300 font-medium">{value}</span>} />
                            
                            <Bar dataKey="totalStores" name="전체 가맹점" fill="url(#totalBarGrad)" barSize={40} radius={[8, 8, 0, 0]} animationDuration={2000} />
                            <Bar dataKey="newStores" name="신규 개점" fill="#22D3EE" barSize={12} radius={[4, 4, 0, 0]} animationDuration={2000} />
                            <Bar dataKey="closedStores" name="계약 종료" fill="#F472B6" barSize={12} radius={[4, 4, 0, 0]} animationDuration={2000} />
                          </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-3 rounded-xl bg-orange-900/20 border border-orange-500/30 flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-2"><div className="p-1.5 bg-orange-500 rounded-full text-white"><ClockIcon className="w-4 h-4"/></div><span className="text-xs md:text-sm font-bold text-orange-200">가맹점 평균 영업 기간</span></div>
                        <span className="text-sm md:text-lg font-black text-orange-400">{vm.avgDuration || '정보 없음'}</span>
                    </div>
                </Section>
                <Section title="지역별 가맹점 분포 (전국)" icon={MapPinIcon}>
                    <div className="h-[600px] md:h-[800px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={vm.regionalStores} layout="vertical" margin={{top:0, right:30, left:0, bottom:0}} barSize={12}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155"/>
                              <XAxis type="number" hide domain={[0, 'dataMax * 1.15']} />
                              <YAxis dataKey="region" type="category" width={40} tick={{fill:'#94A3B8', fontSize:10, fontWeight:'bold'}} axisLine={false} tickLine={false} />
                              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor:'#0F172A', color:'#E2E8F0', borderRadius:'8px', border:'1px solid #334155'}} />
                              <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#CBD5E1', fontSize: 10, fontWeight:'bold', formatter: (val: number) => `${val}개` }} animationDuration={2000} />
                          </BarChart>
                      </ResponsiveContainer>
                    </div>
                </Section>
              </div>
          )}

          {activeTab === 'finance' && (
              <>
                <Section title="가맹점 연평균 매출" icon={ArrowTrendingUpIcon}>
                    <div className="grid grid-cols-2 gap-3 md:gap-6 mb-2">
                      <div className="p-4 md:p-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center h-40 md:h-48">
                          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-2 break-keep">가맹점 전체 평균 매출 (연간)</p>
                          <p className="text-lg md:text-3xl font-black text-white">{fmtMoney(vm.avgSales)}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-500 mt-2">* 정보공개서 신고 기준</p>
                      </div>
                      <div className="p-4 md:p-6 bg-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center h-40 md:h-48">
                          <p className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase mb-2 break-keep">3.3㎡(1평)당 평균 매출</p>
                          <p className="text-lg md:text-3xl font-black text-indigo-400">{fmtMoney(vm.avgRevenue.perPyeong)}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-500 mt-2">* 효율성 참고 지표</p>
                      </div>
                    </div>
                </Section>
                <CostTabContent data={vm} fmtMoney={fmtMoney} /> 
                <Section title="운영 중 부담 (월 고정비)" icon={ChartBarIcon}>
                    <div className="grid grid-cols-2 gap-3 md:gap-6">
                      <div className="p-4 md:p-8 bg-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg flex items-center gap-4 md:gap-6">
                          <div className="w-10 h-10 md:w-16 md:h-16 bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0"><BanknotesIcon className="w-6 h-6 md:w-8 md:h-8 text-indigo-400"/></div>
                          <div className="overflow-hidden"><p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase mb-1 whitespace-nowrap truncate">로열티 (Royalty)</p><p className="text-xs md:text-lg font-black text-white break-keep">{vm.ongoingCosts?.royalty || '-'}</p></div>
                      </div>
                      <div className="p-4 md:p-8 bg-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg flex items-center gap-4 md:gap-6">
                          <div className="w-10 h-10 md:w-16 md:h-16 bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0"><MegaphoneIcon className="w-6 h-6 md:w-8 md:h-8 text-indigo-400"/></div>
                          <div className="overflow-hidden"><p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase mb-1 whitespace-nowrap truncate">광고/판촉비 분담</p><p className="text-xs md:text-lg font-black text-white break-keep">{vm.ongoingCosts?.adFee || '-'}</p></div>
                      </div>
                    </div>
                </Section>
              </>
          )}

          {activeTab === 'analysis' && (
              <div className="space-y-6 md:space-y-8 animate-fade-in">
                <Section title="계약 중요 조건" icon={DocumentTextIcon}>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <InfoCard label="최초 계약" value={`${vm.contract.termInitial}년`} />
                      <InfoCard label="연장 단위" value={`${vm.contract.termRenewal}년`} />
                      <InfoCard label="갱신 비용" value={vm.contract.renewalCost} />
                    </div>
                    <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2 text-indigo-400 font-bold"><MapPinIcon className="w-5 h-5"/> 영업지역 보호</div>
                      <p className="text-white font-bold mb-1">{vm.contract.areaProtection ? '보호함 (독점권)' : '보호 안 함'}</p>
                      <p className="text-xs text-slate-400">{vm.contract.areaDesc}</p>
                    </div>
                </Section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <Section title="교육 및 훈련" icon={AcademicCapIcon}>
                      <div className="space-y-4 p-2">
                          <DetailRow label="교육 기간" value={`${vm.contract.training.days}일`} />
                          <DetailRow label="비용 부담" value={vm.contract.training.costBearer} />
                          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50"><p className="text-xs font-bold text-slate-400 mb-2">상세 내용</p><p className="text-sm text-slate-200">{vm.contract.training.contents}</p></div>
                      </div>
                    </Section>
                    <Section title="마케팅/운영 통제" icon={MegaphoneIcon}>
                      <div className="space-y-4 p-2">
                          <DetailRow label="광고비 비율" value={vm.contract.marketing.ratio} />
                          <DetailRow label="가격 통제" value={vm.contract.qualityControl.priceControl ? '있음' : '없음'} />
                          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50"><p className="text-xs font-bold text-slate-400 mb-2">활동 내용</p><p className="text-sm text-slate-200">{vm.contract.marketing.desc}</p></div>
                      </div>
                    </Section>
                </div>
              </div>
          )}
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         <div className="max-w-5xl mx-auto">
            <button 
               onClick={() => setIsInquiryOpen(true)}
               className="w-full py-4 bg-[#6366F1] text-white rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2 hover:bg-[#4F46E5] transition-all active:scale-95"
            >
               <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
               가맹 문의하기
            </button>
         </div>
      </div>

      {/* 문의하기 팝업 */}
      {isInquiryOpen && (
        <InquiryPopup 
          brandId={vm.id}
          brandName={vm.name} 
          onClose={() => setIsInquiryOpen(false)} 
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------
// 내부 컴포넌트 (UI)
// ----------------------------------------------------------------------

function Section({ title, icon: Icon, children }: any) {
  return (
     <section className="bg-slate-800 shadow-xl rounded-3xl border border-slate-700/50 overflow-hidden relative group">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-500/20 to-transparent"></div>
        <h3 className="text-sm md:text-xl font-black mb-4 md:mb-8 flex items-center gap-3 uppercase tracking-tight px-6 md:px-8 py-4 md:py-6 bg-slate-900/30 border-b border-slate-700/50 text-white">
           <Icon className="w-5 h-5 md:w-7 md:h-7 text-indigo-400"/> <span className="drop-shadow-md">{title}</span>
        </h3>
        <div className="px-4 md:px-8 pb-6 md:pb-10">{children}</div>
     </section>
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

function InfoCard({ label, value }: any) {
    return (<div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-center"><p className="text-[10px] font-bold text-slate-500 mb-1">{label}</p><p className="text-sm md:text-lg font-bold text-white break-keep">{value}</p></div>)
}

function DetailRow({ label, value }: any) {
    return (<div className="flex justify-between border-b border-slate-700/50 pb-2"><span className="text-slate-400 text-sm font-bold">{label}</span><span className="text-white text-sm font-bold">{value}</span></div>)
}

function CostTabContent({ data, fmtMoney }: { data: any, fmtMoney: any }) {
  const baseSizeM2 = data.baseSizeM2 || 50; 
  const [selectedSizeM2, setSelectedSizeM2] = useState<number>(baseSizeM2); 
  
  useEffect(() => {
      if(data.baseSizeM2) setSelectedSizeM2(data.baseSizeM2);
  }, [data.baseSizeM2]);

  const toPyeong = (m2: number) => Math.round(m2 / 3.3);

  const sizeOptions = useMemo(() => {
      const defaultSizes = [33, 50, 66, 83, 99, 132, 165, 198];
      if (!defaultSizes.includes(baseSizeM2)) {
          return [...defaultSizes, baseSizeM2].sort((a, b) => a - b);
      }
      return defaultSizes.sort((a, b) => a - b);
  }, [baseSizeM2]);

  const costs = data.initialCosts || { interior: 0, other: 0, joinFee: 0, eduFee: 0, deposit: 0 };
  
  const diffM2 = selectedSizeM2 - baseSizeM2; 
  const diffPyeong = diffM2 / 3.3; 
  const addedInteriorCost = Math.round(diffPyeong * (costs.interior || 0));
  const finalConstructionCost = (costs.other || 0) + addedInteriorCost;
  const calcTotal = (costs.joinFee || 0) + (costs.eduFee || 0) + (costs.deposit || 0) + finalConstructionCost;

  const costChartData = [
    { name: '가입비', value: costs.joinFee || 0 },
    { name: '교육비', value: costs.eduFee || 0 },
    { name: '보증금', value: costs.deposit || 0 },
    { name: '기타(인테리어 등)', value: Math.max(0, finalConstructionCost) }, 
  ].filter(item => item.value > 0);

  const securityInfo = costs.security_deposit || '';

  return (
    <Section title="초기 창업 비용 (예상)" icon={BanknotesIcon}>
       <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div>
             <p className="text-[10px] md:text-xs text-indigo-400 font-bold mb-1 whitespace-nowrap">
                * 프랜차이즈 정보 공개서 기준 면적: {baseSizeM2}m² ({toPyeong(baseSizeM2)}평)
             </p>
             <div className="flex items-center mt-2">
                 <span className="text-white font-bold text-sm md:text-base mr-2">기준 면적 선택:</span>
                 <div className="relative inline-block w-40">
                   <select value={selectedSizeM2} onChange={(e) => setSelectedSizeM2(Number(e.target.value))} className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg py-2 px-3 text-sm font-bold">
                      {sizeOptions.map(size => (
                          <option key={size} value={size}>{size}m² ({toPyeong(size)}평)</option>
                      ))}
                   </select>
                 </div>
             </div>
          </div>
          <p className="text-[10px] md:text-xs text-slate-400">* 면적 변경 시 추가/감소 면적에 대한 인테리어 비용이 반영됩니다.</p>
       </div>

       <div className="overflow-hidden rounded-2xl border-2 border-slate-700/50 shadow-xl mb-6">
          <table className="w-full text-xs md:text-sm text-left">
             <thead className="bg-slate-900 text-slate-400 font-bold uppercase"><tr><th className="p-3 border-b border-slate-700">구분</th><th className="p-3 border-b border-slate-700 text-right">예상 비용</th></tr></thead>
             <tbody className="divide-y divide-slate-700/50 bg-slate-900/30">
                <tr><td className="p-3 text-slate-300">가입비</td><td className="p-3 text-right text-white font-bold">{fmtMoney(costs.joinFee)}</td></tr>
                <tr><td className="p-3 text-slate-300">교육비</td><td className="p-3 text-right text-white font-bold">{fmtMoney(costs.eduFee)}</td></tr>
                <tr><td className="p-3 text-slate-300">보증금</td><td className="p-3 text-right text-white font-bold">{fmtMoney(costs.deposit)}</td></tr>
                <tr><td className="p-3 text-slate-300">기타(인테리어 등)</td><td className="p-3 text-right text-white font-bold">{fmtMoney(finalConstructionCost)}</td></tr>
                <tr className="bg-slate-900"><td className="p-4 font-black text-white">합계</td><td className="p-4 text-right text-base md:text-xl font-black text-[#00FF00]">{fmtMoney(calcTotal)}</td></tr>
             </tbody>
          </table>
       </div>

       {securityInfo && (
         <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
            <h6 className="text-xs font-bold text-yellow-500 mb-2 flex items-center gap-1">
                <CheckBadgeIcon className="w-4 h-4"/> 비용/담보/기타내용 (초기 비용 제외 항목)
            </h6>
            <p className="text-xs md:text-sm text-yellow-100/90 whitespace-pre-wrap leading-relaxed">
                {securityInfo}
            </p>
         </div>
       )}

       <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 flex flex-col items-center">
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <defs><filter id="pie-shadow" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.5"/></filter></defs>
                       <Pie data={costChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value" animationDuration={2000} animationEasing="ease-in-out" style={{ filter: 'url(#pie-shadow)' }}>
                          {costChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />)}
                       </Pie>
                       <Tooltip formatter={(val:number) => fmtMoney(val)} contentStyle={{backgroundColor:'#0F172A', border:'none', color:'white', boxShadow:'0 10px 15px rgba(0,0,0,0.5)'}} />
                    </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="w-full grid grid-cols-2 gap-2 mt-4 px-2">
                {costChartData.map((entry, index) => {
                    const percent = ((entry.value / calcTotal) * 100).toFixed(1);
                    return (<div key={index} className="flex items-center gap-2 text-[10px] text-slate-300"><div className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor: PIE_COLORS[index % PIE_COLORS.length]}}></div><span className="flex-1 truncate">{entry.name}<span className="hidden md:inline">: {fmtMoney(entry.value)}</span> <span className="font-bold text-slate-100"> ({percent}%)</span></span></div>);
                })}
             </div>
          </div>
          <div className="w-full md:w-1/2 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-center flex flex-col justify-center">
              <h5 className="text-[10px] font-bold text-indigo-400 mb-2 whitespace-nowrap">평수에 따른 인테리어 조정 비용(추정)</h5>
              <div className="flex flex-row items-center justify-between gap-2 mb-3 bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                  <div className="flex flex-col items-start">
                      <span className="text-[9px] text-slate-500 mb-0.5">희망 평수</span>
                      <select value={selectedSizeM2} onChange={(e) => setSelectedSizeM2(Number(e.target.value))} className="bg-slate-800 text-white text-[10px] p-1 rounded border border-slate-600 focus:outline-none focus:border-indigo-500">
                          {sizeOptions.map(size => (<option key={size} value={size}>{toPyeong(size)}평</option>))}
                      </select>
                  </div>
                  <div className="flex flex-col items-center">
                      <span className="text-[9px] text-slate-500 mb-0.5">평당 단가</span>
                      <span className="text-xs font-bold text-white">{fmtMoney(costs.interior || 0)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-500 mb-0.5">면적 차이</span>
                      <span className={`text-xs font-black ${diffPyeong > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                        {diffPyeong > 0 ? '+' : ''}{diffPyeong.toFixed(1)}평
                      </span>
                  </div>
              </div>
              <div className="pt-2 border-t border-slate-700/50">
                  <p className="text-[10px] text-slate-500 mb-1">조정 비용 합계 (증감)</p>
                  <p className={`text-lg font-black ${addedInteriorCost > 0 ? 'text-red-300' : 'text-blue-300'}`}>
                    {fmtMoney(addedInteriorCost)}
                  </p>
              </div>
          </div>
       </div>
    </Section>
  );
}