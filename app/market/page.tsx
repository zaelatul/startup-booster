import React from 'react';
import MarketClient from './MarketClient';

export default function MarketPage() {
  return (
    // 배경색과 최소 높이를 지정하여 레이아웃 무너짐 방지
    <main className="min-h-screen bg-slate-50 pb-20">
        <MarketClient />
    </main>
  );
}