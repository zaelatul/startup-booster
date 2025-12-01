'use client';

import React from 'react';
import MarketClient from './MarketClient';

export default function MarketPage() {
  return (
    // min-h-screen으로 설정해서 내용이 적어도 화면이 꽉 차게, 많으면 스크롤 되게 변경
    <main className="min-h-screen bg-slate-50 pb-20">
        <MarketClient />
    </main>
  );
}