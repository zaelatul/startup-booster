import { createClient } from '@supabase/supabase-js';
import BrandDetailClient from '@/app/franchise/brand/[id]/BrandDetailClient'; 
import { FRANCHISE_MOCK_DATA } from '@/lib/franchise-data';

// ✅ [수정됨] 환경변수가 없으면 가짜 값('placeholder')을 넣어서 빌드 에러를 막습니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FranchiseDetailPage({ params }: Props) {
  const { id } = await params;

  // 1. DB 조회
  const { data: dbData } = await supabase
    .from('franchises')
    .select('*')
    .eq('id', id)
    .maybeSingle();

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
      heroImage: dbData.hero_image, 
      category: dbData.category,
      
      // [수정] DB의 'avg_duration' -> UI의 'avgDuration' 연결
      avgDuration: dbData.avg_duration || '정보 없음', 
      
      // [핵심 수정] DB의 'base_size_m2' -> UI의 'baseSizeM2'로 연결 (이름표 통일!)
      baseSizeM2: dbData.base_size_m2 || 50, 

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
    };
  } else {
    vm = {
      ...FRANCHISE_MOCK_DATA,
      id: id,
      name: `(임시) ${FRANCHISE_MOCK_DATA.name}`,
      heroImage: null, 
      avgDuration: '0년 0개월',
      baseSizeM2: 50
    };
  }

  return <BrandDetailClient vm={vm} />;
}