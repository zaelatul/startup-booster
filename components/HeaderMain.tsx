'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { createBrowserClient } from '@supabase/ssr';
import { UserCircleIcon, ArrowRightStartOnRectangleIcon, BellIcon } from '@heroicons/react/24/solid';

export default function HeaderMain() {
  const [user, setUser] = useState<any>(null); 
  const [notices, setNotices] = useState<any[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  );

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser(user);

      const { data } = await supabase
        .from('header_notices')
        .select('content')
        .eq('is_active', true)
        .order('priority', { ascending: true });
      if (data) setNotices(data);
    };
    init();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut(); 
    setUser(null); 
    window.location.reload(); 
  };

  return (
    <header className="sticky top-0 z-[100] w-full shadow-sm">
      {/* 1. 메인 헤더 (로고 & 유저) */}
      <div className="border-b border-slate-100 bg-white h-14 md:h-16 flex items-center">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex-1 flex items-center gap-2">
            <div className="relative h-8 w-8 md:h-10 md:w-10 shrink-0 overflow-hidden rounded-full border border-slate-100 shadow-sm">
              <Image src="/images/logo.jpg" alt="로고" fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs md:text-lg font-black leading-none text-slate-900 tracking-tighter">창업부스터</span>
              <span className="text-[6px] md:text-[10px] font-bold text-indigo-600 tracking-widest mt-0.5 uppercase">Startup Booster</span>
            </div>
          </Link>

          {/* 데스크탑 전용 공지 (기본 유지) */}
          <div className="hidden md:flex flex-[1.5] justify-center h-full items-center relative overflow-hidden px-10">
            <div className="flex whitespace-nowrap group">
              <div className="flex animate-marquee-loop group-hover:pause">
                {notices.map((n, i) => (
                  <div key={`n1-${i}`} className="flex items-center px-10">
                    <span className="h-1 w-1 rounded-full bg-emerald-500 mr-2 shrink-0" />
                    <span className="text-[12px] font-bold text-slate-500 tracking-tight">{n.content}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end gap-3">
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-[10px] md:text-xs font-bold text-slate-500">
                <ArrowRightStartOnRectangleIcon className="h-3 w-3 md:h-4 md:w-4" /> 로그아웃
              </button>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] md:text-xs font-bold text-slate-700 shadow-sm">
                <UserCircleIcon className="h-3 w-3 md:h-4 md:w-4 text-slate-300" /> 간편 로그인
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. ✅ 모바일 전용 NEWS 띠 (요청사항 반영 버전) */}
      <div className="md:hidden bg-white h-7 flex items-center overflow-hidden border-b border-slate-100">
        <div className="flex items-center gap-1 px-3 shrink-0 bg-white h-full z-10 border-r border-slate-50">
          {/* 고급스러운 초록색 종 로고 (emerald-500) */}
          <BellIcon className="w-3 h-3 text-emerald-500 animate-bounce" />
          <span className="text-[9px] font-black text-slate-900 tracking-tighter uppercase">NEWS</span>
        </div>
        
        <div className="relative flex-1 flex items-center overflow-hidden">
          <div className="whitespace-nowrap flex items-center animate-marquee-mobile">
            {notices.map((n, i) => (
              <span key={`m-n-${i}`} className="text-[10px] font-bold text-slate-600 px-4 tracking-tight">
                {n.content}
              </span>
            ))}
            {/* 무한 흐름을 위한 반복 */}
            {notices.map((n, i) => (
              <span key={`m-n-d-${i}`} className="text-[10px] font-bold text-slate-600 px-4 tracking-tight" aria-hidden="true">
                {n.content}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-marquee-loop { display: flex; animation: marquee 40s linear infinite; }
        .animate-marquee-mobile { display: inline-flex; animation: marquee-m 20s linear infinite; }
        .pause { animation-play-state: paused; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        @keyframes marquee-m { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </header>
  );
}