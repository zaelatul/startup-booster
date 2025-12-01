'use client';

import Link from 'next/link';
import { RocketLaunchIcon, UserCircleIcon } from '@heroicons/react/24/solid';

export default function HeaderMain() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        {/* 1. 로고 영역 (클릭 시 홈으로 이동) */}
        <Link 
          href="/" 
          className="group flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-sm group-hover:shadow-md transition-all transform group-hover:scale-105">
            <RocketLaunchIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-lg font-extrabold leading-none text-slate-900 tracking-tight">
              창업부스터
            </span>
            <span className="text-[10px] font-bold text-indigo-600 tracking-widest mt-0.5">
              STARTUP BOOSTER
            </span>
          </div>
        </Link>

        {/* 2. 우측 메뉴 */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            className="hidden rounded-full px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 sm:inline-block"
            onClick={() => alert('서비스 소개 페이지 준비 중입니다.')}
          >
            서비스 소개
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-95"
            onClick={() => alert('로그인 기능 연동 준비 중입니다.')}
          >
            <UserCircleIcon className="h-4 w-4 text-slate-400" />
            간편 로그인
          </button>
        </div>
      </div>
    </header>
  );
}