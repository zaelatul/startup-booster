'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function RecentViews() {
  const [history, setHistory] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = JSON.parse(localStorage.getItem('recent_views') || '[]');
    setHistory(saved);
  }, []);

  const removeHistory = (e: any, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newHistory = history.filter((h) => h.id !== targetId);
    setHistory(newHistory);
    localStorage.setItem('recent_views', JSON.stringify(newHistory));
  };

  if (!mounted || history.length === 0) return null;

  return (
    <section>
      {/* 👇 [수정] 제목 마진과 아이콘 크기를 줄였습니다. */}
      <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-1.5 px-1">
        <ClockIcon className="w-4 h-4 text-indigo-600" />
        최근 본 창업 사례
      </h2>
      
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {history.map((item) => (
          <Link 
            key={item.id} 
            href={item.url}
            // 👇 [수정] w-40 -> w-28로 너비를 확 줄였습니다.
            className="flex-shrink-0 w-28 group relative"
          >
            <div className="aspect-square rounded-xl overflow-hidden mb-1.5 border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
              <img src={item.image} alt={item.brand} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <button 
                onClick={(e) => removeHistory(e, item.id)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </div>
            <div className="text-center px-1">
              {/* 👇 [수정] 폰트 크기를 한 단계씩 줄였습니다. */}
              <p className="text-xs font-bold text-slate-900 truncate">{item.brand}</p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.branch}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}