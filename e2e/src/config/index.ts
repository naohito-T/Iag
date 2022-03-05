/**
 * @desc envまとめクラス
 */

export class Config {
  private INSTA_ID = process.env.INSTA_ID ?? '';

  private INSTA_PASS = process.env.INSTA_PASS ?? '';

  private INSTA_URL = 'https://www.instagram.com/';

  private INSTA_HASH_URL = 'https://www.instagram.com/explore/tags/';

  private LINE_TOKEN = process.env.LINE_TOKEN ?? '';

  private LINE_URL = process.env.LINE_URL ?? '';

  set setHashURL(hash: string) {
    this.INSTA_HASH_URL = `${this.INSTA_HASH_URL}${hash}/?hl=ja`;
  }

  get instaId(): string {
    return this.INSTA_ID;
  }

  get instaURL(): string {
    return this.INSTA_URL;
  }

  get instaHashURL(): string {
    return this.INSTA_HASH_URL;
  }

  get instaPass(): string {
    return this.INSTA_PASS;
  }

  get lineToken(): string {
    return this.LINE_TOKEN;
  }

  get lineURL(): string {
    return this.LINE_URL;
  }
}
