'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { StarIcon, TrashIcon } from '@heroicons/react/24/solid';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function ReviewSection({ franchiseId }: { franchiseId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      fetchReviews();
    };
    init();
  }, [franchiseId]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('franchise_id', franchiseId)
      .order('created_at', { ascending: false });
    
    if (data) setReviews(data);
  };

  // 🕵️‍♂️ [추가된 기능] 이름 가려주는 마법사 함수
  const getMaskedName = (user: any) => {
    // 1. 일단 가져올 수 있는 이름은 다 가져봅니다.
    const rawName = 
      user.user_metadata.full_name || 
      user.user_metadata.name || 
      user.user_metadata.profile_nickname || 
      user.email?.split('@')[0] || 
      '익명';

    // 2. 이름 길이에 따라 별표(*)를 칩니다.
    if (rawName.length <= 1) return rawName; // 1글자는 그대로
    if (rawName.length === 2) return rawName[0] + '*'; // 두 글자(이명) -> 이*
    
    // 3글자 이상(홍길동) -> 홍*동 (가운데만 가림)
    const firstChar = rawName[0];
    const lastChar = rawName[rawName.length - 1];
    const maskLength = rawName.length - 2;
    return `${firstChar}${'*'.repeat(maskLength)}${lastChar}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    setLoading(true);
    
    // 🚨 여기서 위에서 만든 마스킹 함수를 사용합니다!
    const nickname = getMaskedName(user);

    const { error } = await supabase.from('reviews').insert({
      franchise_id: franchiseId,
      user_id: user.id,
      nickname: nickname, // 마스킹된 이름(예: 김*수)이 저장됩니다.
      content: content,
      rating: 5,
    });

    if (error) {
      alert('등록 실패: ' + error.message);
    } else {
      setContent('');
      fetchReviews();
    }
    setLoading(false);
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (!error) fetchReviews();
    else alert('삭제 권한이 없습니다.');
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 mt-8">
      {/* [수정] 모바일 텍스트 크기 축소 (text-sm), 웹은 유지 (md:text-xl) */}
      <h3 className="text-sm md:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        💬 나도 한마디! 이용자분들의 리얼 리뷰 <span className="text-indigo-600 text-xs md:text-sm font-normal">({reviews.length})</span>
      </h3>

      <form onSubmit={handleSubmit} className="mb-8 relative">
        {user ? (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
               {user.user_metadata.profile_image || user.user_metadata.avatar_url ? (
                 <img src={user.user_metadata.profile_image || user.user_metadata.avatar_url} alt="프로필" className="w-full h-full object-cover"/>
               ) : (
                 <UserCircleIcon className="w-6 h-6 text-slate-400" />
               )}
            </div>
            <div className="flex-grow">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="이 성공사례에 대한 의견이나 궁금한 점을 남겨주세요."
                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button type="submit" disabled={loading || !content} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-50 transition-all">
                  {loading ? '등록 중...' : '리뷰 등록'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-100">
            <p className="text-slate-500 text-sm mb-3">로그인하고 리뷰를 남겨보세요!</p>
            <Link href="/login" className="text-indigo-600 font-bold text-sm hover:underline">로그인하러 가기 &rarr;</Link>
          </div>
        )}
      </form>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="flex gap-4 border-b border-slate-50 pb-4 last:border-none">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-600 font-bold text-sm">{review.nickname[0]}</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{review.nickname}</span>
                    <span className="text-xs text-slate-400 ml-2">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  {user && user.id === review.user_id && (
                    <button onClick={() => handleDelete(review.id)} className="text-slate-300 hover:text-red-500 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                  )}
                </div>
                <div className="flex items-center gap-1 my-1">
                  {[...Array(5)].map((_, i) => (<StarIcon key={i} className="w-3 h-3 text-yellow-400" />))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{review.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-400 text-sm py-10">첫 번째 리뷰의 주인공이 되어보세요! 🚀</p>
        )}
      </div>
    </div>
  );
}