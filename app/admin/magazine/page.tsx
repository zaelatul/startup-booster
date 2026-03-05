'use client';

import { useState, useEffect, ChangeEvent, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@supabase/supabase-js';
import { TrashIcon, PencilIcon, PlusIcon, ArrowLeftIcon, PhotoIcon, CheckIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid';

const ToastEditorWrapper = dynamic(() => import('@/components/ToastEditorWrapper'), { ssr: false });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminMagazinePage() {
  const [list, setList] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  // 검색을 위한 상태값
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');

  const fetchData = async () => {
    const { data: magData } = await supabase.from('magazines').select('*').order('created_at', { ascending: false });
    if (magData) setList(magData);
    
    const { data: brandData } = await supabase.from('franchises').select('id, name').order('name');
    if (brandData) setBrands(brandData);
  };

  useEffect(() => { fetchData(); }, []);

  // 검색 필터 로직
  const filteredBrandsA = useMemo(() => 
    brands.filter(b => b.name.toLowerCase().includes(searchA.toLowerCase())).slice(0, 10), 
    [brands, searchA]
  );
  const filteredBrandsB = useMemo(() => 
    brands.filter(b => b.name.toLowerCase().includes(searchB.toLowerCase())).slice(0, 10), 
    [brands, searchB]
  );

  const handleSave = async () => {
    if (!form.title) return alert('제목을 입력하세요.');
    const payload = {
      title: form.title, 
      subtitle: form.subtitle, 
      category: form.category || '일반', 
      author: form.author || '에디터',
      thumbnail_url: form.thumbnail_url, 
      content: form.content, 
      is_published: form.is_published ?? true,
      compare_brand_a: form.compare_brand_a || null, 
      compare_brand_b: form.compare_brand_b || null
    };

    const { error } = form.id 
      ? await supabase.from('magazines').update(payload).eq('id', form.id)
      : await supabase.from('magazines').insert([payload]);

    if (!error) { 
      alert('저장 완료!'); 
      setIsEditing(false); 
      setForm({}); 
      fetchData(); 
    } else {
      alert('저장 실패: ' + error.message);
    }
  };

  // ✅ [복구] 삭제 기능 함수
  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 매거진을 삭제하시겠습니까?')) return;
    
    const { error } = await supabase.from('magazines').delete().eq('id', id);
    
    if (!error) {
      alert('삭제되었습니다.');
      fetchData();
    } else {
      alert('삭제 실패: ' + error.message);
    }
  };

  const handleThumbnailUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileName = `magazine/thumb_${Date.now()}`;
    const { error } = await supabase.storage.from('uploads').upload(fileName, file);
    if (!error) {
        const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
        setForm({ ...form, thumbnail_url: data.publicUrl });
    }
    setUploading(false);
  };

  if (isEditing) {
    return (
      <div className="max-w-5xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
           <div className="flex items-center gap-3">
              <button onClick={() => setIsEditing(false)}><ArrowLeftIcon className="w-6 h-6 text-slate-400"/></button>
              <h2 className="text-xl font-bold">{form.id ? '매거진 수정' : '새 글 쓰기'}</h2>
           </div>
           <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex gap-2 items-center shadow-lg hover:bg-indigo-500"><CheckIcon className="w-5 h-5"/> 저장 및 발행</button>
        </div>
        
        <div className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <Input label="카테고리" value={form.category} onChange={(v:any) => setForm({...form, category: v})} placeholder="예: 창업가이드"/>
              <Input label="작성자" value={form.author} onChange={(v:any) => setForm({...form, author: v})}/>
           </div>
           <Input label="제목" value={form.title} onChange={(v:any) => setForm({...form, title: v})}/>
           <Input label="부제목 (요약)" value={form.subtitle} onChange={(v:any) => setForm({...form, subtitle: v})}/>
           
           {/* 라이벌 브랜드 검색 시스템 */}
           <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 border-l-4 border-l-indigo-500">
              <p className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">🔍 라이벌 브랜드 검색 및 선택</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">비교 브랜드 A</label>
                  <div className="mt-1 flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500">
                    <MagnifyingGlassIcon className="w-4 h-4 text-slate-300"/>
                    <input className="flex-1 outline-none text-sm" placeholder="브랜드명 검색..." value={searchA} onChange={(e) => setSearchA(e.target.value)}/>
                  </div>
                  {searchA && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
                      {filteredBrandsA.map(b => (
                        <div key={b.id} className="p-3 text-sm hover:bg-indigo-50 cursor-pointer flex justify-between items-center border-b last:border-0" onClick={() => { setForm({...form, compare_brand_a: b.id}); setSearchA(b.name); }}>
                          <span className="font-bold">{b.name}</span>
                          {form.compare_brand_a === b.id && <CheckIcon className="w-4 h-4 text-indigo-600"/>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">비교 브랜드 B</label>
                  <div className="mt-1 flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500">
                    <MagnifyingGlassIcon className="w-4 h-4 text-slate-300"/>
                    <input className="flex-1 outline-none text-sm" placeholder="브랜드명 검색..." value={searchB} onChange={(e) => setSearchB(e.target.value)}/>
                  </div>
                  {searchB && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
                      {filteredBrandsB.map(b => (
                        <div key={b.id} className="p-3 text-sm hover:bg-indigo-50 cursor-pointer flex justify-between items-center border-b last:border-0" onClick={() => { setForm({...form, compare_brand_b: b.id}); setSearchB(b.name); }}>
                          <span className="font-bold">{b.name}</span>
                          {form.compare_brand_b === b.id && <CheckIcon className="w-4 h-4 text-indigo-600"/>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
           </div>

           <div>
              <p className="text-xs font-bold text-slate-500 mb-2">썸네일</p>
              <div className="flex items-center gap-4">
                  <label className="cursor-pointer border border-dashed border-slate-300 w-32 h-20 rounded-xl flex flex-col items-center justify-center hover:bg-slate-50 relative overflow-hidden">
                      {uploading ? <span className="text-xs text-slate-400">업로드 중...</span> : <><PhotoIcon className="w-5 h-5 text-slate-400"/><span className="text-[10px] text-slate-400">클릭</span></>}
                      <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload}/>
                  </label>
                  {form.thumbnail_url && <img src={form.thumbnail_url} className="h-20 w-32 object-cover rounded-xl border"/>}
              </div>
           </div>

           <div>
              <p className="text-xs font-bold text-slate-500 mb-2">본문 내용</p>
              <div className="border rounded-xl overflow-hidden">
                 <ToastEditorWrapper initialValue={form.content || ''} onChange={(html: string) => setForm({...form, content: html})} />
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-black text-slate-900">매거진 관리</h2>
          <button onClick={() => { setForm({ is_published: true }); setSearchA(''); setSearchB(''); setIsEditing(true); }} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold flex gap-2 items-center shadow-lg hover:bg-indigo-500"><PlusIcon className="w-5 h-5"/> 새 글 쓰기</button>
       </div>
       
       <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 text-slate-500 font-bold border-b text-xs uppercase">
                <tr><th className="p-5 pl-8">썸네일</th><th className="p-5">제목</th><th className="p-5 text-right pr-8">관리</th></tr>
             </thead>
             <tbody>
                {list.map(item => (
                   <tr key={item.id} className="hover:bg-slate-50 border-b last:border-0">
                      <td className="p-5 pl-8"><img src={item.thumbnail_url || '/no-image.png'} className="w-16 h-10 object-cover rounded border"/></td>
                      <td className="p-5 font-bold text-slate-900">{item.title}</td>
                      <td className="p-5 text-right pr-8 flex justify-end gap-2">
                          {/* 수정 버튼 */}
                          <button onClick={() => { setForm(item); setSearchA(''); setSearchB(''); setIsEditing(true); }} className="p-2 bg-slate-100 rounded-lg hover:text-indigo-600 transition-colors"><PencilIcon className="w-4 h-4"/></button>
                          {/* ✅ [복구] 삭제 버튼 */}
                          <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-100 rounded-lg hover:text-red-600 transition-colors"><TrashIcon className="w-4 h-4"/></button>
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