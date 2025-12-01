// 신규 파일: src/components/BrandList.tsx
// 역할: 프랜차이즈 탐색 결과 리스트 (가상 스크롤/무한 스크롤 도입 전 구조 분리)
// 서버 컴포넌트로 사용 가능(훅 없음). Next 16 호환.

import React from "react";
import Link from "next/link";

export type BrandLite = {
  id: string;
  name: string;
  category?: string;
  summary?: string;
};

type Props = {
  items: BrandLite[];
  /** 현재 URL의 searchParams 그대로 넘겨받아 q/sort/cat을 상세 링크에 유지 */
  searchParams?: Record<string, string | string[] | undefined>;
  /** 향후 가상 스크롤 플래그(지금은 비활성, 구조만 남김) */
  virtualize?: boolean;
};

function keepQuery(sp?: Record<string, string | string[] | undefined>) {
  if (!sp) return "";
  const keep = new URLSearchParams();
  for (const k of ["q", "sort", "cat"]) {
    const v = sp[k];
    if (v === undefined) continue;
    if (Array.isArray(v)) v.forEach((x) => keep.append(k, String(x)));
    else keep.set(k, String(v));
  }
  const qs = keep.toString();
  return qs ? `?${qs}` : "";
}

export default function BrandList({ items, searchParams }: Props) {
  const qs = keepQuery(searchParams);

  if (!items || items.length === 0) {
    return (
      <div
        className="rounded-2xl border p-6 text-gray-600"
        data-testid="brand-list"
      >
        조건에 맞는 브랜드가 없어요. 필터를 바꿔보세요.
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="brand-list">
      {items.map((b) => (
        <Link
          key={b.id}
          href={`/franchise/brand/${encodeURIComponent(b.id)}${qs}`}
          className="block rounded-2xl border p-4 hover:bg-gray-50 transition"
          data-testid={`brand-card-${b.id}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-base font-semibold">{b.name}</div>
              <p className="text-sm text-gray-600 mt-1">
                {b.summary ?? "상세 페이지에서 지표와 트렌드를 확인하세요."}
              </p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full border bg-white">
              {b.category ?? "-"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
