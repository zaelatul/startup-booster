'use client';

import Link from 'next/link';
import Image from 'next/image'; 
import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function HeaderMain() {
  return (
    // ✅ 배경을 살짝 투명한 흰색(bg-white/90)으로 해서 로고가 잘 보이게 함
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        
        {/* ✅ [수정 완료] 로켓 이모지 🚀 삭제 -> Image 컴포넌트로 교체 */}
        <Link href="/" className="flex items-center gap-2.5 group">
           <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
             {/* 👇 저장하신 파일명(logo.jpg)과 경로가 정확합니다 */}
             <Image 
               src="/images/logo.jpg" 
               alt="창업부스터 로고"
               fill
               className="object-cover"
             />
           </div>
           <span className="text-xl font-extrabold text-slate-900 tracking-tight">창업부스터</span>
        </Link>

        {/* 메뉴 영역 */}
        <div className="flex items-center gap-3">
          <Link href="/admin/franchises" className="hidden md:block text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg">
            관리자 모드
          </Link>

          <Link
            href="/login" 
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <UserCircleIcon className="h-4 w-4 text-white/90" />
            <span>사장님 로그인</span>
          </Link>
        </div>

      </div>
    </header>
  );
}