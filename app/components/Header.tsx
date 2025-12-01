'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* 로고 영역 수정: 로고 + 텍스트 */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
            {/* 1단계에서 저장한 이미지 경로입니다 */}
            <Image 
              src="/images/logo.jpg" 
              alt="창업부스터 로고" 
              fill 
              className="object-cover"
            />
          </div>
          <span className="text-xl font-bold text-slate-900">
            창업부스터
          </span>
        </Link>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden md:flex gap-8">
          <Link href="/analysis" className="text-gray-600 hover:text-blue-600 font-medium">상권분석</Link>
          <Link href="/franchise" className="text-gray-600 hover:text-blue-600 font-medium">프랜차이즈</Link>
          <Link href="/interior" className="text-gray-600 hover:text-blue-600 font-medium">셀프인테리어</Link>
          <Link href="/magazine" className="text-gray-600 hover:text-blue-600 font-medium">창업매거진</Link>
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-lg">
          <Link href="/analysis" className="text-gray-600 p-2">상권분석</Link>
          <Link href="/franchise" className="text-gray-600 p-2">프랜차이즈</Link>
          <Link href="/interior" className="text-gray-600 p-2">셀프인테리어</Link>
          <Link href="/magazine" className="text-gray-600 p-2">창업매거진</Link>
        </div>
      )}
    </header>
  );
}