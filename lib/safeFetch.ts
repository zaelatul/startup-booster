// 신규(풀코드) — C:\Users\USER\Desktop\프로젝트2\web\src\lib\safeFetch.ts
export type SafeOk<T> = { ok: true; data: T; status: number };
export type SafeErr = { ok: false; error: string; status: number; cause?: unknown };
export type SafeResult<T> = SafeOk<T> | SafeErr;

/** JSON 전용 안전 fetch — 콘솔 'Uncaught (in promise)'의 근본 원인 제거 */
export async function safeFetchJSON<T>(url: string, init?: RequestInit): Promise<SafeResult<T>> {
  try {
    const res = await fetch(url, { cache: "no-store", ...init });
    const status = res.status;
    const ct = res.headers.get("content-type") || "";

    if (!res.ok) {
      let body = "";
      try { body = await res.text(); } catch {}
      return { ok: false, status, error: body || res.statusText || `HTTP_${status}` };
    }
    if (!ct.includes("application/json")) {
      return { ok: false, status, error: `NOT_JSON(${ct || "unknown"})` };
    }
    const data = (await res.json()) as T;
    return { ok: true, data, status };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, error: msg, cause: e };
  }
}

/** 오류 문구를 사용자용으로 정제 */
export function humanizeError(err: SafeErr): string {
  if (err.status === 0) return "네트워크 연결에 실패했습니다.";
  if (err.error.startsWith("NOT_JSON")) return "서버 응답 형식이 올바르지 않습니다.";
  if (err.status === 404) return "데이터를 찾을 수 없습니다.";
  if (err.status >= 500) return "서버가 일시적으로 응답하지 않습니다.";
  return "요청 처리에 실패했습니다.";
}

/** 쿼리 가드: 행정동 10자리 & 허용 업종 */
export function parseMarketQuery(inputDong: string | null, inputBiz: string | null) {
  const dong = (inputDong || "").trim();
  const biz = (inputBiz || "").trim().toUpperCase();
  const validDong = /^\d{10}$/.test(dong) ? dong : "";
  const validBiz = ["FNB", "RETAIL", "SERVICE"].includes(biz) ? biz : "FNB";
  return { dong: validDong, biz: validBiz as "FNB" | "RETAIL" | "SERVICE" };
}
