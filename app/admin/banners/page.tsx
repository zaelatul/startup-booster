'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TrashIcon, PencilIcon, PlusIcon, PhotoIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/solid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  image_url: string;        // PC 배너
  mobile_image_url: string; // ✅ [추가] 모바일 배너
  detail_image_url: string; // 상세 팝업
  link_url: string;
  is_active: boolean;
  sort_order: number;
};

const LOCATION_OPTIONS = [
  { value: 'main', label: '🏠 메인 홈 (하단)' },
  { value: 'magazine', label: '📰 매거진 상세 (상단)' },
  { value: 'cases', label: '🏆 성공사례 상세 (상단)' },
  { value: 'franchise', label: '📊 프랜차이즈 분석 상세 (상단)' },
  { value: 'mbti', label: '🧠 MBTI 테스트 (상단)' }, 
];

export default function AdminBannersPage() {
  const [list, setList] = useState<Banner[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [form, setForm] = useState<Partial<Banner>>({
    location: 'main',
    title: '',
    subtitle: '',
    image_url: '',
    mobile_image_url: '', // ✅ 초기값 추가
    detail_image_url: '', 
    link_url: '',
    is_active: true,
    sort_order: 0,
  });

  const fetchList = async () => {
    const { data } = await supabase.from('banners').select('*').order('location').order('sort_order');
    if (data) setList(data);
  };

  useEffect(() => { fetchList(); }, []);

  const generateSafeFileName = (originalName: string) => {
    const fileExt = originalName.split('.').pop();
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${Date.now()}_${randomString}.${fileExt}`;
  };

  // ✅ [수정] 필드 타입에 mobile_image_url 추가
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, field: 'image_url' | 'mobile_image_url' | 'detail_image_url') => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    
    // 폴더 구분 (상세 이미지만 details 폴더, 나머지는 banners)
    const folder = field === 'detail_image_url' ? 'banners/details' : 'banners';
    const safeName = generateSafeFileName(file.name);
    const filePath = `${folder}/${safeName}`;
    
    setUploading(true);
    
    const { error } = await supabase.storage.from('uploads').upload(filePath, file, { upsert: true });
    
    if (error) { 
        console.error('Upload Error:', error);
        alert('업로드 실패: ' + error.message); 
        setUploading(false); 
        return; 
    }
    
    const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
    setForm(prev => ({ ...prev, [field]: data.publicUrl }));
    setUploading(false);
  };

  const handleSave = async () => {
    // ✅ [수정] PC 이미지만 필수로 두고, 제목/부제목 필수 체크 제거
    if (!form.image_url) return alert('PC 배너 이미지는 필수입니다.');
    // if (!form.title) return alert('제목은 필수입니다.'); -> 삭제 (빈값 허용)

    const payload = { ...form, sort_order: Number(form.sort_order) };
    
    const { error } = form.id 
      ? await supabase.from('banners').update(payload).eq('id', form.id)
      : await supabase.from('banners').insert([payload]);

    if (!error) {
      alert('저장되었습니다!');
      setIsEditing(false);
      setForm({ location: 'main', is_active: true, sort_order: 0, image_url: '', mobile_image_url: '', detail_image_url: '' });
      fetchList();
    } else {
      alert('오류: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('삭제하시겠습니까?')) {
      await supabase.from('banners').delete().eq('id', id);
      fetchList();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">배너 관리</h2>
        <button onClick={() => { setIsEditing(true); setForm({ location: 'main', is_active: true, sort_order: 0, image_url: '', mobile_image_url: '', detail_image_url: '' }); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700">
          <PlusIcon className="w-5 h-5" /> 배너 등록
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 리스트 영역 */}
        <div className="lg:col-span-2 space-y-4">
          {list.length === 0 ? (
             <div className="p-10 text-center text-slate-400 border rounded-xl">등록된 배너가 없습니다.</div>
          ) : (
            list.map((banner) => (
                <div key={banner.id} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4 shadow-sm items-center">
                <div className="w-32 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 cursor-pointer relative group" onClick={() => setPreviewImage(banner.image_url)}>
                    <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all"><EyeIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" /></div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-600`}>{LOCATION_OPTIONS.find(opt => opt.value === banner.location)?.label || banner.location}</span>
                    {!banner.is_active && <span className="text-red-500 text-xs font-bold">(비공개)</span>}
                    {/* 뱃지 표시 */}
                    {banner.mobile_image_url && <span className="text-blue-500 text-[10px] font-bold border border-blue-100 px-1 rounded bg-blue-50">모바일O</span>}
                    {banner.detail_image_url && <span className="text-indigo-500 text-[10px] font-bold border border-indigo-100 px-1 rounded bg-indigo-50">팝업O</span>}
                    </div>
                    <h4 className="font-bold text-slate-900 line-clamp-1">{banner.title || '(제목 없음)'}</h4>
                    <p className="text-xs text-slate-500 truncate">{banner.subtitle || '-'}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => { setForm(banner); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleDelete(banner.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg"><TrashIcon className="w-5 h-5"/></button>
                </div>
                </div>
            ))
          )}
        </div>

        {/* 입력 폼 영역 */}
        {isEditing && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 sticky top-6 h-fit animate-fade-in-up">
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-lg">{form.id ? '배너 수정' : '새 배너 등록'}</h3><button onClick={() => setIsEditing(false)}><XMarkIcon className="w-6 h-6 text-slate-400 hover:text-slate-600"/></button></div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-slate-500 mb-1">위치</label><select className="w-full border p-2 rounded-lg text-sm" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})}>{LOCATION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                  <Input label="순서 (숫자)" type="number" value={form.sort_order} onChange={(v:any) => setForm({...form, sort_order: v})} placeholder="0" />
              </div>
              
              {/* ① PC 롤링 배너 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-900">① PC 롤링 배너 (필수)</label>
                    <span className="text-[10px] text-red-500 font-bold">*권장: 1920 x 500 px</span>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer bg-white border border-slate-300 text-slate-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-2 shrink-0">
                    <PhotoIcon className="w-4 h-4" /> {uploading ? '...' : '업로드'}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image_url')} disabled={uploading} />
                  </label>
                  {form.image_url ? <img src={form.image_url} className="h-10 w-20 object-cover rounded border cursor-pointer" onClick={() => setPreviewImage(form.image_url!)} /> : <span className="text-xs text-slate-400">필수</span>}
                </div>
              </div>

              {/* ✅ [추가] ② 모바일 롤링 배너 */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-blue-900">② 모바일 롤링 배너 (선택)</label>
                    <span className="text-[10px] text-blue-600 font-bold">*권장: 800 x 208 px</span>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer bg-white border border-blue-200 text-blue-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 flex items-center gap-2 shrink-0">
                    <PhotoIcon className="w-4 h-4" /> {uploading ? '...' : '업로드'}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'mobile_image_url')} disabled={uploading} />
                  </label>
                  {form.mobile_image_url ? <img src={form.mobile_image_url} className="h-10 w-20 object-cover rounded border cursor-pointer" onClick={() => setPreviewImage(form.mobile_image_url!)} /> : <span className="text-xs text-slate-400">PC 이미지 사용됨</span>}
                </div>
                <p className="text-[10px] text-blue-400 mt-1">* 미등록 시 모바일에서도 PC 이미지가 보여집니다.</p>
              </div>

              {/* ③ 상세 팝업 이미지 */}
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-indigo-900">③ 상세 팝업 이미지 (클릭 시)</label>
                    <span className="text-[10px] text-indigo-600 font-bold">*권장: 1000 x 1500 px</span>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer bg-white border border-indigo-200 text-indigo-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 flex items-center gap-2 shrink-0">
                    <PhotoIcon className="w-4 h-4" /> {uploading ? '...' : '업로드'}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'detail_image_url')} disabled={uploading} />
                  </label>
                  {form.detail_image_url ? <img src={form.detail_image_url} className="h-14 w-10 object-cover rounded border cursor-pointer" onClick={() => setPreviewImage(form.detail_image_url!)} /> : <span className="text-xs text-slate-400">선택</span>}
                </div>
              </div>

              {/* 타이틀/서브타이틀 (선택사항으로 변경됨) */}
              <Input label="타이틀 (선택)" value={form.title} onChange={(v:any) => setForm({...form, title: v})} placeholder="입력 시 이미지 위에 텍스트 노출" />
              <Input label="서브 타이틀 (선택)" value={form.subtitle} onChange={(v:any) => setForm({...form, subtitle: v})} />
              <Input label="외부 링크 URL (선택)" value={form.link_url} onChange={(v:any) => setForm({...form, link_url: v})} placeholder="https://..." />
              
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl"><input type="checkbox" checked={form.is_active ?? true} onChange={(e) => setForm({...form, is_active: e.target.checked})} /><label className="text-sm font-bold text-slate-700">공개</label></div>
              <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 mt-2">저장하기</button>
            </div>
          </div>
        )}
      </div>
      {previewImage && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setPreviewImage(null)}><div className="relative max-w-4xl max-h-[90vh]"><img src={previewImage} className="w-full h-full object-contain rounded-lg" /></div></div>}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type='text' }: any) {
  return (<div className="flex flex-col gap-1"><label className="text-xs font-bold text-slate-500">{label}</label><input type={type} className="border p-2.5 rounded-lg text-sm outline-none focus:border-indigo-500 transition-all" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} /></div>);
}