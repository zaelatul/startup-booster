// app/market/layout.tsx  (신규)
// 목적: 기존 /market/page.tsx 위에 공통 배너만 안전하게 추가

import BannerStrip from '@/components/BannerStrip';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-4" data-testid="banner-wrap-market">
        <BannerStrip />
      </div>
      {children}
    </>
  );
}
