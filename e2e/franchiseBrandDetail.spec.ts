import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const EXPLORE = `${BASE}/franchise/explore`;

test.describe("프랜차이즈 탐색→상세 흐름 + 상태복원 + 추천블록", () => {
  test("탐색→상세 진입, 지표/주석/추천 노출, 뒤/앞으로 상태 유지", async ({ page }) => {
    // 1) 탐색 진입
    await page.goto(EXPLORE, { waitUntil: "domcontentloaded" });

    // 2) F&B 칩 토글 → URL에 cat=F%26B 포함되어야 함
    await page.getByTestId("cat-F&B").click();
    await expect(page).toHaveURL(/cat=F%26B/);

    // 3) 검색(Enter) 동작 확인
    const search = page.getByTestId("search-input");
    await search.click();
    await search.fill("브랜드");           // 어떤 샘플이든 최소 1개는 걸리도록
    await search.press("Enter");
    await expect(page).toHaveURL(/q=%/);  // q 파라미터 존재

    // 4) 정렬 변경 → 제출(Enter)
    const sel = page.getByTestId("sort-select");
    await sel.selectOption("name");
    await search.press("Enter");
    await expect(page).toHaveURL(/sort=name/);

    // 5) 카드 클릭 → 상세 진입
    const firstCard = page.locator('[data-testid^="brand-card-"]').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // 6) 상세 요소 확인: 스파크라인 / 주석 / 추천 리스트
    await expect(page.getByTestId("spark-trend")).toBeVisible();
    await expect(page.getByTestId("trend-note")).toHaveText(/기준월=100/);
    const recoList = page.getByTestId("reco-list");
    await expect(recoList).toBeVisible();
    await expect(page.locator('[data-testid^="reco-card-"]')).toHaveCountGreaterThan(0);

    // 7) “탐색으로” 클릭 → 상태 보존 확인(q/sort/cat 유지)
    await page.getByTestId("back-to-explore").click();
    await expect(page).toHaveURL(/\/franchise\/explore/);
    await expect(page).toHaveURL(/cat=F%26B/);
    await expect(page).toHaveURL(/q=%/);
    await expect(page).toHaveURL(/sort=name/);

    // 8) 다시 카드 클릭 → 상세 → 뒤로/앞으로 동작
    await page.locator('[data-testid^="brand-card-"]').first().click();
    await expect(page.getByTestId("spark-trend")).toBeVisible();
    await page.goBack();   // 탐색으로
    await expect(page).toHaveURL(/\/franchise\/explore/);
    await page.goForward(); // 상세로
    await expect(page.getByTestId("spark-trend")).toBeVisible();
  });
});

// Custom matcher: toHaveCountGreaterThan
expect.extend({
  async toHaveCountGreaterThan(locator: any, expectedMin: number) {
    const count = await locator.count();
    const pass = count > expectedMin;
    return {
      pass,
      message: () =>
        `expected locator count > ${expectedMin}, but got ${count}`,
    };
  },
});
