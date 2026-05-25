import { getLocale } from 'next-intl/server';
import { Footer as DsFooter } from '@nakamura196/react-ui';
import { Link } from '@/i18n/routing';

// トップの「例」と同じ5つの DTS エンドポイント。フッターから ?base= で直接ロード。
const EXAMPLES = [
  { label: '校異源氏物語', url: 'https://dts-typescript.vercel.app/api/dts' },
  { label: 'Dracor', url: 'https://dev.dracor.org/api/v1/dts' },
  { label: 'Alpheios', url: 'https://texts.alpheios.net/api/dts' },
  { label: 'Perseids', url: 'https://dts.perseids.org/' },
  { label: 'Epigraphische Datenbank Heidelberg', url: 'https://edh.ub.uni-heidelberg.de/api/dts/' },
];

export default async function Footer() {
  const locale = await getLocale();
  const ja = locale !== 'en';

  return (
    <DsFooter
      title="DTS Viewer"
      description={
        ja
          ? 'DTS（Distributed Text Services）API でテキストコレクションを階層的に閲覧できる Web アプリ。'
          : 'A web app for browsing text collections hierarchically through the DTS (Distributed Text Services) API.'
      }
      columns={[
        {
          heading: ja ? 'サイト案内' : 'Site',
          links: [
            { label: ja ? 'ホーム' : 'Home', href: '/' },
            { label: ja ? 'このサイトについて' : 'About', href: '/about' },
            { label: ja ? 'プライバシーポリシー' : 'Privacy Policy', href: '/privacy' },
          ],
        },
        {
          heading: ja ? '例' : 'Examples',
          links: EXAMPLES.map((e) => ({
            label: e.label,
            href: `/?base=${encodeURIComponent(e.url)}`,
          })),
        },
        {
          heading: ja ? '関連リンク' : 'Related',
          links: [
            {
              label: ja ? 'DTS 仕様' : 'DTS Specification',
              href: 'https://distributed-text-services.github.io/specifications/',
              external: true,
            },
            {
              label: 'GitHub',
              href: 'https://github.com/nakamura196/dts-viewer',
              external: true,
            },
          ],
        },
      ]}
      copyright={`© ${new Date().getFullYear()} DTS Viewer`}
      LinkComponent={Link}
    />
  );
}
