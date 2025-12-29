import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  // 환경변수에 설정한 비밀번호와 일치하는지 확인
  if (password === process.env.ADMIN_PASSWORD) {
    // 일치하면 'admin_session'이라는 출입증(쿠키)을 발급해줍니다.
    cookies().set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24시간 동안 유효
      path: '/',
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}