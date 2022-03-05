import { test, expect } from '@playwright/test';
import { Config } from '@/config';
import { api } from '@/lib';

const config = new Config();
const screenshotPath = `${process.cwd()}/src/tests/image`;
const txt: string[] = [];

test.beforeEach(async ({ page }) => {
  await page.goto(config.instaURL);
});

test.describe('Instagram Auto Like', () => {
  test.beforeAll(async ({ browserName }) => {
    txt.push(`[Instagram Auto Like] start for ${browserName}`);
  });

  test.afterAll(async ({ browserName }) => {
    txt.push(`[Instagram Auto Like] End for ${browserName}`);
    await api.service.postLine(txt);
  });

  test('Login Test.', async ({ page }) => {
    await page.locator('input[name=username]').click();
    await page.locator('input[name=username]').fill(config.instaId);
    await page.locator('input[name=password]').click();
    await page.locator('input[name=password]').fill(config.instaPass);

    /** ログインができているまで */
    await Promise.all([
      page.waitForNavigation({ url: 'https://www.instagram.com/accounts/onetap/?next=%2F', waitUntil: 'load' }),
      page.locator('button[type=submit]').first().click(),
      await page.screenshot({ path: `${screenshotPath}/login.png` }),
    ]);

    await Promise.all([
      page.locator('text=Not Now').click(),
      expect(page).toHaveURL('https://www.instagram.com/accounts/onetap/?next=%2F'),
      await page.screenshot({ path: `${screenshotPath}/popup1.png` }),
    ]);

    await Promise.all([
      expect(page).toHaveURL('https://www.instagram.com/'),
      await page.screenshot({ path: `${screenshotPath}/popup2.png` }),
    ]);

    await page.screenshot({ path: `${screenshotPath}/logined.png`, fullPage: true });
  });

  /** login後 */
  test('Go to New Page.', async ({ page }) => {
    config.setHashURL = '今日のコーディネート';
    await page.goto(config.instaHashURL);
    await page.screenshot({ path: `${screenshotPath}/hash_page.png`, fullPage: true });
  });

  /**
   * @手順
   * ※これをダイアログで書く(明日)
   * 画像をダブルタップ→もーだるが開く
   * その画像をダブルタップ→いいね(とURLを保存しておく)
   * 次をクリック
   * その画像をダブルタップ→いいね(とURLを保存しておく)
   * 次をクリック
   * ...以降繰り返し
   */
});
