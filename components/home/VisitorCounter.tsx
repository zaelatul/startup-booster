'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { SparklesIcon } from '@heroicons/react/24/solid';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const initVisitor = async () => {
      const currentMonth = new Date().toISOString().slice(0, 7); 

      await supabase.rpc('increment_visitor_count', { target_month: currentMonth });

      const { data } = await supabase
        .from('visitor_stats')
        .select('base_count, real_count')
        .eq('month_key', currentMonth)
        .maybeSingle();

      if (data) {
        setCount(data.base_count + data.real_count);
      }
    };

    initVisitor();
  }, []);

  if (count === null) return null;

  return (
    // ✅ [수정 1] scale-90 (90% 크기), top-3 right-3 (여백 확보)
    // ✅ PC 위치도 md:top-5 md:right-5로 자연스럽게 조정
    <div className="absolute top-3 right-3 md:top-5 md:right-5 z-50 animate-fade-in scale-90 md:scale-100 origin-top-right">
      <div className="relative group">
        <div className="absolute inset-0 bg-slate-500 blur-md opacity-20 rounded-full group-hover:opacity-30 transition-opacity"></div>
        <div className="relative flex items-center gap-1.5 md:gap-3 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border border-slate-600/50 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
          
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]"></div>
            <span className="text-[9px] md:text-[10px] font-bold text-slate-400 tracking-widest">Monthly Visitors</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-sm md:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-sm font-mono tracking-tight">
              {count.toLocaleString()}
            </span>
            <SparklesIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-400/80" />
          </div>
        </div>
      </div>
    </div>
  );
}