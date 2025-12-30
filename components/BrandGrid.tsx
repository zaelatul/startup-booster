// C:\Users\USER\Desktop\프로젝트2\web\src\components\BrandGrid.tsx
import Link from "next/link";

// 서버 컴포넌트: 선택 카테고리 기반 추천 브랜드 그리드
export default async function BrandGrid({ categories }: { categories: string[] }) {
  // BRANDS가 없는 환경에서도 터지지 않도록 안전 로드
  let BRANDS: any[] = [];
  try {
    const mod = await import("@/lib/reco"); // 존재 시 { BRANDS, ... }
    // 일부 프로젝트는 default로 내보낼 수 있으므로 병합 방지
    // @ts-ignore
    BRANDS = (mod?.BRANDS || mod?.default?.BRANDS || []) as any[];
  } catch {
    BRANDS = [];
  }

  if (!Array.isArray(BRANDS) || BRANDS.length === 0) {
    return (
      <div className="mt-8 rounded-xl border p-5 text-sm">
        샘플 브랜드 카탈로그가 아직 없어요. <code>@/lib/reco.ts</code>에 <b>BRANDS</b> 배열을 넣어두면
        여기서 자동으로 보여줄게요.
      </div>
    );
  }

  // 카테고리 필터: brand.category 또는 brand.categories 배열 둘 다 지원
  const selected = (categories || []).map((s) => s.trim()).filter(Boolean);
  const fit = BRANDS.filter((b: any) => {
    if (selected.length === 0) return true;
    const one = (b?.category ?? "").toString();
    const many: string[] = Array.isArray(b?.categories) ? b.categories : [];
    return selected.some((c) => one === c || many.includes(c));
  });

  // 점수/랭크 키가 있으면 정렬, 없으면 이름순
  const sorted = [...fit].sort((a: any, b: any) => {
    const sa = Number(a?.score ?? a?.rank ?? 0);
    const sb = Number(b?.score ?? b?.rank ?? 0);
    if (sa !== sb) return sb - sa;
    return String(a?.name ?? "").localeCompare(String(b?.name ?? ""));
  });

  const top = sorted.slice(0, 12);

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-semibold">
        추천 브랜드 <span className="text-gray-500 text-base">({top.length}개)</span>
      </h2>

      {top.length === 0 ? (
        <div className="rounded-xl border p-5 text-sm">선택한 카테고리에 맞는 브랜드가 없어요.</div>
      ) : (
        <ul
          data-testid="brand-grid"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {top.map((b: any) => {
            const id = String(b?.id ?? (b?.name || "").toLowerCase().replace(/\s+/g, "-"));
            const name = String(b?.name ?? "브랜드");
            const cat =
              Array.isArray(b?.categories) && b.categories.length
                ? b.categories.join(" · ")
                : String(b?.category ?? "");
            const badge =
              b?.score != null
                ? `점수 ${b.score}`
                : b?.rank != null
                ? `랭크 ${b.rank}`
                : "";

            return (
              <li key={id} className="rounded-xl border p-4 hover:shadow-sm">
                <div className="mb-2 font-medium">{name}</div>
                <div className="mb-3 text-sm text-gray-500">{cat}</div>
                {badge && (
                  <div className="mb-3 inline-block rounded-full border px-2 py-0.5 text-xs">
                    {badge}
                  </div>
                )}
                <Link
                  data-testid={`brand-link-${id}`}
                  href={`/franchise/brand/${encodeURIComponent(id)}`}
                  className="inline-block rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  상세 보기
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
