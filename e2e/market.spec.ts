// 신규 — e2e/market.spec.ts
import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";

test.describe("상권분석(마켓) 기본 플로우", () => {
  test("URL 파라미터 → 화면 반영 & KPI 렌더", async ({ page }) => {
    await page.goto(`${BASE}/market?dong=1144066000&biz=FNB`);
    // 행정동 코드 인풋에 초기값 반영
    await expect(page.getByLabel("행정동 코드")).toHaveValue("1144066000");
    // 업종 콤보박스 라벨 기준 확인
    await expect(page.getByLabel("업종")).toHaveValue(/FNB|F&B/i);
    // KPI 카드 텍스트가 비어있지 않은지 (간단 검증)
    await expect(page.getByText("평균매출").locator("..")).not.toHaveText(/^\s*$/);
    await expect(page.getByText("수익률").locator("..")).not.toHaveText(/^\s*$/);
  });

  test("지표 조회 → 하단 코드/지표 갱신", async ({ page }) => {
    await page.goto(`${BASE}/market?dong=1144066000&biz=FNB`);
    await page.getByLabel("행정동 코드").fill("1168064000");
    await page.getByRole("button", { name: "지표 조회" }).click();
    // 하단 카드 안의 코드가 변경되었는지
    await expect(page.getByText("1168064000")).toBeVisible();
  });

  test("업종 변경 ↔ URL 동기화 + 요청 URL 새 탭 확인", async ({ page, context }) => {
    await page.goto(`${BASE}/market?dong=1144066000&biz=FNB`);
    await page.getByLabel("업종").selectOption({ label: /Retail/i });
    await expect(page).toHaveURL(/biz=RETAIL/i);

    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("button", { name: "새 탭에서 열기" }).click(),
    ]);
    await popup.waitForLoadState("domcontentloaded");
    // 메트릭 JSON 페이지에 kpi 문구가 보이는지 (가벼운 확인)
    await expect(popup.locator("body")).toContainText('"kpi"');
    await popup.close();
  });
});
