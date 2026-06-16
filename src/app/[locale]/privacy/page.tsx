import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getDoc } from '@/lib/content';
import { MarkdownContent } from '@nakamura196/react-ui';
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
  return {
    title: locale === 'en' ? 'Privacy Policy' : 'プライバシーポリシー',
    alternates: alternatesFor(locale, 'privacy'),
  };
}

export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getDoc('privacy', locale);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <MarkdownContent content={content} />
    </div>
  );
}
