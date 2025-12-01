"use client";
export const dynamic = "force-dynamic";

/**
 * Self Interior — Inquiry (Email-first)
 * - 필수: email
 * - 선택: name, phone, scope(floor|wall|both), memo
 * - 저장: localStorage "interior_inquiries" 배열에 append
 * - 메일: mailto 링크로 기본 메일클라이언트 열기(관리자 수신)
 */

import React, { useEffect, useMemo, useState } from "react";

const ADMIN_EMAIL = "contact@example.com"; // ← 운영 메일로 바꿔주세요.
const INQ_KEY = "interior_inquiries";

type Scope = "floor" | "wall" | "both";
type StoredInquiry = {
  ts: string;
  tab: "floor" | "wall";        // 관리자 필터 호환용( both 인 경우 floor 로 저장 )
  scope?: Scope;                // 사용자가 고른 실제 범위
  name?: string;
  phone?: string;
  email: string;
  memo?: string;
  // 관리자페이지 컬럼 호환을 위해 기본값 채움
  area: number;                 // m²
  needM2: number;
  boxes: number;
  adhesiveCans: number;
  productId: string;
  productName: string;
  materialTotal: number;
};

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export default function InteriorContactPage() {
  const mounted = useMounted();
  const [scope, setScope] = useState<Scope>("floor");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [memo, setMemo] = useState("");
  const [saved, setSaved] = useState<StoredInquiry | null>(null);

  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);

  if (!mounted) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="h-7 w-40 rounded bg-gray-200" />
        <div className="mt-4 h-32 rounded-2xl border bg-white" />
      </main>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailOk) {
      alert("이메일을 올바르게 입력해주세요.");
      return;
    }

    const entry: StoredInquiry = {
      ts: new Date().toISOString(),
      tab: scope === "wall" ? "wall" : "floor",
      scope,
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim(),
      memo: memo.trim() || undefined,
      // 관리자 컬럼 호환용 기본치
      area: 0,
      needM2: 0,
      boxes: 0,
      adhesiveCans: 0,
      productId: "general",
      productName: "일반 문의",
      materialTotal: 0,
    };

    try {
      const arr: StoredInquiry[] = JSON.parse(localStorage.getItem(INQ_KEY) || "[]");
      arr.push(entry);
      localStorage.setItem(INQ_KEY, JSON.stringify(arr));
      setSaved(entry);
    } catch {
      alert("저장에 실패했습니다(브라우저 저장소).");
    }
  }

  function resetForm() {
    setScope("floor");
    setName("");
    setPhone("");
    setEmail("");
    setMemo("");
    setSaved(null);
  }

  const mailtoHref = saved
    ? makeMailto({
        to: ADMIN_EMAIL,
        subject: `셀프 인테리어 문의 (${saved.scope === "both" ? "바닥·벽" : saved.scope === "floor" ? "바닥" : "벽"})`,
        body: [
          "다음 내용으로 문의드립니다.",
          "",
          `• 문의 구분: ${saved.scope === "both" ? "바닥·벽" : saved.scope === "floor" ? "바닥" : "벽"}`,
          `• 이름: ${saved.name ?? "-"}`,
          `• 연락처: ${saved.phone ?? "-"}`,
          `• 이메일: ${saved.email}`,
          saved.memo ? `• 메모: ${saved.memo}` : "",
          "",
          "(자동 생성: 페이지 /interior/contact)",
        ]
          .filter(Boolean)
          .join("\n"),
      })
    : "#";

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-3 flex items-center gap-2">
        <a href="/interior" className="rounded-xl border px-3 py-1.5 hover:bg-gray-50">← 계산기로</a>
        <h1 className="text-2xl font-bold">셀프 인테리어 문의</h1>
      </div>

      <p className="mb-4 text-sm text-gray-600">
        이메일로 간단히 문의를 보내세요. 저장하면 관리자 페이지에서 즉시 확인되고, “메일 작성” 버튼으로 기본 메일앱이 열립니다.
      </p>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-4">
        {/* 선택: 바닥/벽/바닥·벽 */}
        <div className="mb-4">
          <div className="mb-2 text-sm font-medium">문의 구분</div>
          <div className="flex flex-wrap gap-2" data-testid="inq-scope">
            <label className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 cursor-pointer">
              <input
                type="radio"
                name="scope"
                className="accent-black"
                checked={scope === "floor"}
                onChange={() => setScope("floor")}
              />
              바닥(데코타일)
            </label>
            <label className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 cursor-pointer">
              <input
                type="radio"
                name="scope"
                className="accent-black"
                checked={scope === "wall"}
                onChange={() => setScope("wall")}
              />
              벽(소프트스톤)
            </label>
            <label className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 cursor-pointer">
              <input
                type="radio"
                name="scope"
                className="accent-black"
                checked={scope === "both"}
                onChange={() => setScope("both")}
              />
              바닥·벽
            </label>
          </div>
        </div>

        {/* 이메일(필수) / 이름 / 연락처 */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">이메일(필수)</label>
            <input
              data-testid="inq-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border px-3 py-2"
            />
            {!emailOk && email && (
              <p className="mt-1 text-xs text-red-600">이메일 형식을 확인해주세요.</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">이름(선택)</label>
            <input
              data-testid="inq-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">연락처(선택)</label>
            <input
              data-testid="inq-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
        </div>

        {/* 메모 */}
        <div className="mt-3">
          <label className="mb-1 block text-sm font-medium">메모(선택)</label>
          <textarea
            data-testid="inq-memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={4}
            placeholder="예) 대략 10평, 바닥 톤 추천 부탁드려요."
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        {/* 액션 */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-xl border bg-black px-4 py-2 text-white hover:opacity-90"
            data-testid="inq-save"
          >
            저장하기
          </button>
          {saved && (
            <>
              <a
                href={mailtoHref}
                className="rounded-xl border px-4 py-2 hover:bg-gray-50"
                data-testid="inq-mailto"
              >
                메일 작성
              </a>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border px-4 py-2 hover:bg-gray-50"
                data-testid="inq-reset"
              >
                새 문의
              </button>
              <span className="self-center text-sm text-gray-600">
                저장됨: {new Date(saved.ts).toLocaleString()}
              </span>
            </>
          )}
        </div>
      </form>

      {/* 안내 */}
      <p className="mt-3 text-xs text-gray-500">
        ※ 저장 시 브라우저에 임시 보관되며(관리자 페이지에서 확인), 실제 견적·일정은 운영자 회신 메일로 확정됩니다.
      </p>
    </main>
  );
}

function makeMailto(opts: { to: string; subject: string; body: string }) {
  const p = new URLSearchParams({
    subject: opts.subject,
    body: opts.body,
  }).toString();
  return `mailto:${encodeURIComponent(opts.to)}?${p}`;
}
