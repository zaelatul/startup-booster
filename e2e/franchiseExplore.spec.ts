import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const EXPLORE = `${BASE}/franchise/explore`;

test.describe("프랜차이즈 탐색(Explore)", () => {
  test("검색 입력 후 Enter → URL q 반영 & 입력값 복원", async ({ page }) => {
    await page.goto(EXPLORE, { waitUntil: "domcontentloaded" });

    const input = page.getByTestId("search-input");
    await input.click();
    await input.fill("브랜드");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      input.press("Enter"),
    ]);

    await expect(page).toHaveURL(/\/franchise\/explore.*[?&]q=/);
    await expect(page.getByTestId("search-input")).toHaveValue("브랜드");
  });

  test("브라우저 뒤로/앞으로: q/카테고리 상태가 히스토리에 동기화", async ({ page }) => {
    await page.goto(EXPLORE, { waitUntil: "domcontentloaded" });

    // 1) F&B 칩 토글 → cat 파라미터 생성
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.getByTestId("cat-F&B").click(),
    ]);
    await expect(page).toHaveURL(/cat=F%26B/);

    // 2) 검색어 입력 후 Enter → q 추가
    const input = page.getByTestId("search-input");
    await input.click();
    await input.fill("브랜드");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      input.press("Enter"),
    ]);
    await expect(page).toHaveURL(/cat=F%26B/);
    await expect(page).toHaveURL(/q=/);

    // 3) 뒤로 → cat만 있고 q는 없음
    await page.goBack(); // 한 단계 이전 히스토리
    await expect(page).toHaveURL(/cat=F%26B/);
    await expect(page).not.toHaveURL(/q=/);

    // 4) 앞으로 → cat과 q가 모두 복원
    await page.goForward();
    await expect(page).toHaveURL(/cat=F%26B/);
    await expect(page).toHaveURL(/q=/);
  });

  test("정렬 변경 시 URL sort 반영", async ({ page }) => {
    await page.goto(EXPLORE, { waitUntil: "domcontentloaded" });

    const input = page.getByTestId("search-input");
    await input.click();
    await input.fill("브랜드");

    const sel = page.getByTestId("sort-select");
    await sel.selectOption("name");

    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      input.press("Enter"),
    ]);

    await expect(page).toHaveURL(/sort=name/);
  });

  test("카테고리 다중 선택: Retail → (안정 대기) → F&B → URL에 다중 반영", async ({ page }) => {
    await page.goto(EXPLORE, { waitUntil: "domcontentloaded" });

    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.getByTestId("cat-Retail").click(),
    ]);
    await expect(page).toHaveURL(/cat=Retail/);

    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.getByTestId("cat-F&B").click(),
    ]);
    // cat=Retail &cat=F%26B 형태(순서는 플랫하게 검증)
    await expect(page).toHaveURL(/cat=Retail/);
    await expect(page).toHaveURL(/cat=F%26B/);
  });
});
