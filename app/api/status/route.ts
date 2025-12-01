// 신규: app/api/status/route.ts
// 역할: 프론트에서 사용하는 /api/status 헬스체크 (임시 로컬 엔드포인트)
// 향후 Cloudflare Worker 프록시로 교체 가능. 지금은 404 제거 목적.

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 프리렌더 방지
export const revalidate = 0;

export async function GET() {
  const now = new Date().toISOString();
  const payload = {
    ok: true,
    at: now,
    source: "next-api(local)",
    note: "로컬 개발용 헬스체크. 워커 연동 전까지 사용.",
  };
  return NextResponse.json(payload, {
    headers: {
      "cache-control": "no-store",
    },
  });
}
