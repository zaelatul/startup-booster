'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TrashIcon, PencilIcon, PlusIcon, ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/solid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminSuccessCasesPage() {
  const [list, setList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  const fetchList = async () => {
    const { data } = await supabase.from('success_cases').select('*').order('created_at', { ascending: false });
    if (data) setList(data);
  };

  useEffect(() => { fetchList(); }, []);

  // [업그레이드] 배열 내 특정 인덱스의 이미지 교체 함수
  const handleArrayImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: 'store_images' | 'menu_images', index: number) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const fileName = `success/${field}_${index}_${Date.now()}`; // 파일명 중복 방지
    
    setUploading(true);
    const { error } = await supabase.storage.from('uploads').upload(fileName, file);
    
    if (error) {
      alert('업로드 실패: ' + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
    const url = data.publicUrl;

    // 기존 배열 복사 후 해당 인덱스만 교체
    const newArray = [...(form[field] || [])];
    newArray[index] = url;
    
    setForm({ ...form, [field]: newArray });
    setUploading(false);
  };

  // 단일 이미지 업로드
  const handleMainImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const fileName = `success/main_${Date.now()}`;
    
    setUploading(true);
    const { error } = await supabase.storage.from('uploads').upload(fileName, file);
    if (error) { alert('실패'); setUploading(false); return; }
    
    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
    setForm({ ...form, main_image: data.publicUrl });
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.brand_name) return alert('브랜드명은 필수입니다.');
    
    // 태그만 쉼표 문자열 -> 배열로 변환 (이미지는 이미 배열 상태)
    const payload = {
      ...form,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map((s: string) => s.trim()) : form.tags,
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
    // DB의 배열 데이터를 폼 상태로 그대로 가져옴 (이미지 배열 유지)
    setForm({
      ...item,
      tags: item.tags ? item.tags.join(', ') : '', // 태그는 편집 편의상 문자열로
      store_images: item.store_images || [],
      menu_images: item.menu_images || [],
    });
    setIsEditing(true);
  };

  // 상권 등급 설명
  const getGradeDesc = (grade: string) => {
     if (grade === 'S') return '핵심상권 (유동비율 매우 높음)';
     if (grade === 'A') return '지역 중심 상권 (유동비율 양호)';
     return '지역 동네 상권 (유동인구 평균 또는 하회)';
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeftIcon className="w-5 h-5"/></button>
          <h2 className="text-xl font-bold">{form.id ? '사례 수정' : '새 사례 등록'}</h2>
        </div>
        
        <div className="space-y-8">
          {/* 1. 기본 정보 */}
          <section className="grid grid-cols-2 gap-4">
            <Input label="브랜드명" value={form.brand_name} onChange={v => setForm({...form, brand_name: v})} />
            <Input label="지점명" value={form.branch_name} onChange={v => setForm({...form, branch_name: v})} />
            <Input label="지역" value={form.area} onChange={v => setForm({...form, area: v})} />
            <Input label="창업년도" value={form.startup_year} onChange={v => setForm({...form, startup_year: v})} />
          </section>
          
          {/* 2. 핵심 숫자 (실 투자금 반영) */}
          <section className="p-5 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="text-sm font-bold mb-4 text-indigo-600 uppercase">핵심 지표 입력</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="월 매출" value={form.monthly_sales} onChange={v => setForm({...form, monthly_sales: v})} placeholder="예: 9,200만원" />
              <Input label="순수익 (강조됨)" value={form.net_profit} onChange={v => setForm({...form, net_profit: v})} placeholder="예: 1,850만원" />
              <Input label="수익률" value={form.profit_margin} onChange={v => setForm({...form, profit_margin: v})} placeholder="예: 20%" />
              <Input label="실 투자금 (창업비용)" value={form.invest_cost} onChange={v => setForm({...form, invest_cost: v})} placeholder="예: 2억 5천" />
            </div>
          </section>

          {/* 3. 분석 정보 (상권 등급 주석 추가) */}
          <section className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500">상권 등급</label>
                <select 
                   className="border p-2.5 rounded-lg text-sm focus:border-indigo-500 outline-none" 
                   value={form.area_grade || 'B'} 
                   onChange={e => setForm({...form, area_grade: e.target.value})}
                >
                   <option value="S">S등급 (핵심상권)</option>
                   <option value="A">A등급 (지역 중심)</option>
                   <option value="B">B등급 (동네 상권)</option>
                </select>
                <p className="text-[11px] text-indigo-600 font-medium bg-indigo-50 p-2 rounded">
                   💡 {getGradeDesc(form.area_grade || 'B')}
                </p>
             </div>
             <Input label="태그 (쉼표 구분)" value={form.tags} onChange={v => setForm({...form, tags: v})} placeholder="예: 오피스상권, 여성선호" />
          </section>

          <Input label="성공 비결 (한줄 요약)" value={form.success_point} onChange={v => setForm({...form, success_point: v})} />
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">점주 인터뷰</label>
            <textarea className="border p-3 rounded-lg text-sm h-24 resize-none" value={form.interview_text || ''} onChange={e => setForm({...form, interview_text: e.target.value})} />
          </div>

          {/* 4. [대폭 수정] 이미지 업로드 섹션 (버튼 분리) */}
          <section className="space-y-6 border-t pt-6">
             <h3 className="text-sm font-bold text-slate-900">이미지 등록 (클릭하여 업로드)</h3>
             
             {/* 메인 이미지 */}
             <div>
                <p className="text-xs font-bold text-slate-500 mb-2">메인 배경 (1장)</p>
                <ImageUploader value={form.main_image} onUpload={handleMainImageUpload} loading={uploading} />
             </div>

             {/* 매장 이미지 2장 */}
             <div>
                <p className="text-xs font-bold text-slate-500 mb-2">매장 전경 (2장 필수)</p>
                <div className="grid grid-cols-2 gap-4">
                   {[0, 1].map(i => (
                      <ImageUploader 
                        key={i} 
                        value={form.store_images?.[i]} 
                        onUpload={(e: any) => handleArrayImageUpload(e, 'store_images', i)} 
                        loading={uploading} 
                        placeholder={`매장 사진 ${i+1}`}
                      />
                   ))}
                </div>
             </div>

             {/* 메뉴 이미지 4장 */}
             <div>
                <p className="text-xs font-bold text-slate-500 mb-2">대표 메뉴 (4장 필수)</p>
                <div className="grid grid-cols-4 gap-2">
                   {[0, 1, 2, 3].map(i => (
                      <ImageUploader 
                        key={i} 
                        value={form.menu_images?.[i]} 
                        onUpload={(e: any) => handleArrayImageUpload(e, 'menu_images', i)} 
                        loading={uploading} 
                        placeholder={`메뉴 ${i+1}`}
                      />
                   ))}
                </div>
             </div>
          </section>

          <div className="flex gap-2 pt-6">
            <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 shadow-md">저장하기</button>
          </div>
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
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b">
            <tr><th className="p-4">브랜드/지점</th><th className="p-4">월 매출</th><th className="p-4">순수익</th><th className="p-4 text-right">관리</th></tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-bold">{item.brand_name} <span className="font-normal text-slate-500">{item.branch_name}</span></td>
                <td className="p-4">{item.monthly_sales}</td>
                <td className="p-4 text-indigo-600 font-bold">{item.net_profit}</td>
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

// --- 하위 컴포넌트 ---
function Input({ label, value, onChange, placeholder }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-slate-500">{label}</label>
      <input type="text" className="border p-2.5 rounded-lg text-sm outline-none focus:border-indigo-500" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

// [신규] 카드형 이미지 업로더
function ImageUploader({ value, onUpload, loading, placeholder }: any) {
   return (
      <label className="relative block w-full aspect-video bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer overflow-hidden group">
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