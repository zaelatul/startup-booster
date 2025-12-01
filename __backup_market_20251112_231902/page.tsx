"use client";
export const dynamic = "force-dynamic";

/**
 * 상권분석 v2 (MVP 고도화)
 * - 입력: 행정동코드(dong), 업종(biz=FNB|Retail|Service)
 * - 출력: KPI 카드(평균매출/수익률/개업률/폐업률), 매출 트렌드(지수=100 기준), 출처/업데이트, 간단 리포트 복사, 요청URL 복사/새탭
 * - URL 동기화: ?dong=1168064000&biz=FNB
 * - 안전가드: 네트워크/스냅샷 폴백/숫자형 변환/스파크라인 min-max 보정
 */

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Kpi = {
  avgRevenue?: number; // 월평균 매출(원)
  roi?: number;        // 수익률(%)
  openRate?: number;   // 개업률(%)
  closeRate?: number;  // 폐업률(%)
};

type MetricsResp = {
  kpi?: Kpi;
  trendIndex?: number[];
  lastUpdated?: string;
  source?: string; // "local-snapshot" | "market365" ...
};

const SAMPLE_DONGS = [
  { code: "1168064000", name: "서울 송파구 잠실동(샘플)" },
  { code: "1154551000", name: "서울 금천구 가산동(샘플)" },
  { code: "1144066000", name: "서울 마포구 서교동(샘플)" },
];

const BIZ_OPTIONS = [
  { value: "FNB", label: "F&B(음식)" },
  { value: "Retail", label: "Retail(소매)" },
  { value: "Service", label: "Service(서비스)" },
];

