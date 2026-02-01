import { NextResponse } from 'next/server';

export async function POST() {
  // 1. 로그아웃 성공 메시지 준비
  const response = NextResponse.json({ message: '로그아웃 되었습니다.' });

  // 2. [핵심] 쿠키를 만료시켜서 삭제해버림 (maxAge를 0으로 설정)
  // path: '/'를 꼭 넣어줘야 모든 곳에서 사라집니다.
  response.cookies.set('auth_cookie', '', { maxAge: 0, path: '/' });

  return response;
}