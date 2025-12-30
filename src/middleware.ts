import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // [초강력 납치] 설정(config)이고 뭐고 다 필요 없다.
  // 무조건 구글로 보내버린다.
  console.log("🚨 미들웨어 작동! 납치 경로:", request.nextUrl.pathname);
  
  return NextResponse.redirect(new URL('https://www.google.com', request.url));
}

// ⚠️ 중요: config 설정을 아예 지웁니다! 
// 이렇게 하면 모든 페이지, 이미지, API 등등 접속하자마자 미들웨어가 무조건 실행됩니다.