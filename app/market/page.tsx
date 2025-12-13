'use client';

import React from 'react';
import MarketClient from './MarketClient';

export default function MarketPage() {
  return (
    // [수정] min-h-screen으로 전체 화면 확보
    <main className="min-h-screen bg-slate-50 pb-20">
       {/* 차트가 그려질 공간을 위해 충분한 여백 확보 */}
       <MarketClient />
    </main>
  );
}