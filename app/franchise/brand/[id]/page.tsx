	import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { BRANDS } from '@/lib/reco';
import { toViewModel } from '@/lib/brand-logic';
import BrandDetailClient from './BrandDetailClient'; // 방금 만든 그 파일!

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function FranchiseBrandPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Mock 데이터 우선 검색
  let raw = (BRANDS as any[]).find((b) => b.id === id || b.id === id.replace(/-\d+$/, ''));

  // 2. DB 검색
  if (!raw) {
    const { data } = await supabase
      .from('franchises')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data) {
      // DB 데이터를 뷰모델 형식으로 매핑 (엉아의 DB 구조 반영)
      raw = {
        id: String(data.id),
        name: data.brand_name,
        category: data.category,
        startupCostTotal: data.startup_cost,
        avgSales: data.average_sales,
        storesTotal: data.branch_count,
        mainImage: data.image_url,
        // 나머지 필드 안전장치
        hqName: data.brand_name,
        feeJoin: 0, feeDeposit: 0, feeTraining: 0, interiorCostPerPy: 0,
        establishedYear: data.established_year,
        storeTrend3Y: [], // 추후 연동
      };
    }
  }

  // 3. 데이터 없으면 에러 화면
  if (!raw) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-bold">브랜드 정보를 찾을 수 없습니다.</p>
        <Link href="/franchise/explore" className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-full text-sm">목록으로</Link>
      </div>
    );
  }

  // 4. ViewModel 변환 후 클라이언트 컴포넌트로 전달
  const vm = toViewModel(raw);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <BrandDetailClient vm={vm} />
    </main>
  );
}