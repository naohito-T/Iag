import { test, expect } from '@playwright/test';
import { excludeSpace, sortTexts } from '@/utils';
import { api } from '@/lib';

const txt: string[] = [];

test.beforeEach(async ({ page }) => {
  await page.goto('https://fes.nijisanji.jp/');
});

/**
 * @desc LPのmetaの設定を確認するTest
 */
test.describe('LPのタグの設定を確認するTest', () => {
  /** 3つで実行しているため(Chrome, Firefox, WebDriverが通知される) */
  test.beforeAll(async ({ browserName }) => {
    txt.push(`[LP Meta Check] start for ${browserName}`);
  });

  test.afterAll(async ({ browserName }) => {
    txt.push(`[LP Meta Check] End for ${browserName}`);
    await api.service.postTeams(txt);
  });

  test('<title>タグと、og:titleが設定されており同一かテスト', async ({ page }) => {
    const title = await page.title();
    const ogTitle = await page.locator("meta[property='og:title']").getAttribute('content');

    expect(title).not.toBeNull();

    expect(ogTitle).not.toBeNull();
    expect(title).toBe('にじさんじフェス 2022');
    expect(ogTitle).toBe('にじさんじフェス 2022');

    /** titleとog:titleが同一か */
    expect(title).toBe(ogTitle);
    txt.push('Check OK: titleとog:titleは同一です。');
  });

  /**
   * @desc 順番はこちらの設定値に合わせ値があるかだけを確認する。
   *       また空白が入っていたりすることもあるため空白はデフォルトで除外しsortにかける
   */
  // telephone=no, address=no, email=no
  test('format-detectionが設定されており値が正しいか', async ({ page }) => {
    const detection = await page.locator('meta[name=format-detection]').getAttribute('content');

    expect(detection).not.toBeNull();
    expect(sortTexts(excludeSpace(detection), 'address=no,telephone=no,email=no')).toBe(
      excludeSpace('address=no,telephone=no,email=no'),
    );
    txt.push('Check OK: format-detectionは設定されています');
  });

  /**
   * @desc 順番はこちらの設定値に合わせ値があるかだけを確認する。
   *       また空白が入っていたりすることもあるため空白はデフォルトで除外する。
   */
  test('viewportが設定されており値が正しいか', async ({ page }) => {
    const viewport = await page.locator('meta[name=viewport]').getAttribute('content');
    expect(viewport).not.toBeNull();

    expect(sortTexts(excludeSpace(viewport), 'width=device-width,initial-scale=1,minimum-scale=1')).toBe(
      excludeSpace('width=device-width,initial-scale=1,minimum-scale=1'),
    );
    txt.push('Check OK: viewportは設定されています');
  });

  /**
   * @desc ない場合もある。 JSONが設定されていたら実行
   * @TODO そしてカラーコード形式であるのかをチェックしないといけない。
   */
  if (false) {
    test('theme-colorが設定されており値が正しいか', async ({ page }) => {
      const themeColor = await page.locator('meta[name=theme-color]').getAttribute('content');
      expect(themeColor).not.toBeNull();
    });
  }

  /**
   * @desc
   * @TODO 60文字以上であればwarn
   */
  test('descriptionタグと、og:descriptionが設定されており同一か(60文字以上はwarn)', async ({ page }) => {
    const description = await page.locator('meta[name=description]').getAttribute('content');
    const ogDesc = await page.locator("meta[property='og:description']").getAttribute('content');

    /** @desc 設定されていた場合にチェックする */
    if (false) {
      const twitterDesc = await page.locator("meta[name='twitter:description']").getAttribute('content');
      expect(twitterDesc).not.toBeNull();
      expect(description).toBe(twitterDesc);
    }

    expect(description).not.toBeNull();
    expect(ogDesc).not.toBeNull();

    /** descriptionとog:descriptionが同一か */
    expect(description).toBe(ogDesc);

    if (description && description.length >= 60) {
      txt.push('Check OK: description設定あり、ですが60文字以上あります');
    }
  });

  test('og:site_nameが設定されており正しい値か', async ({ page }) => {
    const siteName = await page.locator("meta[property='og:site_name']").getAttribute('content');
    expect(siteName).not.toBeNull();
    expect(siteName).toBe('にじさんじフェス 2022');
    txt.push('Check OK: og:site_nameは設定されています');
  });

  test('og:urlが設定されておりサイトのリンクと同一か', async ({ page }) => {
    const ogUrl = await page.locator("meta[property='og:url']").getAttribute('content');
    expect(ogUrl).not.toBeNull();
    expect(ogUrl).toBe('https://fes.nijisanji.jp/');
    txt.push('Check OK: og:urlは設定されています');
  });

  test('meta og:image', async ({ page }) => {
    const ogImage = await page.locator("meta[property='og:image']").getAttribute('content');
    expect(ogImage).not.toBeNull();
    txt.push('Check OK: og:imageは設定されています');
  });

  test('og:localeが設定されており正しい値か', async ({ page }) => {
    const ogLocale = await page.locator("meta[property='og:locale']").getAttribute('content');
    expect(ogLocale).not.toBeNull();
    expect(ogLocale).toBe('ja_JP');
    txt.push('Check OK: og:localeは設定されています');
  });

  test('twitter:cardが設定されており正しい値か', async ({ page }) => {
    const twitterCard = await page.locator("meta[name='twitter:card']").getAttribute('content');
    expect(twitterCard).not.toBeNull();
    expect(twitterCard).toBe('summary_large_image');
    txt.push('Check OK: twitter:cardは設定されています');
  });

  test('twitter:siteが設定されており正しい値か', async ({ page }) => {
    const twitterSite = await page.locator("meta[name='twitter:site']").getAttribute('content');
    expect(twitterSite).not.toBeNull();
    expect(twitterSite).toBe('@nijisanji_app');
    txt.push('Check OK: twitter:siteは設定されています');
  });

  test('faviconが設定されており、URLは有効か', async ({ page }) => {
    const faviconLink = await page.locator("link[rel='icon']").getAttribute('href');
    expect(faviconLink).not.toBeNull();
    txt.push('Check OK: faviconは設定されています');
  });

  test('appleのショートカット画像が設定されており正しい値か', async ({ page }) => {
    const appleTouchIconLink = await page.locator("link[rel='apple-touch-icon']").getAttribute('href');
    expect(appleTouchIconLink).not.toBeNull();
    txt.push('Check OK: apple-touch-iconは設定されています');
  });

  if (false) {
    test('Androidのショートカット画像が設定されており正しい値か', async ({ page }) => {
      const androidIconLink = await page.locator("link[rel='apple-touch-icon']").getAttribute('href');
      expect(androidIconLink).not.toBeNull();
    });
  }
});
