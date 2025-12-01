"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Tab = "floor" | "wall";

type CatalogItem = {
  id: string;
  kind: Tab;
  name: string;
  brand?: string;
  unit: "box";
  pieceSizeMm: [number, number];
  pcsPerBox: number;
  m2PerBox: number;
  pricePerBox: number;
};

type ShowcaseItem = { id: string; name: string; price: number; img: string; href?: string };

type ApiResp =
  | {
      ok: true;
      at: string;
      tab: Tab;
      catalog?: CatalogItem[];
      showcase?: ShowcaseItem[];
      count?: { catalog?: number; showcase?: number };
    }
  | { ok: false; error: string };

const krw = (n: number) => "₩" + Math.round(n).toLocaleString();

export default function InteriorShopPage() {
  const sp = useSearchParams();
  const router = useRouter();

  // URL의 ?tab=floor|wall 반영(기본 floor)
  const initialTab = (sp.get("tab") === "wall" ? "wall" : "floor") as Tab;
  const [tab, setTab] = useState<Tab>(initialTab);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"rel" | "priceUp" | "priceDown" | "name">("rel");

  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [showcase, setShowcase] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"api" | "fallback">("api");

  // “더보기” — 화면에 보이는 개수(카드가 늘어나도 안전)
  const [visibleCount, setVisibleCount] = useState(12);

  // 탭 바꾸면 URL도 동기화, “더보기” 초기화
  useEffect(() => {
    const url = `/interior/shop?tab=${tab}`;
    // replace로 히스토리 오염 방지
    router.replace(url);
    setVisibleCount(12);
  }, [tab, router]);

  // 데이터 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/interior/products?tab=${tab}`, { cache: "no-store" });
        const json: ApiResp = await res.json();
        if (!("ok" in json) || !json.ok) throw new Error("bad");
        setCatalog(json.catalog || []);
        setShowcase(json.showcase || []);
        setSource("api");
      } catch {
        // 폴백(레이아웃 유지용)
        setSource("fallback");
        if (tab === "floor") {
          setCatalog([
            {
              id: "floor-deco-basic",
              kind: "floor",
              name: "데코타일 3T (152×914) 18장/박스",
              unit: "box",
              pieceSizeMm: [152, 914],
              pcsPerBox: 18,
              m2PerBox: 3.34,
              pricePerBox: 42000,
            },
          ]);
          setShowcase([
            {
              id: "p1",
              name: "데코타일 내추럴 오크",
              price: 42000,
              img: "https://images.unsplash.com/photo-1582582621959-48d99f8d9c4a?q=80&w=800&auto=format",
            },
            {
              id: "p2",
              name: "데코타일 라이트 그레이",
              price: 44000,
              img: "https://images.unsplash.com/photo-1520881544934-431f3c3d0f83?q=80&w=800&auto=format",
            },
            {
              id: "p3",
              name: "데코타일 월넛 브라운",
              price: 44000,
              img: "https://images.unsplash.com/photo-1520881544934-431f3c3d0f83?q=80&w=800&auto=format",
            },
          ]);
        } else {
          setCatalog([
            {
              id: "wall-softstone-600x300",
              kind: "wall",
              name: "소프트스톤 600×300 10장/박스",
              unit: "box",
              pieceSizeMm: [600, 300],
              pcsPerBox: 10,
              m2PerBox: 1.8,
              pricePerBox: 59000,
            },
          ]);
          setShowcase([
            {
              id: "w1",
              name: "소프트스톤 베이지 600×300",
              price: 59000,
              img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format",
            },
            {
              id: "w2",
              name: "소프트스톤 그레이 600×300",
              price: 59000,
              img: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=800&auto=format",
            },
          ]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // tab 바뀔 때마다 다시 로드
  }, [tab]);

  // 병합 리스트(카탈로그 → 쇼케이스)
  type Row =
    | {
        type: "catalog";
        id: string;
        name: string;
        price: number;
        sub: string;
        img?: string;
      }
    | { type: "show"; id: string; name: string; price: number; img: string };

  const rows: Row[] = useMemo(() => {
    const cat: Row[] = catalog.map((c) => ({
      type: "catalog",
      id: c.id,
      name: c.name,
      price: c.pricePerBox,
      sub: `${c.pieceSizeMm[0]}×${c.pieceSizeMm[1]}mm · ${c.pcsPerBox}장/박스 · ${c.m2PerBox}m²/box`,
    }));
    const shw: Row[] = showcase.map((s) => ({
      type: "show",
      id: s.id,
      name: s.name,
      price: s.price,
      img: s.img,
    }));

    let merged = [...cat, ...shw];

    // 검색
    if (q.trim()) {
      const key = q.trim().toLowerCase();
      merged = merged.filter((r) => r.name.toLowerCase().includes(key));
    }

    // 정렬
    switch (sort) {
      case "priceUp":
        merged.sort((a, b) => a.price - b.price);
        break;
      case "priceDown":
        merged.sort((a, b) => b.price - a.price);
        break;
      case "name":
        merged.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rel":
      default:
        merged.sort((a, b) => (a.type === b.type ? 0 : a.type === "catalog" ? -1 : 1));
    }
    return merged;
  }, [catalog, showcase, q, sort]);

  const visibleRows = rows.slice(0, visibleCount);
  const hasMore = rows.length > visibleRows.length;

  return (
    <main className="mx-auto max-w-6xl p-6">
      {/* 상단 타이틀 + 상태 */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <a href="/interior" className="rounded-xl border px-3 py-1.5 hover:bg-gray-50" data-testid="shop-back">
          ← 인테리어 계산기로
        </a>
        <h1 className="text-2xl font-bold">상품 전체보기</h1>
        <span
          className={
            "rounded-full border px-2 py-0.5 text-xs " +
            (source === "api"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-yellow-200 bg-yellow-50 text-yellow-700")
          }
        >
          {source}
        </span>
        {loading && <span className="text-xs text-gray-500">불러오는 중…</span>}
      </div>

      {/* 탭 */}
      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setTab("floor")}
          className={
            "rounded-full border px-3 py-1.5 text-sm " + (tab === "floor" ? "bg-black text-white" : "bg-white hover:bg-gray-50")
          }
          data-testid="shop-tab-floor"
        >
          바닥 · 데코타일
        </button>
        <button
          onClick={() => setTab("wall")}
          className={
            "rounded-full border px-3 py-1.5 text-sm " + (tab === "wall" ? "bg-black text-white" : "bg-white hover:bg-gray-50")
          }
          data-testid="shop-tab-wall"
        >
          벽 · 소프트스톤
        </button>
      </div>

      {/* 검색/정렬/개수 — 한 줄 정렬 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="상품명을 검색하세요"
          className="w-64 rounded-xl border px-3 py-2"
          data-testid="shop-search"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="rounded-xl border px-3 py-2"
          data-testid="shop-sort"
        >
          <option value="rel">기본(카탈로그→쇼케이스)</option>
          <option value="priceUp">가격 낮은순</option>
          <option value="priceDown">가격 높은순</option>
          <option value="name">이름순</option>
        </select>
        <span className="ml-auto text-sm text-gray-600" data-testid="shop-count">
          총 {rows.length}개
        </span>
      </div>

      {/* 균형 잡힌 카드 그리드 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visibleRows.map((r) => (
          <article
            key={`${r.type}-${r.id}`}
            className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white hover:shadow"
            data-testid={`shop-card-${r.id}`}
          >
            {/* 이미지 영역: 고정 비율로 높이 통일 */}
            {"img" in r && r.img ? (
              <img src={(r as any).img} alt={r.name} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="aspect-[4/3] grid w-full place-items-center bg-gray-100 text-xs text-gray-400">이미지 준비중</div>
            )}

            {/* 본문: flex-1로 채우고, 버튼은 하단 정렬 */}
            <div className="flex flex-1 flex-col p-3">
              <div className="text-xs text-gray-500">{tab === "floor" ? "데코타일" : "소프트스톤"}</div>
              <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold">{r.name}</h3>
              {"sub" in r && <p className="mt-1 line-clamp-1 text-xs text-gray-600">{(r as any).sub}</p>}
              <div className="mt-2 text-base font-bold">{krw(r.price)}</div>

              <div className="mt-auto flex gap-2 pt-2">
                <a
                  href="/interior#inq"
                  className="rounded-xl border px-2 py-1 text-sm hover:bg-gray-50"
                  data-testid={`shop-ask-${r.id}`}
                >
                  문의하기
                </a>
                <button
                  onClick={() => alert("장바구니/결제는 준비중입니다.")}
                  className="rounded-xl border px-2 py-1 text-sm hover:bg-gray-50"
                  data-testid={`shop-cart-${r.id}`}
                >
                  담기(준비중)
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 더보기(상품 무제한 대비) */}
      {hasMore && (
        <div className="mt-6 grid place-items-center">
          <button
            onClick={() => setVisibleCount((n) => n + 12)}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
            data-testid="shop-more"
          >
            더보기
          </button>
        </div>
      )}

      <p className="mt-6 text-xs text-gray-500">
        * 레이아웃 상태입니다. 실제 판매/결제는 다음 단계에서 연결합니다.
      </p>
    </main>
  );
}
