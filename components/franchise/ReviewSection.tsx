'use client';

import { useEffect, useMemo, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { StarIcon, LockClosedIcon } from '@heroicons/react/24/solid';

type Review = {
  id: string;
  franchise_id: string; 
  user_name: string;
  rating: number;
  content: string;
  created_at: string;
};

export default function ReviewSection({ franchiseId }: { franchiseId: string }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = useMemo(
    () =>
      createBrowserClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder-key'
      ),
    [supabaseUrl, supabaseAnonKey]
  );

  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ user_name: '', content: '', rating: 5 });
  const [loading, setLoading] = useState(false);

  // ✅ [개인정보 보호] 이름 마스킹 로직 강화 (홍길동 -> 홍*동, 이순신 -> 이*신)
  const maskName = (name: string) => {
    if (!name) return '익명';
    const trimmedName = name.trim();
    if (trimmedName.length <= 1) return trimmedName;
    if (trimmedName.length === 2) return trimmedName[0] + '*';
    // 성과 끝자만 남기고 중간은 모두 별표 처리
    return trimmedName[0] + '*'.repeat(trimmedName.length - 2) + trimmedName[trimmedName.length - 1];
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user?.user_metadata?.full_name) {
        setForm(prev => ({ ...prev, user_name: user.user_metadata.full_name }));
    }
  };

  const fetchReviews = async () => {
    try {
      if (!franchiseId || !supabaseUrl) return;
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('franchise_id', franchiseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews((data as Review[]) || []);
    } catch (err) {
      console.error('리뷰 불러오기 실패:', err);
    }
  };

  // ✅ [수정] Hook 에러 방지를 위해 의존성 배열을 안정적으로 고정함
  useEffect(() => {
    checkUser();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [franchiseId, supabase]); 

  const handleSubmit = async () => {
    if (!user) return alert('로그인이 필요합니다.');
    if (!form.user_name || !form.content) return alert('이름과 리뷰 내용은 필수입니다.');

    setLoading(true);

    try {
      // ✅ [수정] user_id를 명시적으로 포함하여 Not-Null 에러 방지
      const { error } = await supabase.from('reviews').insert([
        {
          franchise_id: franchiseId,
          user_id: user.id, // 👈 로그인한 유저 ID를 확실히 전달
          user_name: form.user_name,
          rating: form.rating,
          content: form.content,
        },
      ]);

      if (error) throw error;

      alert('리뷰가 등록되었습니다!');
      setForm({ ...form, content: '' });
      fetchReviews();
    } catch (err: any) {
      console.error('리뷰 등록 실패:', err);
      alert('리뷰 등록 실패: ' + (err.message || '데이터 전송 오류'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 mt-10">
      <h3 className="text-[13px] md:text-lg font-black text-slate-900 mb-4 tracking-tighter">
        ✨ 나도 한마디! 이용자분들의 리얼 리뷰
      </h3>

      <div className="space-y-3 mb-6">
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-500 font-medium">아직 등록된 리뷰가 없습니다.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                {/* ✅ [수정] 마스킹 함수가 확실히 적용되도록 함 */}
                <p className="font-black text-slate-800">{maskName(review.user_name)}</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-line">{review.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 relative overflow-hidden">
        {!user && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-2">
            <LockClosedIcon className="w-8 h-8 text-slate-400" />
            <p className="text-sm font-bold text-slate-600">로그인 후 리뷰를 남길 수 있습니다.</p>
            <button onClick={() => window.location.href = '/login'} className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-bold active:scale-95">로그인하기</button>
          </div>
        )}

        <input
          type="text"
          value={form.user_name}
          onChange={(e) => setForm({ ...form, user_name: e.target.value })}
          placeholder="이름 / 닉네임"
          disabled={!user}
          className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 font-bold text-slate-800 disabled:bg-slate-100"
        />

        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="이 성공사례에 대한 응원 및 궁금한점을 남겨주새요."
          disabled={!user}
          className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 font-medium text-slate-800 h-24 resize-none disabled:bg-slate-100"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-500">평점</span>
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              disabled={!user}
              className="p-2 rounded-xl border border-slate-200 font-bold text-slate-800 disabled:opacity-50"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n}점</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !user}
            className={`px-5 py-2 rounded-2xl font-black transition-all active:scale-95 ${!user ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            {loading ? '등록 중...' : '리뷰 등록'}
          </button>
        </div>
      </div>
    </div>
  );
}