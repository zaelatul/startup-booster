import { createClient } from '@supabase/supabase-js';

// [중요] '!' 느낌표를 지우고 '||' 연산자로 임시 값을 넣어줘야 빌드가 안 터집니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// 클라이언트 타입 정의 (필요시 사용, 없으면 any로 대체 가능)
// type Supa = ReturnType<typeof createClient>; 

// 싱글톤 인스턴스
let client: any = null;

export function supabase() {
  if (!client) {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false // 서버 사이드 렌더링 시 세션 충돌 방지
      }
    });
  }
  return client;
}

// 간단하게 바로 쓸 수 있는 객체도 export (기존 코드 호환용)
export const supabaseClient = createClient(supabaseUrl, supabaseKey);