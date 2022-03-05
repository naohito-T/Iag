import { test, expect, chromium } from '@playwright/test';
import { api } from '@/lib';
import { mkdir, touchFile, readFile, appendFile } from '@/utils';
import { Config } from '@/config';

const config = new Config();
const screenshotPath = config.screenShotPath;
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

    /** そのハッシュタグをファイルから読み込み */
    const herfList: string[] = [];

    /** @TODO いいね済みのはカウントしない */
    const instaLength = 'https://www.instagram.com'.length;
    const herfPush = async () => {
      herfList.push(page.url().substring(instaLength));
    };

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
    // for (let i = 0; i < config.instaLikeLimitCount; i++) {
    for (let i = 0; i < 10; i++) {
      Promise.all([
        await page
          .locator('article[role="presentation"] div[role="presentation"] div[role="button"]')
          .first()
          .dblclick(),
        await page.locator('.l8mY4 .wpO6b').click(),
        await herfPush(),
      ]);
      await page.waitForTimeout(2000);
      // if (i < config.instaLikeLimitCount) {
      if (i < 10) {
        await appendFile(`${config.localStoragePath}${config.localEvidenceURLFile}`, herfList);
      }
    }
  });
});
