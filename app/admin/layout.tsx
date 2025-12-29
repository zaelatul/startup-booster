'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, PhotoIcon, ChartBarIcon, 
  BuildingStorefrontIcon, WrenchScrewdriverIcon, 
  BookOpenIcon, StarIcon, EnvelopeIcon, ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

// 메뉴 리스트
const MENU = [
  { name: '대시보드', href: '/admin', icon: HomeIcon },
  { name: '성공 사례 관리', href: '/admin/success-cases', icon: StarIcon },
  { name: '프랜차이즈 DB', href: '/admin/franchises', icon: BuildingStorefrontIcon },
  { name: '인기 브랜드', href: '/admin/popular', icon: ChartBarIcon },
  { name: '매거진/콘텐츠', href: '/admin/magazine', icon: BookOpenIcon },
  { name: '배너 관리', href: '/admin/banners', icon: PhotoIcon },
  { name: '상담 문의', href: '/admin/inquiries', icon: EnvelopeIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* 사이드바 */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col fixed h-full z-50 shadow-2xl">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
             <ChartBarIcon className="w-5 h-5" />
             <span className="text-xs font-bold tracking-widest">ADMINISTRATOR</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">창업부스터</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {MENU.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 text-center text-xs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors">
            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            앱으로 돌아가기
          </Link>
        </div>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 ml-64 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}