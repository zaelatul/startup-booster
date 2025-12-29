'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@supabase/supabase-js';
import { TrashIcon, PencilIcon, PlusIcon, ArrowLeftIcon, PhotoIcon, CheckIcon } from '@heroicons/react/24/solid';

// [수정] ToastEditorWrapper로 이름 변경해서 불러오기
const ToastEditorWrapper = dynamic(() => import('@/components/ToastEditorWrapper'), { ssr: false });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminMagazinePage() {
  const [list, setList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  const fetchList = async () => {
    const { data } = await supabase.from('magazines').select('*').order('created_at', { ascending: false });
    if (data) setList(data);
  };

  useEffect(() => { fetchList(); }, []);

  // [수정] 썸네일 업로드 (uploads 버킷 사용)
  const handleThumbnailUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    
    const file = e.target.files[0];
    const fileName = `magazine/thumb_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    
    // 버킷명 통일: 'uploads'
    const { error } = await supabase.storage.from('uploads').upload(fileName, file);
    
    if (!error) {
        const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
        setForm({ ...form, thumbnail_url: data.publicUrl });
    } else {
        alert('이미지 업로드 실패: ' + error.message);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title) return alert('제목을 입력하세요.');
    
    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      category: form.category || '일반',
      author: form.author || '에디터',
      thumbnail_url: form.thumbnail_url,
      content: form.content, 
      is_published: form.is_published ?? true
    };

    let error;
    if (form.id) {
       const { error: err } = await supabase.from('magazines').update(payload).eq('id', form.id);
       error = err;
    } else {
       const { error: err } = await supabase.from('magazines').insert([payload]);
       error = err;
    }

    if (!error) {
        alert('저장 완료!');
        setIsEditing(false);
        setForm({});
        fetchList();
    } else {
        alert('저장 실패: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    await supabase.from('magazines').delete().eq('id', id);
    fetchList();
  };

  if (isEditing) {
    return (
      <div className="max-w-5xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
           <div className="flex items-center gap-3">
              <button onClick={() => setIsEditing(false)}><ArrowLeftIcon className="w-6 h-6 text-slate-400"/></button>
              <h2 className="text-xl font-bold">{form.id ? '매거진 수정' : '새 글 쓰기'}</h2>
           </div>
           <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex gap-2 items-center"><CheckIcon className="w-5 h-5"/> 발행</button>
        </div>
        
        <div className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <Input label="카테고리" value={form.category} onChange={(v:any) => setForm({...form, category: v})} placeholder="예: 창업가이드"/>
              <Input label="작성자" value={form.author} onChange={(v:any) => setForm({...form, author: v})}/>
           </div>
           <Input label="제목" value={form.title} onChange={(v:any) => setForm({...form, title: v})}/>
           <Input label="부제목 (요약)" value={form.subtitle} onChange={(v:any) => setForm({...form, subtitle: v})}/>

           <div>
              <p className="text-xs font-bold text-slate-500 mb-2">썸네일</p>
              <div className="flex items-center gap-4">
                  <label className="cursor-pointer border border-dashed border-slate-300 w-32 h-20 rounded-xl flex flex-col items-center justify-center hover:bg-slate-50 relative overflow-hidden">
                      {uploading ? (
                          <span className="text-xs text-slate-400">업로드 중...</span>
                      ) : (
                          <>
                            <PhotoIcon className="w-5 h-5 text-slate-400"/>
                            <span className="text-[10px] text-slate-400">클릭</span>
                          </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload}/>
                  </label>
                  {form.thumbnail_url && <img src={form.thumbnail_url} className="h-20 w-32 object-cover rounded-xl border"/>}
              </div>
           </div>

           <div>
              <p className="text-xs font-bold text-slate-500 mb-2">본문 (Toast Editor)</p>
              <div className="border rounded-xl overflow-hidden">
                 {/* [수정] ToastEditorWrapper 사용 */}
                 <ToastEditorWrapper 
                    initialValue={form.content || ''} 
                    onChange={(html: string) => setForm({...form, content: html})} 
                 />
              </div>
           </div>

           <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <input type="checkbox" checked={form.is_published !== false} onChange={e => setForm({...form, is_published: e.target.checked})} className="w-5 h-5 accent-indigo-600"/>
              <span className="font-bold text-sm text-slate-700">공개 발행</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-black text-slate-900">매거진 관리</h2>
          <button onClick={() => { setForm({ is_published: true }); setIsEditing(true); }} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold flex gap-2 items-center shadow-lg hover:bg-indigo-500"><PlusIcon className="w-5 h-5"/> 글 쓰기</button>
       </div>
       
       <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 text-slate-500 font-bold border-b text-xs uppercase">
                <tr><th className="p-5 pl-8">썸네일</th><th className="p-5">제목</th><th className="p-5">상태</th><th className="p-5 text-right pr-8">관리</th></tr>
             </thead>
             <tbody>
                {list.map(item => (
                   <tr key={item.id} className="hover:bg-slate-50 border-b last:border-0">
                      <td className="p-5 pl-8"><img src={item.thumbnail_url || '/no-image.png'} className="w-16 h-10 object-cover rounded bg-slate-100 border"/></td>
                      <td className="p-5 font-bold text-slate-900">{item.title}<div className="text-xs text-slate-400 font-normal mt-0.5">{new Date(item.created_at).toLocaleDateString()}</div></td>
                      <td className="p-5">{item.is_published ? <span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded text-xs font-bold">공개</span> : <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs font-bold">비공개</span>}</td>
                      <td className="p-5 text-right pr-8 flex justify-end gap-2">
                          <button onClick={() => { setForm(item); setIsEditing(true); }} className="p-2 bg-slate-100 rounded-lg hover:text-indigo-600"><PencilIcon className="w-4 h-4"/></button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-100 rounded-lg hover:text-red-600"><TrashIcon className="w-4 h-4"/></button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: any) {
  return (<div className="flex flex-col gap-1.5 w-full"><label className="text-xs font-bold text-slate-500 ml-1">{label}</label><input className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} /></div>);
}