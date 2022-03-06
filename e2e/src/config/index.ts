/**
 * @desc config まとめクラス
 */

export class Config {
  private INSTA_ID = process.env.INSTA_ID ?? '';

  private INSTA_PASS = process.env.INSTA_PASS ?? '';

  private INSTA_URL = 'https://www.instagram.com';

  private INSTA_HASH_URL: string[] = [];

  private INSTA_DEFAULT_HASH_URL = 'https://www.instagram.com/explore/tags/今日のコーディネート/?hl=ja';

  private INSTA_LIKE_LIMIT_COUNT = 100;

  private INSTA_MODAL_URL = 'https://www.instagram.com/accounts/onetap/?next=%2F';

  private LINE_TOKEN = process.env.LINE_TOKEN ?? '';

  private LINE_URL = process.env.LINE_URL ?? '';

  private SCREEN_SHOT_PATH = `${process.cwd()}/src/tests/image`;

  private LOCAL_STORAGE_PATH = `${process.cwd()}/src/tests/storage`;

  private LOCAL_EVIDENCE_COUNT_FILE = '/like_count.txt';

  private LOCAL_EVIDENCE_URL_FILE = '/like_url.txt';

  set setHashURL(hash: string) {
    this.INSTA_HASH_URL.push(`https://www.instagram.com/explore/tags/${hash}/?hl=ja`);
  }

  get instaId(): string {
    return this.INSTA_ID;
  }

  get instaURL(): string {
    return this.INSTA_URL;
  }

  /** defaultのhash urlを返す */
  get instaDefaultHashURL(): string {
    return this.INSTA_DEFAULT_HASH_URL;
  }

  /** HashURLから先頭の一つ返す */
  get instaHashFirstURL(): string | undefined {
    return this.INSTA_HASH_URL.shift();
  }

  /** HashURL Listを返す */
  get instaHashListURL(): string[] {
    return this.INSTA_HASH_URL;
  }

  get instaPass(): string {
    return this.INSTA_PASS;
  }

  get instaLikeLimitCount(): number {
    return this.INSTA_LIKE_LIMIT_COUNT;
  }

  get instaModalUrl(): string {
    return this.INSTA_MODAL_URL;
  }

  get lineToken(): string {
    return this.LINE_TOKEN;
  }

  get lineURL(): string {
    return this.LINE_URL;
  }

  get screenShotPath(): string {
    return this.SCREEN_SHOT_PATH;
  }

  get localStoragePath(): string {
    return this.LOCAL_STORAGE_PATH;
  }

  get localEvidenceCountFile(): string {
    return this.LOCAL_EVIDENCE_COUNT_FILE;
  }

  get localEvidenceURLFile(): string {
    return this.LOCAL_EVIDENCE_URL_FILE;
  }
}
