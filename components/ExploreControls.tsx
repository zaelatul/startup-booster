'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ExploreControls({ q, sort }: { q: string; sort: string }) {
  const router = useRouter();
  const sp = useSearchParams();

  const [query, setQuery] = useState(q ?? '');
  const [order, setOrder] = useState(sort ?? 'basic');

  useEffect(() => setQuery(q ?? ''), [q]);

  const apply = () => {
    const params = new URLSearchParams(sp.toString());

    if (query && query.trim()) params.set('q', query.trim());
    else params.delete('q');

    if (order && order !== 'basic') params.set('sort', order);
    else params.delete('sort');

    router.push(`/franchise/explore${params.size ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <input
        aria-label="브랜드명으로 검색"
        className="flex-1 border rounded px-3 py-2"
        placeholder="브랜드명 또는 업종 키워드로 검색 (예: 치킨, 올리브영)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && apply()}
      />
      <select
        aria-label="정렬"
        className="border rounded px-3 py-2"
        value={order}
        onChange={(e) => setOrder(e.target.value)}
      >
        <option value="basic">기본</option>
        <option value="name-asc">이름 오름차순</option>
        <option value="name-desc">이름 내림차순</option>
        <option value="profit_desc">수익률 높은순</option>
        <option value="profit_asc">수익률 낮은순</option>
        <option value="sales_desc">매출 높은순</option>
        <option value="sales_asc">매출 낮은순</option>
      </select>
      <button onClick={apply} className="border rounded px-4 py-2">적용</button>
    </div>
  );
}
