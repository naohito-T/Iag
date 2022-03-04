import { test } from '@playwright/test';

const screenshotPath = `${process.cwd()}/src/tests/image`;

test.beforeEach(async ({ page }) => {
  await page.goto('https://fes.nijisanji.jp/');
});

/**
 * @desc レスポンシブに関しては人力での対応を良しとしている
 *       そのため以下のテストでは代表的なデバイス幅でスクリーンショットを撮ることまで対応している
 *       2022/03/04 Chrome検証からデバイス値は参照
 */
test.describe('レスポンシブチェック', () => {
  test('スマホ viewportスクリーン(iphone XR)', async ({ page }) => {
    await page.setViewportSize({
      width: 414,
      height: 896,
    });
    await page.screenshot({ path: `${screenshotPath}/iphone_xr.png` });
  });

  test('タブレット viewportスクリーンショット(ipad Air)', async ({ page }) => {
    await page.setViewportSize({
      width: 820,
      height: 1180,
    });
    await page.screenshot({ path: `${screenshotPath}/ipad_air.png` });
  });

  test('PC viewportスクリーンショット', async ({ page }) => {
    await page.setViewportSize({
      width: 1366,
      height: 1020,
    });
    await page.screenshot({ path: `${screenshotPath}/pc.png` });
  });
});
