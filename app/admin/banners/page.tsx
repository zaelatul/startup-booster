'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { TrashIcon, PencilIcon, PlusIcon, PhotoIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/solid';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
};

// [1] 노출 위치 옵션 정의 (엉아 요청 반영)
const LOCATION_OPTIONS = [
  { value: 'main', label: '🏠 메인 홈' },
  { value: 'market', label: '🗺️ 상권 분석' },
  { value: 'franchise', label: '🏪 프랜차이즈 분석' },
  { value: 'interior', label: '🛠️ 셀프 인테리어' },
  { value: 'magazine', label: '📰 창업 매거진' },
  { value: 'cases', label: '🏆 성공 사례' },
  { value: 'mbti', label: '🧩 MBTI 테스트' },
];

export default function AdminBannersPage() {
  const [list, setList] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // [3] 이미지 상세 보기 모달 상태
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [form, setForm] = useState<Partial<Banner>>({
    location: 'main',
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    is_active: true,
  });

  const fetchList = async () => {
    setLoading(true);
    const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
    if (data) setList(data);
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, []);

  // [2] 이미지 업로드 핸들러 (공통 로직 적용)
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const fileName = `banners/${Date.now()}_${file.name}`;
    
    setUploading(true);
    const { error } = await supabase.storage.from('uploads').upload(fileName, file);
    
    if (error) {
      alert('업로드 실패: ' + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
    setForm({ ...form, image_url: data.publicUrl });
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.image_url) return alert('배너 이미지는 필수입니다.');
    
    const { error } = form.id 
      ? await supabase.from('banners').update(form).eq('id', form.id)
      : await supabase.from('banners').insert([form]);

    if (!error) {
      alert('저장되었습니다!');
      setIsEditing(false);
      setForm({ location: 'main', is_active: true });
      fetchList();
    } else {
      alert('저장 실패: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    await supabase.from('banners').delete().eq('id', id);
    fetchList();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">배너 관리</h2>
        <button 
          onClick={() => { setIsEditing(true); setForm({ location: 'main', is_active: true }); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" /> 배너 등록
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 리스트 영역 */}
        <div className="lg:col-span-2 space-y-4">
          {list.map((banner) => (
            <div key={banner.id} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4 shadow-sm items-center">
              {/* 썸네일 (클릭 시 확대) */}
              <div 
                className="w-32 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 cursor-pointer relative group"
                onClick={() => setPreviewImage(banner.image_url)}
              >
                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                   <EyeIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded font-bold">
                    {LOCATION_OPTIONS.find(opt => opt.value === banner.location)?.label || banner.location}
                  </span>
                  {!banner.is_active && <span className="text-red-500 text-xs font-bold">(비공개)</span>}
                </div>
                <h4 className="font-bold text-slate-900 line-clamp-1">{banner.title || '(제목 없음)'}</h4>
                <p className="text-xs text-slate-500 truncate">{banner.link_url || '링크 없음'}</p>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => { setForm(banner); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg"><PencilIcon className="w-5 h-5"/></button>
                <button onClick={() => handleDelete(banner.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg"><TrashIcon className="w-5 h-5"/></button>
              </div>
            </div>
          ))}
        </div>

        {/* 입력 폼 영역 */}
        {isEditing && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 sticky top-6 h-fit">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-lg">{form.id ? '배너 수정' : '새 배너 등록'}</h3>
               <button onClick={() => setIsEditing(false)}><XMarkIcon className="w-6 h-6 text-slate-400 hover:text-slate-600"/></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">노출 위치</label>
                <select 
                  className="w-full border p-2 rounded-lg text-sm"
                  value={form.location}
                  onChange={(e) => setForm({...form, location: e.target.value})}
                >
                  {LOCATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* [핵심] 이미지 업로더 */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500">배너 이미지</label>
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shrink-0">
                    <PhotoIcon className="w-4 h-4" />
                    {uploading ? '업로드 중...' : '파일 선택'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  <input type="text" className="flex-1 border bg-slate-50 p-2 rounded-lg text-xs text-slate-500" value={form.image_url || ''} readOnly placeholder="URL 자동 입력" />
                </div>
                {form.image_url && (
                  <div className="w-full h-24 bg-slate-100 rounded-lg overflow-hidden mt-1 border border-slate-200">
                    <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <Input label="타이틀" value={form.title} onChange={(v: string) => setForm({...form, title: v})} />
              <Input label="서브 타이틀" value={form.subtitle} onChange={(v: string) => setForm({...form, subtitle: v})} />
              <Input label="이동 링크" value={form.link_url} onChange={(v: string) => setForm({...form, link_url: v})} placeholder="/market" />
              
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} />
                <span className="text-sm">공개 여부</span>
              </div>
              
              <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 mt-2">
                저장하기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* [3] 이미지 상세 보기 모달 */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-fadeIn" onClick={() => setPreviewImage(null)}>
           <div className="relative max-w-4xl max-h-[90vh] w-full">
              <img src={previewImage} alt="Detail" className="w-full h-full object-contain rounded-lg" />
              <button className="absolute -top-10 right-0 text-white hover:text-slate-300" onClick={() => setPreviewImage(null)}>
                 <XMarkIcon className="w-8 h-8" />
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-slate-500">{label}</label>
      <input 
        type="text" 
        className="border p-2.5 rounded-lg text-sm outline-none focus:border-indigo-500 transition-all"
        value={value || ''} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
      />
    </div>
  );
}