# DTS Viewer

[![Live](https://img.shields.io/badge/demo-dts--viewer.vercel.app-0B8BEE)](https://dts-viewer.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**Browse digital text collections published via the [DTS (Distributed Text Services)](https://distributed-text-services.github.io/specifications/) API — entirely in your browser.**

🌐 **Live demo: https://dts-viewer.vercel.app/**

*日本語の説明は [下記](#日本語) にあります。*

---

## English

DTS Viewer is a web app for hierarchically browsing digital text collections that are published through the **DTS (Distributed Text Services)** API standard. Enter a DTS API endpoint URL — or pick one of the bundled examples — and explore collections, resources, citation structures and metadata, all in the browser.

### Features

- Hierarchical browsing of text collections
- Dublin Core metadata display
- Citation-structure navigation (page / line, waka / ku, …)
- Resource details, XML / text download
- Japanese / English UI + light / dark mode

### Introduction video

[![DTS Viewer — Introduction (EN)](https://img.youtube.com/vi/uypWo_qEcmA/hqdefault.jpg)](https://www.youtube.com/watch?v=uypWo_qEcmA)

### Example endpoints

| Collection | DTS endpoint |
|---|---|
| Kōi Genji Monogatari (校異源氏物語, CC0) | `https://dts-typescript.vercel.app/api/dts` |
| DraCor | `https://dev.dracor.org/api/v1/dts` |
| Alpheios | `https://texts.alpheios.net/api/dts` |
| Perseids | `https://dts.perseids.org/` |
| Epigraphic Database Heidelberg | `https://edh.ub.uni-heidelberg.de/api/dts/` |

### Tech stack

- [Next.js 15](https://nextjs.org/) (App Router, static export) · React 19 · TypeScript
- [next-intl](https://next-intl.dev/) (i18n) · [next-themes](https://github.com/pacocoursey/next-themes) (dark mode)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Shared design system [`@nakamura196/react-ui`](https://github.com/nakamura196/react-ui) — colors & typography follow the [University of Tokyo Visual Identity Guidelines](https://www.u-tokyo.ac.jp/) (logo / symbol mark not used)

### Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
npm run lint
```

---

## 日本語

DTS Viewer は、**DTS（Distributed Text Services）API 標準**で公開されたデジタルテキストコレクションを、ブラウザだけで階層的に閲覧できる Web アプリです。ビューアに DTS API の URL を入力するか、用意された例を選ぶだけで、コレクション・リソース・引用構造・メタデータを辿れます。

### 機能

- テキストコレクションの階層的な閲覧
- Dublin Core メタデータの表示
- 引用構造のナビゲーション（ページ・行／和歌・句 など）
- リソース詳細、XML・テキストのダウンロード
- 日本語／英語 UI ＋ ダークモード

### 紹介動画

[![DTS Viewer — 紹介動画（日本語）](https://img.youtube.com/vi/gFM5UsNn5dw/hqdefault.jpg)](https://www.youtube.com/watch?v=gFM5UsNn5dw)

> ずんだもん・四国めたんの掛け合い版もあります → https://www.youtube.com/watch?v=aBwZfL1gh9Q

### 例として使えるエンドポイント

| コレクション | DTS エンドポイント |
|---|---|
| 校異源氏物語（裏源氏勉強会, CC0） | `https://dts-typescript.vercel.app/api/dts` |
| DraCor | `https://dev.dracor.org/api/v1/dts` |
| Alpheios | `https://texts.alpheios.net/api/dts` |
| Perseids | `https://dts.perseids.org/` |
| ハイデルベルク碑文データベース | `https://edh.ub.uni-heidelberg.de/api/dts/` |

### 技術構成

- Next.js 15（App Router・静的書き出し）／React 19／TypeScript
- next-intl（多言語）／next-themes（ダークモード）／Tailwind CSS v4
- 共有デザインシステム [`@nakamura196/react-ui`](https://github.com/nakamura196/react-ui)（配色・書体は[東京大学ビジュアル・アイデンティティ・ガイドライン](https://www.u-tokyo.ac.jp/)に倣う。ロゴ・シンボルマークは不使用）

---

## Deployment / デプロイ

### GitHub Pages (automated via Actions)

`.github/workflows/deploy-pages.yml` ワークフローが `NEXT_PUBLIC_BASE_PATH=/dts-viewer`
を渡して `out/` を生成し GitHub Pages にアップロードします。リポジトリ側で
**Settings → Pages → Source: "GitHub Actions"** を一度選択するだけで `main` へ
push するたびに自動デプロイされます。

### Optional: Google Analytics

本リポジトリには Measurement ID をハードコードしていないため、フォークしても
意図せず元 maintainer の GA に計測が送信されることはありません。各自のデプロイで
GA4 を有効化するには:

1. GA4 プロパティを作成して Measurement ID (`G-XXXXXXXXXX`) を取得
2. **GitHub Pages の場合**: Repository → **Settings → Secrets and variables →
   Actions → Variables** タブ → New repository variable
   `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX`。次回 push でビルドが走り GA 有効化
3. **Vercel の場合**: Project → **Settings → Environment Variables** →
   `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX` (Production scope)

`src/app/[locale]/layout.tsx` がビルド時に `process.env.NEXT_PUBLIC_GA_ID` を読み、
値があるときだけ `@next/third-parties/google` の `<GoogleAnalytics>` を描画します。

---

## Contributing / 貢献

Issues and pull requests are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) and our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Citation / 引用

If you use DTS Viewer in your research, please cite it — see [CITATION.cff](./CITATION.cff).

## License / ライセンス

[MIT](./LICENSE) © Satoru Nakamura
