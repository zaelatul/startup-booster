import { createClient } from '@supabase/supabase-js';

// [수정] 환경변수가 없어도 빌드가 터지지 않게 '임시 값'을 넣어주는 안전장치 추가
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// 클라이언트 타입 정의
type Supa = ReturnType<typeof createClient>;
let _client: Supa | null = null;

/** 서버/클라이언트 어디서든 싱글톤으로 재사용 */
export function supabase(): Supa {
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseKey, { 
      auth: { 
        persistSession: false // 불필요한 세션 저장 방지
      } 
    });
  }
  return _client;
}