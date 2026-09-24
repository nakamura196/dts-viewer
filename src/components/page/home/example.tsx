import { useTranslations } from 'next-intl';
import { SectionHeading } from '@nakamura196/react-ui';
import { DTS_EXAMPLES } from '@/config/examples';

export default function Example({ setUrl }: { setUrl: (url: string) => void }) {
  const t = useTranslations('Common');

  const items = DTS_EXAMPLES;

  // await getLatestNews(locale);
  return (
    <section className="container mx-auto px-4 py-16">
      {/* max-w-4xl  */}
      <div className="mx-auto">
        <SectionHeading>{t('example')}</SectionHeading>
        <div className="space-y-3">
          {items.map((item, index) => (
            <a
              key={index}
              onClick={() => {
                setUrl(item.url);
              }}
              className="block border border-[var(--ds-border)] rounded-md hover:border-[var(--ds-primary)] transition-colors bg-[var(--ds-surface)] cursor-pointer"
            >
              <div className="p-4">
                <div className="text-lg text-[var(--ds-fg)] hover:text-[var(--ds-primary)] transition-colors">
                  {item.label}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
