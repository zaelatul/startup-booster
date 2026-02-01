'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { XMarkIcon } from '@heroicons/react/24/solid';

// 이 컴포넌트 안에서만 쓰는 Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface InquiryPopupProps {
  brandId: string;
  brandName: string;
  onClose: () => void;
}

export default function InquiryPopup({ brandId, brandName, onClose }: InquiryPopupProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', content: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return alert('이름과 연락처는 필수입니다.');
    setLoading(true);

    try {
      const { error } = await supabase.from('inquiries').insert([
        {
          brand_id: brandId,
          brand_name: brandName,
          user_name: form.name,
          user_phone: form.phone,
          email: form.email, 
          content: form.content,
          category: '가맹'
        }
      ]);

      if (error) throw error;

      alert(`[${brandName}] 가맹 문의가 접수되었습니다!\n담당자가 곧 연락드리겠습니다.`);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert('문의 접수 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <p className="text-xs text-indigo-300 font-bold mb-1">가맹 본사 직접 연결</p>
            <h3 className="text-xl font-black">{brandName} 창업 문의</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <XMarkIcon className="w-6 h-6 text-white"/>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">이름 / 닉네임 <span className="text-red-500">*</span></label>
            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-800" placeholder="홍길동" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">연락처 <span className="text-red-500">*</span></label>
            <input type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-800" placeholder="010-1234-5678" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">이메일 (선택)</label>
            <input type="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-800" placeholder="example@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">문의 내용 (선택)</label>
            <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-800 h-24 resize-none" placeholder="창업 비용이나 교육 일정 등 궁금한 점을 남겨주세요." value={form.content} onChange={e => setForm({...form, content: e.target.value})}></textarea>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 text-lg mt-2 flex justify-center">
            {loading ? '접수 중...' : '문의 접수하기'}
          </button>
        </div>
      </div>
    </div>
  );
}