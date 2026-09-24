import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // next-intl が拡張子なしで import する next/navigation を Vite 側で解決させる
    // (i18n/routing を経由する config/site や app/sitemap をテストするため)。
    server: { deps: { inline: ['next-intl'] } },
  },
});
