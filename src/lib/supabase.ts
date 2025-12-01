import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Supa = ReturnType<typeof createClient>;
let _client: Supa | null = null;

/** 서버/클라이언트 어디서든 같은 옵션으로 재사용 */
export function supabase(): Supa {
  if (!_client) {
    _client = createClient(url, anon, { auth: { persistSession: false } });
  }
  return _client;
}
