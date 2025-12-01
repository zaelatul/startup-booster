// 신규 — src/components/RegionPicker.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type RegionNode = {
  code: string;        // 행정동 코드 10자리(동 단위)
  name: string;        // 노드 이름
  level: "sido" | "sigungu" | "dong";
  children?: RegionNode[];
};

// ---- 폴백 샘플(일부) : API 실패 시 사용 ----
const SAMPLE_TREE: RegionNode[] = [
  {
    code: "1100000000",
    name: "서울특별시",
    level: "sido",
    children: [
      {
        code: "1168000000",
        name: "강남구",
        level: "sigungu",
        children: [
          { code: "1168064000", name: "개포동", level: "dong" },
          { code: "1168058000", name: "대치동", level: "dong" },
          { code: "1168062000", name: "논현동", level: "dong" },
        ],
      },
      {
        code: "1159000000",
        name: "동작구",
        level: "sigungu",
        children: [
          { code: "1159062000", name: "사당동", level: "dong" },
          { code: "1159051000", name: "노량진동", level: "dong" },
        ],
      },
    ],
  },
  {
    code: "4100000000",
    name: "경기도",
    level: "sido",
    children: [
      {
        code: "4141000000",
        name: "성남시",
        level: "sigungu",
        children: [
          { code: "4141051000", name: "분당동", level: "dong" },
          { code: "4141052000", name: "수내동", level: "dong" },
          { code: "4141056000", name: "정자동", level: "dong" },
        ],
      },
    ],
  },
];

// 안전 fetch (타임아웃 + 폴백)
async function safeFetchJson<T>(url: string, ms = 2500): Promise<T | null> {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctl.signal, cache: "no-store" });
    if (!r.ok) return null;
    const j = (await r.json()) as T;
    return j;
  } catch {
    return null;
  } finally {
    clearTimeout(id);
  }
}

type Props = {
  value?: string | null; // 선택된 dong code
  onChange?: (code: string, labels: { sido?: string; sigungu?: string; dong?: string }) => void;
  apiBase?: string; // 기본: /api/market365/region
  className?: string;
};

