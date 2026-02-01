'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // ✅ [필수] 이미지 기능 추가
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
// ❌ RocketLaunchIcon 삭제 (더 이상 안 씀)
import { UserCircleIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';

export default function HeaderMain() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null); 

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut(); 
    setUser(null); 
    window.location.reload(); 
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        
        {/* 1. 로고 영역 수정됨 (아이콘 -> 이미지) */}
        <Link href="/" className="group flex items-center gap-2 transition-opacity hover:opacity-80">
          
          {/* ✅ [수정] 로켓 아이콘 삭제하고 이미지(logo.jpg)로 교체 */}
          <div className="relative h-8 w-8 md:h-10 md:w-10 shrink-0 overflow-hidden rounded-full border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
            <Image 
              src="/images/logo.jpg" // ⚠️ 저장하신 파일명과 경로가 정확해야 합니다!
              alt="창업부스터 로고"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xs md:text-lg font-extrabold leading-none text-slate-900 tracking-tight">창업부스터</span>
            <span className="text-[6px] md:text-[10px] font-bold text-indigo-600 tracking-widest mt-0.5">STARTUP BOOSTER</span>
          </div>
        </Link>

        {/* 2. 중앙 메뉴 (공란) */}
        <nav className="hidden md:flex items-center gap-8">
        </nav>

        {/* 3. 우측 메뉴 */}
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/franchises" 
            className="hidden md:inline-flex text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            관리자 모드
          </Link>

          {user ? (
            // (A) 로그인 했을 때
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
            // (B) 로그인 안 했을 때
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