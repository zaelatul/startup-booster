'use client';

import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link'; // 👈 링크 이동용 추가
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, LockClosedIcon } from '@heroicons/react/24/outline'; // 아이콘 추가
import { createBrowserClient } from '@supabase/ssr';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
  targetBrand?: string;
}

export default function InquiryModal({ isOpen, onClose, category = '일반', targetBrand = '' }: InquiryModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
   
  // 유저 상태 관리
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ [수정됨] 환경변수 안전장치 추가! (빌드 에러 방지)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  
  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

  // 모달 열릴 때마다 유저 체크
  useEffect(() => {
    if (isOpen) {
      setLoadingUser(true);
      const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // 로그인했으면 닉네임 자동 입력
          const nickname = 
            user.user_metadata.full_name || 
            user.user_metadata.name || 
            user.user_metadata.profile_nickname || 
            '';
          setName(nickname);
        }
        setLoadingUser(false);
      };
      checkUser();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // 혹시라도 뚫리면 차단

    setIsSubmitting(true);

    // TODO: DB 저장 로직 (supabase.from('inquiries').insert...)

    setTimeout(() => {
      alert(`${name}님, 상담 신청이 완료되었습니다!\n전문가가 검토 후 ${phone}으로 연락드리겠습니다.`);
      setIsSubmitting(false);
      setName('');
      setPhone('');
      setContent('');
      onClose();
    }, 1000);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-bold text-gray-900">
                    🚀 무료 창업 상담 신청
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* 👇 로딩 중일 때 */}
                {loadingUser ? (
                  <div className="py-10 text-center text-gray-500">정보 확인 중...</div>
                ) : !user ? (
                  /* 👇 [핵심] 비로그인 상태일 때 보여줄 화면 */
                  <div className="py-8 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <LockClosedIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">로그인이 필요한 서비스입니다</h4>
                    <p className="text-sm text-slate-500 mb-6 px-4">
                      더 정확한 상담을 위해 본인 확인이 필요합니다.<br/>
                      1초 만에 로그인하고 무료 상담을 받아보세요.
                    </p>
                    <Link 
                      href="/login" 
                      className="w-full bg-kakao text-slate-900 font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-all bg-[#FEE500]"
                    >
                      카카오로 1초 만에 시작하기
                    </Link>
                  </div>
                ) : (
                  /* 👇 로그인 상태일 때 (입력 폼) */
                  <>
                    <div className="mb-6 bg-indigo-50 p-3 rounded-lg text-sm text-indigo-700">
                      <span className="font-bold">[{category}]</span> {targetBrand && <span className="font-bold text-indigo-900">{targetBrand}</span>} 관련하여 궁금한 점을 남겨주세요.
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">신청자명 (닉네임)</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none bg-slate-50 text-slate-600"
                          readOnly // 닉네임은 자동입력이므로 수정 불가 처리 (선택사항)
                        />
                      </div>
                       
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="010-1234-5678"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용 (선택)</label>
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="예: 예상 창업 비용이 궁금합니다. 상권 분석 요청드려요."
                          rows={3}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none resize-none"
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-white font-bold hover:bg-indigo-500 transition-colors disabled:bg-gray-400"
                        >
                          {isSubmitting ? '신청 중...' : '상담 신청하기'}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-3">
                          신청 시 개인정보 수집 및 이용에 동의하게 됩니다.
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}