export default function RegionPicker({
  value = "",
  onChange,
  apiBase = "/api/market365/region",
  className = "",
}: Props) {
  const [tree, setTree] = useState<RegionNode[]>([]);
  const [sido, setSido] = useState<string>("");
  const [sigungu, setSigungu] = useState<string>("");
  const [dong, setDong] = useState<string>("");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"api" | "fallback">("api");
  const saveKey = "regionpicker_recent_v1";
  const recentRef = useRef<{ code: string; label: string }[]>([]);

  // 초기 로드
  useEffect(() => {
    (async () => {
      // API 형태 예시 기대: { ok:true, tree:[{code,name,level,children:[...]}, ...] }
      type ApiShape = { ok: boolean; tree: RegionNode[] };
      const base = typeof window !== "undefined"
        ? (process.env.NEXT_PUBLIC_API_BASE || "/api")
        : "/api"; // 서버/클라 모두 안전
      const url = apiBase.startsWith("/api")
        ? apiBase
        : `${base}/market365/region`;

      const api = await safeFetchJson<ApiShape>(url);
      if (api?.ok && Array.isArray(api.tree) && api.tree.length) {
        setTree(api.tree);
        setSource("api");
      } else {
        setTree(SAMPLE_TREE);
        setSource("fallback");
      }
    })();
  }, [apiBase]);

  // 초기값 value 반영
  useEffect(() => {
    if (!value || !tree.length) return;
    // 트리에서 코드 찾아 부모 라벨 복원
    let found: RegionNode | null = null;
    let fSido = "", fSigungu = "";
    for (const s of tree) {
      if (s.children) {
        for (const g of s.children) {
          const d = g.children?.find((x) => x.code === value);
          if (d) {
            found = d;
            fSido = s.name; fSigungu = g.name;
            setSido(s.code);
            setSigungu(g.code);
            setDong(d.code);
            onChange?.(d.code, { sido: fSido, sigungu: fSigungu, dong: d.name });
            break;
          }
        }
      }
    }
  }, [value, tree]); // eslint-disable-line react-hooks/exhaustive-deps

  // 레벨별 목록
  const sidos = useMemo(() => tree, [tree]);
  const sigungus = useMemo(() => (sidos.find((s) => s.code === sido)?.children ?? []), [sidos, sido]);
  const dongs = useMemo(() => (sigungus.find((g) => g.code === sigungu)?.children ?? []), [sigungus, sigungu]);

  // 검색(간단: 동 이름 포함)
  const filteredDongs = useMemo(() => {
    if (!query.trim()) return dongs;
    const q = query.trim();
    return dongs.filter((d) => d.name.includes(q));
  }, [dongs, query]);

  // 선택 핸들러
  const apply = (d?: RegionNode) => {
    if (!d) return;
    setDong(d.code);
    // 상위 라벨 구하기
    const s = sidos.find((x) => x.code === sido)?.name;
    const g = sigungus.find((x) => x.code === sigungu)?.name;
    onChange?.(d.code, { sido: s, sigungu: g, dong: d.name });
    // 최근 저장
    const item = { code: d.code, label: `${s ?? ""} ${g ?? ""} ${d.name}`.trim() };
    const old = JSON.parse(localStorage.getItem(saveKey) || "[]") as typeof recentRef.current;
    const next = [item, ...old.filter((x) => x.code !== item.code)].slice(0, 8);
    localStorage.setItem(saveKey, JSON.stringify(next));
    recentRef.current = next;
  };

  // 최근 로드
  useEffect(() => {
    try {
      recentRef.current = JSON.parse(localStorage.getItem(saveKey) || "[]");
    } catch {
      recentRef.current = [];
    }
  }, []);

  // 복사
  const copy = async () => {
    if (!dong) return;
    try {
      await navigator.clipboard.writeText(dong);
      alert("행정동 코드가 복사되었습니다.");
    } catch {
      // noop
    }
  };

  // 초기화
  const reset = () => {
    setSido(""); setSigungu(""); setDong(""); setQuery("");
    onChange?.("", {});
  };

  return (
    <div className={`w-full rounded-2xl border p-3 md:p-4 ${className}`} data-testid="region-picker">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-sm text-gray-600">
          행정동 선택 <span className="ml-1 rounded bg-gray-100 px-2 py-0.5 text-xs">{source === "api" ? "API" : "폴백"}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            disabled={!dong}
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
            data-testid="copy-code"
          >
            코드 복사
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border px-3 py-1 text-sm"
            data-testid="reset"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 1단계: 시/도 */}
      <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-3">
        <select
          value={sido}
          onChange={(e) => { setSido(e.target.value); setSigungu(""); setDong(""); }}
          className="rounded-lg border px-3 py-2"
          data-testid="sido"
        >
          <option value="">시/도 선택</option>
          {sidos.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>

        {/* 2단계: 구/군 */}
        <select
          value={sigungu}
          onChange={(e) => { setSigungu(e.target.value); setDong(""); }}
          className="rounded-lg border px-3 py-2"
          data-testid="sigungu"
          disabled={!sido}
        >
          <option value="">{sido ? "구/군 선택" : "시/도 먼저 선택"}</option>
          {sigungus.map((g) => (
            <option key={g.code} value={g.code}>{g.name}</option>
          ))}
        </select>

        {/* 3단계: 동 검색 */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="동 이름 검색 (예: 대치)"
          className="rounded-lg border px-3 py-2"
          data-testid="dong-search"
          disabled={!sigungu}
        />
      </div>

      {/* 동 선택 리스트 */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {filteredDongs.map((d) => {
          const active = d.code === dong;
          return (
            <button
              type="button"
              key={d.code}
              onClick={() => apply(d)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                active ? "border-blue-600 bg-blue-50" : "hover:bg-gray-50"
              }`}
              data-testid={`dong-${d.code}`}
            >
              <div className="font-medium">{d.name}</div>
              <div className="text-xs text-gray-500">{d.code}</div>
            </button>
          );
        })}
        {!sigungu && (
          <div className="col-span-2 text-sm text-gray-500 md:col-span-4">
            구/군을 먼저 선택하세요.
          </div>
        )}
        {sigungu && filteredDongs.length === 0 && (
          <div className="col-span-2 text-sm text-gray-500 md:col-span-4">
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {/* 최근 선택 */}
      {recentRef.current.length > 0 && (
        <div className="mt-3">
          <div className="mb-1 text-sm text-gray-600">최근 선택</div>
          <div className="flex flex-wrap gap-2">
            {recentRef.current.map((r) => (
              <button
                type="button"
                key={r.code}
                onClick={() => {
                  // 최근에서 바로 반영: 트리를 순회해 부모코드 세팅
                  for (const s of sidos) {
                    for (const g of s.children ?? []) {
                      const d = g.children?.find((x) => x.code === r.code);
                      if (d) {
                        setSido(s.code);
                        setSigungu(g.code);
                        apply(d);
                        return;
                      }
                    }
                  }
                }}
                className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
                data-testid={`recent-${r.code}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
