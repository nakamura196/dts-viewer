# Contributing / 貢献ガイド

Thanks for your interest in improving **DTS Viewer**! Issues and pull requests are welcome.
**DTS Viewer** の改善にご関心をお寄せいただきありがとうございます。Issue・Pull Request を歓迎します。

## Prerequisites / 前提

- [Node.js](https://nodejs.org/) >= 20

## Setup

```bash
npm install
```

## Development / 開発

```bash
npm run dev      # http://localhost:3000
npm run lint     # ESLint
npm run build    # static export to ./out
```

## Pull requests

- Keep changes focused, and run `npm run lint` and `npm run build` before submitting.
- The UI is built on the shared design system [`@nakamura196/react-ui`](https://github.com/nakamura196/react-ui)
  (colors & typography follow the University of Tokyo Visual Identity Guidelines).
  Prefer its components and design tokens (CSS variables such as `--ds-primary`) over hardcoded colors.
- 変更は小さくまとめ、送信前に `npm run lint` と `npm run build` を通してください。
  色は生の Tailwind カラーではなく、共有DSのコンポーネント／トークン（`--ds-*` CSS変数）を優先してください。

## Reporting issues / 不具合報告

Please use [GitHub Issues](https://github.com/nakamura196/dts-viewer/issues).
