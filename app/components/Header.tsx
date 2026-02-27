'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Bell } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 공지사항 문구 - 나중에 어드민 연동 전까지 여기서 직접 수정 가능합니다.
  const noticeText = "🚀 창업부스터 업데이트 안내: 이제 프랜차이즈 실제 성공사례 데이터를 모바일에서도 상세히 분석할 수 있습니다!";

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] shadow-sm">
      {/* 1. 상단 화이트 헤더 영역 */}
      <div className="bg-white border-b border-gray-100 h-14 md:h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          
          {/* 로고 영역 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-gray-200">
              <Image 
                src="/images/logo.jpg" 
                alt="창업부스터 로고" 
                fill 
                className="object-cover"
              />
            </div>
            <span className="text-base md:text-xl font-black text-slate-900 tracking-tighter">
              창업부스터
            </span>
          </Link>

          {/* 데스크탑 메뉴 */}
          <nav className="hidden md:flex gap-8 font-bold text-sm text-slate-600">
            <Link href="/analysis" className="hover:text-indigo-600">상권분석</Link>
            <Link href="/franchise" className="hover:text-indigo-600">프랜차이즈</Link>
            <Link href="/interior" className="hover:text-indigo-600">셀프인테리어</Link>
            <Link href="/magazine" className="hover:text-indigo-600">창업매거진</Link>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <div className="flex items-center gap-2 md:hidden">
            <button className="p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. [핵심] 헤더 바로 아래 얇은 공지사항 띠 (1번 방식) */}
      <div className="bg-indigo-600 text-white h-7 md:h-8 flex items-center overflow-hidden border-b border-indigo-700/50">
        <div className="flex items-center gap-1.5 px-3 shrink-0 bg-indigo-700 h-full z-10 shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
          <Bell size={12} className="animate-bounce" />
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Notice</span>
        </div>
        
        {/* 무한 흐르는 텍스트 */}
        <div className="relative flex-1 flex items-center overflow-hidden">
          <div className="whitespace-nowrap flex items-center animate-marquee">
            <span className="text-[10px] md:text-xs font-bold px-4">{noticeText}</span>
            <span className="text-[10px] md:text-xs font-bold px-4">{noticeText}</span>
            <span className="text-[10px] md:text-xs font-bold px-4">{noticeText}</span>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 펼침 화면 */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[84px] md:top-[96px] left-0 right-0 bg-white p-6 flex flex-col gap-5 shadow-2xl animate-in slide-in-from-top duration-300">
          <Link href="/analysis" className="text-slate-900 font-black text-lg" onClick={() => setIsMenuOpen(false)}>상권분석</Link>
          <Link href="/franchise" className="text-slate-900 font-black text-lg" onClick={() => setIsMenuOpen(false)}>프랜차이즈</Link>
          <Link href="/interior" className="text-slate-900 font-black text-lg" onClick={() => setIsMenuOpen(false)}>셀프인테리어</Link>
          <Link href="/magazine" className="text-slate-900 font-black text-lg" onClick={() => setIsMenuOpen(false)}>창업매거진</Link>
        </div>
      )}

      {/* 애니메이션 스타일 */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </header>
  );
}