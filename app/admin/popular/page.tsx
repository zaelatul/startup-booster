'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TrashIcon, PencilIcon, PlusIcon, ArrowLeftIcon, PhotoIcon, CheckIcon } from '@heroicons/react/24/solid';

// Supabase 클라이언트 설정
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPopularPage() {
  const [list, setList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. 목록 불러오기
  const fetchList = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('popular_franchises')
      .select('*')
      .order('priority', { ascending: false }) // 우선순위 높은 순
      .order('created_at', { ascending: false }); // 최신순 보조 정렬
      
    if (error) console.error('Fetch error:', error);
    if (data) setList(data);
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, []);

  // 2. 이미지 업로드 (버킷: 'uploads' 사용)
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: string, index: number = -1) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    
    // 이미지 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, GIF)만 업로드 가능합니다.');
      return;
    }

    // 파일명 중복 방지
    const fileName = `popular/${field}_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    
    setUploading(true);
    
    // 👇 [수정됨] 행님이 만드신 'uploads' 버킷 사용
    const { error } = await supabase.storage.from('uploads').upload(fileName, file);
    
    if (error) {
      alert('업로드 실패: ' + error.message);
      setUploading(false);
      return;
    }

    // URL 가져오기 ('uploads' 버킷)
    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
    const url = data.publicUrl;

    if (index >= 0) {
      // 배열 이미지 (매장, 메뉴)
      const newArray = [...(form[field] || [])];
      newArray[index] = url;
      setForm({ ...form, [field]: newArray });
    } else {
      // 단일 이미지 (메인)
      setForm({ ...form, [field]: url });
    }
    setUploading(false);
  };

  // 3. 저장하기
  const handleSave = async () => {
    if (!form.name) return alert('브랜드명은 필수입니다.');
    
    // 가맹점 추이 데이터 처리 (콤마 문자열 -> JSON 배열 변환)
    // 예: "100, 200, 300" -> [{year: 2022, count: 100}, {year: 2023, count: 200}, ...]
    const storeTrendData = form.store_trend_str 
      ? form.store_trend_str.split(',').map((cnt: string, idx: number) => ({ year: 2022 + idx, count: Number(cnt.trim()) })) 
      : (form.store_trend || []);

    const payload = {
      name: form.name,
      category: form.category,
      slogan: form.slogan,
      concept: form.concept,
      target_layer: form.target_layer,
      
      // 숫자형 변환 (빈 값일 경우 0 처리)
      stores_total: Number(form.stores_total || 0),
      avg_sales: Number(form.avg_sales || 0),
      net_profit: Number(form.net_profit || 0),
      profit_margin: Number(form.profit_margin || 0),
      startup_cost: Number(form.startup_cost || 0),
      
      open_rate: Number(form.open_rate || 0),
      close_rate: Number(form.close_rate || 0),
      established_year: Number(form.established_year || 0),
      
      // 콤마 구분 문자열 -> 배열 변환
      success_points: typeof form.success_points_str === 'string'
        ? form.success_points_str.split(',').map((s: string) => s.trim()).filter(Boolean)
        : (form.success_points || []),
      
      // 이미지는 배열 그대로 저장
      main_image: form.main_image,
      store_images: form.store_images || [],
      menu_images: form.menu_images || [],
      
      store_trend: storeTrendData,
      brand_story: form.brand_story,
      
      // 본사 정보
      hq_name: form.hq_name,
      hq_phone: form.hq_phone,
      hq_email: form.hq_email,
      hq_url: form.hq_url,
      
      // 관리용
      is_active: form.is_active ?? true,
      priority: Number(form.priority || 0)
    };

    // 임시 필드 제거 (DB에 없는 컬럼)
    delete (payload as any).success_points_str;
    delete (payload as any).store_trend_str;

    let error;
    if (form.id) {
       // 수정
       const { error: err } = await supabase.from('popular_franchises').update(payload).eq('id', form.id);
       error = err;
    } else {
       // 신규 등록
       const { error: err } = await supabase.from('popular_franchises').insert([payload]);
       error = err;
    }

    if (!error) { 
        setIsEditing(false); 
        setForm({}); 
        fetchList(); 
        alert('저장되었습니다!');
    } else { 
        alert('저장 오류: ' + error.message); 
    }
  };

  // 4. 삭제하기
  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await supabase.from('popular_franchises').delete().eq('id', id);
      fetchList();
    }
  };

  // 5. 수정 모드 진입
  const handleEdit = (item: any) => {
    setForm({
      ...item,
      // 배열 -> 문자열 변환 (입력창 표시용)
      success_points_str: item.success_points?.join(', ') || '',
      store_trend_str: item.store_trend?.map((d: any) => d.count).join(', ') || '',
      // 이미지는 배열 그대로 유지
      store_images: item.store_images || [],
      menu_images: item.menu_images || [],
    });
    setIsEditing(true);
  };

  // 6. 신규 등록 초기값
  const handleNew = () => {
    setForm({
        is_active: true,
        priority: 0,
        store_images: [],
        menu_images: [],
        established_year: new Date().getFullYear(),
        profit_margin: 0,
        open_rate: 0,
        close_rate: 0
    });
    setIsEditing(true);
  }

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
              <Input label="브랜드명" value={form.name} onChange={(v:any) => setForm({...form, name: v})} />
              <Input label="카테고리" value={form.category} onChange={(v:any) => setForm({...form, category: v})} />
            </div>
            <div className="mt-4">
               <Input label="슬로건" value={form.slogan} onChange={(v:any) => setForm({...form, slogan: v})} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
               <Input label="브랜드 컨셉 (짧게)" value={form.concept} onChange={(v:any) => setForm({...form, concept: v})} placeholder="예: 커스텀 요거트" />
               <Input label="주요 타겟층" value={form.target_layer} onChange={(v:any) => setForm({...form, target_layer: v})} placeholder="예: 2030 여성" />
            </div>
            <div className="flex items-center gap-4 mt-4 p-3 bg-slate-50 rounded-lg">
                <Input label="노출 순위 (높을수록 위)" type="number" value={form.priority} onChange={(v:any) => setForm({...form, priority: v})} />
                <div className="pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.is_active !== false} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-5 h-5 accent-indigo-600" />
                        <span className="font-bold text-slate-700">노출 활성화</span>
                    </label>
                </div>
            </div>
          </section>

          {/* 2. 핵심 지표 */}
          <section className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-600 mb-3 uppercase">핵심 지표 (숫자만 입력)</h3>
            <div className="grid grid-cols-3 gap-4">
              <Input label="가맹점 수" type="number" value={form.stores_total} onChange={(v:any) => setForm({...form, stores_total: v})} />
              <Input label="연 평균 매출 (만원)" type="number" value={form.avg_sales} onChange={(v:any) => setForm({...form, avg_sales: v})} />
              <Input label="월 순수익 (만원)" type="number" value={form.net_profit} onChange={(v:any) => setForm({...form, net_profit: v})} />
              <Input label="수익률 (%)" type="number" value={form.profit_margin} onChange={(v:any) => setForm({...form, profit_margin: v})} />
              <Input label="창업비용 (만원)" type="number" value={form.startup_cost} onChange={(v:any) => setForm({...form, startup_cost: v})} />
              <Input label="설립년도" type="number" value={form.established_year} onChange={(v:any) => setForm({...form, established_year: v})} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
               <Input label="개업률 (%)" type="number" value={form.open_rate} onChange={(v:any) => setForm({...form, open_rate: v})} />
               <Input label="폐업률 (%)" type="number" value={form.close_rate} onChange={(v:any) => setForm({...form, close_rate: v})} />
            </div>
          </section>

          {/* 3. 상세 정보 */}
          <section>
            <h3 className="text-sm font-bold text-indigo-600 mb-3 uppercase">상세 정보</h3>
            <Input label="브랜드 스토리" isTextarea value={form.brand_story} onChange={(v:any) => setForm({...form, brand_story: v})} />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input label="경쟁력 3가지 (쉼표 구분)" value={form.success_points_str} onChange={(v:any) => setForm({...form, success_points_str: v})} placeholder="맛, 가성비, 인테리어" />
              <Input label="증가 추이 (22,23,24년 숫자 쉼표 구분)" value={form.store_trend_str} onChange={(v:any) => setForm({...form, store_trend_str: v})} placeholder="20, 50, 150" />
            </div>
          </section>

          {/* 4. 이미지 업로드 (행님이 요청하신 레이아웃 유지) */}
          <section className="grid grid-cols-2 gap-6">
            <div>
               <h3 className="text-sm font-bold text-slate-600 mb-3 uppercase">이미지</h3>
               <div className="space-y-4">
                  {/* 메인 1장 */}
                  <div>
                     <p className="text-xs font-bold text-slate-500 mb-2">로고/메인 (1장)</p>
                     <ImageUploader value={form.main_image} onUpload={(e: any) => handleImageUpload(e, 'main_image')} loading={uploading} />
                  </div>
                  {/* 매장 전경 2장 */}
                  <div>
                     <p className="text-xs font-bold text-slate-500 mb-2">매장 전경 (2장)</p>
                     <div className="grid grid-cols-2 gap-2">
                        {[0, 1].map(i => (
                            <ImageUploader key={i} value={form.store_images?.[i]} onUpload={(e: any) => handleImageUpload(e, 'store_images', i)} loading={uploading} />
                        ))}
                     </div>
                  </div>
                  {/* 메뉴 사진 4장 */}
                  <div>
                     <p className="text-xs font-bold text-slate-500 mb-2">메뉴 사진 (4장)</p>
                     <div className="grid grid-cols-2 gap-2">
                        {[0, 1, 2, 3].map(i => (
                            <ImageUploader key={i} value={form.menu_images?.[i]} onUpload={(e: any) => handleImageUpload(e, 'menu_images', i)} loading={uploading} />
                        ))}
                     </div>
                  </div>
               </div>
            </div>
            {/* 본사 정보 */}
            <div>
               <h3 className="text-sm font-bold text-slate-600 mb-3 uppercase">본사 정보</h3>
               <div className="space-y-3">
                  <Input label="본사명" value={form.hq_name} onChange={(v:any) => setForm({...form, hq_name: v})} />
                  <Input label="전화번호" value={form.hq_phone} onChange={(v:any) => setForm({...form, hq_phone: v})} />
                  <Input label="이메일" value={form.hq_email} onChange={(v:any) => setForm({...form, hq_email: v})} />
                  <Input label="홈페이지 URL" value={form.hq_url} onChange={(v:any) => setForm({...form, hq_url: v})} />
               </div>
            </div>
          </section>

          <div className="pt-6 border-t border-slate-100">
            <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2">
                <CheckIcon className="w-5 h-5" /> 저장하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 리스트 화면
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">🔥 인기 브랜드 관리</h2>
            <p className="text-slate-500 text-sm mt-1">이곳에 등록된 브랜드는 메인 화면에 우선 노출됩니다.</p>
        </div>
        <button onClick={handleNew} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-500"><PlusIcon className="w-5 h-5" /> 등록</button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
         <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b">
            <tr><th className="p-4">썸네일</th><th className="p-4">브랜드명</th><th className="p-4">매출</th><th className="p-4">상태</th><th className="p-4 text-right">관리</th></tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400">로딩 중...</td></tr>
            ) : list.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400">등록된 데이터가 없습니다.</td></tr>
            ) : list.map(item => (
               <tr key={item.id} className="border-b hover:bg-slate-50">
                  <td className="p-4"><img src={item.main_image || '/no-image.png'} className="w-12 h-12 rounded-lg object-cover bg-slate-100 border"/></td>
                  <td className="p-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.category}</div>
                  </td>
                  <td className="p-4 font-bold">{Number(item.avg_sales || 0).toLocaleString()}만원</td>
                  <td className="p-4">{item.is_active ? <span className="text-emerald-600 font-bold text-xs">노출중</span> : <span className="text-slate-400 text-xs">비노출</span>}</td>
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