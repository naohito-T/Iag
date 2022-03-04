/** @type import('eslint').Linter.BaseConfig */
module.exports = {
  extends: ['airbnb-typescript/base', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:import/recommended'],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // default export は基本使用しない
    'import/prefer-default-export': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: { project: './' },
      // たぶんeslintrc.jsからtsconfig.jsonがあるディレクトリへの相対パス
    },
  },
};
