import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // [강제 납치 테스트] 조건문 다 필요 없음. 무조건 실행!
  console.log("🚨 미들웨어 생존 신고! 경로:", request.nextUrl.pathname);
  
  // 무조건 구글로 보내버림 (홈페이지든 어드민이든 다 납치)
  return NextResponse.redirect(new URL('https://www.google.com', request.url));
}

// ⚠️ matcher 설정을 아예 지워버립니다! (모든 경로에서 실행되게)
// export const config = { matcher: ... };  <-- 이거 없음