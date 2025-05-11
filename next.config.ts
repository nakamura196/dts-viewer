import type { NextConfig } from 'next';

import createNextIntlPlugin from 'next-intl/plugin';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
  output: 'export',
  basePath,
};

export default withNextIntl(nextConfig);
