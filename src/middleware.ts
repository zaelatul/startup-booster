import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // [테스트] admin 페이지에 오면 묻지도 따지지도 말고 구글로 보내버려라!
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log("🚨 미들웨어 작동 확인! 구글로 납치 중...");
    return NextResponse.redirect(new URL('https://www.google.com', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // admin으로 시작하는 모든 경로 감시
  matcher: ['/admin', '/admin/:path*'],
};