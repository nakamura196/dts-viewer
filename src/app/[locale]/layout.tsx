import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import './globals.css';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from 'next-themes';
import { Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google';
import { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';

// 東大VIの指定書体（無料の代替）: 本文=Noto Sans JP / 見出し=Noto Serif JP
const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});
const notoSerif = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-noto-serif',
  display: 'swap',
});

// Google Analytics 4 の測定ID（公開値: クライアント JS に出るため秘匿不要）。
// Vercel 等の NEXT_PUBLIC_GA_ID で上書き可能。dev では計測しない（本番ビルドのみ有効）。
const gaId =
  process.env.NODE_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_GA_ID ?? 'G-905D2TFQX0')
    : undefined;

const title = 'DTS Viewer';
const description =
  'Application for viewing and searching text collections using DTS (Distributed Text Services) API.';
const twitter = '@satoru196';
const url = 'https://dts-viewer.vercel.app';
const imageUrl = `${url}/home.webp`;

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: title,
  description: description,
  keywords: ['TEI', 'XML', 'Next.js', 'Vercel'],
  authors: [{ name: 'Satoru Nakamura', url: 'https://researchmap.jp/nakamura.satoru' }],
  openGraph: {
    title: title,
    description: description,
    url: url,
    type: 'website',
    siteName: title,
    images: imageUrl,
  },
  twitter: {
    card: 'summary',
    site: twitter,
    creator: twitter,
    title: title,
    description: description,
    images: imageUrl,
  },
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const locale = (await params).locale;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'ja')) {
    notFound();
  }

  // SSG対応
  setRequestLocale(locale);

  // getMessagesを同期的に呼び出すように変更
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${notoSans.variable} ${notoSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <Header />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
