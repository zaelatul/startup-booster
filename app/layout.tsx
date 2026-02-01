import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Script from 'next/script'; // 구글 스크립트 로드용 컴포넌트
// 👇 경로가 만약 에러나면 './components/HeaderMain' 으로 바꿔주세요 (파일 위치에 따라 다름)
import HeaderMain from '@/components/HeaderMain'; 
// [기존] 모바일 하단 네비게이션 불러오기
import MobileNav from '@/components/layout/MobileNav';
// ✅ [신규 추가] 배경음악 컴포넌트 불러오기
import BackgroundMusic from '@/components/common/BackgroundMusic';

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

        {/* ✅ [신규 추가] 배경음악 플레이어 (화면 왼쪽 하단 고정) */}
        {/* 이 컴포넌트는 위치가 fixed라 어디에 넣어도 상관없지만, 관리가 편하게 맨 위에 둡니다 */}
        <BackgroundMusic />

        {/* 헤더: 방금 로고 이미지를 적용한 HeaderMain을 불러옵니다 */}
        <HeaderMain />
        
        {/* 본문 */}
        {/* [수정] pb-16: 하단 네비게이션 높이만큼 패딩을 줘서 내용 가림 방지 */}
        <main className="w-full pb-16 md:pb-0">
          {children}
        </main>

        {/* [추가] 모바일 하단 네비게이션 (PC에서는 자동으로 숨겨짐) */}
        <MobileNav />
      </body>
    </html>
  );
}