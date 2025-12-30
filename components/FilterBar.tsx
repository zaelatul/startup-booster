// src/components/FilterBar.tsx
'use client';

import { useState } from 'react';
import type { MarketFilters, MarketPeriod } from '@/lib/market';

type Props = {
  initial: MarketFilters;
  onApply: (f: MarketFilters) => void;
};

const PERIODS: { label: string; value: MarketPeriod }[] = [
  { label: '최근 1개월', value: '1m' },
  { label: '최근 3개월', value: '3m' },
  { label: '최근 6개월', value: '6m' },
  { label: '최근 12개월', value: '12m' },
];

export default function FilterBar({ initial, onApply }: Props) {
  const [industry, setIndustry] = useState(initial.industry);
  const [region, setRegion] = useState(initial.region);
  const [period, setPeriod] = useState<MarketPeriod>(initial.period);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.2fr 0.8fr auto',
        gap: 8,
        marginBottom: 16,
      }}
    >
      <input
        aria-label="업종"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        placeholder="업종(예: 카페, 치킨)"
        style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px' }}
      />
      <input
        aria-label="지역"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        placeholder="지역(예: 강남구 역삼동)"
        style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px' }}
      />
      <select
        aria-label="기간"
        value={period}
        onChange={(e) => setPeriod(e.target.value as MarketPeriod)}
        style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px' }}
      >
        {PERIODS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
      <button
        onClick={() => onApply({ industry, region, period })}
        style={{
          border: '1px solid #111827',
          background: '#111827',
          color: '#fff',
          borderRadius: 8,
          padding: '10px 16px',
          fontWeight: 700,
        }}
        aria-label="필터 적용"
      >
        적용
      </button>
    </div>
  );
}
