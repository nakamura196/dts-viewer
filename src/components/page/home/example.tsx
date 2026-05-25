import { useTranslations } from 'next-intl';
import { SectionHeading } from '@nakamura196/react-ui';

export default function Example({ setUrl }: { setUrl: (url: string) => void }) {
  const t = useTranslations('Common');

  const items = [
    {
      label: '校異源氏物語',
      url: 'https://dts-typescript.vercel.app/api/dts',
    },
    {
      label: 'Dracor',
      url: 'https://dev.dracor.org/api/v1/dts',
    },

    {
      label: 'Alpheios',
      url: 'https://texts.alpheios.net/api/dts',
      description:
        'A small collection of Latin and Greek texts that have been aligned with linguistic annotations for learning ancient languages. Uses the MyCapytain/Nautilus libraries.',
    },
    {
      label: 'Perseids',
      url: 'https://dts.perseids.org/',
      description:
        'Serves all textual resources available from Perseus within the Ancient Greek and Latin corpora as well as some resources in Hebrew and Farsi.',
    },
    {
      label: 'Epigraphische Datenbank Heidelberg',
      url: 'https://edh.ub.uni-heidelberg.de/api/dts/',
      description: 'A corpus of 80,000 short texts from the Latin epigraphic databases.',
    },
  ];

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
