import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getDoc } from '@/lib/content';
import { MarkdownContent } from '@/components/MarkdownContent';

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
  return { title: locale === 'en' ? 'About' : 'このサイトについて' };
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getDoc('about', locale);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <MarkdownContent content={content} />
    </div>
  );
}
