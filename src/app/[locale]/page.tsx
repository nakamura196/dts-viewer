import { routing } from '@/i18n/routing';

import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import Page from '@/components/page/index';
import { alternatesFor } from '@/config/site';

// SSG対応
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternatesFor(locale) };
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
