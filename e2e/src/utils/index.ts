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
export const mkdir = async (path: string) => {
  await fs.mkdir(path);
};

/** @desc ファイル作成 */
// 一度読みこんで、行数が
export const touchFile = async (path: string, data: string) => {
  await fs.writeFile(path, data);
};

export const readFile = async (path: string) => {
  await fs.readFile(path);
};
