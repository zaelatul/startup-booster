'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TrashIcon, PencilIcon, PlusIcon, ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/solid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPopularPage() {
  const [list, setList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  const fetchList = async () => {
    const { data } = await supabase.from('popular_franchises').select('*').order('created_at', { ascending: false });
    if (data) setList(data);
  };

  useEffect(() => { fetchList(); }, []);

  // 이미지 업로드
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: string, index: number = -1) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    
    // [체크] 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, GIF)만 업로드 가능합니다.');
      return;
    }

    const fileName = `popular/${field}_${Date.now()}_${file.name}`;
    
    setUploading(true);
    const { error } = await supabase.storage.from('uploads').upload(fileName, file);
    
    if (error) {
      alert('업로드 실패: ' + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
    const url = data.publicUrl;

    if (index >= 0) {
      const newArray = [...(form[field] || [])];
      newArray[index] = url;
      setForm({ ...form, [field]: newArray });
    } else {
      setForm({ ...form, [field]: url });
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name) return alert('브랜드명은 필수입니다.');
    
    const storeTrendData = form.store_trend_str 
      ? form.store_trend_str.split(',').map((cnt: string, idx: number) => ({ year: 2021 + idx, count: Number(cnt.trim()) })) 
      : [];

    const payload = {
      ...form,
      stores_total: Number(form.stores_total),
      avg_sales: Number(form.avg_sales),
      profit_margin: Number(form.profit_margin),
      startup_cost: Number(form.startup_cost),
      net_profit: Number(form.net_profit),
      
      open_rate: Number(form.open_rate),
      close_rate: Number(form.close_rate),
      established_year: Number(form.established_year),
      
      success_points: form.success_points_str ? form.success_points_str.split(',').map((s: string) => s.trim()) : [],
      store_images: form.store_images_str ? form.store_images_str.split(',').map((s: string) => s.trim()) : [],
      menu_images: form.menu_images_str ? form.menu_images_str.split(',').map((s: string) => s.trim()) : [],
      store_trend: storeTrendData,
    };

    // 임시 필드 삭제
    delete payload.success_points_str;
    delete payload.store_images_str;
    delete payload.menu_images_str;
    delete payload.store_trend_str;

    const { error } = form.id 
      ? await supabase.from('popular_franchises').update(payload).eq('id', form.id)
      : await supabase.from('popular_franchises').insert([payload]);

    if (!error) { setIsEditing(false); setForm({}); fetchList(); }
    else { alert('오류: ' + error.message); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      await supabase.from('popular_franchises').delete().eq('id', id);
      fetchList();
    }
  };

  const handleEdit = (item: any) => {
    setForm({
      ...item,
      success_points_str: item.success_points?.join(', ') || '',
      store_images_str: item.store_images?.join(', ') || '',
      menu_images_str: item.menu_images?.join(', ') || '',
      store_trend_str: item.store_trend?.map((d: any) => d.count).join(', ') || '',
    });
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeftIcon className="w-5 h-5"/></button>
          <h2 className="text-xl font-bold">{form.id ? '브랜드 수정' : '새 브랜드 등록'}</h2>
        </div>
        
        <div className="space-y-8">
          {/* 1. 기본 정보 */}
          <section>
            <h3 className="text-sm font-bold text-indigo-600 mb-3 uppercase">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="브랜드명" value={form.name} onChange={v => setForm({...form, name: v})} />
              <Input label="카테고리" value={form.category} onChange={v => setForm({...form, category: v})} />
            </div>
            <div className="mt-4">
               <Input label="슬로건" value={form.slogan} onChange={v => setForm({...form, slogan: v})} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
               {/* [추가된 필드] 컨셉 & 타겟 */}
               <Input label="브랜드 컨셉 (짧게)" value={form.concept} onChange={v => setForm({...form, concept: v})} placeholder="예: 취향대로 조합하는 커스텀 요거트" />
               <Input label="주요 타겟층" value={form.target_layer} onChange={v => setForm({...form, target_layer: v})} placeholder="예: 2030 여성" />
            </div>
          </section>

          {/* 2. 핵심 지표 */}
          <section className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-600 mb-3 uppercase">핵심 지표 (숫자만 입력)</h3>
            <div className="grid grid-cols-3 gap-4">
              <Input label="가맹점 수" type="number" value={form.stores_total} onChange={v => setForm({...form, stores_total: v})} />
              <Input label="연 평균 매출" type="number" value={form.avg_sales} onChange={v => setForm({...form, avg_sales: v})} />
              <Input label="순수익 (월)" type="number" value={form.net_profit} onChange={v => setForm({...form, net_profit: v})} />
              <Input label="수익률 (%)" type="number" value={form.profit_margin} onChange={v => setForm({...form, profit_margin: v})} />
              <Input label="창업비용" type="number" value={form.startup_cost} onChange={v => setForm({...form, startup_cost: v})} />
              <Input label="설립년도" type="number" value={form.established_year} onChange={v => setForm({...form, established_year: v})} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
               <Input label="개업률 (%)" type="number" value={form.open_rate} onChange={v => setForm({...form, open_rate: v})} />
               <Input label="폐업률 (%)" type="number" value={form.close_rate} onChange={v => setForm({...form, close_rate: v})} />
            </div>
          </section>

          {/* 3. 상세 정보 */}
          <section>
            <h3 className="text-sm font-bold text-indigo-600 mb-3 uppercase">상세 정보</h3>
            <Input label="브랜드 스토리" isTextarea value={form.brand_story} onChange={v => setForm({...form, brand_story: v})} />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input label="경쟁력 3가지 (쉼표 구분)" value={form.success_points_str} onChange={v => setForm({...form, success_points_str: v})} placeholder="맛, 가성비, 인테리어" />
              <Input label="가맹점 증가 추이 (21,22,23년 숫자만 쉼표 구분)" value={form.store_trend_str} onChange={v => setForm({...form, store_trend_str: v})} placeholder="20, 50, 150" />
            </div>
          </section>

          {/* 4. 이미지 & 본사 정보 */}
          <section className="grid grid-cols-2 gap-6">
            <div>
               <h3 className="text-sm font-bold text-slate-600 mb-3 uppercase">이미지 등록</h3>
               <div className="space-y-4">
                  <div>
                     <p className="text-xs font-bold text-slate-500 mb-2">로고/메인 (1장)</p>
                     <ImageUploader value={form.main_image} onUpload={(e: any) => handleImageUpload(e, 'main_image')} loading={uploading} />
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-500 mb-2">매장 전경 (2장)</p>
                     <div className="grid grid-cols-2 gap-2">
                        {[0, 1].map(i => <ImageUploader key={i} value={form.store_images?.[i]} onUpload={(e: any) => handleImageUpload(e, 'store_images', i)} loading={uploading} />)}
                     </div>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-500 mb-2">메뉴 사진 (4장)</p>
                     <div className="grid grid-cols-2 gap-2">
                        {[0, 1, 2, 3].map(i => <ImageUploader key={i} value={form.menu_images?.[i]} onUpload={(e: any) => handleImageUpload(e, 'menu_images', i)} loading={uploading} />)}
                     </div>
                  </div>
               </div>
            </div>
            <div>
               <h3 className="text-sm font-bold text-slate-600 mb-3 uppercase">본사 정보</h3>
               <div className="space-y-3">
                  <Input label="본사명" value={form.hq_name} onChange={v => setForm({...form, hq_name: v})} />
                  <Input label="대표번호" value={form.hq_phone} onChange={v => setForm({...form, hq_phone: v})} />
                  <Input label="이메일" value={form.hq_email} onChange={v => setForm({...form, hq_email: v})} />
                  <Input label="홈페이지 URL" value={form.hq_url} onChange={v => setForm({...form, hq_url: v})} />
               </div>
            </div>
          </section>

          <div className="pt-6 border-t border-slate-100">
            <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-md">저장하기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">인기 브랜드 관리</h2>
        <button onClick={() => { setIsEditing(true); setForm({}); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold"><PlusIcon className="w-5 h-5" /> 등록</button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
         <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b">
            <tr><th className="p-4">브랜드명</th><th className="p-4">매출</th><th className="p-4 text-right">관리</th></tr>
          </thead>
          <tbody>
            {list.map(item => (
               <tr key={item.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-bold">{item.name}</td>
                  <td className="p-4">{item.avg_sales?.toLocaleString()}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                     <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-indigo-600"><PencilIcon className="w-4 h-4"/></button>
                     <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600"><TrashIcon className="w-4 h-4"/></button>
                  </td>
               </tr>
            ))}
          </tbody>
         </table>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type='text', isTextarea, placeholder }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-slate-500">{label}</label>
      {isTextarea ? (
        <textarea className="border p-3 rounded-lg text-sm outline-none focus:border-indigo-500 h-24 resize-none" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input type={type} className="border p-2.5 rounded-lg text-sm outline-none focus:border-indigo-500" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function ImageUploader({ value, onUpload, loading }: any) {
   return (
      <label className="relative block w-full aspect-video bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer overflow-hidden group">
         <input type="file" className="hidden" accept="image/*" onChange={onUpload} disabled={loading} />
         {value ? (
            <img src={value} className="w-full h-full object-cover" />
         ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-indigo-500">
               <PhotoIcon className="w-6 h-6 mb-1" />
               <span className="text-[10px] font-bold">{loading ? '...' : '+'}</span>
            </div>
         )}
      </label>
   );
}