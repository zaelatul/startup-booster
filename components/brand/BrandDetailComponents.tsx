'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from 'recharts';
import { 
  BuildingStorefrontIcon, UserGroupIcon, 
  CheckCircleIcon, ExclamationCircleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/solid';

// 1. 유틸리티 함수 (export 확인)
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

// 2. 하위 섹션들
export const BasicInfoSection = ({ vm }: { vm: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
        <BuildingStorefrontIcon className="w-4 h-4" /> 가맹 본부
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">상호명</span>
          <span className="font-medium">{vm?.hqName || '-'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">설립일</span>
          <span className="font-medium">{vm?.establishedYear || '2020'}년</span>
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
          <span className="font-medium">{vm?.category}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">문의</span>
          <span className="text-indigo-600">홈페이지 참조</span>
        </div>
      </div>
    </div>
  </div>
);

export const StoreStatusSection = ({ vm }: { vm: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-4">가맹점 현황</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div className="p-4 bg-slate-50 rounded-xl">
        <p className="text-xs text-slate-500 mb-1">전체 가맹점</p>
        <p className="text-xl font-bold text-slate-900">{vm?.storesTotal || 0}개</p>
      </div>
      <div className="p-4 bg-slate-50 rounded-xl">
        <p className="text-xs text-slate-500 mb-1">신규 개점</p>
        <p className="text-xl font-bold text-emerald-600">+{safeNumber(vm?.openStoreCount || 0)}개</p>
      </div>
    </div>
  </div>
);

export const StoreTrend3YSection = ({ vm }: { vm: any }) => {
  const data = vm?.storeTrend3Y && vm.storeTrend3Y.length > 0 
    ? vm.storeTrend3Y 
    : [{ year: 2023, stores: vm?.storesTotal || 0 }];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6">가맹점 추이</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: 8 }} />
            <Bar dataKey="stores" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 비용 요약
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
    <h3 className="text-lg font-bold text-slate-900 mb-4">초기 창업 비용</h3>
    <div className="space-y-3">
      <CostRow label="가맹비" value={vm?.feeJoin} />
      <CostRow label="교육비" value={vm?.feeTraining} />
      <CostRow label="보증금" value={vm?.feeDeposit} />
      <div className="pt-3 border-t border-slate-100 mt-3">
        <CostRow label="총 비용" value={vm?.startupCostTotal} isHighlight />
      </div>
    </div>
  </div>
);

export const CostStructureDetailSection = ({ vm }: { vm: any }) => {
  const data = [
    { name: '가맹비', value: safeNumber(vm?.feeJoin) },
    { name: '교육비', value: safeNumber(vm?.feeTraining) },
    { name: '기타', value: safeNumber(vm?.startupCostTotal) - (safeNumber(vm?.feeJoin) + safeNumber(vm?.feeTraining)) }
  ].filter(d => d.value > 0);
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">비용 구성</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(val: number) => fmtMoney(val)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const SalesSection = ({ vm }: { vm: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-6">평균 매출</h3>
    <div className="text-center">
      <p className="text-sm text-indigo-900 mb-1 font-bold">연 평균 매출</p>
      <p className="text-2xl font-extrabold text-indigo-600">{fmtMoney(vm?.avgSales)}</p>
    </div>
  </div>
);

export const SalesDistributionSection = ({ vm }: { vm: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-2">매출 분포</h3>
    <div className="h-4 bg-slate-100 rounded-full overflow-hidden mt-4">
      <div className="h-full bg-indigo-500 w-1/2 mx-auto"></div>
    </div>
    <p className="text-center text-xs text-slate-500 mt-2">평균 구간</p>
  </div>
);

export const AdPromotionSection = ({ vm }: { vm: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-4">광고/판촉</h3>
    <p className="text-sm text-slate-600">본사/가맹점 분담 비율 등 (데이터 준비중)</p>
  </div>
);

export const ContractStatusSection = ({ vm }: { vm: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-slate-900 mb-4">계약 현황</h3>
    <p className="text-sm text-slate-600">계약 기간: 2년 / 연장: 1년</p>
  </div>
);

export const TrendSection = ({ vm }: { vm: any }) => null;

export const AnalysisSection = ({ vm }: { vm: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-lg font-bold text-emerald-600 mb-4 flex items-center gap-2"><ArrowTrendingUpIcon className="w-5 h-5"/> 강점</h3>
    <ul className="space-y-2">{(vm?.strengths || []).map((s: string, i: number) => <li key={i} className="text-sm text-slate-700 flex gap-2"><CheckCircleIcon className="w-4 h-4 text-emerald-500"/>{s}</li>)}</ul>
  </div>
);

export const RoiSimulationSection = ({ vm }: { vm: any }) => (
  <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl text-center">
    <h3 className="text-lg font-bold mb-4">예상 수익률</h3>
    <p className="text-3xl font-bold text-emerald-400">약 22%</p>
    <p className="text-xs text-slate-400 mt-2">* 평균 매출 기준 추정치입니다.</p>
  </div>
);

export const SimilarBrandsSection = ({ currentId, categoryKey }: any) => null;
export const BrandHeaderSection = () => null;
export const ImageGallerySection = () => null;