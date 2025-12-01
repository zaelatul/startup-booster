// 신규: app/api/market365/metrics/route.ts
// 역할: /api/market365/metrics?dong=XXXX&biz=FNB|Retail|Service
// 형태: { kpi: {avgRevenue, roi, openRate, closeRate}, trendIndex: number[], lastUpdated, source }

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 프리렌더/캐시 방지
export const revalidate = 0;

type KPI = { avgRevenue?: number; roi?: number; openRate?: number; closeRate?: number };

function presetByBiz(biz: string): { kpi: KPI; trendIndex: number[] } {
  const B = biz.toUpperCase();
  if (B === "FNB" || B === "F&B") {
    return {
      kpi: { avgRevenue: 72_000_000, roi: 19.2, openRate: 3.1, closeRate: 1.0 },
      trendIndex: [100, 102, 104, 103, 108, 112],
    };
  }
  if (B === "RETAIL") {
    return {
      kpi: { avgRevenue: 65_000_000, roi: 16.5, openRate: 2.7, closeRate: 1.3 },
      trendIndex: [100, 101, 100, 102, 103, 105],
    };
  }
  // Service 등 기타
  return {
    kpi: { avgRevenue: 58_000_000, roi: 15.0, openRate: 2.4, closeRate: 1.2 },
    trendIndex: [100, 99, 101, 103, 104, 106],
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const dong = url.searchParams.get("dong") || "";
  const biz = url.searchParams.get("biz") || "";

  if (!dong || !biz) {
    return NextResponse.json(
      { ok: false, error: "missing query: dong & biz required" },
      { status: 400 }
    );
  }

  // 샘플: 동코드 일부에 따라 약간의 보정(가벼운 변동감)
  const base = presetByBiz(biz);
  const tail = Number(dong.slice(-2)) || 0;
  const adj = 1 + (tail % 5) * 0.01; // 최대 +4%

  const kpi = {
    avgRevenue: Math.round((base.kpi.avgRevenue ?? 0) * adj),
    roi: Number(((base.kpi.roi ?? 0) * adj).toFixed(1)),
    openRate: Number(((base.kpi.openRate ?? 0) * (0.98 + (tail % 3) * 0.01)).toFixed(1)),
    closeRate: Number(((base.kpi.closeRate ?? 0) * (0.98 + (tail % 2) * 0.01)).toFixed(1)),
  };

  const trendIndex = base.trendIndex.map((v, i) =>
    Math.round(v * (1 + ((tail + i) % 4) * 0.002))
  );

  const payload = {
    kpi,
    trendIndex,
    lastUpdated: new Date().toISOString(),
    source: "local-snapshot", // 추후 worker 프록시로 교체 시 "market365"로 변경 예정
  };

  return NextResponse.json(payload, {
    headers: { "cache-control": "no-store" },
  });
}
