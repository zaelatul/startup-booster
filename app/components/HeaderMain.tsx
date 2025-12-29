'use client';

import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function HeaderMain() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
           <span className="text-lg">🚀</span>
           <span className="text-lg font-extrabold text-slate-900">창업부스터</span>
        </Link>

        {/* 메뉴 */}
        <div className="flex items-center gap-3">
          <Link href="/admin/franchises" className="text-xs font-bold text-slate-400">관리자</Link>

          {/* 👇 [테스트] 버튼을 아주 눈에 띄는 빨간색으로 바꿨습니다 👇 */}
          <Link
            href="/login" 
            className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white hover:bg-red-500 transition-all shadow-lg"
          >
            <UserCircleIcon className="h-5 w-5 text-white" />
            <span>찾았다! 내 파일!</span>
          </Link>
        </div>

      </div>
    </header>
  );
}