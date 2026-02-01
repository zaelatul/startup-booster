'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 1. 라우터(페이지 이동) 도구 가져오기
import { createClient } from '@supabase/supabase-js';
import { 
  UserGroupIcon, DocumentTextIcon, 
  ArrowTrendingUpIcon, BuildingStorefrontIcon,
  ArrowLeftOnRectangleIcon // 2. 로그아웃 아이콘 가져오기
} from '@heroicons/react/24/solid';

// Supabase 클라이언트 설정
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const router = useRouter(); // 3. 라우터 사용 준비
  
  // 통계 상태 관리
  const [stats, setStats] = useState({
    brands: 0,
    cases: 0,
    magazines: 0
  });

  // 데이터 불러오기
  useEffect(() => {
    async function fetchStats() {
      const { count: brandCount } = await supabase.from('franchises').select('*', { count: 'exact', head: true });
      const { count: caseCount } = await supabase.from('success_cases').select('*', { count: 'exact', head: true });
      const { count: magCount } = await supabase.from('magazines').select('*', { count: 'exact', head: true });

      setStats({
        brands: brandCount || 0,
        cases: caseCount || 0,
        magazines: magCount || 0
      });
    }
    fetchStats();
  }, []);
  
  // 4. [핵심] 로그아웃 기능 함수
  const handleLogout = async () => {
    try {
      // 아까 만든 쿠키 삭제 API 부르기
      await fetch('/api/admin-logout', { method: 'POST' }); 
      
      // 로그인 페이지로 쫓아내고 새로고침!
      router.push('/admin/login');
      router.refresh(); 
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const todayVisitors = 1204;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* 상단 헤더 영역 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">관리자 대시보드</h2>
        
        <div className="flex items-center gap-3">
            {/* 날짜 표시 */}
            <span className="text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border shadow-sm">
              {new Date().toLocaleDateString()} 기준
            </span>
            
            {/* 🔥 5. 여기에 진짜 작동하는 로그아웃 버튼 추가! */}
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-bold transition-colors border border-red-100 shadow-sm"
            >
                <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                로그아웃
            </button>
        </div>
      </div>

      {/* 통계 카드 그리드 (기존 코드 유지) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="총 방문자 수" 
          value={`${todayVisitors.toLocaleString()}명`} 
          trend="+12%" 
          icon={UserGroupIcon} 
          color="indigo" 
        />
        <StatCard 
          title="등록 프랜차이즈" 
          value={`${stats.brands.toLocaleString()}개`} 
          trend="Realtime" 
          icon={BuildingStorefrontIcon} 
          color="blue" 
        />
        <StatCard 
          title="성공 사례 데이터" 
          value={`${stats.cases.toLocaleString()}건`} 
          trend="Realtime" 
          icon={ArrowTrendingUpIcon} 
          color="emerald" 
        />
        <StatCard 
          title="매거진 콘텐츠" 
          value={`${stats.magazines}개`} 
          trend="Realtime" 
          icon={DocumentTextIcon} 
          color="purple" 
        />
      </div>

      {/* 하단 바로가기 영역 (기존 코드 유지) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">📢 시스템 상태</h3>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-start gap-4">
             <div className="p-3 bg-white rounded-full text-2xl shadow-sm">✅</div>
             <div>
                <p className="font-bold text-emerald-900 text-lg">모든 서비스가 정상 운영 중입니다.</p>
                <p className="text-emerald-700 text-sm mt-1">
                   현재 Supabase DB와 정상적으로 연동되어<br/>
                   실시간 데이터를 서빙하고 있습니다.
                </p>
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-900 mb-4">🚀 빠른 바로가기</h3>
           <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-left transition-colors group">
                 <span className="block text-xs font-bold text-slate-400 mb-1">상담 관리</span>
                 <span className="font-bold text-slate-700 group-hover:text-indigo-600">미답변 문의 확인 &rarr;</span>
              </button>
              <button className="p-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-left transition-colors group">
                 <span className="block text-xs font-bold text-slate-400 mb-1">콘텐츠</span>
                 <span className="font-bold text-slate-700 group-hover:text-indigo-600">새 매거진 글쓰기 &rarr;</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

// 통계 카드 UI (기존 코드 유지)
function StatCard({ title, value, trend, icon: Icon, color }: any) {
  const colors: any = {
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${colors[color]}`}>{trend}</span>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-extrabold text-slate-900 mt-1">{value}</p>
    </div>
  );
}