export default function MarketPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // URL → 상태
  const initDong = sp.get("dong") || "1168064000";
  const initBiz = sp.get("biz") || "FNB";

  const [dong, setDong] = useState(initDong);
  const [biz, setBiz] = useState(initBiz);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<MetricsResp | null>(null);

  // URL 동기화
  useEffect(() => {
    const q = new URLSearchParams({ dong, biz }).toString();
    router.replace(`/market?${q}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dong, biz]);

  async function fetchMetrics() {
    setLoading(true);
    setErr(null);
    try {
      const url = `/api/market365/metrics?dong=${encodeURIComponent(dong)}&biz=${encodeURIComponent(biz)}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as MetricsResp;
      setData(json || {});
    } catch (e: any) {
      setErr(e?.message || "요청 실패");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  // 최초 로드 시 자동 조회
  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kpi = data?.kpi || {};
  const trend = Array.isArray(data?.trendIndex) && (data?.trendIndex?.length || 0) > 0 ? (data?.trendIndex as number[]) : [];
  const src = data?.source || "-";
  const updated = data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : "-";

  // 포맷터
  const fmtKRW = (n?: number) =>
    typeof n === "number" && isFinite(n)
      ? n.toLocaleString("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 })
      : "-";
  const fmtPCT = (n?: number) =>
    typeof n === "number" && isFinite(n) ? `${n.toFixed(1)}%` : "-";

  // 스파크라인 path (min~max 정규화)
  const spark = useMemo(() => {
    if (!trend.length) return { d: "", min: 0, max: 0 };
    const W = 340;
    const H = 64;
    const min = Math.min(...trend);
    const max = Math.max(...trend);
    const span = max - min || 1;
    const stepX = W / Math.max(1, trend.length - 1);

    let d = "";
    trend.forEach((v, i) => {
      const x = i * stepX;
      const y = H - ((v - min) / span) * H; // 상향값 위로
      d += i === 0 ? `M ${x},${y}` : ` L ${x},${y}`;
    });
    return { d, min, max };
  }, [trend]);

  // 간단 리포트
  const reportText = useMemo(() => {
    const parts = [
      `[상권 요약] 행정동: ${dong} / 업종: ${biz}`,
      `- 평균매출: ${fmtKRW(kpi.avgRevenue)} / 수익률: ${fmtPCT(kpi.roi)} / 개업률: ${fmtPCT(kpi.openRate)} / 폐업률: ${fmtPCT(kpi.closeRate)}`,
      trend.length ? `- 최근 지수: ${trend.join(" → ")} (기준월=100, 값이 클수록 우상향)` : `- 최근 지수: 데이터 없음`,
      `- 출처: ${src} / 업데이트: ${updated}`,
      `※ 지수는 상대지표(100=기준월). 실제 값과 오차가 있을 수 있어 공공 포털의 원문도 함께 확인하세요.`,
    ];
    return parts.join("\n");
  }, [dong, biz, kpi, trend, src, updated]);

  const requestUrl = `/api/market365/metrics?dong=${encodeURIComponent(dong)}&biz=${encodeURIComponent(biz)}`;

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("클립보드에 복사했습니다.");
    } catch {
      alert("복사 실패. 브라우저 권한을 확인하세요.");
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-4">
      {/* 상단 헤더 */}
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">상권분석 (베타)</h1>
        <a
          href="/franchise/explore"
          className="rounded-lg border px-3 py-1.5 hover:bg-gray-50"
        >
          프랜차이즈 탐색으로 →
        </a>
      </div>

      {/* 상단 롤링/프로모 간단 영역 */}
      <div className="mb-4 overflow-auto whitespace-nowrap rounded-xl border p-3 text-sm">
        <span className="mr-4 inline-block rounded-full bg-gray-100 px-3 py-1"># 데이터 스냅샷 폴백 지원</span>
        <span className="mr-4 inline-block rounded-full bg-gray-100 px-3 py-1"># 지수=100 기준, 최근 추세 한눈에</span>
        <span className="inline-block rounded-full bg-gray-100 px-3 py-1"># 주소복사로 원문 확인</span>
      </div>

      {/* 필터 */}
      <section className="mb-3 rounded-2xl border bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">행정동 코드</label>
            <div className="flex gap-2">
              <input
                data-testid="region-input"
                className="w-full rounded-xl border px-3 py-2"
                value={dong}
                onChange={(e) => setDong(e.target.value.trim())}
                placeholder="예: 1168064000"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {SAMPLE_DONGS.map((d) => (
                <button
                  key={d.code}
                  onClick={() => setDong(d.code)}
                  className="rounded-full border px-2 py-1 hover:bg-gray-50"
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">업종</label>
            <select
              data-testid="biz-select"
              className="w-full rounded-xl border px-3 py-2"
              value={biz}
              onChange={(e) => setBiz(e.target.value)}
            >
              {BIZ_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            data-testid="query-btn"
            onClick={fetchMetrics}
            className="rounded-xl border bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "조회 중..." : "지표 조회"}
          </button>

          <button
            onClick={() => copy(`${location.origin}${requestUrl}`)}
            className="rounded-xl border px-4 py-2 hover:bg-gray-50"
            data-testid="copy-request"
          >
            요청 URL 복사
          </button>
          <button
            onClick={() => window.open(requestUrl, "_blank")}
            className="rounded-xl border px-4 py-2 hover:bg-gray-50"
          >
            새 탭에서 열기
          </button>
          <button
            onClick={() => copy(reportText)}
            className="rounded-xl border px-4 py-2 hover:bg-gray-50"
            data-testid="copy-report-btn"
          >
            간단 리포트 복사
          </button>
        </div>

        {err && (
          <p className="mt-3 text-sm text-red-600">오류: {err} — 스냅샷 모드 또는 입력값을 확인하세요.</p>
        )}
      </section>

      {/* KPI */}
      <section className="mb-3 grid gap-3 sm:grid-cols-4">
        <KpiCard title="평균매출" value={fmtKRW(kpi.avgRevenue)} />
        <KpiCard title="수익률(순이익/매출)" value={fmtPCT(kpi.roi)} />
        <KpiCard title="개업률" value={fmtPCT(kpi.openRate)} />
        <KpiCard title="폐업률" value={fmtPCT(kpi.closeRate)} />
      </section>

      {/* 트렌드 + 메타 */}
      <section className="rounded-2xl border bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">매출 트렌드(지수)</h2>
          <span className="text-xs text-gray-500">기준월=100, 값이 클수록 최근 흐름이 우상향</span>
        </div>

        {trend.length ? (
          <div className="flex items-end gap-6">
            <svg width="360" height="72" className="rounded-lg bg-gray-50" data-testid="spark">
              <path d={spark.d} stroke="black" strokeWidth="2" fill="none" />
            </svg>
            <div className="text-sm text-gray-600">
              <div>최근 지수: {trend.join(" → ")}</div>
              <div>
                범위: {Math.min(...trend)} ~ {Math.max(...trend)}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-sm text-gray-500">지수 데이터가 없습니다.</div>
        )}

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <MetaCard label="행정동 코드" value={dong} />
          <MetaCard label="업종" value={biz} />
          <MetaCard
            label="데이터 출처"
            value={
              <span className="inline-flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{src}</span>
                <span className="text-xs text-gray-500">업데이트 {updated}</span>
              </span>
            }
          />
        </div>

        <p className="mt-3 text-xs text-gray-500">
          ※ 통계는 스냅샷 모드일 수 있습니다. 공공 포털의 원문(소상공인시장진흥공단, 공정위 등)과 함께 참고하세요.
        </p>
      </section>
    </main>
  );
}

// ──────────────────────────────────────────────────────────────
// UI 조각
function KpiCard({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-xl font-semibold" data-testid="kpi">{value}</div>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-3 text-sm">
      <div className="text-gray-500">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
