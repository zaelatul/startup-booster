'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { RocketLaunchIcon, UserCircleIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';

export default function HeaderMain() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // 유저 정보를 담을 그릇

  // 1. Supabase 접속 도구 만들기
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 2. 페이지 열리자마자 "로그인된 사람 있어?" 확인하기
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user); // "어, 있어!" -> 유저 정보 저장
      }
    };
    getUser();
  }, []);

  // 3. 로그아웃 기능
  const handleLogout = async () => {
    await supabase.auth.signOut(); // 로그아웃 시키고
    setUser(null); // 내 정보 비우고
    window.location.reload(); // 새로고침해서 화면 갱신!
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        
        {/* 1. 로고 (클릭 시 홈으로) - 모바일 사이즈 50% 축소 적용 */}
        <Link href="/" className="group flex items-center gap-1.5 md:gap-2 transition-opacity hover:opacity-80">
          {/* 아이콘 박스: 모바일 h-6 w-6 (24px) / PC h-9 w-9 (36px) */}
          <div className="flex h-6 w-6 md:h-9 md:w-9 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-sm group-hover:shadow-md transition-all transform group-hover:scale-105">
            <RocketLaunchIcon className="h-3.5 w-3.5 md:h-5 md:w-5 text-white" />
          </div>
          <div className="flex flex-col justify-center">
            {/* 한글명: 모바일 text-xs (12px) / PC text-lg (18px) */}
            <span className="text-xs md:text-lg font-extrabold leading-none text-slate-900 tracking-tight">창업부스터</span>
            {/* 영문명: 모바일 text-[6px] / PC text-[10px] */}
            <span className="text-[6px] md:text-[10px] font-bold text-indigo-600 tracking-widest mt-0.5">STARTUP BOOSTER</span>
          </div>
        </Link>

        {/* 2. 중앙 메뉴 (공란) */}
        <nav className="hidden md:flex items-center gap-8">
        </nav>

        {/* 3. 우측 메뉴 (상황에 따라 바뀜) */}
        <div className="flex items-center gap-3">
          {/* 개발 편의용 관리자 링크 */}
          <Link 
            href="/admin/franchises" 
            className="hidden md:inline-flex text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            관리자 모드
          </Link>

          {/* 🚨 [핵심] 로그인 여부에 따라 버튼 바꾸기 */}
          {user ? (
            // (A) 로그인 했을 때 보여줄 버튼들
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-bold text-slate-600">
                {user.user_metadata.profile_nickname || '사장님'} 반가워요! 👋
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-200 active:scale-95"
              >
                <ArrowRightStartOnRectangleIcon className="h-3 w-3 md:h-4 md:w-4" />
                로그아웃
              </button>
            </div>
          ) : (
            // (B) 로그인 안 했을 때 보여줄 버튼 (기존)
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-95"
            >
              <UserCircleIcon className="h-3 w-3 md:h-4 md:w-4 text-slate-400" />
              간편 로그인
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}