'use client';

import { useMemo, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

interface InquiryPopupProps {
  brandId: string;
  brandName: string;
  onClose: () => void;

  // ✅ 어디서 왔는지 구분해서 저장하고 싶을 때 사용
  category?: string; // 예: '가맹' | '인기' | '성공사례'
}

export default function InquiryPopup({
  brandId,
  brandName,
  onClose,
  category = '가맹',
}: InquiryPopupProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', content: '' });
  const [loading, setLoading] = useState(false);

  // ✅ 개인정보 제3자 제공 동의 (필수)
  const [isAgreed, setIsAgreed] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // ✅ env가 undefined여도 "빌드/렌더에서" 터지지 않게 안전하게 생성
  const supabase = useMemo(
    () =>
      createBrowserClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder-key'
      ),
    [supabaseUrl, supabaseAnonKey]
  );

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return alert('이름과 연락처는 필수입니다.');
    if (!isAgreed) return alert('개인정보 제3자 제공 동의가 필요합니다.');

    // ✅ env가 없으면 여기서 깔끔하게 중단 (화면 변화 없음, 저장만 막음)
    if (!supabaseUrl || !supabaseAnonKey) {
      return alert('Supabase 환경변수가 설정되지 않아 문의 접수를 진행할 수 없습니다.');
    }

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
          category,
        },
      ]);

      if (error) throw error;

      alert(`[${brandName}] 상담 신청이 접수되었습니다!\n담당자가 곧 연락드리겠습니다.`);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert('문의 접수 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div>
            {/* ✅ [삭제] '가맹 본사 직접 연결' 문구만 정확히 제거함 */}
            <h3 className="text-xl font-black">{brandName} 창업 문의</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              이름 / 닉네임 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-800"
              placeholder="홍길동"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-800"
              placeholder="010-1234-5678"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">이메일 (선택)</label>
            <input
              type="email"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-800"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">문의 내용 (선택)</label>
            <textarea
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-800 h-24 resize-none"
              placeholder="창업 비용이나 교육 일정 등 궁금한 점을 남겨주세요."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>

          {/* ✅ 개인정보 제3자 제공 동의 */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agree"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-0.5"
              />
              <label
                htmlFor="agree"
                className="text-xs text-slate-500 leading-snug cursor-pointer"
              >
                <span className="font-bold text-slate-700">[필수] 개인정보 제3자 제공 동의</span>
                <br />
                상담을 위해 입력하신 정보를 <span className="underline">{brandName} 본사</span>에 제공하는
                것에 동의합니다.
              </label>
            </div>
          </div>

          {/* ✅ [유지] 체크 안하면 비활성화 로직 적용 */}
          <button
            onClick={handleSubmit}
            disabled={loading || !isAgreed}
            className={`w-full py-4 font-black rounded-2xl shadow-lg transition-all active:scale-95 text-lg mt-2 flex justify-center ${
              loading || !isAgreed 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-70' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? '접수 중...' : '문의 접수하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

type InquiryBottomBarProps = {
  brandId: string;
  brandName: string;
  category?: string;
  buttonLabel?: string;
};

export function InquiryBottomBar({
  brandId,
  brandName,
  category = '가맹',
  buttonLabel = '창업 문의하기',
}: InquiryBottomBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ✅ [유지] 모바일 하단 위치를 bottom-20(80px)으로 유지하여 잘림 현상 방지 */}
      <div className="fixed left-0 right-0 bottom-20 md:bottom-0 z-[999] bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 p-3 md:p-6 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="hidden md:block">
            <p className="text-xs text-slate-500">본사 담당자에게 직접 전달됩니다.</p>
            <p className="text-sm font-bold text-slate-900">
              지금 문의하면 <span className="text-indigo-600">우선 상담 혜택!</span>
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="w-full md:w-auto flex-1 bg-[#1E293B] hover:bg-slate-800 text-white px-4 py-3 md:px-8 md:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg text-sm"
          >
            <EnvelopeIcon className="w-4 h-4 md:w-5 md:h-5" /> {buttonLabel}
          </button>
        </div>
      </div>

      {open && (
        <InquiryPopup
          brandId={brandId}
          brandName={brandName}
          category={category}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}