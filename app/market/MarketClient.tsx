'use client';

import React, { useState, useRef } from 'react';
import Script from 'next/script';
import RollingBanner from '@/components/home/RollingBanner';
// [중요] 여기 Import 경로가 이제 정상적으로 동작할 것입니다.
import { MarketFilters, MarketKPIs, MarketCharts, MarketAnalysisData } from '@/components/MarketAnalysis';
import { fetchMarketAnalysis } from '@/lib/market';

// [초기 데이터 설정] 앱이 처음 켜질 때 에러 안 나게 방어
const INITIAL_DATA: MarketAnalysisData = {
  grade: 'B', 
  summaryReport: {
    growthTitle: '데이터 분석 중...',
    growthDesc: '상권 데이터를 불러오고 있습니다.',
    stabilityTitle: '데이터 분석 중...',
    stabilityDesc: '잠시만 기다려주세요.',
    compTitle: '데이터 분석 중...',
    compDesc: '최신 데이터를 조회하고 있습니다.'
  },
  profitTrend: [],
  ageDist: [],
  genderDist: [],
  population: [],
  costStructure: [],
  timeIndex: [],
  kpiCards: [],
};

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MarketClient() {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<any[]>([]);
  const [currentAddr, setCurrentAddr] = useState('위치 확인 중...');
  const [currentCategory, setCurrentCategory] = useState('전체');
  const [totalStoreCount, setTotalStoreCount] = useState(0);

  const [analysisData, setAnalysisData] = useState<MarketAnalysisData>(INITIAL_DATA);
  const [isDataReady, setIsDataReady] = useState(false);

  const initMap = () => {
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      const container = document.getElementById('map-container');
      const options = { center: new window.kakao.maps.LatLng(37.4979, 127.0276), level: 5 };
      const map = new window.kakao.maps.Map(container, options);
      mapRef.current = map;
      setLoading(false);

      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      const onIdle = () => {
        searchAddr(map.getCenter());
      };

      window.kakao.maps.event.addListener(map, 'dragend', onIdle);
      window.kakao.maps.event.addListener(map, 'zoom_changed', onIdle);

      searchAddr(map.getCenter());
      // 초기 로딩 시 기본 위치로 한번 검색
      handleSearchLocation(currentAddr, '전체');
    });
  };

  const handleSearchLocation = (address: string, industryKeyword: string) => {
    const selectedCategory = industryKeyword || '전체';
    setCurrentCategory(selectedCategory);
    setIsDataReady(false);

    // 지도 핀 초기화
    if (markersRef.current.length > 0) {
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];
    }
    setStores([]); 

    if (mapRef.current && address !== currentAddr && address !== '위치 확인 중...') {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                mapRef.current.panTo(coords);
                searchAddr(coords);
            }
        });
    }

    // 지도 이동 애니메이션 시간 고려 후 데이터 조회
    setTimeout(() => {
        if (mapRef.current) {
            fetchStores(mapRef.current, selectedCategory);
        }
    }, 800);
  };

  const searchAddr = (coords: any) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const region = result.find((r: any) => r.region_type === 'H');
        if (region) setCurrentAddr(region.address_name);
      }
    });
  };

  const fetchStores = async (map: any, categoryKeyword: string) => {
    const center = map.getCenter();
    try {
      const url = `/api/stores?lat=${center.getLat()}&lng=${center.getLng()}&numOfRows=3000&radius=1000`;

      const res = await fetch(url);
      const data = await res.json();

      if (markersRef.current.length > 0) {
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];
      }

      let filteredCount = 0;

      if (data.body?.items) {
        let list = data.body.items;
        setTotalStoreCount(list.length);

        if (categoryKeyword && categoryKeyword !== '전체') {
          list = list.filter((item: any) => checkCategoryMatch(item, categoryKeyword));
        }

        setStores(list);
        filteredCount = list.length;

        list.forEach((store: any) => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(store.lat, store.lon),
            map: map,
          });

          const iwContent = `
            <div style="padding:10px;font-size:12px;color:#333;border-radius:8px;border:none;white-space:nowrap;">
              <strong style="display:block;margin-bottom:2px;">${store.bizesNm}</strong>
              <span style="color:gray;font-size:11px;">${store.indsMclsNm} > ${store.indsSclsNm}</span>
            </div>
          `;
          const infowindow = new window.kakao.maps.InfoWindow({ content: iwContent, removable: true });
          window.kakao.maps.event.addListener(marker, 'click', () => infowindow.open(map, marker));

          markersRef.current.push(marker);
        });
      } else {
        setStores([]);
        setTotalStoreCount(0);
      }

      // [핵심] Supabase 데이터 조회 요청
      updateDashboard(currentAddr, categoryKeyword, filteredCount);

    } catch (e) {
        console.error("데이터 실패:", e);
        updateDashboard(currentAddr, categoryKeyword, 0);
    }
  };

  const updateDashboard = async (address: string, category: string, count: number) => {
    const data = await fetchMarketAnalysis(address, category, count);
    setAnalysisData(data);
    setIsDataReady(true);
  };

  const checkCategoryMatch = (item: any, keyword: string) => {
    if (keyword === '전체') return true;

    const categoryInfo = `${item.indsLclsNm} ${item.indsMclsNm} ${item.indsSclsNm}`.toLowerCase();
    const nameInfo = item.bizesNm.toLowerCase();
    const key = keyword.toLowerCase();

    if (key === '편의점') {
        return categoryInfo.includes('편의점') || categoryInfo.includes('종합소매') || categoryInfo.includes('슈퍼') || (nameInfo.includes('24') && item.indsLclsNm === '소매');
    }
    if (key === '카페') {
        return categoryInfo.includes('커피') || categoryInfo.includes('카페') || categoryInfo.includes('다방') || categoryInfo.includes('음료') || categoryInfo.includes('디저트');
    }
    if (key === '한식') {
        return categoryInfo.includes('한식') || categoryInfo.includes('분식') || categoryInfo.includes('국수') || categoryInfo.includes('칼국수') || categoryInfo.includes('국밥') || categoryInfo.includes('해장국') || categoryInfo.includes('백반');
    }

    return categoryInfo.includes(key) || nameInfo.includes(key);
  };

  return (
    <div className="w-full flex justify-center bg-slate-50 relative min-h-screen">
      <div className="w-full max-w-6xl px-4 py-6 md:px-6 lg:px-8 space-y-8">

        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT_ID}&libraries=services,clusterer&autoload=false`}
          strategy="afterInteractive"
          onReady={initMap}
        />

        <section><RollingBanner /></section>

        {/* 검색 필터 */}
        <MarketFilters onSearch={handleSearchLocation} />

        {/* 로딩 중이거나 데이터가 준비되면 KPI 카드 표시 */}
        {isDataReady ? (
            <MarketKPIs data={analysisData} />
        ) : (
            <div className="h-32 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-400">
                <span className="animate-pulse">📊 상권 데이터를 열심히 분석하고 있습니다...</span>
            </div>
        )}

        {/* 지도 영역 */}
        <div className="relative w-full h-[500px] bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <div id="map-container" className="w-full h-full" />

          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-5 py-3 rounded-xl shadow-lg z-20 border border-slate-200">
              <p className="text-xs font-bold text-slate-500 mb-1">현재 분석 위치</p>
              <p className="text-lg font-extrabold text-indigo-900 flex items-center gap-2">📍 {currentAddr}</p>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-xs text-slate-500">
                  주변 탐색: <b>{totalStoreCount}</b>개 중
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-indigo-600">
                    {currentCategory} : {stores.length}개 발견
                  </span>
                </div>
              </div>
          </div>

          {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 font-bold text-slate-600">
                🌏 지도를 불러오는 중입니다...
              </div>
          )}
        </div>

        {/* 상세 차트 및 리포트 */}
        {isDataReady ? (
            <MarketCharts data={analysisData} />
        ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
                <p>🏗️</p>
                <p className="mt-2 text-sm">분석이 완료되면 상세 리포트가 여기에 표시됩니다.</p>
            </div>
        )}
      </div>
    </div>
  );
}