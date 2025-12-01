'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TrashIcon, PencilIcon, PlusIcon, ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/solid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Magazine = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  thumbnail_url: string;
  author: string;
  is_published: boolean;
  content_html: string;
  content_images: string[]; // [신규] 본문 이미지 배열
};

export default function AdminMagazinePage() {
  const [list, setList] = useState<Magazine[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  const fetchList = async () => {
    const { data } = await supabase.from('magazines').select('*').order('created_at', { ascending: false });
    if (data) setList(data);
  };

  useEffect(() => { fetchList(); }, []);

  // 이미지 업로드
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: string, isArray = false) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const fileName = `magazine/${Date.now()}_${file.name}`;
    
    setUploading(true);
    const { error } = await supabase.storage.from('uploads').upload(fileName, file);
    if (error) { alert('실패'); setUploading(false); return; }
    
    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
    const url = data.publicUrl;

    if (isArray) {
       const current = form[field] ? form[field] + ', ' : '';
       setForm({ ...form, [field]: current + url });
    } else {
       setForm({ ...form, [field]: url });
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title) return alert('제목 필수');
    
    const payload = { 
      ...form,
      // 본문 이미지는 쉼표로 구분된 문자열 -> 배열로 변환해서 저장
      content_images: form.content_images_str ? form.content_images_str.split(',').map((s: string) => s.trim()) : []
    };
    delete payload.content_images_str; // 임시 필드 삭제

    const { error } = form.id 
      ? await supabase.from('magazines').update(payload).eq('id', form.id)
      : await supabase.from('magazines').insert([payload]);

    if (!error) { setIsEditing(false); setForm({}); fetchList(); }
    else { alert('오류: ' + error.message); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('삭제?')) {
      await supabase.from('magazines').delete().eq('id', id);
      fetchList();
    }
  };

  const handleEdit = (item: any) => {
    setForm({
      ...item,
      // 배열 -> 문자열 변환 (수정 시 보이게)
      content_images_str: item.content_images?.join(', ') || ''
    });
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
          <button onClick={() => setIsEditing(false)}><ArrowLeftIcon className="w-5 h-5"/></button>
          <h2 className="text-xl font-bold">{form.id ? '수정' : '새 글 작성'}</h2>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="카테고리" value={form.category} onChange={v => setForm({...form, category: v})} placeholder="트렌드" />
            <Input label="작성자" value={form.author} onChange={v => setForm({...form, author: v})} placeholder="에디터 김창업" />
          </div>
          <Input label="제목" value={form.title} onChange={v => setForm({...form, title: v})} />
          <Input label="부제목" value={form.subtitle} onChange={v => setForm({...form, subtitle: v})} />
          
          {/* 이미지 업로드 2종 */}
          <div className="grid grid-cols-2 gap-6 border-t pt-4">
             <div>
                <p className="text-xs font-bold text-slate-500 mb-2">썸네일 (1장)</p>
                <ImageUploader value={form.thumbnail_url} onUpload={(e: any) => handleImageUpload(e, 'thumbnail_url')} loading={uploading} />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-500 mb-2">본문 삽입 이미지 (여러 장 가능)</p>
                <ImageUploader value={form.content_images_str} onUpload={(e: any) => handleImageUpload(e, 'content_images_str', true)} loading={uploading} placeholder="본문 이미지 추가" isArray />
                <p className="text-[10px] text-slate-400 mt-1">* 여러 장 업로드 시 본문 순서대로 사용됩니다.</p>
             </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">본문 내용</label>
            <textarea className="border p-3 rounded-lg text-sm h-64 resize-none" value={form.content_html || ''} onChange={e => setForm({...form, content_html: e.target.value})} />
          </div>

          <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-xl">
            <input type="checkbox" checked={form.is_published || false} onChange={e => setForm({...form, is_published: e.target.checked})} />
            <label className="text-sm font-bold text-slate-700">즉시 발행 (체크 해제 시 비공개)</label>
          </div>

          <div className="pt-4"><button onClick={handleSave} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">저장하기</button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">매거진 관리</h2>
        <button onClick={() => { setIsEditing(true); setForm({ is_published: true }); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold"><PlusIcon className="w-5 h-5" /> 글 쓰기</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b">
            <tr><th className="p-4">썸네일</th><th className="p-4">제목</th><th className="p-4">상태</th><th className="p-4 text-right">관리</th></tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id} className="border-b hover:bg-slate-50">
                <td className="p-4"><img src={item.thumbnail_url} className="w-16 h-12 rounded bg-slate-100 object-cover" /></td>
                <td className="p-4 font-bold">{item.title}<br/><span className="text-xs text-slate-400 font-normal">{new Date(item.created_at).toLocaleDateString()}</span></td>
                <td className="p-4">{item.is_published ? <span className="text-emerald-600 font-bold">발행</span> : <span className="text-slate-400">임시</span>}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                   <button onClick={() => handleEdit(item)}><PencilIcon className="w-4 h-4 text-slate-400"/></button>
                   <button onClick={() => handleDelete(item.id)}><TrashIcon className="w-4 h-4 text-slate-400"/></button>
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
  return (<div className="flex flex-col gap-1"><label className="text-xs font-bold text-slate-500">{label}</label><input className="border p-2.5 rounded-lg text-sm" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} /></div>);
}

function ImageUploader({ value, onUpload, loading, placeholder, isArray }: any) {
  return (
     <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
           <label className="cursor-pointer bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shrink-0">
              <PhotoIcon className="w-3 h-3" /> {loading ? '...' : (placeholder || '업로드')}
              <input type="file" className="hidden" accept="image/*" onChange={onUpload} disabled={loading} />
           </label>
           <input type="text" className="flex-1 border bg-slate-50 p-2 rounded-lg text-xs text-slate-500" value={value || ''} readOnly />
        </div>
        {value && !isArray && <img src={value} className="h-20 w-full object-cover rounded-lg border" />}
        {value && isArray && <div className="flex gap-2 overflow-x-auto">{value.split(',').map((url: string, i: number) => url.trim() && <img key={i} src={url.trim()} className="h-16 w-16 rounded object-cover border" />)}</div>}
     </div>
  )
}