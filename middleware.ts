import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. [예외 처리] 홈페이지, 이미지, API, 로그인 페이지 등은 그냥 통과시킨다.
  // (admin으로 시작하지 않거나, admin/login 인 경우는 검사 안 함)
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next();
  }

  // 2. [보안 검사] 여기서부터는 '/admin' 관련 페이지입니다.
  // 'auth_cookie'라는 이름의 쿠키가 있는지 확인합니다. (행님이 쓰시던 쿠키 이름으로 바꾸세요!)
  const isLoggedIn = request.cookies.get('auth_cookie'); 

  if (!isLoggedIn) {
    // 3. 로그인이 안 되어 있으면 -> 로그인 페이지로 쫓아낸다.
    console.log("🚨 관리자 접근 차단! 로그인 페이지로 이동합니다.");
    const loginUrl = new URL('/admin/login', request.url); // 로그인 페이지 경로 확인 필요
    return NextResponse.redirect(loginUrl);
  }

  // 4. 로그인 되어 있으면 -> 통과!
  return NextResponse.next();
}

export const config = {
  // 미들웨어가 동작할 경로 설정 (필요한 곳만 감시해서 성능 최적화)
  matcher: ['/admin/:path*'],
};