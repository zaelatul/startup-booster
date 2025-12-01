'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, PhotoIcon, ChartBarIcon, 
  BuildingStorefrontIcon, WrenchScrewdriverIcon, 
  BookOpenIcon, StarIcon, EnvelopeIcon // [추가됨] 편지 아이콘
} from '@heroicons/react/24/outline';

// 메뉴 리스트
const MENU = [
  { name: '대시보드', href: '/admin', icon: HomeIcon },
  { name: '배너 관리', href: '/admin/banners', icon: PhotoIcon },
  { name: '상권 분석', href: '/admin/market', icon: ChartBarIcon },
  { name: '프랜차이즈', href: '/admin/franchises', icon: BuildingStorefrontIcon },
  { name: '성공 사례', href: '/admin/success-cases', icon: StarIcon },
  { name: '인기 브랜드', href: '/admin/popular', icon: StarIcon },
  { name: '매거진', href: '/admin/magazine', icon: BookOpenIcon },
  { name: '인테리어', href: '/admin/interior', icon: WrenchScrewdriverIcon },
  { name: '상담 관리', href: '/admin/inquiries', icon: EnvelopeIcon }, // [추가됨] 여기가 새로 들어간 줄이야!
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* 사이드바 */}
      <aside className="w-64 bg-[#1E293B] text-white flex flex-col fixed h-full z-50">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">창업부스터 ADMIN</h1>
          <p className="text-xs text-slate-400 mt-1">관리자 전용</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {MENU.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Link href="/" className="block w-full py-2 text-center text-xs text-slate-400 hover:text-white border border-slate-600 rounded-lg">
            앱 메인으로 가기
          </Link>
        </div>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}