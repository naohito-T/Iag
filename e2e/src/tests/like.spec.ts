import { test, expect, chromium } from '@playwright/test';
import { Config } from '@/config';
import { api } from '@/lib';

const config = new Config();
const screenshotPath = `${process.cwd()}/src/tests/image`;
const txt: string[] = [];

/** 必ず最初に呼ばれる */
test.beforeAll(async ({ browserName }) => {
  txt.push(`[Instagram Auto Like] start for ${browserName}`);
});

/** 必ず最後に呼ばれる */
test.afterAll(async ({ browserName }) => {
  txt.push(`[Instagram Auto Like] End for ${browserName}`);
  await api.service.postLine(txt);
});

test.describe('Instagram Auto Like', () => {
  /** @desc test.describe内でtestごとによばれる */
  test.beforeEach(async ({ page }) => {
    if (process.env.PWDEBUG) {
      console.log('GUI mode で実行');
      await chromium.launch();
      await page.goto(config.instaURL);
    } else {
      console.log('headless mode で実行');
      await page.goto(config.instaURL);
    }
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
    txt.push('Login完了');

    config.setHashURL = '今日のコーディネート';
    /** Promise.allのなかでawaitをつかえば順に処理がされる */
    await Promise.all([
      page.waitForNavigation({ url: config.instaHashURL, waitUntil: 'commit' }),
      page.goto(config.instaHashURL),
      // await page.goForward(config.instaHashURL)
      await expect(page).toHaveURL(config.instaHashURL),
      await page.screenshot({ path: `${screenshotPath}/hash_page.png`, fullPage: true }),
    ]);

    await page.screenshot({ path: `${screenshotPath}/hash_page1.png`, fullPage: true });
    txt.push('次のpageへ遷移が完了');

    /** ハッシュpageにいく */
    // * 画像をダブルタップ→もーだるが開く

    // これが1 set
    const href = await page
      .locator('xpath=//*[@id="react-root"]/section/main/article/div[1]/div/div/div[1]/div[1]/a')
      .getAttribute('href');
    console.log(`hjjjjjjjjjjjjjjjj${href}`);
    await Promise.all([
      /** x path selector */
      page.screenshot({ path: `${screenshotPath}/hash_page2.png`, fullPage: true }),
      page.waitForNavigation({ url: `${config.instaURL}${href}` }),
      page
        .locator('xpath=//*[@id="react-root"]/section/main/article/div[1]/div/div/div[1]/div[1]/a/div[1]/div[2]')
        .click(),
      await expect(page).toHaveURL(`${config.instaURL}${href}`),
    ]);

    /** ここでファイルに書き込む */

    // 画像をダブルタップ
    // await page.locator('input[name=username]').dblclick();

    // for await ()
  });

  /**
   * @手順
   * ※これをダイアログで書く(明日)
   * 画像をダブルタップ→もーだるが開く
   * ここをfor await
   * その画像をダブルタップ→いいね(とURLを保存しておく)
   * 次をクリック
   * その画像をダブルタップ→いいね(とURLを保存しておく)
   * 次をクリック
   * ...以降繰り返し
   */
});

// test.describe('Next Page to Hash.', () => {
//   /** login後 */
//   test('Go to New Page Test.', async ({ page }) => {
//     config.setHashURL = '今日のコーディネート';

//     await page.screenshot({ path: `${screenshotPath}/hash_page.png`, fullPage: true });
//     await Promise.all([
//       page.waitForNavigation({ url: config.instaHashURL, waitUntil: 'load' }),
//       page.goto(config.instaHashURL),
//     ]);
//     await page.screenshot({ path: `${screenshotPath}/hash_page2.png`, fullPage: true });

//     await expect(page).toHaveURL(config.instaHashURL);
//   });
// });

// test.describe('Next Page to Hash.', () => {
//   /** login後 */
//   /** @desc test.describe内で一回呼ばれる */
//   test.beforeEach(async ({ page }) => {
//     await page.goto(config.instaURL);
//   });
//   test('Go to New Page Test.', async ({ page }) => {
// config.setHashURL = '今日のコーディネート';

// page.screenshot({ path: `${screenshotPath}/hash_page.png`, fullPage: true });
// await Promise.all([
//   page.waitForNavigation({ url: config.instaHashURL, waitUntil: 'load' }),
//   page.goto(config.instaHashURL),
// ]);
//     page.screenshot({ path: `${screenshotPath}/hash_page2.png`, fullPage: true });

//     expect(page).toHaveURL(config.instaHashURL);
//   });
// });
