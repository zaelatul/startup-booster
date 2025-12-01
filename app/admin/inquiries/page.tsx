'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CheckCircleIcon, FunnelIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

type Inquiry = {
  id: string;
  created_at: string;
  source: string;
  customer_name: string;
  contact: string;
  details?: string;
  status: 'pending' | 'done';
};

export default function AdminInquiriesPage() {
  const [list, setList] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState('all');

  const fetchInquiries = async () => {
    // 1. 통합 문의 (메인 페이지)
    const { data: common } = await supabase.from('common_inquiries').select('*');
    // 2. 인테리어 문의
    const { data: interior } = await supabase.from('interior_consultations').select('*');
    // 3. 성공 사례 문의
    const { data: success } = await supabase.from('success_consultations').select('*');

    // 데이터 통합
    const commonList = common?.map(i => ({
      ...i, source: 'main_inquiry', details: `[${i.category}] ${i.content || '-'}`
    })) || [];
    
    const interiorList = interior?.map(i => ({
      ...i, source: 'interior', details: `견적: ${i.width_m}m x ${i.length_m}m`
    })) || [];
    
    const successList = success?.map(i => ({
      ...i, source: 'success_case', details: '성공사례 보고 문의'
    })) || [];

    const combined = [...commonList, ...interiorList, ...successList].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    setList(combined);
  };

  useEffect(() => { fetchInquiries(); }, []);

  // 상태 변경 핸들러
  const handleStatus = async (item: Inquiry) => {
    let table = '';
    if (item.source === 'main_inquiry') table = 'common_inquiries';
    else if (item.source === 'interior') table = 'interior_consultations';
    else table = 'success_consultations';

    await supabase.from(table).update({ status: 'done' }).eq('id', item.id);
    fetchInquiries();
  };

  // 필터링
  const filteredList = filter === 'all' ? list : list.filter(i => i.source === filter);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <EnvelopeIcon className="w-7 h-7 text-indigo-600"/> 통합 상담 관리
          </h2>
          <div className="flex bg-slate-100 p-1 rounded-lg">
             <button onClick={() => setFilter('all')} className={`px-4 py-1.5 text-xs font-bold rounded-md ${filter==='all' ? 'bg-white shadow' : 'text-slate-500'}`}>전체</button>
             <button onClick={() => setFilter('main_inquiry')} className={`px-4 py-1.5 text-xs font-bold rounded-md ${filter==='main_inquiry' ? 'bg-white shadow' : 'text-slate-500'}`}>메인문의</button>
             <button onClick={() => setFilter('interior')} className={`px-4 py-1.5 text-xs font-bold rounded-md ${filter==='interior' ? 'bg-white shadow' : 'text-slate-500'}`}>인테리어</button>
          </div>
       </div>

       <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 text-slate-500 font-bold border-b">
                <tr>
                   <th className="p-4">접수일</th>
                   <th className="p-4">구분</th>
                   <th className="p-4">고객명/연락처</th>
                   <th className="p-4">내용</th>
                   <th className="p-4 text-center">상태</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {filteredList.length === 0 ? (
                   <tr><td colSpan={5} className="p-10 text-center text-slate-400">문의 내역이 없습니다.</td></tr>
                ) : (
                   filteredList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                         <td className="p-4 text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString()}</td>
                         <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                               item.source === 'main_inquiry' ? 'bg-indigo-100 text-indigo-600' : 
                               item.source === 'interior' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                               {item.source === 'main_inquiry' ? '통합상담' : item.source === 'interior' ? '인테리어' : '성공사례'}
                            </span>
                         </td>
                         <td className="p-4">
                            <p className="font-bold text-slate-900">{item.customer_name}</p>
                            <p className="text-xs text-slate-500">{item.contact}</p>
                         </td>
                         <td className="p-4 text-slate-600 truncate max-w-xs">{item.details}</td>
                         <td className="p-4 text-center">
                            {item.status === 'done' ? (
                               <span className="text-emerald-500 font-bold text-xs flex items-center justify-center gap-1"><CheckCircleIcon className="w-4 h-4"/> 완료</span>
                            ) : (
                               <button onClick={() => handleStatus(item)} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-700">
                                  처리
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