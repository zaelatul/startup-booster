'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { MAGAZINE_ARTICLES as DUMMY_ARTICLES } from '@/lib/magazine-data';
import { CalendarIcon, ClockIcon, UserCircleIcon, ChevronLeftIcon, ShareIcon } from '@heroicons/react/24/solid';
import RollingBanner from '@/components/home/RollingBanner';

const TuiViewerWrapper = dynamic(() => import('@/components/TuiViewerWrapper'), { ssr: false });

// ✅ [수정됨] 빌드 에러 방지용 안전장치 추가
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MagazineDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [kakaoId, setKakaoId] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase.from('magazines').select('*').eq('id', id).single();
      if (data && !error) {
         setArticle({ 
             id: data.id, 
             category: data.category, 
             title: data.title, 
             description: data.subtitle, 
             author: data.author, 
             date: new Date(data.created_at).toLocaleDateString(), 
             readTime: data.read_time, 
             content: data.content,
             thumbnailUrl: data.thumbnail_url 
         });
      } else {
         const found = DUMMY_ARTICLES.find(a => a.id === id);
         setArticle(found || null);
      }
      setLoading(false);
    }
    fetchArticle();
  }, [id]);

  const handleSubscribe = (e: React.FormEvent) => { e.preventDefault(); setIsSubscribed(true); };

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  if (!article) return <div className="min-h-screen flex flex-col items-center justify-center"><p>글이 없습니다.</p><Link href="/magazine" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">목록으로</Link></div>;

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* 상단 롤링 배너 (매거진용) */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
         <RollingBanner location="magazine" />
      </div>

      {/* 히어로 섹션 */}
      <div className="relative w-full bg-slate-900 flex flex-col justify-end mt-4 overflow-hidden min-h-[180px] md:min-h-[220px]">
        {/* 배경 이미지 */}
        {article.thumbnailUrl && (
            <>
                <Image 
                    src={article.thumbnailUrl} 
                    alt="Background" 
                    fill 
                    // opacity-80 유지 (이미지 선명하게)
                    className="object-cover opacity-80" 
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/10"></div>
            </>
        )}

        <div className="absolute top-4 left-4 md:left-8 z-20">
          <Link href="/magazine" className="inline-flex items-center gap-1 px-3 py-1.5 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-full text-xs font-bold transition-all border border-white/20"><ChevronLeftIcon className="w-3 h-3" /> 목록</Link>
        </div>
        
        <div className="w-full p-6 md:p-8 max-w-4xl mx-auto z-10 relative">
          <span className="inline-block px-2.5 py-0.5 rounded bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold mb-2 md:mb-3 shadow-sm border border-indigo-400/30">{article.category}</span>
          <h1 className="text-xl md:text-3xl font-extrabold text-white leading-tight mb-3 md:mb-4 drop-shadow-lg break-keep">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-xs text-slate-200 font-medium">
            <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10"><UserCircleIcon className="w-3.5 h-3.5 text-indigo-300" />{article.author}</span>
            <span className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5 opacity-80" />{article.date}</span>
            <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5 opacity-80" />{article.readTime}</span>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto -mt-6 relative z-20 px-3 md:px-4">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-10 border border-slate-100 min-h-[400px]">
          {article.description && (
              <div className="bg-indigo-50/50 rounded-xl p-4 md:p-6 mb-8 border-l-4 border-indigo-500">
                  <p className="text-sm md:text-lg font-medium text-indigo-900 leading-relaxed break-keep">{article.description}</p>
              </div>
          )}
          
          {/* [수정] 일반 서적 수준 간격 적용 */}
          {/* leading-normal (1.5배): 책 읽기 가장 좋은 표준 간격 */}
          {/* mb-4: 문단 간격도 좁혀서 텍스트 밀집도 향상 */}
          <div className="prose prose-sm md:prose-lg max-w-none prose-headings:font-bold prose-a:text-indigo-600 break-keep whitespace-normal [&_.toastui-editor-contents_*]:!leading-normal [&_.toastui-editor-contents_p]:!mb-4 [&_.toastui-editor-contents_li]:!my-0">
              {article.content ? <TuiViewerWrapper content={article.content} /> : <div className="space-y-4">{article.contentParagraphs?.map((p:string, i:number) => <p key={i} className="leading-normal">{p}</p>)}</div>}
          </div>

          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-full transition-all"><ShareIcon className="w-4 h-4" /> 친구에게 공유하기</button>
          </div>
        </div>
      </article>

      <div className="max-w-3xl mx-auto px-4 mt-12">
        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 shadow-lg text-center">
          <h3 className="text-base md:text-xl font-bold text-white mb-2">매거진이 도움이 되셨나요?</h3>
          <p className="text-slate-300 text-xs md:text-sm mb-6">카톡 아이디와 이메일을 남겨주시면, <span className="text-indigo-400 font-bold">월 2회 최신 창업 정보</span>를 무료로 보내드립니다.</p>
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <input type="text" placeholder="카카오톡 ID" className="w-full pl-4 py-2.5 rounded-lg border-0 bg-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 text-sm" value={kakaoId} onChange={(e) => setKakaoId(e.target.value)} />
              <input type="email" required placeholder="이메일 (필수)" className="w-full pl-4 py-2.5 rounded-lg border-0 bg-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" className="sm:w-auto w-full bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-indigo-500 text-sm whitespace-nowrap">구독하기</button>
            </form>
          ) : (<div className="bg-white/10 rounded-xl p-3 animate-fadeIn inline-block px-8"><p className="text-sm font-bold text-white">🎉 구독해주셔서 감사합니다!</p></div>)}
        </div>
        <div className="text-center mt-8"><Link href="/magazine" className="inline-block px-6 py-2 text-slate-500 text-sm font-medium hover:text-slate-800 transition-colors underline-offset-4 hover:underline">목록으로 돌아가기</Link></div>
      </div>
    </main>
  );
}