import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // [수정 포인트 1] 환경변수가 없어도 일단 '1234'로 로그인 되게 함 (테스트용)
    const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD || '1234';

    if (password === CORRECT_PASSWORD) {
      // 로그인 성공 응답 생성
      const response = NextResponse.json({ success: true });

      // [수정 포인트 2] 쿠키 이름을 'auth_cookie'로 변경! (미들웨어랑 이름 통일)
      response.cookies.set('auth_cookie', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24시간
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ success: false }, { status: 401 });
    
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}