# Systems

## ディレクトリ構造

```sh
src
├── __mocks__
│   └── mock.json
├── config
│   └── index.ts
├── lib
│   ├── _base.ts
│   ├── index.ts
│   ├── request
│   │   ├── api.ts
│   │   ├── index.ts
│   │   └── service.ts
│   └── service
│       ├── index.ts
│       └── service.ts
├── tests                # テスト置き場でありエントリーポイント
│   ├── image            # スクリーンショットが格納される
│   │   ├── ipad_air.png
│   │   ├── iphone_xr.png
│   │   └── pc.png
│   ├── meta.spec.ts
│   └── responsive.spec.ts
└── utils
    ├── index.ts
    └── utils.test.ts
```

## 各テストについて

meta.spec.ts
メタタグのテストをする。

responsive.spec.ts
viewport の閾値でスクリーンショットを撮る
