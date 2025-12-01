'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon, ServerIcon, MapIcon } from '@heroicons/react/24/solid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SystemLog = {
  id: string;
  created_at: string;
  status: 'success' | 'fail';
  message: string;
  synced_by: string;
};

export default function AdminMarketPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [stats, setStats] = useState({ totalRegions: 0, lastUpdated: '-' });

  // 로그 및 통계 불러오기 (가상 데이터)
  useEffect(() => {
    fetchLogs();
    // 실제로는 DB에서 카운트 조회
    setStats({ totalRegions: 1254, lastUpdated: new Date().toLocaleDateString() });
  }, []);

  const fetchLogs = async () => {
    const { data } = await supabase.from('market_system_logs').select('*').order('created_at', { ascending: false }).limit(10);
    if (data) setLogs(data);
  };

  // 수동 동기화 (시뮬레이션)
  const handleSync = async () => {
    setIsSyncing(true);
    
    // 3초간 로딩 흉내 (나중에 실제 API 호출로 교체)
    setTimeout(async () => {
      await supabase.from('market_system_logs').insert([{
        status: 'success',
        message: '상권 데이터 1,254건 업데이트 완료 (수동 실행)',
        synced_by: 'admin'
      }]);
      
      setIsSyncing(false);
      fetchLogs();
      setStats(prev => ({ ...prev, lastUpdated: new Date().toLocaleTimeString() }));
      alert('동기화가 완료되었습니다.');
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">상권 데이터 관리</h2>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all ${
            isSyncing ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg active:scale-95'
          }`}
        >
          <ArrowPathIcon className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? '데이터 동기화 중...' : '최신 데이터 동기화'}
        </button>
      </div>

      {/* 현황 대시보드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-full text-blue-600"><MapIcon className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-slate-500 font-bold">총 분석 지역</p>
            <p className="text-3xl font-extrabold text-slate-900">{stats.totalRegions.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 rounded-full text-emerald-600"><ServerIcon className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-slate-500 font-bold">API 상태</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-lg font-bold text-emerald-600">정상 가동 중</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-slate-50 rounded-full text-slate-600"><ArrowPathIcon className="w-8 h-8" /></div>
          <div>
            <p className="text-sm text-slate-500 font-bold">마지막 업데이트</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{stats.lastUpdated}</p>
          </div>
        </div>
      </div>

      {/* 시스템 로그 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-700">시스템 동기화 로그</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">아직 로그가 없습니다. 동기화 버튼을 눌러보세요.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  {log.status === 'success' ? (
                    <CheckCircleIcon className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <XCircleIcon className="w-6 h-6 text-rose-500" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-800">{log.message}</p>
                    <p className="text-xs text-slate-400">{new Date(log.created_at).toLocaleString()} · {log.synced_by === 'admin' ? '관리자 수동 실행' : '자동 스케줄러'}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {log.status.toUpperCase()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}