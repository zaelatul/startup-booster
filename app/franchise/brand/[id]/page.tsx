import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import BrandDetailClient from './BrandDetailClient';
import { FRANCHISE_MOCK_DATA } from '@/lib/franchise-data';
import RecentLogger from '@/components/common/RecentLogger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

type Props = {
  params: Promise<{ id: string }>;
};

// --- [추가] 2단계 핵심: 검색 로봇을 위한 '검색 명함' 생성 함수 ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // 1. 검색 로봇이 미리 데이터를 읽어옵니다.
  const { data: dbData } = await supabase
    .from('franchises')
    .select('name, category, initial_costs')
    .eq('id', id)
    .maybeSingle();

  const brandName = dbData?.name || FRANCHISE_MOCK_DATA.name;
  const category = dbData?.category || FRANCHISE_MOCK_DATA.category;
  const cost = dbData?.initial_costs?.totalAvg || FRANCHISE_MOCK_DATA.initialCosts.totalAvg;
  
  // 2. 검색창에 노출될 매력적인 문구들을 구성합니다.
  const title = `${brandName} 창업비용 및 실제 수익성 분석 보고서 | 창업부스터`;
  const description = `${brandName}의 가맹점 평균 매출, 초기 창업비용(${Math.floor(cost / 10000)}억대), 순이익 데이터를 정보공개서 기반으로 정밀 분석했습니다. ${category} 창업 전 필수 체크리스트를 확인하세요.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://startup-booster.co.kr/franchise/brand/${id}`,
      images: [
        {
          url: 'https://startup-booster.co.kr/og-image.png', // 실제 OG 이미지가 있다면 경로 수정
          width: 1200,
          height: 630,
          alt: `${brandName} 분석 리포트`,
        },
      ],
    },
    // 네이버 및 구글 검색 엔진용 핵심 키워드
    keywords: [`${brandName} 창업`, `${brandName} 창업비용`, `${brandName} 수익`, `프랜차이즈 분석`, `${category} 창업`],
  };
}

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
      heroImage: dbData.hero_image, 
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
      
      initialCosts: {
        joinFee: dbData.initial_costs?.join_fee || dbData.initial_costs?.joinFee || 0,
        eduFee: dbData.initial_costs?.edu_fee || dbData.initial_costs?.eduFee || 0,
        deposit: dbData.initial_costs?.deposit || 0,
        interior: dbData.initial_costs?.interior || 0,
        other: dbData.initial_costs?.other || 0,
        security_deposit: dbData.initial_costs?.security_deposit || ''
      },
      ongoingCosts: dbData.ongoing_costs || FRANCHISE_MOCK_DATA.ongoingCosts,
      baseSizeM2: dbData.base_size_m2 || 0,
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

  // 3. 클라이언트 컴포넌트로 데이터 전달
  return (
    <>
      <RecentLogger 
        id={`brand-${vm.id}`} 
        brand={vm.name} 
        branch={vm.category || '프랜차이즈'} 
        image={vm.heroImage || ''} 
        url={`/franchise/brand/${vm.id}`} 
      />
      <BrandDetailClient vm={vm} />
    </>
  );
}