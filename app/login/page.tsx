import SocialLogin from '@/components/auth/SocialLogin';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
        {/* 로고 영역 */}
        <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
           <span className="text-2xl">🚀</span>
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-2">창업부스터 시작하기</h1>
        <p className="text-slate-500 text-sm mb-10">
          성공적인 창업을 위한 데이터 분석, <br/>
          지금 바로 확인해보세요.
        </p>

        {/* 소셜 로그인 버튼들 */}
        <SocialLogin />
      </div>
    </div>
  );
}