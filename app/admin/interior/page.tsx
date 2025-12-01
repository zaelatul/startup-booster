'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TrashIcon, PencilIcon, PlusIcon, PhotoIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

// --- 타입 정의 ---
type InteriorProduct = {
  id: string;
  category: string;
  name: string;
  tag: string;
  tile_width: number;
  tile_height: number;
  price_per_piece: number;
  image_url: string;
  spec_description: string;
};

type InteriorCase = {
  id: string;
  title: string;
  before_image: string;
  after_image: string;
  description: string;
  cost_saved: number;
};

type Consultation = {
  id: string;
  created_at: string;
  customer_name: string;
  contact: string;
  email: string;
  width_m: number;
  length_m: number;
  zone_count: number;
  status: string;
};

export default function AdminInteriorPage() {
  const [activeTab, setActiveTab] = useState<'product' | 'case' | 'consultation'>('product');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">셀프 인테리어 통합 관리</h2>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
        <TabButton label="📦 자재 관리" active={activeTab === 'product'} onClick={() => setActiveTab('product')} />
        <TabButton label="✨ 시공 사례" active={activeTab === 'case'} onClick={() => setActiveTab('case')} />
        <TabButton label="📞 상담 신청 내역" active={activeTab === 'consultation'} onClick={() => setActiveTab('consultation')} />
      </div>

      {/* 탭별 컨텐츠 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
        {activeTab === 'product' && <ProductManager />}
        {activeTab === 'case' && <CaseManager />}
        {activeTab === 'consultation' && <ConsultationManager />}
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
        active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {label}
    </button>
  );
}

// --------------------------------------------------------------------------
// 1. 자재 관리 컴포넌트 (규격/장당가격 수정됨)
// --------------------------------------------------------------------------
function ProductManager() {
  const [list, setList] = useState<InteriorProduct[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  const fetchList = async () => {
    const { data } = await supabase.from('interior_products').select('*').order('created_at', { ascending: false });
    if (data) setList(data);
  };

  useEffect(() => { fetchList(); }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const fileName = `interior/product_${Date.now()}_${file.name}`;
    setUploading(true);
    const { error } = await supabase.storage.from('uploads').upload(fileName, file);
    if (error) { alert('업로드 실패'); setUploading(false); return; }
    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
    setForm({ ...form, image_url: data.publicUrl });
    setUploading(false);
  };

  const handleSave = async () => {
    const payload = { 
       ...form, 
       tile_width: Number(form.tile_width),
       tile_height: Number(form.tile_height),
       price_per_piece: Number(form.price_per_piece)
    };
    const { error } = form.id 
      ? await supabase.from('interior_products').update(payload).eq('id', form.id)
      : await supabase.from('interior_products').insert([payload]);
    if (!error) { setIsEditing(false); setForm({}); fetchList(); }
    else { alert('오류: ' + error.message); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      await supabase.from('interior_products').delete().eq('id', id);
      fetchList();
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <h3 className="font-bold text-lg mb-4">{form.id ? '자재 수정' : '새 자재 등록'}</h3>
        <div className="flex gap-2">
           <select className="border p-2 rounded-lg text-sm w-32" value={form.category || 'wall'} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="wall">벽면</option>
              <option value="floor">바닥</option>
           </select>
           <input className="border p-2 rounded-lg flex-1 text-sm" placeholder="자재명" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <input className="border p-2 rounded-lg w-full text-sm" placeholder="태그 (#카페 #모던)" value={form.tag || ''} onChange={e => setForm({...form, tag: e.target.value})} />
        
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">규격 (mm)</label>
              <div className="flex gap-2">
                 <input type="number" className="border p-2 rounded-lg w-full text-sm" placeholder="가로" value={form.tile_width || ''} onChange={e => setForm({...form, tile_width: e.target.value})} />
                 <span className="pt-2">x</span>
                 <input type="number" className="border p-2 rounded-lg w-full text-sm" placeholder="세로" value={form.tile_height || ''} onChange={e => setForm({...form, tile_height: e.target.value})} />
              </div>
           </div>
           <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">장당 가격 (원)</label>
              <input type="number" className="border p-2 rounded-lg w-full text-sm" placeholder="예: 4500" value={form.price_per_piece || ''} onChange={e => setForm({...form, price_per_piece: e.target.value})} />
           </div>
        </div>

        <textarea className="border p-2 rounded-lg w-full text-sm h-20" placeholder="상세 스펙" value={form.spec_description || ''} onChange={e => setForm({...form, spec_description: e.target.value})} />
        
        <div className="flex items-center gap-3">
           {form.image_url && <img src={form.image_url} alt="preview" className="w-16 h-16 rounded-lg object-cover bg-slate-100" />}
           <label className="cursor-pointer bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800">
              {uploading ? '...' : '이미지 선택'}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
           </label>
        </div>

        <div className="flex gap-2 pt-4">
           <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">저장</button>
           <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold">취소</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
         <button onClick={() => { setIsEditing(true); setForm({ category: 'wall' }); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm"><PlusIcon className="w-4 h-4"/> 자재 등록</button>
      </div>
      <div className="space-y-3">
         {list.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50">
               <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden">
                  {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" />}
               </div>
               <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.tile_width}x{item.tile_height}mm / {Number(item.price_per_piece).toLocaleString()}원</p>
               </div>
               <button onClick={() => { setForm(item); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-indigo-600"><PencilIcon className="w-4 h-4"/></button>
               <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600"><TrashIcon className="w-4 h-4"/></button>
            </div>
         ))}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 2. 시공 사례 관리 컴포넌트
// --------------------------------------------------------------------------
function CaseManager() {
  const [list, setList] = useState<InteriorCase[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  const fetchList = async () => {
    const { data } = await supabase.from('interior_cases').select('*').order('created_at', { ascending: false });
    if (data) setList(data);
  };

  useEffect(() => { fetchList(); }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: 'before_image' | 'after_image') => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const fileName = `interior/case_${field}_${Date.now()}`;
    setUploading(true);
    await supabase.storage.from('uploads').upload(fileName, file);
    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
    setForm({ ...form, [field]: data.publicUrl });
    setUploading(false);
  };

  const handleSave = async () => {
    const payload = { ...form, cost_saved: Number(form.cost_saved) };
    const { error } = form.id 
      ? await supabase.from('interior_cases').update(payload).eq('id', form.id)
      : await supabase.from('interior_cases').insert([payload]);
    if (!error) { setIsEditing(false); setForm({}); fetchList(); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      await supabase.from('interior_cases').delete().eq('id', id);
      fetchList();
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
         <h3 className="font-bold text-lg mb-4">{form.id ? '시공 사례 수정' : '새 사례 등록'}</h3>
         <input className="border p-2 rounded-lg w-full text-sm" placeholder="제목 (예: 30평 카페 바닥 시공)" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} />
         <input type="number" className="border p-2 rounded-lg w-full text-sm" placeholder="절감액 (숫자만, 예: 1500000)" value={form.cost_saved || ''} onChange={e => setForm({...form, cost_saved: e.target.value})} />
         <textarea className="border p-2 rounded-lg w-full text-sm h-24" placeholder="시공 스토리 및 설명" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} />
         
         <div className="grid grid-cols-2 gap-4">
            <div>
               <p className="text-xs font-bold mb-2 text-slate-500">Before 사진</p>
               <div className="flex items-center gap-2">
                  {form.before_image && <img src={form.before_image} className="w-12 h-12 rounded object-cover bg-slate-100" />}
                  <label className="cursor-pointer text-xs bg-slate-200 px-3 py-2 rounded hover:bg-slate-300">
                     업로드 <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'before_image')} />
                  </label>
               </div>
            </div>
            <div>
               <p className="text-xs font-bold mb-2 text-slate-500">After 사진 (필수)</p>
               <div className="flex items-center gap-2">
                  {form.after_image && <img src={form.after_image} className="w-12 h-12 rounded object-cover bg-slate-100" />}
                  <label className="cursor-pointer text-xs bg-slate-900 text-white px-3 py-2 rounded hover:bg-slate-800">
                     업로드 <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'after_image')} />
                  </label>
               </div>
            </div>
         </div>

         <div className="flex gap-2 pt-4">
            <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">저장</button>
            <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold">취소</button>
         </div>
      </div>
    );
  }

  return (
    <div>
       <div className="flex justify-end mb-4">
          <button onClick={() => { setIsEditing(true); setForm({}); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm"><PlusIcon className="w-4 h-4"/> 사례 등록</button>
       </div>
       <div className="grid grid-cols-2 gap-4">
          {list.map(item => (
             <div key={item.id} className="border border-slate-200 rounded-xl p-4 relative group">
                <div className="h-32 bg-slate-100 rounded-lg overflow-hidden mb-3">
                   <img src={item.after_image} className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-sm text-slate-900 truncate">{item.title}</p>
                <p className="text-xs text-indigo-600 font-bold">{Number(item.cost_saved).toLocaleString()}원 절감</p>
                <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                   <button onClick={() => { setForm(item); setIsEditing(true); }} className="p-1.5 bg-white shadow text-slate-600 rounded"><PencilIcon className="w-4 h-4"/></button>
                   <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-white shadow text-red-500 rounded"><TrashIcon className="w-4 h-4"/></button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 3. 상담 내역 관리 컴포넌트
// --------------------------------------------------------------------------
function ConsultationManager() {
  const [list, setList] = useState<Consultation[]>([]);

  const fetchList = async () => {
    const { data } = await supabase.from('interior_consultations').select('*').order('created_at', { ascending: false });
    if (data) setList(data);
  };

  useEffect(() => { fetchList(); }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await supabase.from('interior_consultations').update({ status: newStatus }).eq('id', id);
    fetchList();
  };

  return (
    <div>
       <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
             <thead className="bg-slate-50 text-slate-500 font-bold">
                <tr>
                   <th className="p-3">날짜</th>
                   <th className="p-3">고객명/연락처</th>
                   <th className="p-3">견적 내용</th>
                   <th className="p-3">상태</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {list.length === 0 ? (
                   <tr><td colSpan={4} className="p-8 text-center text-slate-400">아직 상담 신청이 없습니다.</td></tr>
                ) : (
                   list.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50">
                         <td className="p-3 text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString()}</td>
                         <td className="p-3">
                            <p className="font-bold text-slate-900">{item.customer_name}</p>
                            <p className="text-xs text-slate-500">{item.contact}</p>
                         </td>
                         <td className="p-3">
                            <p className="text-xs text-slate-700">가로{item.width_m}m x 세로{item.length_m}m ({item.zone_count}구역)</p>
                         </td>
                         <td className="p-3">
                            {item.status === 'pending' ? (
                               <button onClick={() => handleStatusChange(item.id, 'contacted')} className="flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-bold hover:bg-rose-200">
                                  <XCircleIcon className="w-4 h-4" /> 대기중
                               </button>
                            ) : (
                               <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold">
                                  <CheckCircleIcon className="w-4 h-4" /> 상담완료
                               </span>
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