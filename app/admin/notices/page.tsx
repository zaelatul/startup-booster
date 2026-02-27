'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { PlusIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function NoticeAdmin() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ [수정] 행님의 스타일대로 기본값을 제공하여 빌드 에러를 방지합니다.
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  );

  const fetchNotices = async () => {
    setLoading(true);
    const { data } = await supabase.from('header_notices').select('*').order('priority', { ascending: true });
    if (data) setNotices(data);
    setLoading(false);
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleAdd = async () => {
    const { error } = await supabase.from('header_notices').insert([{ content: '새 공지사항', priority: 99 }]);
    if (error) alert("에러: " + error.message);
    else await fetchNotices();
  };

  const handleUpdate = async (id: number) => {
    const item = notices.find(n => n.id === id);
    if (!item) return;

    const { error } = await supabase
      .from('header_notices')
      .update({ content: item.content, priority: Number(item.priority) })
      .eq('id', id);

    if (error) alert("에러: " + error.message);
    else {
      alert("✅ 반영 완료!");
      await fetchNotices();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('삭제할까요?')) return;
    const { error } = await supabase.from('header_notices').delete().eq('id', id);
    if (error) alert("에러: " + error.message);
    else await fetchNotices();
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">동기화 중...</div>;

  return (
    <div className="max-w-5xl mx-auto p-10 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">헤더 공지 관리</h1>
          <p className="text-slate-500 font-medium mt-2 text-sm">수정 후 [업데이트] 버튼을 눌러야 실제 사이트에 반영됩니다.</p>
        </div>
        <button 
          onClick={handleAdd} 
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <PlusIcon className="w-5 h-5 inline-block mr-1" /> 신규 추가
        </button>
      </div>

      <div className="space-y-4">
        {notices.map((n) => (
          <div key={n.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center gap-4 shadow-sm hover:border-indigo-300 transition-all">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black text-slate-400 uppercase">순위</span>
              <input 
                type="number" 
                value={n.priority} 
                onChange={e => setNotices(notices.map(x => x.id === n.id ? {...x, priority: e.target.value} : x))}
                className="w-16 border border-slate-200 bg-slate-50 rounded-xl p-2 text-center font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="flex-1 w-full">
              <span className="text-[10px] font-black text-slate-400 uppercase mb-1 block">공지 문구</span>
              <input 
                type="text" 
                value={n.content} 
                onChange={e => setNotices(notices.map(x => x.id === n.id ? {...x, content: e.target.value} : x))}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button 
                onClick={() => handleUpdate(n.id)} 
                className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-md"
              >
                <CheckIcon className="w-4 h-4 inline-block mr-1" /> 업데이트
              </button>
              <button 
                onClick={() => handleDelete(n.id)} 
                className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
              >
                <TrashIcon className="w-5 h-5"/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {notices.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">등록된 공지가 없습니다. [신규 추가]를 눌러주세요.</p>
        </div>
      )}
    </div>
  );
}