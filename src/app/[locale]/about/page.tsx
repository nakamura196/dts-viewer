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
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-[var(--ds-fg)] mb-8" style={{ fontFamily: 'var(--ds-font-serif)' }}>{t('aboutTitle')}</h1>

          <p className="text-xl text-[var(--ds-fg-muted)] mb-8 leading-relaxed">
            {t('aboutDescription')}
          </p>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[var(--ds-fg)] mb-6" style={{ fontFamily: 'var(--ds-font-serif)' }}>{t('whatIsDts')}</h2>
            <p className="text-[var(--ds-fg-muted)] leading-relaxed">
              {t('dtsDescription')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[var(--ds-fg)] mb-6" style={{ fontFamily: 'var(--ds-font-serif)' }}>{t('features')}</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li className="text-[var(--ds-fg-muted)]">{t('feature1')}</li>
              <li className="text-[var(--ds-fg-muted)]">{t('feature2')}</li>
              <li className="text-[var(--ds-fg-muted)]">{t('feature3')}</li>
              <li className="text-[var(--ds-fg-muted)]">{t('feature4')}</li>
              <li className="text-[var(--ds-fg-muted)]">{t('feature5')}</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-[var(--ds-fg)] mb-6" style={{ fontFamily: 'var(--ds-font-serif)' }}>{t('gettingStarted')}</h2>
            <p className="text-[var(--ds-fg-muted)] leading-relaxed">
              {t('gettingStartedDescription')}
            </p>
          </section>
        </article>
      </div>
    );
  }

  return (
    <>
      <article className="prose prose-lg max-w-none">
        <div
          className="[&>p]:my-6 [&>p]:mb-6
                prose-headings:font-bold prose-headings:text-[var(--ds-fg)]
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-[var(--ds-fg-muted)] prose-p:leading-relaxed
                prose-a:text-[var(--ds-primary)] prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
                prose-strong:text-[var(--ds-fg)] prose-strong:font-bold
                prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
                prose-li:text-[var(--ds-fg-muted)] prose-li:mb-2
                prose-table:border-collapse prose-table:w-full
                prose-th:border prose-th:border-[var(--ds-border)] prose-th:p-3 prose-th:bg-[var(--ds-surface-2)]
                prose-td:border prose-td:border-[var(--ds-border)] prose-td:p-3
                prose-blockquote:border-l-4 prose-blockquote:border-[var(--ds-primary)]
                prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[var(--ds-fg-muted)]"
        />
      </article>
    </>
  );
}
