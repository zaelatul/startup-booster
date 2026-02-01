'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
// ✅ [수정] SaveIcon 삭제 -> CheckIcon으로 변경 (Heroicons v2에는 SaveIcon이 없음)
import { CheckIcon, CalculatorIcon } from '@heroicons/react/24/solid';

export default function VisitorAdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ base: 0, real: 0 });
  const [inputBase, setInputBase] = useState(0);

  // ✅ [수정] createBrowserClient를 컴포넌트 밖으로 빼거나 useMemo를 써야 하지만,
  // 일단 에러 해결을 위해 유지하되, 기능상 문제는 없습니다.
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const currentMonth = new Date().toISOString().slice(0, 7); // "2026-01"

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data } = await supabase
      .from('visitor_stats')
      .select('*')
      .eq('month_key', currentMonth)
      .maybeSingle();

    if (data) {
      setStats({ base: data.base_count, real: data.real_count });
      setInputBase(data.base_count);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('visitor_stats')
      .update({ base_count: inputBase })
      .eq('month_key', currentMonth);

    if (error) alert('저장 실패: ' + error.message);
    else {
      alert('저장되었습니다! 메인페이지에 반영됩니다.');
      fetchStats();
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><CalculatorIcon className="w-8 h-8"/></div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">방문자 수 관리</h2>
          <p className="text-slate-500 text-sm">이번 달({currentMonth}) 방문자 통계를 설정합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. 실제 방문자 (자동 집계) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-bold text-sm mb-2">🤖 실제 접속자 (자동 집계)</h3>
          <p className="text-4xl font-black text-slate-900">{stats.real.toLocaleString()}명</p>
        </div>

        {/* 2. 관리자 설정값 (기본값) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-bold text-sm mb-2">🔧 기본 설정값 (조작용)</h3>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={inputBase} 
              onChange={(e) => setInputBase(Number(e.target.value))}
              className="w-full p-3 border border-slate-300 rounded-xl font-bold text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button onClick={handleSave} className="bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center">
              {/* ✅ [수정] 여기서 CheckIcon 사용 */}
              <CheckIcon className="w-6 h-6" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">* 이 숫자에 실제 접속자가 더해집니다.</p>
        </div>

        {/* 3. 최종 노출값 */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg shadow-slate-900/20">
          <h3 className="text-slate-400 font-bold text-sm mb-2">📢 메인 노출 (최종)</h3>
          <p className="text-4xl font-black text-emerald-400">{(stats.base + stats.real).toLocaleString()}명</p>
          <p className="text-xs text-slate-500 mt-2">이 숫자가 고객에게 보입니다.</p>
        </div>
      </div>
    </div>
  );
}