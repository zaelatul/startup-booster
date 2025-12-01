import { supabase } from './supabase';

export type Banner = { id: string; title: string; href: string };

const FALLBACK: Banner[] = [
  { id: 'b1', title: '상권분석 베타 오픈', href: '/market#filters' },
  { id: 'b2', title: '프랜차이즈 분석 바로가기', href: '/franchise/analysis' },
  { id: 'b3', title: 'MBTI로 보는 창업 (10문항)', href: '/mbti' },
];

export async function getBanners(): Promise<Banner[]> {
  try {
    const { data, error } = await supabase()
      .from('banners')
      .select('id, title, href, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    const rows = data ?? [];
    return (rows.length ? rows : FALLBACK).map((r: any) => ({
      id: String(r.id),
      title: r.title,
      href: r.href,
    }));
  } catch {
    return FALLBACK; // 장애 시에도 UI 유지
  }
}
