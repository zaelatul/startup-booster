'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from 'recharts';
import { 
  BuildingStorefrontIcon, CurrencyDollarIcon, UserGroupIcon, 
  CheckCircleIcon, ExclamationCircleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/solid';

// ----------------------------------------------------------------------
// [1] 유틸리티 함수 (반드시 export 붙이기!)
// ----------------------------------------------------------------------
export function safeNumber(val: any): number {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

export function fmtMoney(val: any): string {
  const n = safeNumber(val);
  if (n === 0) return '-';
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  return `${(n / 10000).toLocaleString()}만`;
}

export function fmtPct(val: any): string {
  const n = safeNumber(val);
  return `${n.toFixed(1)}%`;
}

// ----------------------------------------------------------------------
// [2] 하위 섹션 컴포넌트들 (전부 export 붙임!)
// ----------------------------------------------------------------------

// 1. 기본 정보
export const BasicInfoSection = ({ vm }: { vm: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
        <BuildingStorefrontIcon className="w-4 h-4" /> 가맹 본부
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">상호명</span>
          <span className="font-medium">{vm.hqName || '-'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">대표자</span>
          <span className="font-medium">홍길동 (예시)</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">설립일</span>
          <span className="font-medium">{vm.establishedYear || '2020'}년</span>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
        <UserGroupIcon className="w-4 h-4" /> 브랜드 개요
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">업종</span>
          <span className="font-medium">{vm.category}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">대표 번호</span>
          <span className="font-medium">02-1234-5678</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">홈페이지</span>
          <span className="text-indigo-600 cursor-pointer">방문하기</span>
        </div>
      </div>
    </div>
  </div>
);

// 2. 가맹점 현황 (숫자 카드)
export const StoreStatusSection = ({ vm }: { vm: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-4">가맹점 현황</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div className="p-4 bg-slate-50 rounded-xl">
        <p className="text-xs text-slate-500 mb-1">전체 가맹점</p>
        <p className="text-xl font-bold text-slate-900">{vm.storesTotal}개</p>
      </div>
      <div className="p-4 bg-slate-50 rounded-xl">
        <p className="text-xs text-slate-500 mb-1">신규 개점(년)</p>
        <p className="text-xl font-bold text-emerald-600">+{safeNumber(vm.openStoreCount || 12)}개</p>
      </div>
      <div className="p-4 bg-slate-50 rounded-xl">
        <p className="text-xs text-slate-500 mb-1">계약 해지(년)</p>
        <p className="text-xl font-bold text-rose-500">-{safeNumber(vm.closeStoreCount || 2)}개</p>
      </div>
      <div className="p-4 bg-slate-50 rounded-xl">
        <p className="text-xs text-slate-500 mb-1">명의 변경</p>
        <p className="text-xl font-bold text-slate-700">{safeNumber(vm.changeStoreCount || 5)}개</p>
      </div>
    </div>
  </div>
);

// 3. 3년 가맹점 추이 (차트)
export const StoreTrend3YSection = ({ vm }: { vm: any }) => {
  const data = vm.storeTrend3Y && vm.storeTrend3Y.length > 0 
    ? vm.storeTrend3Y 
    : [
        { year: 2021, stores: Math.floor(vm.storesTotal * 0.8) },
        { year: 2022, stores: Math.floor(vm.storesTotal * 0.9) },
        { year: 2023, stores: vm.storesTotal }
      ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6">최근 3년 가맹점 수 추이</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
            />
            <Bar dataKey="stores" name="가맹점 수" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 4. 비용 요약
const CostRow = ({ label, value, desc, isHighlight }: any) => (
  <div className="flex justify-between items-center">
    <div>
      <span className={`text-sm ${isHighlight ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{label}</span>
      {desc && <span className="text-xs text-slate-400 ml-2">{desc}</span>}
    </div>
    <span className={`text-sm ${isHighlight ? 'font-bold text-indigo-600' : 'font-medium text-slate-700'}`}>
      {fmtMoney(value)}
    </span>
  </div>
);

export const FeeAndCostSection = ({ vm }: { vm: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-4">초기 창업 비용 (예상)</h3>
    <div className="flex items-end gap-2 mb-6">
      <span className="text-3xl font-extrabold text-indigo-600">{fmtMoney(vm.startupCostTotal)}</span>
      <span className="text-sm text-slate-500 mb-1.5">(임대보증금/권리금 제외)</span>
    </div>
    
    <div className="space-y-3">
      <CostRow label="가맹비" value={vm.feeJoin} desc="소멸성 비용" />
      <CostRow label="교육비" value={vm.feeTraining} desc="오픈 전 교육 비용" />
      <CostRow label="보증금" value={vm.feeDeposit} desc="계약 종료 시 반환" />
      <div className="pt-3 border-t border-slate-100 mt-3">
        <CostRow label="인테리어 (10평 기준)" value={vm.interiorCostPerPy * 10} desc={`평당 ${fmtMoney(vm.interiorCostPerPy)}`} isHighlight />
      </div>
    </div>
  </div>
);

// 5. 비용 구조 상세 (파이차트 + 수치 표시)
export const CostStructureDetailSection = ({ vm }: { vm: any }) => {
  const data = [
    { name: '가맹비', value: safeNumber(vm.feeJoin) },
    { name: '교육비', value: safeNumber(vm.feeTraining) },
    { name: '보증금', value: safeNumber(vm.feeDeposit) },
    { name: '인테리어', value: safeNumber(vm.interiorCostPerPy * 10) },
    { name: '기타', value: Math.max(0, safeNumber(vm.startupCostTotal) - (safeNumber(vm.feeJoin) + safeNumber(vm.feeTraining) + safeNumber(vm.feeDeposit) + safeNumber(vm.interiorCostPerPy * 10))) }
  ].filter(d => d.value > 0);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">비용 구성 비율</h3>
      <div className="h-72 flex items-center justify-center font-bold text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              // [라벨 추가]
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => fmtMoney(value)} contentStyle={{borderRadius: 12}} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            <span className="text-xs font-bold text-slate-700">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. 매출 분석
export const SalesSection = ({ vm }: { vm: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-6">가맹점 평균 매출</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-indigo-50 p-6 rounded-xl text-center">
        <p className="text-sm text-indigo-900 mb-1 font-bold">연 평균 매출</p>
        <p className="text-2xl font-extrabold text-indigo-600">{fmtMoney(vm.avgSales)}</p>
        <p className="text-xs text-indigo-400 mt-2">전국 가맹점 평균 기준</p>
      </div>
      <div className="bg-slate-50 p-6 rounded-xl text-center">
        <p className="text-sm text-slate-700 mb-1 font-bold">평당 평균 매출</p>
        <p className="text-2xl font-extrabold text-slate-900">{fmtMoney(vm.avgSales / (vm.avgSize || 15))}</p>
        <p className="text-xs text-slate-400 mt-2">1평(3.3㎡)당 효율</p>
      </div>
    </div>
  </div>
);

// 7. 매출 분포 (히스토그램 예시)
export const SalesDistributionSection = ({ vm }: { vm: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-2">매출 분포 현황</h3>
    <p className="text-xs text-slate-500 mb-6">전체 가맹점 중 내 예상 매출 구간을 확인하세요.</p>
    
    <div className="space-y-4">
      <div className="relative pt-6">
        <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
          <div style={{ width: '15%' }} className="bg-slate-300"></div>
          <div style={{ width: '50%' }} className="bg-indigo-500"></div>
          <div style={{ width: '25%' }} className="bg-indigo-300"></div>
          <div style={{ width: '10%' }} className="bg-slate-300"></div>
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
          <span>하위 20%</span>
          <span className="font-bold text-indigo-600">평균 구간 (50%)</span>
          <span>상위 20%</span>
        </div>
        
        {/* 평균 표시 핀 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded mb-1">평균 {fmtMoney(vm.avgSales)}</div>
          <div className="w-0.5 h-6 bg-slate-800"></div>
        </div>
      </div>
    </div>
  </div>
);

// 8. 광고/판촉비
export const AdPromotionSection = ({ vm }: { vm: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-4">광고·판촉비 부담</h3>
    <div className="space-y-4">
      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
        <div>
          <p className="font-bold text-slate-700">광고비</p>
          <p className="text-xs text-slate-500">전국 광고 분담금</p>
        </div>
        <span className="text-sm font-bold text-slate-900">본사 50% : 점주 50%</span>
      </div>
      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
        <div>
          <p className="font-bold text-slate-700">판촉비</p>
          <p className="text-xs text-slate-500">개별 매장 행사 등</p>
        </div>
        <span className="text-sm font-bold text-slate-900">점주 100% 부담</span>
      </div>
    </div>
  </div>
);

// 9. 계약 현황
export const ContractStatusSection = ({ vm }: { vm: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-4">계약 기간 및 조건</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="border border-slate-200 rounded-xl p-4 text-center">
        <p className="text-xs text-slate-500 mb-1">최초 계약</p>
        <p className="text-lg font-bold text-slate-900">2년</p>
      </div>
      <div className="border border-slate-200 rounded-xl p-4 text-center">
        <p className="text-xs text-slate-500 mb-1">연장 계약</p>
        <p className="text-lg font-bold text-slate-900">1년</p>
      </div>
    </div>
  </div>
);

// 10. 트렌드 (빈 껍데기 유지 - 에러 방지용)
export const TrendSection = ({ vm }: { vm: any }) => null;

// 11. 분석/리뷰 (강점/약점)
export const AnalysisSection = ({ vm }: { vm: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-emerald-600 mb-4 flex items-center gap-2">
        <ArrowTrendingUpIcon className="w-5 h-5" /> 강점 (Pros)
      </h3>
      <ul className="space-y-2">
        {(vm.strengths || ['브랜드 인지도가 높음', '안정적인 물류 시스템']).map((item: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircleIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-rose-500 mb-4 flex items-center gap-2">
        <ExclamationCircleIcon className="w-5 h-5" /> 유의할 점 (Cons)
      </h3>
      <ul className="space-y-2">
        {(vm.cautions || ['초기 투자 비용이 높음', '경쟁 브랜드 다수']).map((item: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <ExclamationCircleIcon className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// 12. 수익 시뮬레이션 (ROI) - 문구 수정됨
export const RoiSimulationSection = ({ vm }: { vm: any }) => {
  const profit = Math.floor(vm.avgSales * 0.22); 
  const roi = vm.startupCostTotal > 0 ? (profit / vm.startupCostTotal) * 100 : 0;
  const paybackPeriod = vm.startupCostTotal > 0 ? (vm.startupCostTotal / (profit / 12)).toFixed(1) : '0';

  return (
    <div className="bg-gradient-to-br from-[#1E293B] to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-slate-700/50">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <CurrencyDollarIcon className="w-6 h-6 text-yellow-400" />
        예상 수익 시뮬레이션
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-2xl p-5 backdrop-blur-sm border border-white/10 text-center">
          <p className="text-xs text-indigo-200 mb-1 font-medium">월 예상 순수익</p>
          <p className="text-2xl font-extrabold text-white tracking-tight">약 {fmtMoney(profit / 12)}</p>
          <p className="text-[10px] text-indigo-300/80 mt-1.5">순수익률 22% 가정</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-5 backdrop-blur-sm border border-white/10 text-center">
          <p className="text-xs text-indigo-200 mb-1 font-medium">투자금 회수 기간</p>
          <p className="text-2xl font-extrabold text-yellow-400 tracking-tight">{paybackPeriod}개월</p>
          <p className="text-[10px] text-indigo-300/80 mt-1.5">단순 회수 기준</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-5 backdrop-blur-sm border border-white/10 text-center">
          <p className="text-xs text-indigo-200 mb-1 font-medium">연 수익률 (ROI)</p>
          <p className="text-2xl font-extrabold text-emerald-400 tracking-tight">{roi.toFixed(1)}%</p>
          <p className="text-[10px] text-indigo-300/80 mt-1.5">초기 비용 대비</p>
        </div>
      </div>
      
      <div className="p-3 bg-black/20 rounded-xl text-center border border-white/5">
        <p className="text-[11px] text-slate-300 leading-relaxed">
          * 위 수치는 전국 가맹점 매출의 <strong>상위 60% 평균</strong>을 기준으로 산출되었습니다.<br/>
          <span className="opacity-70">(하위 40% 매출 부진 매장을 제외한, 중상위권 매장의 예상치입니다.)</span>
        </p>
      </div>
    </div>
  );
};

// 13. 유사 브랜드 추천
export const SimilarBrandsSection = ({ currentId, categoryKey }: { currentId: string, categoryKey: string }) => (
  <div className="pt-8 border-t border-slate-200">
    <h3 className="text-lg font-bold text-slate-900 mb-4">이 브랜드는 어때요?</h3>
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="min-w-[160px] bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-indigo-200 cursor-pointer transition-all">
          <div className="w-12 h-12 bg-slate-100 rounded-lg mb-3"></div>
          <p className="font-bold text-sm text-slate-900 mb-1">유사 브랜드 {i}</p>
          <p className="text-xs text-slate-500">평균 매출 4.2억</p>
        </div>
      ))}
    </div>
  </div>
);

// 빈 껍데기들 (에러 방지용)
export const BrandHeaderSection = () => null;
export const ImageGallerySection = () => null;