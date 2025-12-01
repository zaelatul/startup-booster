// app/franchise/explore/ExploreClient.tsx  (신규)
// 클라이언트 컴포넌트: 필터/검색/정렬 UI + URL 동기화
'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Brand = {
  id: string;
  name: string;
  category: 'F&B' | 'Retail' | 'Service';
  revenue_avg: number;
  margin_pct: number;
  open_rate: number;
  close_rate: number;
};

type SearchParams = {
  category?: string;
  search?: string;
  sort?: 'revenue_desc' | 'margin_desc' | 'open_desc' | 'close_asc';
};

function parseCategories(param?: string): Brand['category'][] {
  if (!param) return [];
  return param
    .split(/[|,]/)
    .map(s => s.trim())
    .filter((s): s is Brand['category'] => ['F&B','Retail','Service'].includes(s));
}

export default function ExploreClient({
  initial,
  sp,
}: {
  initial: Brand[];
  sp: SearchParams;
}) {
  const router = useRouter();
  const q = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [kw, setKw] = useState<string>(sp.search ?? '');
  const selected = useMemo(() => new Set(parseCategories(sp.category)), [sp.category]);
  const sort = (sp.sort ?? 'revenue_desc') as NonNullable<SearchParams['sort']>;

  const updateQS = (mutate: (p: URLSearchParams)=>void) => {
    const params = new URLSearchParams(q.toString());
    mutate(params);
    startTransition(()=> router.replace(`/franchise/explore?${params.toString()}`, { scroll: false }));
  };

  const toggleCat = (c: Brand['category']) => {
    const next = new Set(selected);
    if (next.has(c)) next.delete(c); else next.add(c);
    const val = Array.from(next).join('|');
    updateQS(p => { val ? p.set('category', val) : p.delete('category'); });
  };

  const applySearch = () => {
    const v = kw.trim();
    updateQS(p => { v ? p.set('search', v) : p.delete('search'); });
  };

  const changeSort = (v: NonNullable<SearchParams['sort']>) => {
    updateQS(p => { p.set('sort', v); });
  };

  return (
    <>
      <section className="mt-4 rounded-2xl border px-4 py-3" data-testid="fr-explore-filters">
        <div className="flex flex-wrap items-center gap-2">
          {(['F&B','Retail','Service'] as const).map((c) => (
            <button
              key={c}
              onClick={()=>toggleCat(c)}
              className={`rounded-full border px-3 py-1 text-sm ${selected.has(c) ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-neutral-50'}`}
              data-testid={`cat-${c}`}
              aria-pressed={selected.has(c)}
            >
              {c}
            </button>
          ))}

          <input
            value={kw}
            onChange={(e)=>setKw(e.target.value)}
            onKeyDown={(e)=>{ if (e.key === 'Enter') applySearch(); }}
            placeholder="브랜드명 검색"
            className="ml-2 min-w-[200px] flex-1 rounded-lg border px-3 py-2 text-sm"
            data-testid="search-input"
          />
          <button
            onClick={applySearch}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
            data-testid="search-btn"
          >
            검색
          </button>

          <select
            value={sort}
            onChange={(e)=>changeSort(e.target.value as any)}
            className="ml-auto rounded-lg border px-3 py-2 text-sm"
            data-testid="sort-select"
            aria-label="정렬"
          >
            <option value="revenue_desc">매출높은순</option>
            <option value="margin_desc">수익률높은순</option>
            <option value="open_desc">개업률높은순</option>
            <option value="close_asc">폐업률낮은순</option>
          </select>
        </div>
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3" data-testid="fr-explore-list" aria-busy={isPending}>
        {(initial.length ? initial : []).map((b) => (
          <a
            key={b.id}
            href={`/franchise/brand/${b.id}`}
            className="rounded-2xl border p-4 transition hover:shadow-sm"
            data-testid={`brand-${b.id}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">{b.name}</h3>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px]">{b.category}</span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
              <div><dt className="text-neutral-500">평균매출</dt><dd className="font-medium">{b.revenue_avg.toLocaleString()} 만원</dd></div>
              <div><dt className="text-neutral-500">수익률</dt><dd className="font-medium">{b.margin_pct}%</dd></div>
              <div><dt className="text-neutral-500">개업률</dt><dd className="font-medium">{b.open_rate}%</dd></div>
              <div><dt className="text-neutral-500">폐업률</dt><dd className="font-medium">{b.close_rate}%</dd></div>
            </dl>
          </a>
        ))}
        {initial.length === 0 && (
          <div className="col-span-full rounded-xl border p-6 text-center text-sm text-neutral-500">
            조건에 맞는 브랜드가 없습니다.
          </div>
        )}
      </section>
    </>
  );
}
