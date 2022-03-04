import { excludeSpace, checkColorCode, sortTexts } from '@/utils';

/**
 * @desc Utils Test
 */
describe('utils Test.', () => {
  test('空白が除外できているか', () => {
    const mockSpaceIncludedStr = 'a b c';
    expect(excludeSpace(mockSpaceIncludedStr)).toBe('abc');
  });

  test('カラーコードをチェックする', () => {
    const mockExistsColor = '#aabbcc';
    const mockExists3CodeColor = '#AAA';
    const mockNotExistsColor = '#GGHHFF';

    // OK Tests.
    expect(checkColorCode(mockExistsColor)).toBe(true);
    expect(checkColorCode(mockExists3CodeColor)).toBe(true);
    // NG Test.
    expect(checkColorCode(mockNotExistsColor)).toBe(false);
  });

  test('カンマの文字列をSortする', () => {
    const mockCommaIncludeStr = 'a,b,c';
    expect(sortTexts(mockCommaIncludeStr, 'b,c,a')).toBe('b,c,a');
  });
});
