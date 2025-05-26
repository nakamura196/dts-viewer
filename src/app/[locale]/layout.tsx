import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import './globals.css';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
