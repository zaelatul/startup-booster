// 신규 파일 — app/franchise/brand/[id]/inquiry/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function InquiryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memo, setMemo] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-bold mb-6">가맹 문의하기</h1>
      <p className="mb-6 text-gray-600">
        브랜드: <span className="font-semibold">{decodeURIComponent(String(id))}</span>
      </p>

      <div className="space-y-4">
        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="inq-name"
        />
        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder="연락처(숫자만)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          data-testid="inq-phone"
        />
        <textarea
          className="w-full rounded-xl border px-3 py-2 min-h-[120px]"
          placeholder="메모(선택)"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          data-testid="inq-memo"
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          className="rounded-xl border px-4 py-2 hover:bg-gray-50"
          onClick={() => router.back()}
        >
          돌아가기
        </button>
        <button
          className="rounded-xl bg-black text-white px-4 py-2"
          onClick={() => {
            // 서버 저장은 후속 작업. 지금은 간단히 확인 토스트만.
            alert("문의가 접수되었습니다. (샘플)");
            router.push(`/franchise/brand/${encodeURIComponent(String(id))}`);
          }}
          data-testid="inq-submit"
        >
          제출
        </button>
      </div>

      <p className="mt-6 text-xs text-gray-500">
        ※ 본 폼은 샘플입니다. 실제 저장은 추후 Supabase 연동 후 활성화됩니다.
      </p>
    </div>
  );
}
