import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type ProductKind = 'floor' | 'wall';

type ProductRow = {
  id: string;
  kind: ProductKind;
  name: string;
  price_per_sqm: number;
  status?: string;
};

type ProductImageRow = {
  product_id: string;
  url: string;
  alt: string | null;
  sort: number | null;
};

type PhotoRow = {
  url: string;
  alt: string | null;
  kind: ProductKind | 'other' | null;
  sort: number | null;
};

const FALLBACK = {
  products: [
    { id: 'floor-demo', kind: 'floor', name: '바닥 — 데코타일', price_per_sqm: 45000, images: [] as { url: string; alt?: string }[] },
    { id: 'wall-demo',  kind: 'wall',  name: '벽 — 소프트스톤', price_per_sqm: 65000, images: [] as { url: string; alt?: string }[] },
  ],
  photos: Array.from({ length: 6 }, (_, i) => ({ url: '', alt: `샘플 사진 ${i + 1}`, kind: null as null | ProductKind })),
};

export const dynamic = 'force-dynamic'; // 항상 최신 조회
export const revalidate = 0;

export async function GET() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // env가 없으면 폴백 제공
  if (!url || !anon) {
    return NextResponse.json(FALLBACK, { headers: { 'Cache-Control': 'no-store' } });
  }

  const supabase = createClient(url, anon, { auth: { persistSession: false } });

  try {
    const [{ data: products, error: e1 }, { data: images, error: e2 }, { data: photos, error: e3 }] = await Promise.all([
      supabase
        .from('products')
        .select('id, kind, name, price_per_sqm, status')
        .order('kind', { ascending: true }) as any,
      supabase
        .from('product_images')
        .select('product_id, url, alt, sort')
        .order('sort', { ascending: true }) as any,
      supabase
        .from('interior_photos')
        .select('url, alt, kind, sort')
        .order('sort', { ascending: true })
        .limit(18) as any,
    ]);

    if (e1 || e2 || e3) {
      const msg = (e1 || e2 || e3)?.message || 'unexpected supabase error';
      throw new Error(msg);
    }

    const imgMap = new Map<string, { url: string; alt?: string }[]>();
    (images as ProductImageRow[] | null)?.forEach((im) => {
      const arr = imgMap.get(im.product_id) ?? [];
      arr.push({ url: im.url, alt: im.alt ?? undefined });
      imgMap.set(im.product_id, arr);
    });

    const active = (products as ProductRow[] | null)?.filter((p) => (p.status ?? 'active') === 'active') ?? [];

    const outProducts = active.map((p) => ({
      id: p.id,
      kind: p.kind,
      name: p.name,
      price_per_sqm: p.price_per_sqm,
      images: imgMap.get(p.id) ?? [],
    }));

    const outPhotos =
      (photos as PhotoRow[] | null)?.map((ph) => ({
        url: ph.url,
        alt: ph.alt ?? undefined,
        kind: (ph.kind as ProductKind | null) ?? null,
      })) ?? [];

    return NextResponse.json({ products: outProducts, photos: outPhotos }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[interior/catalog] error:', err);
    // 오류 시에도 UX가 끊기지 않게 폴백
    return NextResponse.json(FALLBACK, { headers: { 'Cache-Control': 'no-store' } });
  }
}
