'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CheckCircleIcon, EnvelopeIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Inquiry = {
  id: string;
  created_at: string;
  name: string;
  contact: string;
  email?: string;
  category: string;      // 문의 유형 (메인, 성공사례 등)
  target_brand?: string; // 관심 브랜드
  status: string;        // '대기중' | '상담완료'
};

export default function AdminInquiriesPage() {
  const [list, setList] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // 데이터 불러오기 (통합 테이블 inquiries 조회)
  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inquiries:', error);
    } else {
      setList(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchInquiries(); }, []);

  // 상태 변경 (대기중 -> 상담완료)
  const handleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === '대기중' ? '상담완료' : '대기중';
    await supabase.from('inquiries').update({ status: newStatus }).eq('id', id);
    fetchInquiries(); // 목록 갱신
  };

  // 필터링 로직
  const filteredList = filter === 'all' 
    ? list 
    : list.filter(i => i.category.includes(filter));

  return (
    <div className="space-y-6">
       
       {/* 헤더 & 필터 */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <EnvelopeIcon className="w-7 h-7 text-indigo-600"/> 통합 상담 관리
             </h2>
             <p className="text-sm text-slate-500 mt-1">
                총 <span className="font-bold text-indigo-600">{list.length}</span>건의 문의가 접수되었습니다.
             </p>
          </div>
          
          <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
             <button onClick={() => setFilter('all')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter==='all' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>전체</button>
             <button onClick={() => setFilter('메인')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter==='메인' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>메인문의</button>
             <button onClick={() => setFilter('성공사례')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter==='성공사례' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}>성공사례</button>
             <button onClick={() => fetchInquiries()} className="px-3 text-slate-400 hover:text-indigo-600"><ArrowPathIcon className="w-4 h-4"/></button>
          </div>
       </div>

       {/* 테이블 */}
       <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 text-slate-500 font-bold border-b">
                <tr>
                   <th className="p-5 pl-8">접수일 / 유형</th>
                   <th className="p-5">고객 정보</th>
                   <th className="p-5">관심 브랜드 / 내용</th>
                   <th className="p-5 text-center">처리 상태</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {loading ? (
                   <tr><td colSpan={4} className="p-10 text-center text-slate-400">데이터 로딩 중...</td></tr>
                ) : filteredList.length === 0 ? (
                   <tr><td colSpan={4} className="p-10 text-center text-slate-400">문의 내역이 없습니다.</td></tr>
                ) : (
                   filteredList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                         <td className="p-5 pl-8">
                            <div className="font-bold text-slate-900">{new Date(item.created_at).toLocaleDateString()}</div>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                               item.category.includes('메인') ? 'bg-slate-100 text-slate-600' : 
                               item.category.includes('성공') ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                               {item.category}
                            </span>
                         </td>
                         <td className="p-5">
                            <p className="font-bold text-slate-900 text-base">{item.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.contact}</p>
                            {item.email && <p className="text-xs text-slate-400">{item.email}</p>}
                         </td>
                         <td className="p-5">
                            {item.target_brand ? (
                               <p className="text-indigo-600 font-bold bg-indigo-50 inline-block px-2 py-1 rounded text-xs">
                                  {item.target_brand}
                               </p>
                            ) : (
                               <span className="text-slate-400 text-xs">-</span>
                            )}
                         </td>
                         <td className="p-5 text-center">
                            {item.status === '상담완료' ? (
                               <button onClick={() => handleStatus(item.id, item.status)} className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
                                  <CheckCircleIcon className="w-4 h-4"/> 상담완료
                               </button>
                            ) : (
                               <button onClick={() => handleStatus(item.id, item.status)} className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-700 shadow-sm transition-all active:scale-95">
                                  대기중 (처리)
                               </button>
                            )}
                         </td>
                      </tr>
                   ))
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
}