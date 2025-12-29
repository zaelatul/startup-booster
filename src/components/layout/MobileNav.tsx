'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  HeartIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolid, 
  MagnifyingGlassIcon as MagnifyingGlassSolid, 
  HeartIcon as HeartSolid, 
  UserIcon as UserSolid 
} from '@heroicons/react/24/solid';

export default function MobileNav() {
  const pathname = usePathname();

  const menus = [
    { name: '홈', href: '/', icon: HomeIcon, activeIcon: HomeSolid },
    { name: '찾기', href: '/franchise/explore', icon: MagnifyingGlassIcon, activeIcon: MagnifyingGlassSolid },
    { name: '찜', href: '/saved', icon: HeartIcon, activeIcon: HeartSolid }, // 찜 페이지 (없으면 만들어야 함)
    { name: '마이', href: '/mypage', icon: UserIcon, activeIcon: UserSolid }, // 마이 페이지 (없으면 만들어야 함)
  ];

  return (
    // PC에서는 숨기고(md:hidden), 모바일에서만 하단 고정(fixed bottom-0)
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 pb-safe z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {menus.map((menu) => {
          // 현재 주소와 메뉴 주소가 일치하면 활성화 (홈은 정확히 일치, 나머지는 포함)
          const isActive = menu.href === '/' 
            ? pathname === '/' 
            : pathname?.startsWith(menu.href);
            
          const Icon = isActive ? menu.activeIcon : menu.icon;

          return (
            <Link 
              key={menu.name} 
              href={menu.href} 
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{menu.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}