import { routing } from '@/i18n/routing';

import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

// SSG対応
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Common');
  // const node = await getNode('page', 'd04b8218-5d11-420b-80b9-39ed9c59eb0a', locale);
  const node = null;

  if (!node) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-600">{t('comingSoon')}</p>
      </div>
    );
  }

  return (
    <>
      <article className="prose prose-lg max-w-none">
        <div
          className="[&>p]:my-6 [&>p]:mb-6
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
                prose-li:text-gray-700 prose-li:mb-2
                prose-table:border-collapse prose-table:w-full
                prose-th:border prose-th:border-gray-300 prose-th:p-3 prose-th:bg-gray-50
                prose-td:border prose-td:border-gray-300 prose-td:p-3
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500
                prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700"
        />
      </article>
    </>
  );
}
