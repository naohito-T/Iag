# Introduction

Instagram の auto いいねツール

やりたいこと
system 構成図をかく

## Setup

ローカルで開発する際は下記手順での準備が必要。以下パッケージが準備されていることを前提とする。

Mac の場合

```sh
# direnv install
$ brew install direnv
# 配布されているenvを復号(パスは担当者からもらってください) 以下はzshの場合
$ (make env.encrypt ENV=xxxxxxx)
# direnvを許可する
$ direnv allow
# node_module install
$ cd ./createSmartFormat; yarn install
```

## Start up

| 項目           | 概要                                                                      | 補足                      |
| -------------- | ------------------------------------------------------------------------- | ------------------------- |
| エントリー     | e2e/src/\*\*.spec.ts                                                      | Playwright のテスト群     |
| テストランナー | @playwright/test                                                          | yarn test で走らせる      |
| Jest           | このプロジェクトでは Util 群をテストする                                  | yarn test:jest で走らせる |
| コンパイル     | playwright がコンパイルしながら実行するため特にバンドルやコンパイルは不要 |

## Test flow

基本 3 つのブラウザで確認するようになっている(Chrome, Firefox, WebDriver)

- コマンド実行
  `$ yarn test`
  → 実行後生成された index.html がそのままエビデンスとなります(提出する場合はこれを提出)

- Test 結果を自身でブラウザで確認したい方は以下のコマンドを実行
  `$ yarn test:show`

- UtilsTest
  `$ yarn test:jest`

## Code generate

playwright で対象サイトを開く
`$ npx playwright open https://www.instagram.com/`
あとはクリックするだけ
