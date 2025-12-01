import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Tab = "floor" | "wall";

type CatalogItem = {
  id: string;
  kind: Tab;
  name: string;
  brand?: string;
  unit: "box";
  pieceSizeMm: [number, number];
  pcsPerBox: number;
  m2PerBox: number;
  pricePerBox: number;
  adhesiveName?: string;
  adhesiveCoverageM2PerCan?: number;
  adhesivePricePerCan?: number;
};

type ShowcaseItem = { id: string; name: string; price: number; img: string; href?: string };

type Pack = {
  floor: { tab: "floor"; catalog: CatalogItem[]; showcase: ShowcaseItem[] };
  wall: { tab: "wall"; catalog: CatalogItem[]; showcase: ShowcaseItem[] };
};

// 안전 기본값(파일 없을 때 폴백)
const DEFAULT_PACK: Pack = {
  floor: {
    tab: "floor",
    catalog: [
      {
        id: "floor-deco-basic",
        kind: "floor",
        name: "데코타일 3T (152×914) 18장/박스",
        unit: "box",
        pieceSizeMm: [152, 914],
        pcsPerBox: 18,
        m2PerBox: 3.34,
        pricePerBox: 42000,
        adhesiveName: "LVT 전용본드 3kg",
        adhesiveCoverageM2PerCan: 6,
        adhesivePricePerCan: 14000,
      },
    ],
    showcase: [
      {
        id: "p1",
        name: "데코타일 내추럴 오크",
        price: 42000,
        img: "https://images.unsplash.com/photo-1582582621959-48d99f8d9c4a?q=80&w=800&auto=format",
      },
      {
        id: "p2",
        name: "데코타일 라이트 그레이",
        price: 44000,
        img: "https://images.unsplash.com/photo-1520881544934-431f3c3d0f83?q=80&w=800&auto=format",
      },
      {
        id: "p3",
        name: "데코타일 월넛 브라운",
        price: 44000,
        img: "https://images.unsplash.com/photo-1520881544934-431f3c3d0f83?q=80&w=800&auto=format",
      },
    ],
  },
  wall: {
    tab: "wall",
    catalog: [
      {
        id: "wall-softstone-600x300",
        kind: "wall",
        name: "소프트스톤 600×300 10장/박스",
        unit: "box",
        pieceSizeMm: [600, 300],
        pcsPerBox: 10,
        m2PerBox: 1.8,
        pricePerBox: 59000,
        adhesiveName: "소프트스톤 전용 접착제 3kg",
        adhesiveCoverageM2PerCan: 8,
        adhesivePricePerCan: 16000,
      },
    ],
    showcase: [
      {
        id: "w1",
        name: "소프트스톤 베이지 600×300",
        price: 59000,
        img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format",
      },
      {
        id: "w2",
        name: "소프트스톤 그레이 600×300",
        price: 59000,
        img: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=800&auto=format",
      },
    ],
  },
};

async function loadPack(): Promise<{ pack: Pack; source: "file" | "local-snapshot" }> {
  const path = `${process.cwd()}/data/interior/products.json`;
  try {
    const fs = await import("fs/promises");
    const txt = await fs.readFile(path, "utf8");
    const json = JSON.parse(txt) as Pack;
    // 간단 검증
    if (!json?.floor?.catalog || !json?.wall?.catalog) throw new Error("bad shape");
    return { pack: json, source: "file" };
  } catch {
    return { pack: DEFAULT_PACK, source: "local-snapshot" };
  }
}

export async function GET(req: NextRequest) {
  const { pack, source } = await loadPack();

  const url = new URL(req.url);
  const tab = (url.searchParams.get("tab") === "wall" ? "wall" : "floor") as Tab;
  const section = url.searchParams.get("section"); // 'catalog' | 'showcase' | null
  const limit = Number(url.searchParams.get("limit") || "0");
  const q = (url.searchParams.get("q") || "").toLowerCase();

  const data = pack[tab];

  const filterByQ = <T extends { name: string }>(arr: T[]) =>
    q ? arr.filter((x) => x.name.toLowerCase().includes(q)) : arr;

  let catalog = filterByQ(data.catalog);
  let showcase = filterByQ(data.showcase);

  if (section === "catalog") {
    if (limit > 0) catalog = catalog.slice(0, limit);
    return NextResponse.json({
      ok: true,
      at: new Date().toISOString(),
      tab,
      catalog,
      count: { catalog: catalog.length },
      source,
    });
  }
  if (section === "showcase") {
    if (limit > 0) showcase = showcase.slice(0, limit);
    return NextResponse.json({
      ok: true,
      at: new Date().toISOString(),
      tab,
      showcase,
      count: { showcase: showcase.length },
      source,
    });
  }

  return NextResponse.json({
    ok: true,
    at: new Date().toISOString(),
    tab,
    catalog,
    showcase,
    count: { catalog: catalog.length, showcase: showcase.length },
    source,
  });
}
