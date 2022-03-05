import fs from 'fs/promises';

/** @desc 文字列から空白を削除する(全角・空白可能) */
export const excludeSpace = (str: string | null): string => {
  if (!str) return '';
  return str.replace(/\s+/g, '');
};

/** @desc カンマに対応 */
export const sortTexts = (str: string | null, sortAnswer: string): string => {
  if (!str) return '';
  const arr = str.split(',');
  const answer = sortAnswer.split(',');
  const result = [...arr].sort((a, b) => answer.indexOf(a) - answer.indexOf(b));
  return result.join(',');
};

/** @desc カラーコード形式をチェックする(3桁もしくは6桁のカラーコードに一致) */
export const checkColorCode = (color: string | null): boolean => {
  if (!color) return false;
  return color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) !== null;
};

/** @desc ディレクトリを作成 */
export const mkdir = async (path: string): Promise<boolean> => {
  const isDir = await fs
    .mkdir(path)
    .then((_) => true)
    .catch((_) => false);
  return isDir;
};

/** @desc ファイル作成で書き込む */
export const touchFile = async (path: string, data: string): Promise<boolean> => {
  return fs
    .writeFile(path, `${data}\n`)
    .then((_) => true)
    .catch((_) => false);
};

/** @desc ファイル新規作成 */
export const readFile = async (path: string): Promise<string | boolean> => {
  return fs.readFile(path, 'utf-8').catch((_) => false);
};

/** @desc ファイルに追記(使用用途はURLぐらい配列で格納する) */
export const appendFile = async (path: string, data: string[]): Promise<boolean> => {
  const texts = data.join('\n');
  return fs
    .appendFile(path, texts, 'utf-8')
    .then((_) => true)
    .catch((_) => false);
};
