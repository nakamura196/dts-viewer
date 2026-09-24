import type { MetadataRoute } from 'next';
import { siteUrl } from '@/config/site';

// `output: export` でも静的ファイル (out/robots.txt) として生成させる。
export const dynamic = 'force-static';

// dtsview.ldas.jp ではホスト直下に配信されるので、この robots.txt が
// そのままクローラに読まれる。basePath 付きで配信するフォークでは
// `${basePath}/robots.txt` になりクローラには読まれないので、
// Sitemap は Search Console に直接登録すること。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
