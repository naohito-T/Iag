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
