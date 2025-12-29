import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // [디버깅용 로그] Vercel 로그에 이 말이 찍히는지 봐야 합니다.
  console.log("Middleware 동작 중! 접속 경로:", request.nextUrl.pathname);

  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const adminSession = request.cookies.get('admin_session');

    if (!adminSession) {
      // 로그인 안했으면 로그인 페이지로 강제 이동
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // admin으로 시작하는 모든 경로 감시
  matcher: ['/admin', '/admin/:path*'],
};