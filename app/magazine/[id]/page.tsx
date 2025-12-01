'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MAGAZINE_ARTICLES } from '@/lib/magazine-data';
import { CalendarIcon, ClockIcon, UserCircleIcon, ChevronLeftIcon, ShareIcon, EnvelopeIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';

export default function MagazineDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [kakaoId, setKakaoId] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // ID로 기사 찾기
  const article = MAGAZINE_ARTICLES.find(a => a.id === id) || 
                  MAGAZINE_ARTICLES.find(a => {
                      if (!id) return false;
                      const baseId = id.split('-').slice(0, 2).join('-'); 
                      return a.id === baseId;
                  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
  };

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <p className="text-slate-500 font-medium mb-4">찾으시는 기사가 없습니다.</p>
        <Link href="/magazine" className="px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-colors">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* 상단 헤더 (이미지 없음, 다크 배경) */}
      <div className="relative h-auto min-h-[320px] w-full bg-slate-900 flex flex-col justify-end">
        <div className="absolute top-6 left-4 md:left-8 z-10">
          <Link 
            href="/magazine"
            className="inline-flex items-center gap-1 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-bold transition-all"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            목록
          </Link>
        </div>

        <div className="w-full p-6 md:p-12 max-w-4xl mx-auto z-10">
          <span className="inline-block px-3 py-1 rounded-lg bg-indigo-500 text-white text-xs font-bold mb-4 shadow-sm">
            {article.category}
          </span>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6 drop-shadow-sm">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-300 font-medium">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <UserCircleIcon className="w-4 h-4 text-indigo-300" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4" />
              {article.readTime} 소요
            </span>
          </div>
        </div>
      </div>

      {/* 본문 내용 */}
      <article className="max-w-3xl mx-auto -mt-8 relative z-10 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
          
          {/* 요약 박스 */}
          <div className="bg-indigo-50 rounded-2xl p-6 mb-10 border-l-4 border-indigo-500">
            <p className="text-lg font-medium text-indigo-900 leading-relaxed">
              {article.description}
            </p>
          </div>

          {/* 본문 반복 */}
          <div className="space-y-12 text-slate-800 leading-loose text-base md:text-lg">
            {article.contentParagraphs?.map((paragraph, idx) => (
              <div key={idx} className="space-y-6">
                <p className="text-justify">{paragraph}</p>
                {article.contentImages && article.contentImages[idx] && (
                  <figure className="rounded-2xl overflow-hidden shadow-lg my-8 group">
                    <div className="overflow-hidden">
                      <img 
                        src={article.contentImages[idx]} 
                        alt={`기사 참고 이미지 ${idx + 1}`} 
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <figcaption className="text-center text-xs text-slate-500 mt-3 py-2 bg-slate-50 rounded-b-2xl">
                      ▲ {article.category} 현장 자료 {idx + 1}
                    </figcaption>
                  </figure>
                )}
              </div>
            ))}
          </div>

          {/* 하단 공유 */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">#창업꿀팁</span>
              <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">#트렌드</span>
              <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">#성공사례</span>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-4 py-2 rounded-full transition-all">
              <ShareIcon className="w-4 h-4" />
              공유하기
            </button>
          </div>
        </div>
      </article>

      {/* 하단 구독 섹션 (여기는 유지!) */}
      <div className="max-w-3xl mx-auto px-4 mt-12">
        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 shadow-lg text-center">
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">
            매거진이 도움이 되셨나요?
          </h3>
          <p className="text-slate-300 text-xs md:text-sm mb-6">
            카톡 아이디와 이메일을 남겨주시면, <span className="text-indigo-400 font-bold">월 2회 최신 창업 정보</span>를 무료로 보내드립니다.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ChatBubbleLeftEllipsisIcon className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="카카오톡 ID" 
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border-0 bg-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={kakaoId}
                  onChange={(e) => setKakaoId(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="이메일 (필수)" 
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border-0 bg-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="sm:w-auto w-full bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-indigo-500 transition-colors text-sm whitespace-nowrap"
              >
                구독하기
              </button>
            </form>
          ) : (
             <div className="bg-white/10 rounded-xl p-3 animate-fadeIn inline-block px-8">
                <p className="text-sm font-bold text-white">🎉 구독해주셔서 감사합니다!</p>
             </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link 
            href="/magazine"
            className="inline-block px-6 py-2 text-slate-500 text-sm font-medium hover:text-slate-800 transition-colors underline-offset-4 hover:underline"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}