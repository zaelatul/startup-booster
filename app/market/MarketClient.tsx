'use client';

import React, { useState, useEffect } from 'react';
import { MarketAnalysis, MarketAnalysisData } from '@/components/MarketAnalysis';
import RollingBanner from '@/components/home/RollingBanner'; // 배너 컴포넌트 경로 확인 필요

// [데이터] 엉아가 만든 목업 데이터 (그대로 유지)
const MOCK_DATA: MarketAnalysisData = {
  profitTrend: [
    { quarter: '1분기', index: 92 }, { quarter: '2분기', index: 96 },
    { quarter: '3분기', index: 101 }, { quarter: '4분기', index: 108 },
  ],
  ageDist: [
    { name: '20대', value: 35 }, { name: '30대', value: 25 },
    { name: '40대', value: 20 }, { name: '50대', value: 12 }, { name: '60대+', value: 8 },
  ],
  genderDist: [
    { name: '남성', value: 52 }, { name: '여성', value: 48 },
  ],
  population: [
    { name: '거주', value: 32000 }, { name: '직장', value: 45000 }, { name: '유동', value: 58000 },
  ],
  costStructure: [
    { name: '임대료', value: 38 }, { name: '인건비', value: 27 },
    { name: '재료비', value: 23 }, { name: '관리비', value: 12 },
  ],
  timeIndex: [
    { name: '08-11', value: 78 }, { name: '11-14', value: 118 },
    { name: '14-17', value: 96 }, { name: '17-21', value: 125 }, { name: '21-24', value: 88 },
  ],
  kpiCards: [
    { title: '매출 수준', value: '지수 112', desc: '평균 대비 12% 높음' },
    { title: '주요 소비', value: '30대 남성', desc: '가장 많은 결제 비중' },
    { title: '유동 인구', value: '5.8만명', desc: '상위 30% 활발 상권' },
    { title: '경쟁 점포', value: '48개', desc: '반경 500m 내' },
  ],
};

export default function MarketClient() {
  const [data, setData] = useState<MarketAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex justify-center bg-slate-50">
      <div className="w-full max-w-6xl px-4 py-6 md:px-6 lg:px-8 space-y-8">
        
        {/* 1. 홍보 배너 (부활!) */}
        <section>
          <RollingBanner />
        </section>

        {/* 2. 데이터 분석 영역 */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-medium">상권 데이터를 불러오고 있습니다...</p>
          </div>
        ) : data ? (
          <MarketAnalysis data={data} />
        ) : null}
        
      </div>
    </div>
  );
}