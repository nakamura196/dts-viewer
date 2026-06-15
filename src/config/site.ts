import { routing } from '@/i18n/routing';

/**
 * 公開サイトの canonical ホスト。
 *
 * GH Pages (`/dts-viewer` 配下) を正本とし、Vercel の旧 URL
 * (dts-viewer.vercel.app) は vercel.json で 301 redirect している。
 * デプロイ先を変える場合のみ `NEXT_PUBLIC_SITE_URL` で上書きする。
 * 末尾スラッシュは正規化のため取り除く。
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nakamura196.github.io/dts-viewer'
).replace(/\/+$/, '');

/**
 * ロケール付きの絶対 URL を返す。next.config の `trailingSlash: true` に合わせ
 * 常に末尾スラッシュ付きで返す（例: `${siteUrl}/en/about/`）。
 */
export function localizedUrl(locale: string, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${siteUrl}/${locale}/${clean}/` : `${siteUrl}/${locale}/`;
}

/**
 * hreflang 用の言語別 URL マップ。`x-default` には既定ロケールを割り当てる。
 */
export function languageAlternates(path = ''): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localizedUrl(locale, path);
  }
  languages['x-default'] = localizedUrl(routing.defaultLocale, path);
  return languages;
}

/**
 * generateMetadata 用の alternates（自己 canonical + hreflang）。
 */
export function alternatesFor(locale: string, path = '') {
  return {
    canonical: localizedUrl(locale, path),
    languages: languageAlternates(path),
  };
}
