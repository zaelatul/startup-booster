// web/app/analysis/[id]/page.tsx
'use client';

import React from 'react';
import Header from '@/components/Header'; // 헤더 경로 확인 (없으면 주석 처리)
import MarketAnalysis from '@/components/MarketAnalysis'; 
import { MarketAnalysisData } from '@/types/market';

export default function AnalysisDetail({ params }: { params: { id: string } }) {
  
  // 엉아가 만든 타입(types/market.ts)에 맞춰서 데이터 준비했어
  const dummyData: MarketAnalysisData = {
    kpiCards: [
      { title: '일 평균 유동인구', value: '58,203명 (많음)', desc: '전월 대비 3.2% 증가했습니다.' },
      { title: '상권 활성도', value: '87.5 지수', desc: '서울시 평균보다 높은 수준입니다.' },
      { title: '주요 소비 연령', value: '30대 (직장인)', desc: '점심 시간대 매출 비중이 높습니다.' },
      { title: '예상 매출 안정성', value: '78.4 지수', desc: '폐업률이 낮고 운영 기간이 깁니다.' },
    ],
    profitTrend: [
      { quarter: '23.1Q', index: 80 },
      { quarter: '23.2Q', index: 82 },
      { quarter: '23.3Q', index: 88 },
      { quarter: '23.4Q', index: 95 },
      { quarter: '24.1Q', index: 92 },
    ],
    ageDist: [
      { name: '20대', value: 25 },
      { name: '30대', value: 45 },
      { name: '40대', value: 20 },
      { name: '50대+', value: 10 },
    ],
    genderDist: [
      { name: '남성', value: 60 },
      { name: '여성', value: 40 },
    ],
    population: [
      { name: '주거', value: 15000 },
      { name: '직장', value: 45000 },
      { name: '유동', value: 58000 },
    ],
    costStructure: [
      { name: '재료비', value: 35 },
      { name: '임대료', value: 20 },
      { name: '인건비', value: 25 },
      { name: '기타', value: 20 },
    ],
    timeIndex: [
      { name: '11-14시', value: 90 },
      { name: '14-17시', value: 40 },
      { name: '17-21시', value: 70 },
      { name: '21시~', value: 30 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더가 있다면 표시 */}
      <Header />
      
      <main className="max-w-screen-xl mx-auto pt-24 px-4">
        <div className="mb-6">
           <h1 className="text-2xl font-bold text-gray-900">
             상권 정밀 분석 리포트
           </h1>
           <p className="text-gray-500 mt-1">
             선택하신 지역(중구 충무로3가)의 상세 분석 결과입니다.
           </p>
        </div>
        
        {/* 핵심: MarketAnalysis 컴포넌트 렌더링 */}
        <MarketAnalysis data={dummyData} />
      </main>
    </div>
  );
}