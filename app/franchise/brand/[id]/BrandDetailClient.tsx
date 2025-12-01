'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  ChartBarIcon, CurrencyDollarIcon, BuildingStorefrontIcon, 
  DocumentTextIcon, CheckBadgeIcon 
} from '@heroicons/react/24/solid';

// [중요] BrandDetailComponents에서 만든 모든 섹션 컴포넌트 불러오기
import {
  BasicInfoSection, StoreStatusSection, StoreTrend3YSection,
  FeeAndCostSection, CostStructureDetailSection,
  SalesSection, SalesDistributionSection,
  AdPromotionSection, ContractStatusSection,
  TrendSection, AnalysisSection, RoiSimulationSection,
  SimilarBrandsSection
} from '@/components/brand/BrandDetailComponents';

// 탭 메뉴 설정 (아이콘 매칭)
const TABS = [
  { key: 'summary', label: '종합 요약', icon: DocumentTextIcon },
  { key: 'finance', label: '매출·비용', icon: CurrencyDollarIcon },
  { key: 'store', label: '가맹 현황', icon: BuildingStorefrontIcon },
  { key: 'analysis', label: '계약·홍보', icon: ChartBarIcon }, 
];

export default function BrandDetailClient({ vm }: { vm: any }) {
  const [activeTab, setActiveTab] = useState('summary');

  // 금액 포맷터
  const fmtMoney = (n: number) => {
    if (!n) return '-';
    if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
    return `${(n / 10000).toLocaleString()}만`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-20">
      
      {/* 1. 브랜드 헤더 (메탈 그레이 카드 적용) */}
      <section className="bg-[#1E293B] rounded-3xl p-6 md:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
         {/* 배경 데코 */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         
         <div className="relative z-10">
            <div className="flex items-start gap-4 mb-6">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl p-1 shrink-0 overflow-hidden">
                  {vm.mainImage ? (
                    <img src={vm.mainImage} alt={vm.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">LOGO</div>
                  )}
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="px-2 py-0.5 bg-indigo-500 rounded text-[10px] font-bold">{vm.category}</span>
                     {vm.riskBadges?.length === 0 && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold"><CheckBadgeIcon className="w-3 h-3"/>우수 브랜드</span>
                     )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{vm.name}</h1>
                  <p className="text-sm text-slate-400 mt-1">{vm.hqName || vm.name} 본사</p>
               </div>
            </div>

            {/* 핵심 3대 지표 */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 border-t border-slate-700/50 pt-6">
               <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">평균 매출 (연)</p>
                  <p className="text-lg md:text-2xl font-bold text-white">{fmtMoney(vm.avgSales)}</p>
               </div>
               <div className="text-center border-l border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">창업 비용</p>
                  <p className="text-lg md:text-2xl font-bold text-indigo-400">{fmtMoney(vm.startupCostTotal)}</p>
               </div>
               <div className="text-center border-l border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">가맹점 수</p>
                  <p className="text-lg md:text-2xl font-bold text-white">{vm.storesTotal}<span className="text-sm font-normal text-slate-500">개</span></p>
               </div>
            </div>
         </div>
      </section>

      {/* 2. 탭 메뉴 (Sticky) */}
      <div className="sticky top-[64px] z-30 bg-slate-50/95 backdrop-blur pt-2 pb-4">
         <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex justify-between overflow-x-auto">
            {TABS.map((tab) => {
               const isActive = activeTab === tab.key;
               const Icon = tab.icon;
               return (
                  <button
                     key={tab.key}
                     onClick={() => setActiveTab(tab.key)}
                     className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                        isActive 
                        ? 'bg-[#1E293B] text-white shadow-md' 
                        : 'text-slate-500 hover:bg-slate-100'
                     }`}
                  >
                     <Icon className="w-4 h-4" />
                     {tab.label}
                  </button>
               )
            })}
         </div>
      </div>

      {/* 3. 탭별 컨텐츠 */}
      <div className="space-y-6 animate-fade-in-up">
         
         {/* [종합 요약] 탭 */}
         {activeTab === 'summary' && (
            <>
               <BasicInfoSection vm={vm} />
               <RoiSimulationSection vm={vm} />
               <AnalysisSection vm={vm} />
               <SimilarBrandsSection currentId={String(vm.id)} categoryKey={vm.categoryKey} />
            </>
         )}

         {/* [매출/비용] 탭 */}
         {activeTab === 'finance' && (
            <>
               <SalesSection vm={vm} />
               <SalesDistributionSection vm={vm} />
               <FeeAndCostSection vm={vm} />
               <CostStructureDetailSection vm={vm} />
            </>
         )}

         {/* [가맹 현황] 탭 */}
         {activeTab === 'store' && (
            <>
               <StoreStatusSection vm={vm} />
               <StoreTrend3YSection vm={vm} />
               <ContractStatusSection vm={vm} />
            </>
         )}

         {/* [계약·홍보] 탭 */}
         {activeTab === 'analysis' && (
            <>
               <AdPromotionSection vm={vm} />
               <ContractStatusSection vm={vm} />
            </>
         )}
      </div>

    </div>
  );
}