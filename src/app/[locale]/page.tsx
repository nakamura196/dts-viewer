import { routing } from '@/i18n/routing';

import { setRequestLocale } from 'next-intl/server';

import Page from '@/components/page/index';

// SSG対応
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Page />
    </>
  );
}
