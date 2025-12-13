import { createClient } from '@supabase/supabase-js';

// [중요] 환경변수가 없으면 '빈 값' 대신 '임시 값'을 넣어서 빌드 에러를 방지합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false // 서버 사이드 렌더링 시 세션 충돌 방지
  }
});