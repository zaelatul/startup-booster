'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RocketLaunchIcon, UserCircleIcon, Bars3Icon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function HeaderMain() {
  const pathname = usePathname(); // 현재 내가 어디 페이지에 있는지 확인
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 메뉴 리스트 (경로와 이름 정의)
  const navItems = [
    { name: '상권분석', href: '/market' },
    { name: '프랜차이즈', href: '/franchise/explore' },
    { name: '셀프 인테리어', href: '/interior' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        
        {/* 1. 로고 (홈으로) */}
        <Link href="/" className="group flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-sm group-hover:shadow-md transition-all transform group-hover:scale-105">
            <RocketLaunchIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-lg font-extrabold leading-none text-slate-900 tracking-tight">창업부스터</span>
            <span className="text-[10px] font-bold text-indigo-600 tracking-widest mt-0.5">STARTUP BOOSTER</span>
          </div>
        </Link>

        {/* 2. PC 메뉴 (중앙) */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-bold transition-colors ${
                pathname.startsWith(item.href) 
                  ? 'text-indigo-600' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 3. 우측 버튼 (로그인 등) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-95"
            onClick={() => alert('로그인 기능 준비 중입니다!')}
          >
            <UserCircleIcon className="h-4 w-4 text-slate-400" />
            간편 로그인
          </button>
          {/* 모바일 메뉴 버튼 */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-sm font-bold text-slate-600 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}