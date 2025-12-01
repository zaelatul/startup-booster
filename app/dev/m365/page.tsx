"use client";

// 역할: 공공데이터 연동 전/후를 한 화면에서 검증
// - 상태 체크(/api/status)
// - 시장 지표(/api/market365/metrics?dong=&biz=)
// - 공정위 브랜드(/api/kftc/brand?id=)
// - 플래그 토글: __FAIL_MARKET_API__, __NO_FALLBACK__

import React, { useEffect, useState } from "react";
import {
  API_BASE,
  getApiStatus,
  getMarketMetrics,
  getKFTCBrand,
  setApiFailFlags,
  type MarketMetrics,
  type KFTCBrand,
} from "@/lib/api";

export default function M365DevPage() {
  // 입력 기본값
  const [dong, setDong] = useState("1168064000");
  const [biz, setBiz] = useState("FNB");
  const [brandId, setBrandId] = useState("brand-new-cafe");

  // 플래그
  const [failMarket, setFailMarket] = useState(false);
  const [noFallback, setNoFallback] = useState(false);

  // 결과
  const [statusRes, setStatusRes] = useState<any>(null);
  const [marketRes, setMarketRes] = useState<MarketMetrics | { ok?: false; error?: string } | null>(null);
  const [brandRes, setBrandRes] = useState<KFTCBrand | { ok?: false; error?: string } | null>(null);

  // 플래그 적용
  useEffect(() => {
    setApiFailFlags({ FAIL_MARKET: failMarket, NO_FALLBACK: noFallback });
  }, [failMarket, noFallback]);

  async function onCheckStatus() {
    const j = await getApiStatus();
    setStatusRes(j);
  }

  async function onFetchMarket() {
    try {
      const j = await getMarketMetrics(dong, biz);
      setMarketRes(j);
    } catch (e: any) {
      setMarketRes({ ok: false, error: String(e?.message || e) });
    }
  }

  async function onFetchBrand() {
    try {
      const j = await getKFTCBrand(brandId);
      setBrandRes(j);
    } catch (e: any) {
      setBrandRes({ ok: false, error: String(e?.message || e) });
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Dev · M365 / KFTC 검증</h1>
      <p className="text-sm text-gray-600 mb-4">
        API_BASE: <code className="px-1 py-0.5 rounded bg-gray-100">{API_BASE}</code>
      </p>

      {/* 플래그 토글 */}
      <section className="rounded-2xl border p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">플래그</h2>
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={failMarket}
              onChange={(e) => setFailMarket(e.target.checked)}
              data-testid="flag-fail-market"
            />
            <span>__FAIL_MARKET_API__ (시장지표 강제 실패)</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={noFallback}
              onChange={(e) => setNoFallback(e.target.checked)}
              data-testid="flag-no-fallback"
            />
            <span>__NO_FALLBACK__ (폴백 금지)</span>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          * 체크 상태는 이 페이지에서만 유효. 해제하면 원복.
        </p>
      </section>

      {/* 상태 체크 */}
      <section className="rounded-2xl border p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">1) /api/status</h2>
          <a
            className="text-sm underline"
            href={`${API_BASE}/status`}
            target="_blank"
            rel="noreferrer"
          >
            새 탭에서 열기
          </a>
        </div>
        <button
          className="rounded-xl border px-3 py-1.5 hover:bg-gray-50"
          onClick={onCheckStatus}
          data-testid="btn-check-status"
        >
          상태 확인
        </button>
        <pre
          className="mt-3 rounded-xl bg-gray-50 p-3 text-sm overflow-auto"
          data-testid="out-status"
        >
{statusRes ? JSON.stringify(statusRes, null, 2) : "결과 없음"}
        </pre>
      </section>

      {/* 시장 지표 */}
      <section className="rounded-2xl border p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">2) /api/market365/metrics</h2>
        <div className="flex flex-wrap gap-3 mb-3">
          <label className="text-sm">
            동 코드(dong)
            <input
              className="ml-2 rounded border px-2 py-1"
              value={dong}
              onChange={(e) => setDong(e.target.value)}
              data-testid="inp-dong"
            />
          </label>
          <label className="text-sm">
            업종(biz)
            <select
              className="ml-2 rounded border px-2 py-1"
              value={biz}
              onChange={(e) => setBiz(e.target.value)}
              data-testid="sel-biz"
            >
              <option value="FNB">FNB</option>
              <option value="Retail">Retail</option>
              <option value="Service">Service</option>
            </select>
          </label>
          <button
            className="rounded-xl border px-3 py-1.5 hover:bg-gray-50"
            onClick={onFetchMarket}
            data-testid="btn-fetch-market"
          >
            지표 조회
          </button>
        </div>
        <pre
          className="mt-3 rounded-xl bg-gray-50 p-3 text-sm overflow-auto"
          data-testid="out-market"
        >
{marketRes ? JSON.stringify(marketRes, null, 2) : "결과 없음"}
        </pre>
      </section>

      {/* 공정위 브랜드 */}
      <section className="rounded-2xl border p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">3) /api/kftc/brand</h2>
        <div className="flex flex-wrap gap-3 mb-3">
          <label className="text-sm">
            브랜드 id
            <input
              className="ml-2 rounded border px-2 py-1"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              data-testid="inp-brand"
            />
          </label>
          <button
            className="rounded-xl border px-3 py-1.5 hover:bg-gray-50"
            onClick={onFetchBrand}
            data-testid="btn-fetch-brand"
          >
            브랜드 조회
          </button>
        </div>
        <pre
          className="mt-3 rounded-xl bg-gray-50 p-3 text-sm overflow-auto"
          data-testid="out-brand"
        >
{brandRes ? JSON.stringify(brandRes, null, 2) : "결과 없음"}
        </pre>
      </section>
    </main>
  );
}
