import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. 유저가 '/admin' 페이지에 들어가려고 하는지 감시합니다.
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // 단, 로그인 페이지 자체는 검사하면 안 되니까 제외합니다.
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // 2. 'admin_session'이라는 출입증(쿠키)을 가지고 있는지 확인합니다.
    const adminSession = request.cookies.get('admin_session');

    // 3. 출입증이 없으면 '너 누구야? 로그인부터 해' 하고 로그인 페이지로 쫓아냅니다.
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// 미들웨어가 감시할 경로 설정
export const config = {
  matcher: '/admin/:path*',
};