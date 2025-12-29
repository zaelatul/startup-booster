import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    // 🚨 [수정 핵심] Next.js 15/16 버전부터는 cookies()가 비동기(await)여야 합니다!
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 성공하면 원래 가려던 페이지로 이동
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error('🔥 로그인 교환 실패:', error.message);
    }
  }

  // 실패 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/login?error=true`);
}