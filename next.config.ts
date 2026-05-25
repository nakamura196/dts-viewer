import type { NextConfig } from 'next';

import createNextIntlPlugin from 'next-intl/plugin';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
  output: 'export',
  basePath,
  transpilePackages: ['@nakamura196/react-ui'],
  // ローカル file: リンクの react-ui が react/next-themes をアプリ側の単一コピーから
  // 解決するようシンボリックリンクを実体化しない（react 重複によるhookエラー回避）。
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
};

export default withNextIntl(nextConfig);
