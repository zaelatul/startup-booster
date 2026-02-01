import { createClient } from '@supabase/supabase-js';
import BrandDetailClient from './BrandDetailClient';
import { FRANCHISE_MOCK_DATA } from '@/lib/franchise-data';
// ✅ [추가] 기록 담당 컴포넌트 불러오기
import RecentLogger from '@/components/common/RecentLogger';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FranchiseDetailPage({ params }: Props) {
  const { id } = await params;

  // 1. DB에서 데이터 가져오기
  const { data: dbData } = await supabase
    .from('franchises')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  // 2. 데이터 매핑
  let vm = null;

  if (dbData) {
    vm = {
      id: dbData.id,
      name: dbData.name,
      hqName: dbData.company_name,
      ceoName: dbData.ceo_name,
      address: dbData.address,
      contact: dbData.contact,
      logoUrl: dbData.logo_url,
      mainImage: dbData.hero_image, 
      category: dbData.category,
      
      avgSales: typeof dbData.avg_revenue === 'object' ? dbData.avg_revenue.total : dbData.avg_revenue || 0,
      startupCostTotal: dbData.initial_costs?.totalAvg || 0,
      storesTotal: dbData.store_summary?.total || 0,

      financials: dbData.financials || [],
      legalStatus: dbData.legal_status || { hasViolation: false },
      storeTrends: dbData.store_trends || [],
      storeSummary: dbData.store_summary || FRANCHISE_MOCK_DATA.storeSummary,
      regionalStores: dbData.regional_stores || [],
      
      avgRevenue: typeof dbData.avg_revenue === 'object' ? dbData.avg_revenue : { total: dbData.avg_revenue || 0, perPyeong: 0 },
      
      initialCosts: dbData.initial_costs || FRANCHISE_MOCK_DATA.initialCosts,
      ongoingCosts: dbData.ongoing_costs || FRANCHISE_MOCK_DATA.ongoingCosts,
      
      contract: dbData.contract || FRANCHISE_MOCK_DATA.contract,
      
      riskBadges: dbData.legal_status?.hasViolation ? ['위반이력'] : [],
      categoryKey: 'cafe' 
    };
  } else {
    vm = {
      ...FRANCHISE_MOCK_DATA,
      id: id,
      name: `(임시) ${FRANCHISE_MOCK_DATA.name}`,
      startupCostTotal: FRANCHISE_MOCK_DATA.initialCosts.totalAvg,
      storesTotal: FRANCHISE_MOCK_DATA.storeSummary.total,
      mainImage: null,
      avgSales: FRANCHISE_MOCK_DATA.avgRevenue.total,
      riskBadges: [],
      categoryKey: 'cafe'
    };
  }

  // 3. 클라이언트 컴포넌트로 데이터 전달 + ✅ [추가] 기록 로거 심기
  return (
    <>
      <RecentLogger 
        id={`brand-${vm.id}`} 
        brand={vm.name} 
        branch={vm.category || '프랜차이즈'} 
        image={vm.mainImage || ''} 
        url={`/franchise/brand/${vm.id}`} 
      />
      <BrandDetailClient vm={vm} />
    </>
  );
}