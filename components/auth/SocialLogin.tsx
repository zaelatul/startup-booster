'use client';

import { createBrowserClient } from '@supabase/ssr';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid';

export default function SocialLogin() {
  // ✅ [수정됨] 빌드 에러 방지용 안전장치 추가!
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

  // [카카오 로그인 함수]
  const handleKakaoLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        // 로그인 끝나면 돌아올 주소
        redirectTo: `${window.location.origin}/auth/callback`,
        
        // 🚨 [핵심 수정] scopes 대신 queryParams 사용!
        // 이렇게 하면 Supabase가 딴말 못하고 카카오한테 딱 이것만 달라고 요청합니다.
        queryParams: {
          scope: 'profile_nickname profile_image', 
        },
      },
    });

    if (error) {
      console.error('카카오 로그인 에러:', error.message);
      alert('로그인 중 오류가 발생했습니다: ' + error.message);
    }
  };

  // [구글 로그인]
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  };

  // [네이버 로그인]
  const handleNaverLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'naver', 
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* 1. 카카오 로그인 버튼 */}
      <button
        onClick={handleKakaoLogin}
        className="w-full flex items-center justify-center gap-2 bg-[#FEE500] text-[#391B1E] py-3.5 rounded-xl font-bold shadow-sm hover:bg-[#FDD835] transition-all active:scale-95"
      >
        <ChatBubbleOvalLeftIcon className="w-5 h-5" />
        카카오로 3초 만에 시작하기
      </button>

      {/* 2. 네이버 로그인 버튼 */}
      <button
        onClick={handleNaverLogin}
        className="w-full flex items-center justify-center gap-2 bg-[#03C75A] text-white py-3.5 rounded-xl font-bold shadow-sm hover:bg-[#02B150] transition-all active:scale-95"
      >
        <span className="font-black text-lg">N</span>
        네이버로 로그인
      </button>

      {/* 3. 구글 로그인 버튼 */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
      >
        <span className="font-black text-lg text-blue-500">G</span>
        Google로 계속하기
      </button>

      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
      </p>
    </div>
  );
}