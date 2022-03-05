import { test, expect, chromium } from '@playwright/test';
import { api } from '@/lib';
import { mkdir, touchFile, readFile, appendFile } from '@/utils';
import { Config } from '@/config';

const config = new Config();
const screenshotPath = config.screenShotPath;
const localStoragePath = config.localStoragePath;
const countFile = config.localEvidenceCountFile;
const urlFile = config.localEvidenceURLFile;
const txt: string[] = [];

/** 必ず最初に呼ばれる */
test.beforeAll(async ({ browserName }) => {
  /** setで呼び出せることでスコープ外からもアクセスできるようになる(getでね) */
  config.setHashURL = '今日のコーディネート';
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

    /** @desc Key Chairnに保存するか */
    await Promise.all([
      page.waitForNavigation({ url: 'https://www.instagram.com/accounts/onetap/?next=%2F', waitUntil: 'load' }),
      page.locator('button[type=submit]').first().click(),
    ]);
    await expect(page).toHaveURL('https://www.instagram.com/accounts/onetap/?next=%2F');
    await page.screenshot({ path: `${screenshotPath}/login.png` });

    /** @desc Home Pageにくる(実際にはlogin情報保存するかポップアップが表示されている) */
    await Promise.all([
      page.waitForNavigation({ url: 'https://www.instagram.com/', waitUntil: 'load' }),
      page.locator('text=Not Now').click(),
    ]);
    await expect(page).toHaveURL('https://www.instagram.com/');
    await page.screenshot({ path: `${screenshotPath}/logined.png`, fullPage: true });
    txt.push('Login完了');

    /** Promise.allのなかでawaitをつかえば順に処理がされる */
    /** @desc ハッシュpageにいく */
    await Promise.all([
      page.waitForNavigation({ url: config.instaHashURL, waitUntil: 'load' }),
      page.goto(config.instaHashURL),
    ]);
    await expect(page).toHaveURL(config.instaHashURL);
    await page.screenshot({ path: `${screenshotPath}/hash_page.png`, fullPage: true });
    txt.push('Hash pageへ遷移が完了');

    // これが1 set
    const href = await page
      .locator('xpath=//*[@id="react-root"]/section/main/article/div[1]/div/div/div[1]/div[1]/a')
      .getAttribute('href');

    /** @desc ハッシュpageから画像をタップし詳細モーダルにいく */
    await Promise.all([
      /** x path selector */
      page.waitForNavigation({ url: `${config.instaURL}${href}`, waitUntil: 'load' }),
      page
        .locator('xpath=//*[@id="react-root"]/section/main/article/div[1]/div/div/div[1]/div[1]/a/div[1]/div[2]')
        .click(),
    ]);
    await expect(page).toHaveURL(`${config.instaURL}${href}`);
    await page.screenshot({ path: `${screenshotPath}/hash_desc_page.png`, fullPage: true });
    txt.push('Hash 詳細pageへ遷移が完了');

    /** @desc ディレクトリを作成する。あればtrue */
    const isMkdir = await mkdir(config.localStoragePath);
    /** @desc ファイルを読み込む。なければfalse */
    const isURLFile = await readFile(`${config.localStoragePath}${config.localEvidenceURLFile}`);
    const isCountFile = await readFile(`${config.localStoragePath}${config.localEvidenceCountFile}`);
    console.log(`isMkdir: ${isMkdir}`);
    console.log(`isURLFile: ${isURLFile}`);
    console.log(`isCountFile: ${isCountFile}`);

    /** ディレクトリがあり、fileがなければURL指定して書き込む(新規作成 URLFile) */
    if (!isURLFile && href) {
      console.log('新規書き込み');
      await touchFile(`${config.localStoragePath}${config.localEvidenceURLFile}`, href);
    }
    /** ディレクトリがあり、fileがなければcount数を指定して書き込む(新規作成 CountFile) */
    if (!isCountFile) {
      console.log('新規書き込みCount');
      await touchFile(
        `${config.localStoragePath}${config.localEvidenceCountFile}`,
        config.instaLikeLimitCount.toString(),
      );
    }

    /** 書き込み */
    // if (isMkdir && isURLFile && href)
    //   await appendFile(`${config.localStoragePath}${config.localEvidenceURLFile}`, [href]);

    // if (isMkdir && isCountFile && href)
    //   await appendFile(`${config.localStoragePath}${config.localEvidenceCountFile}`, [count]);

    /** そのハッシュタグをファイルから読み込み */
    const herfList: string[] = [];

    // いいね
    // await page
    //   .locator(
    //     'xpath=/html/body/div[6]/div[3]/div/article/div/div[1]/div/div[1]/div[2]/div/div/div/ul/li[2]/div/div/div/div[1]/div[2]',
    //   )
    //   .dblclick();
    await page.locator('article[role="presentation"] div[role="presentation"] div[role="button"]').first().click();
    // つぎの画像
    await Promise.all([
      page.waitForNavigation({ url: `${page.url()}`, waitUntil: 'load' }),
      page.locator('xpath=/html/body/div[6]/div[2]/div/div[2]/button').click(),
    ]);

    console.log(`page ulr${page.url()}`);
    const instaLength = 'https://www.instagram.com'.length;
    herfList.push(page.url().substring(instaLength));

    await page
      .locator(
        'xpath=/html/body/div[6]/div[3]/div/article/div/div[1]/div/div[1]/div[2]/div/div/div/ul/li[2]/div/div/div/div[1]/div[2]',
      )
      .dblclick();
    // つぎの画像
    await Promise.all([
      page.waitForNavigation({ url: `${page.url()}`, waitUntil: 'load' }),
      page.locator('xpath=/html/body/div[6]/div[2]/div/div[2]/button').click(),
    ]);
  });

  /**
   * @手順
   * これをダイアログで書く(明日)
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
