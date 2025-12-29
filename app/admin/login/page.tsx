'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockClosedIcon } from '@heroicons/react/24/solid';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      // 로그인 성공 시 관리자 메인으로 이동
      router.push('/admin/success-cases'); // 또는 원하시는 관리자 첫 페이지
      router.refresh();
    } else {
      setError('비밀번호가 틀렸습니다. 다시 확인해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <LockClosedIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">관리자 접속 보안</h2>
          <p className="text-slate-400 text-sm mt-2">관계자 외 접근을 엄격히 금지합니다.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {error && <p className="text-red-400 text-sm font-bold text-center animate-pulse">⚠️ {error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95"
          >
            관리자 모드 접속
          </button>
        </form>
      </div>
    </div>
  );
}