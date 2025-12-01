// 신규(또는 교체): app/api/banners/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // 여기서 DB/스토리지 연동 가능. 실패시 샘플로 폴백.
  const sample = [
    {
      id: "mkt-01",
      title: "상권분석 베타 오픈",
      href: "/market",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=400&auto=format",
      badge: "지수=100 기준",
    },
    {
      id: "fr-01",
      title: "프랜차이즈 탐색 강화",
      href: "/franchise/explore",
      img: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=400&auto=format",
      badge: "검색·정렬·다중카테고리",
    },
  ];

  return NextResponse.json({ ok: true, banners: sample, source: "local-snapshot" });
}
