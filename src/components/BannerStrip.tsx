// 교체: src/components/BannerStrip.tsx
// 서버 컴포넌트 (no "use client")
type Banner = {
  id: string;
  title: string;
  href: string;
  img: string;
  badge?: string;
};

function siteBase(): string {
  // 1) 명시적 설정(로컬/스테이징/프로덕션 공통)
  const env =
    process.env.NEXT_PUBLIC_SITE_URL || // https://mydomain.com
    process.env.SITE_URL || // 선택적
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return env.replace(/\/$/, "");
}

export default async function BannerStrip() {
  const url = new URL("/api/banners", siteBase()).toString();

  let banners: Banner[] = [];
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { banners?: Banner[] };
    banners = json?.banners ?? [];
  } catch {
    // 네트워크/런타임 오류 시 배너 미노출(페이지는 계속 진행)
    return null;
  }

  if (!banners.length) return null;

  return (
    <div className="mb-4 overflow-x-auto whitespace-nowrap rounded-xl border bg-white p-3">
      {banners.map((b) => (
        <a
          key={b.id}
          href={b.href}
          className="mr-3 inline-flex items-center gap-3 rounded-lg border px-3 py-2 hover:bg-gray-50"
        >
          <img
            src={b.img}
            alt={b.title}
            width={48}
            height={48}
            className="h-12 w-12 rounded object-cover"
            loading="lazy"
          />
          <div className="text-sm">
            <div className="font-medium">{b.title}</div>
            {b.badge && (
              <span className="mt-0.5 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                {b.badge}
              </span>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
