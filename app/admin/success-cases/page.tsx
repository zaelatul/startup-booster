'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TrashIcon, PencilIcon, PlusIcon, ArrowLeftIcon, PhotoIcon, ChartBarIcon } from '@heroicons/react/24/solid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

export default function AdminSuccessCasesPage() {
  const [list, setList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  // 분석 데이터 상태 (JSON)
  const [analysisData, setAnalysisData] = useState({
    quarterlyRevenue: [0, 0, 0, 0],
    quarterComment: '',
    footTraffic: {
      dailyAvg: 0, competitors: 0, comment: '',
      weekRatio: { week: 70, weekend: 30 },
      lat: 37.4979, lng: 127.0276
    }
  });

  const fetchList = async () => {
    const { data } = await supabase.from('success_cases').select('*').order('created_at', { ascending: false });
    if (data) setList(data);
  };

  useEffect(() => { fetchList(); }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const fileName = `success/${field}_${Date.now()}`;
    
    setUploading(true);
    const { error } = await supabase.storage.from('uploads').upload(fileName, file);
    if (error) { alert('실패: ' + error.message); setUploading(false); return; }

    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
    const url = data.publicUrl;

    if (typeof index === 'number') {
       const currentArr = form[field] || [];
       const newArr = [...currentArr];
       newArr[index] = url;
       setForm({ ...form, [field]: newArr });
    } else {
       setForm({ ...form, [field]: url });
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.brand_name) return alert('브랜드명은 필수입니다.');
    
    const payload = {
      ...form,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map((s: string) => s.trim()) : form.tags,
      analysis_json: analysisData 
    };

    const { error } = form.id 
      ? await supabase.from('success_cases').update(payload).eq('id', form.id)
      : await supabase.from('success_cases').insert([payload]);

    if (!error) { setIsEditing(false); setForm({}); fetchList(); }
    else { alert('오류: ' + error.message); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      await supabase.from('success_cases').delete().eq('id', id);
      fetchList();
    }
  };

  const handleEdit = (item: any) => {
    setForm({
      ...item,
      tags: item.tags ? item.tags.join(', ') : '',
      store_images: item.store_images || [],
      menu_images: item.menu_images || [],
    });
    if (item.analysis_json) setAnalysisData(item.analysis_json);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="max-w-5xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeftIcon className="w-5 h-5"/></button>
             <h2 className="text-xl font-bold">{form.id ? '사례 수정' : '새 사례 등록'}</h2>
          </div>
          <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all">저장하기</button>
        </div>
        
        <div className="space-y-10">
          {/* 기본 정보 */}
          <section className="grid grid-cols-2 gap-6">
            <Input label="브랜드명" value={form.brand_name} onChange={v => setForm({...form, brand_name: v})} />
            <Input label="지점명" value={form.branch_name} onChange={v => setForm({...form, branch_name: v})} />
            <Input label="지역 (행정동)" value={form.area} onChange={v => setForm({...form, area: v})} />
            <Input label="창업년월" value={form.startup_year} onChange={v => setForm({...form, startup_year: v})} />
          </section>
          
          {/* 핵심 지표 */}
          <section className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold mb-4 text-indigo-600 uppercase flex items-center gap-2"><ChartBarIcon className="w-4 h-4"/> 핵심 성과 지표</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="월 매출" type="number" value={form.monthly_sales} onChange={v => setForm({...form, monthly_sales: v})} />
              <Input label="순수익 (강조)" type="number" value={form.net_profit} onChange={v => setForm({...form, net_profit: v})} />
              <Input label="수익률 (%)" type="number" value={form.profit_margin} onChange={v => setForm({...form, profit_margin: v})} />
              <Input label="실 투자금" type="number" value={form.invest_cost} onChange={v => setForm({...form, invest_cost: v})} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
               <Input label="상권 등급" value={form.area_grade} onChange={v => setForm({...form, area_grade: v})} placeholder="예: B등급" />
               <Input label="태그 (쉼표 구분)" value={form.tags} onChange={v => setForm({...form, tags: v})} />
            </div>
            <div className="mt-4">
               <Input label="성공 비결 (한줄 요약)" value={form.success_point} onChange={v => setForm({...form, success_point: v})} />
            </div>
             <div className="mt-4">
               <Input label="점주 인터뷰" value={form.interview_text} onChange={v => setForm({...form, interview_text: v})} />
            </div>
          </section>

          {/* 이미지 업로드 */}
          <section className="space-y-6 pt-6 border-t">
             <h3 className="text-sm font-bold text-slate-900">이미지 등록 (클릭하여 업로드)</h3>
             <div><p className="text-xs font-bold text-slate-500 mb-2">메인 배경 (1장)</p>
                <ImageUploader value={form.main_image} onUpload={(e:any)=>handleImageUpload(e, 'main_image')} loading={uploading} />
             </div>
             <div><p className="text-xs font-bold text-slate-500 mb-2">매장 전경 (2장 필수)</p>
                <div className="grid grid-cols-2 gap-4">
                   {[0, 1].map(i => (
                      <ImageUploader key={i} value={form.store_images?.[i]} onUpload={(e:any)=>handleImageUpload(e, 'store_images', i)} loading={uploading} placeholder={`매장 ${i+1}`} />
                   ))}
                </div>
             </div>
             <div><p className="text-xs font-bold text-slate-500 mb-2">대표 메뉴 (4장 필수)</p>
                <div className="grid grid-cols-4 gap-2">
                   {[0, 1, 2, 3].map(i => (
                      <ImageUploader key={i} value={form.menu_images?.[i]} onUpload={(e:any)=>handleImageUpload(e, 'menu_images', i)} loading={uploading} placeholder={`메뉴 ${i+1}`} />
                   ))}
                </div>
             </div>
          </section>

          <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">저장하기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">성공 사례 관리</h2>
        <button onClick={() => { setIsEditing(true); setForm({ area_grade: 'B' }); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold">
          <PlusIcon className="w-5 h-5" /> 사례 등록
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b">
            <tr><th className="p-4">브랜드/지점</th><th className="p-4">매출/수익</th><th className="p-4 text-right">관리</th></tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id} className="border-b hover:bg-slate-50 transition-colors">
                <td className="p-4">
                   <div className="font-bold text-slate-900">{item.brand_name}</div>
                   <div className="text-xs text-slate-500">{item.branch_name}</div>
                </td>
                <td className="p-4">
                   <div className="text-slate-900">{item.monthly_sales}</div>
                   <div className="text-xs text-emerald-600 font-bold">{item.net_profit}</div>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-100 rounded-lg"><PencilIcon className="w-4 h-4"/></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 rounded-lg"><TrashIcon className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-bold text-slate-500">{label}</label>
      <input type={type} className="border p-2.5 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors" 
         value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function ImageUploader({ value, onUpload, loading, placeholder }: any) {
   return (
      <label className="relative block w-full aspect-video bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer overflow-hidden group">
         <input type="file" className="hidden" accept="image/*" onChange={onUpload} disabled={loading} />
         {value ? (
            <img src={value} alt="uploaded" className="w-full h-full object-cover" />
         ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-indigo-500">
               <PhotoIcon className="w-6 h-6 mb-1" />
               <span className="text-[10px] font-bold">{loading ? '...' : (placeholder || '사진 선택')}</span>
            </div>
         )}
      </label>
   );
}