import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Node 런타임 고정(서비스롤 사용 시 안전)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ProductKind = 'floor' | 'wall';

type Body = {
  product: ProductKind;
  name: string;
  phone: string;
  region: string;  // 동까지
  memo?: string;
  area_m2?: number | null;
  budget_won?: number | null;
};

function onlyDigits(s: string) {
  return (s || '').replace(/[^0-9]/g, '');
}

function bad(msg: string, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code });
}

export async function POST(req: Request) {
  // --- 환경변수 확인 ---
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!url || !serviceKey) {
    return bad('server env not configured (SUPABASE_URL/service role key)', 500);
  }

  // --- 본문 파싱 ---
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return bad('invalid JSON body');
  }

  // --- 값 정리/검증(아주 기본) ---
  const product = body.product;
  const name = (body.name || '').trim();
  const phoneDigits = onlyDigits(body.phone || '');
  const region = (body.region || '').trim();
  const memo = (body.memo || '').trim();
  const area_m2 =
    body.area_m2 === undefined || body.area_m2 === null
      ? null
      : Math.max(0, Number(body.area_m2));
  const budget_won =
    body.budget_won === undefined || body.budget_won === null
      ? null
      : Math.max(0, Math.floor(Number(body.budget_won)));

  if (product !== 'floor' && product !== 'wall') {
    return bad('product must be "floor" or "wall"');
  }
  if (name.length < 1 || name.length > 60) {
    return bad('name length 1~60 required');
  }
  if (phoneDigits.length < 9 || phoneDigits.length > 13) {
    return bad('phone digits length 9~13 required');
  }
  if (region.length < 1 || region.length > 80) {
    return bad('region length 1~80 required');
  }
  if (memo.length > 1000) {
    return bad('memo too long');
  }

  // --- DB INSERT (service_role 전용) ---
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  try {
    const { data, error } = await supabase
      .from('interior_rfq')
      .insert({
        product,
        name,
        phone: phoneDigits, // 숫자만 저장
        region,
        memo,
        area_m2,
        budget_won,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[RFQ insert error]', error);
      return bad('failed to save RFQ', 500);
    }

    return NextResponse.json(
      { ok: true, id: data?.id, ts: new Date().toISOString() },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (e) {
    console.error('[RFQ unexpected]', e);
    return bad('unexpected server error', 500);
  }
}

// 다른 메서드는 금지
export async function GET() {
  return bad('method not allowed', 405);
}
