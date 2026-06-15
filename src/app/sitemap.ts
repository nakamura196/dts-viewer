import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { languageAlternates, localizedUrl } from '@/config/site';

// `output: export` でも静的ファイル (out/sitemap.xml) として生成させる。
export const dynamic = 'force-static';

// [locale] 配下に存在する静的ルート（先頭がトップページ）。
const ROUTES = ['', 'about', 'privacy'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.5,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
