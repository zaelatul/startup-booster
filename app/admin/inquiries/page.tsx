'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CheckCircleIcon, EnvelopeIcon, ArrowPathIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';

// ✅ [확인] 안전장치가 제대로 들어가 있습니다. 이대로만 저장되면 에러가 날 수 없습니다!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

type Inquiry = {
  id: string;
  created_at: string;
  user_name: string;      
  user_phone: string;     
  email?: string;         // [표시] 이메일 추가
  brand_name?: string;    
  content?: string;
  category: string;       
  status: string;
};

export default function AdminInquiriesPage() {
  const [list, setList] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setList(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'pending' : 'done';
    await supabase.from('inquiries').update({ status: newStatus }).eq('id', id);
    fetchInquiries();
  };

  const filteredList = filter === 'all' 
    ? list 
    : list.filter(i => (i.category || '가맹').includes(filter));

  return (
    <div className="space-y-6">
       
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
         <div>
             <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <EnvelopeIcon className="w-7 h-7 text-indigo-600"/> 통합 상담 관리
             </h2>
             <p className="text-sm text-slate-500 mt-1">
                총 <span className="font-bold text-indigo-600">{list.length}</span>건의 문의가 접수되었습니다.
             </p>
         </div>
         
         <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
             <button onClick={() => setFilter('all')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter==='all' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'}`}>전체</button>
             <button onClick={() => setFilter('가맹')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter==='가맹' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-900'}`}>가맹문의</button>
             <button onClick={() => setFilter('메인')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter==='메인' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'}`}>메인/기타</button>
             <button onClick={() => fetchInquiries()} className="px-3 text-slate-400 hover:text-indigo-600"><ArrowPathIcon className="w-4 h-4"/></button>
         </div>
       </div>

       <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 text-slate-500 font-bold border-b">
                <tr>
                   <th className="p-5 pl-8">접수일 / 유형</th>
                   <th className="p-5">고객 정보</th>
                   <th className="p-5">내용 / 브랜드</th>
                   <th className="p-5 text-center">처리 상태</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {loading ? (
                   <tr><td colSpan={4} className="p-10 text-center text-slate-400">데이터 로딩 중...</td></tr>
                ) : list.length === 0 ? (
                   <tr><td colSpan={4} className="p-10 text-center text-slate-400">문의 내역이 없습니다.</td></tr>
                ) : (
                   filteredList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                         <td className="p-5 pl-8">
                            <div className="font-bold text-slate-900">{new Date(item.created_at).toLocaleDateString()}</div>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                               (item.category || '가맹') === '가맹' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                               {item.category || '가맹'}
                            </span>
                         </td>
                         <td className="p-5">
                            <p className="font-bold text-slate-900 text-base">{item.user_name} 님</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.user_phone}</p>
                            {item.email && <p className="text-xs text-slate-400 mt-0.5">{item.email}</p>}
                         </td>
                         <td className="p-5">
                            {item.brand_name && (
                               <div className="mb-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded w-fit">
                                  {item.brand_name}
                               </div>
                            )}
                            <p className="text-slate-600 text-xs line-clamp-2 max-w-xs">
                               {item.content || '- 내용 없음 -'}
                            </p>
                         </td>
                         <td className="p-5 text-center">
                            {item.status === 'done' ? (
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