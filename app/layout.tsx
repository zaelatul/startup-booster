import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Script from 'next/script';
import HeaderMain from '@/components/HeaderMain'; 
import MobileNav from '@/components/layout/MobileNav';
import BackgroundMusic from '@/components/common/BackgroundMusic';

// ✅ 네이버와 구글의 검색 엔진 최적화(SEO) 및 소유권 확인 설정
export const metadata: Metadata = {
  title: '창업부스터 - 데이터 기반 창업 플랫폼',
  description: '실제 데이터 기반 상권·프랜차이즈 분석 서비스',
  icons: { icon: '/favicon.ico' },
  // ✅ 검증 태그: 네이버와 구글 신분증을 여기에 다 모았습니다.
  verification: {
    other: {
      // 네이버 소유 확인
      'naver-site-verification': 'f531f6db75fbfa314708dd1cb028152a66a75fd0',
      // 구글 소유 확인 (새로 추가됨)
      'google-site-verification': 'Z8ikjkn_wLf9HjhanJLA5FieqYCYwt-TvmEDv-Mzj-A',
    },
  },
};

type Props = { children: ReactNode };

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

        {/* 배경음악 플레이어 */}
        <BackgroundMusic />

        {/* 헤더 */}
        <HeaderMain />
        
        {/* 본문 */}
        <main className="w-full pb-16 md:pb-0">
          {children}
        </main>

        {/* 모바일 하단 네비게이션 */}
        <MobileNav />
      </body>
    </html>
  );
}