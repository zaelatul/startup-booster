// app/api/interior/catalog/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type Product = { id: string; kind: 'floor'|'wall'; name: string; price_per_sqm: number; status?: string|null };
type ProdImg = { product_id: string; url: string; alt: string|null; sort: number|null };
type Photo   = { url: string; alt: string|null; kind: 'floor'|'wall'|'other'|null; sort: number|null };

const FALLBACK = {
  products: [
    { id:'floor-demo', kind:'floor', name:'바닥 — 데코타일', price_per_sqm:45000, images: [] as {url:string;alt?:string}[] },
    { id:'wall-demo',  kind:'wall',  name:'벽 — 소프트스톤', price_per_sqm:65000, images: [] as {url:string;alt?:string}[] },
  ],
  photos: Array.from({length:6},(_,i)=>({ url:'', alt:`샘플 사진 ${i+1}`, kind:null as any })),
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const url  = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.json(FALLBACK, { headers:{'Cache-Control':'no-store'} });

  const sb = createClient(url, anon, { auth:{ persistSession:false } });

  try {
    const [{ data:products, error:e1 }, { data:imgs, error:e2 }, { data:photos, error:e3 }] = await Promise.all([
      sb.from('products').select('id,kind,name,price_per_sqm,status').order('kind',{ascending:true}) as any,
      sb.from('product_images').select('product_id,url,alt,sort').order('sort',{ascending:true}) as any,
      sb.from('interior_photos').select('url,alt,kind,sort').order('sort',{ascending:true}).limit(18) as any,
    ]);
    if (e1 || e2 || e3) throw new Error((e1||e2||e3)?.message || 'supabase error');

    const map = new Map<string, {url:string;alt?:string}[]>();
    (imgs as ProdImg[]|null)?.forEach(im=>{
      const arr = map.get(im.product_id) ?? [];
      arr.push({ url: im.url, alt: im.alt ?? undefined });
      map.set(im.product_id, arr);
    });
    const active = (products as Product[]|null)?.filter(p => (p.status ?? 'active') === 'active') ?? [];
    const outProducts = active.map(p=>({
      id:p.id, kind:p.kind, name:p.name, price_per_sqm:p.price_per_sqm, images: map.get(p.id) ?? []
    }));
    const outPhotos = (photos as Photo[]|null)?.map(ph=>({
      url:ph.url, alt:ph.alt ?? undefined, kind:(ph.kind as any)??null
    })) ?? [];

    return NextResponse.json({ products: outProducts, photos: outPhotos }, { headers:{'Cache-Control':'no-store'} });
  } catch (err) {
    console.error('[interior/catalog]', err);
    return NextResponse.json(FALLBACK, { headers:{'Cache-Control':'no-store'} });
  }
}
