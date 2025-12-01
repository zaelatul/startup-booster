// 신규: app/api/kftc/brand/route.ts
// 역할: /api/kftc/brand?id=<brandId>
// 형태: { id, name, category, summary, metrics:{avgRevenue, roi, openRate, closeRate, stores, trendIndex[]} }

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 간단한 결정적(seed) 숫자 생성: 브랜드 id의 문자코드 합
function seedFrom(str: string) {
  let s = 0;
  for (const ch of str) s += ch.charCodeAt(0);
  return s || 1;
}

// 카테고리 추정(아주 단순)
function guessCategory(id: string): "F&B" | "Retail" | "Service" {
  const x = id.toLowerCase();
  if (x.includes("cafe") || x.includes("coffee") || x.includes("burger") || x.includes("pizza")) return "F&B";
  if (x.includes("mart") || x.includes("store") || x.includes("shop")) return "Retail";
  return "Service";
}

// 툴팁용 이름 포매팅(간단 TitleCase)
function toTitle(id: string) {
  return id
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "";

  if (!id) {
    return NextResponse.json({ ok: false, error: "missing query: id required" }, { status: 400 });
  }

  const seed = seedFrom(id);
  const cat = guessCategory(id);

  // 결정적 샘플 값 생성(브랜드마다 조금씩 다르게)
  const avgRevenue = 60_000_000 + (seed % 30) * 1_000_000;          // 6천만 ~ 8.9천만
  const roi = +(12 + (seed % 12) * 0.5).toFixed(1);                 // 12.0% ~ 17.5%
  const openRate = +(2 + (seed % 6) * 0.2).toFixed(1);              // 2.0% ~ 3.0%
  const closeRate = +(0.8 + (seed % 5) * 0.15).toFixed(1);          // 0.8% ~ 1.4%
  const stores = 50 + (seed % 300);                                 // 50 ~ 349개
  const trendIndex = Array.from({ length: 6 }, (_, i) =>
    Math.round(100 + ((seed + i) % 5) * 2)                          // 100,102,104,106,108 일부 변동
  );

  const payload = {
    id,
    name: toTitle(id),
    category: cat,
    summary: "로컬 스텁 응답입니다. 실제 공정위 데이터 연동 전까지 임시로 사용합니다.",
    metrics: { avgRevenue, roi, openRate, closeRate, stores, trendIndex },
    source: "local-snapshot",
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(payload, { headers: { "cache-control": "no-store" } });
}
