import type { MetadataRoute } from 'next';
import { siteUrl } from '@/config/site';

// `output: export` でも静的ファイル (out/robots.txt) として生成させる。
export const dynamic = 'force-static';

// 注意: クローラがクロール制御として読むのはホスト直下
// (nakamura196.github.io/robots.txt) のみ。ここで生成されるのは
// `${basePath}/robots.txt` なので、Sitemap は Search Console に直接登録すること。
// それでも Bing 等の一部や手動確認のために basePath 直下にも置いておく。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
