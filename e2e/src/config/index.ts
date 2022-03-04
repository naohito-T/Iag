/**
 * @desc envまとめクラス
 */

export class Config {
  private TEAMS_URL = process.env.TEAMS_URL ?? '';

  get teamsURL(): string {
    return this.TEAMS_URL;
  }
}
