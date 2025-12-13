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

  // [중요] 상세 페이지에서 쓸 복잡한 데이터 구조 (JSON)
  const [analysisData, setAnalysisData] = useState({
    quarterlyRevenue: [0, 0, 0, 0], // 1~4분기 매출
    quarterComment: '',
    footTraffic: {
      dailyAvg: 0, competitors: 0, comment: '',
      weekRatio: { week: 70, weekend: 30 },
      lat: 37.4979, lng: 127.0276 // 좌표 (기본값 강남)
    }
  });

  const fetchList = async () => {
    const { data } = await supabase.from('success_cases').select('*').order('created_at', { ascending: false });
    if (data) setList(data);
  };

  useEffect(() => { fetchList(); }, []);

  // 이미지 업로드 (단일/배열 통합)
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
    
    // [핵심] 폼 데이터 + 분석 JSON 데이터 병합
    const payload = {
      ...form,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map((s: string) => s.trim()) : form.tags,
      // 분석 데이터는 JSON으로 묶어서 저장 (DB에 analysis_json 컬럼 필요)
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
    // 저장된 분석 데이터 불러오기 (없으면 기본값)
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
          
          {/* 1. 기본 정보 (기존 유지) */}
          <section className="grid grid-cols-2 gap-6">
            <Input label="브랜드명" value={form.brand_name} onChange={v => setForm({...form, brand_name: v})} />
            <Input label="지점명" value={form.branch_name} onChange={v => setForm({...form, branch_name: v})} />
            <Input label="지역 (행정동)" value={form.area} onChange={v => setForm({...form, area: v})} />
            <Input label="창업년월 (예: 2022년 05월)" value={form.startup_year} onChange={v => setForm({...form, startup_year: v})} />
          </section>
          
          {/* 2. 핵심 지표 (보증금/월세 분리 적용) */}
          <section className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold mb-4 text-indigo-600 uppercase flex items-center gap-2"><ChartBarIcon className="w-4 h-4"/> 핵심 성과 지표</h3>
            <div className="grid grid-cols-3 gap-4">
              <Input label="월 매출 (만원)" type="number" value={form.monthly_sales} onChange={v => setForm({...form, monthly_sales: v})} />
              <Input label="순수익 (만원)" type="number" value={form.net_profit} onChange={v => setForm({...form, net_profit: v})} />
              <Input label="수익률 (%)" type="number" value={form.profit_margin} onChange={v => setForm({...form, profit_margin: v})} />
              <Input label="보증금 (만원)" type="number" value={form.deposit} onChange={v => setForm({...form, deposit: v})} />
              <Input label="월세 (만원)" type="number" value={form.monthly_rent} onChange={v => setForm({...form, monthly_rent: v})} />
              <Input label="실 투자금 (만원)" type="number" value={form.invest_cost} onChange={v => setForm({...form, invest_cost: v})} />
            </div>
          </section>

          {/* 3. [신규] 분석 데이터 입력 (차트용) */}
          <section className="p-6 bg-white rounded-2xl border-2 border-indigo-50">
             <h3 className="text-lg font-bold mb-6 text-slate-800">📊 차트 데이터 입력</h3>
             
             {/* 분기별 매출 */}
             <div className="mb-8">
                <label className="text-xs font-bold text-slate-500 mb-2 block">분기별 매출 (1~4분기)</label>
                <div className="flex gap-2 mb-3">
                   {[0,1,2,3].map(i => (
                      <input key={i} type="number" className="w-full border p-2 rounded-lg text-sm" placeholder={`${i+1}분기`} 
                         value={analysisData.quarterlyRevenue[i]} 
                         onChange={e => {
                            const newArr = [...analysisData.quarterlyRevenue];
                            newArr[i] = Number(e.target.value);
                            setAnalysisData({...analysisData, quarterlyRevenue: newArr});
                         }} 
                      />
                   ))}
                </div>
                <input type="text" className="w-full border p-2 rounded-lg text-sm" placeholder="분기 매출 분석 코멘트 (예: 여름 성수기에 30% 급증...)"
                   value={analysisData.quarterComment}
                   onChange={e => setAnalysisData({...analysisData, quarterComment: e.target.value})}
                />
             </div>

             {/* 유동인구 및 상권 */}
             <div className="grid grid-cols-2 gap-6 mb-4">
                <Input label="일 평균 유동인구 (명)" type="number" value={analysisData.footTraffic.dailyAvg} 
                   onChange={v => setAnalysisData({...analysisData, footTraffic: {...analysisData.footTraffic, dailyAvg: v}})} />
                <Input label="경쟁 점포 수 (개)" type="number" value={analysisData.footTraffic.competitors} 
                   onChange={v => setAnalysisData({...analysisData, footTraffic: {...analysisData.footTraffic, competitors: v}})} />
             </div>
             <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="flex gap-2">
                   <div className="w-1/2"><Input label="주중 비율 (%)" type="number" value={analysisData.footTraffic.weekRatio.week} 
                      onChange={v => setAnalysisData({...analysisData, footTraffic: {...analysisData.footTraffic, weekRatio: {...analysisData.footTraffic.weekRatio, week: v}}})} /></div>
                   <div className="w-1/2"><Input label="주말 비율 (%)" type="number" value={analysisData.footTraffic.weekRatio.weekend} 
                      onChange={v => setAnalysisData({...analysisData, footTraffic: {...analysisData.footTraffic, weekRatio: {...analysisData.footTraffic.weekRatio, weekend: v}}})} /></div>
                </div>
                <div className="flex gap-2">
                   <div className="w-1/2"><Input label="위도 (Lat)" type="number" value={analysisData.footTraffic.lat} 
                      onChange={v => setAnalysisData({...analysisData, footTraffic: {...analysisData.footTraffic, lat: v}})} /></div>
                   <div className="w-1/2"><Input label="경도 (Lng)" type="number" value={analysisData.footTraffic.lng} 
                      onChange={v => setAnalysisData({...analysisData, footTraffic: {...analysisData.footTraffic, lng: v}})} /></div>
                </div>
             </div>
             <textarea className="w-full border p-3 rounded-lg text-sm h-20 resize-none" placeholder="상권 분석 코멘트 (예: 오피스 상권이라 점심 피크가 뚜렷...)"
                value={analysisData.footTraffic.comment}
                onChange={e => setAnalysisData({...analysisData, footTraffic: {...analysisData.footTraffic, comment: e.target.value}})}
             />
          </section>

          <Input label="점주 한마디" value={form.interview_text} onChange={v => setForm({...form, interview_text: v})} />

          {/* 4. 이미지 업로드 (기존 유지 + UI 개선) */}
          <section className="space-y-6 pt-6 border-t">
             <h3 className="text-sm font-bold text-slate-900">이미지 등록</h3>
             
             <div><p className="text-xs font-bold text-slate-500 mb-2">메인 배경 (1장)</p>
                <ImageUploader value={form.main_image} onUpload={(e:any)=>handleImageUpload(e, 'main_image')} loading={uploading} />
             </div>

             <div><p className="text-xs font-bold text-slate-500 mb-2">매장 전경 (2장)</p>
                <div className="grid grid-cols-2 gap-4">
                   {[0, 1].map(i => (
                      <ImageUploader key={i} value={form.store_images?.[i]} onUpload={(e:any)=>handleImageUpload(e, 'store_images', i)} loading={uploading} placeholder={`매장 ${i+1}`} />
                   ))}
                </div>
             </div>

             <div><p className="text-xs font-bold text-slate-500 mb-2">메뉴 (4장)</p>
                <div className="grid grid-cols-4 gap-2">
                   {[0, 1, 2, 3].map(i => (
                      <ImageUploader key={i} value={form.menu_images?.[i]} onUpload={(e:any)=>handleImageUpload(e, 'menu_images', i)} loading={uploading} placeholder={`메뉴 ${i+1}`} />
                   ))}
                </div>
             </div>
          </section>

        </div>
      </div>
    );
  }

  // 목록 화면 (기존 유지)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">성공 사례 관리</h2>
        <button onClick={() => { setIsEditing(true); setForm({ area_grade: 'B' }); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
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

// 하위 컴포넌트들
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