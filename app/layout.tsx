import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Script from 'next/script'; // 구글 스크립트 로드용 컴포넌트
import HeaderMain from '@/components/HeaderMain';

export const metadata: Metadata = {
  title: '창업부스터 - 데이터 기반 창업 플랫폼',
  description: '실제 데이터 기반 상권·프랜차이즈 분석 서비스',
  icons: { icon: '/favicon.ico' },
};

type Props = { children: ReactNode };

// [완료] 엉아의 측정 ID 적용
const GA_ID = 'G-02PPKDRXCM'; 

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
        
        {/* 구글 애널리틱스 (GA4) 스크립트 */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `,
          }}
        />

        {/* 헤더 */}
        <HeaderMain />
        
        {/* 본문 */}
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  );
}