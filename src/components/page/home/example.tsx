import { useTranslations } from 'next-intl';

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
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">{t('example')}</h2>
        <div className="space-y-3">
          {items.map((item, index) => (
            <a
              key={index}
              onClick={() => {
                setUrl(item.url);
              }}
              className="block border border-gray-200 dark:border-gray-700 rounded-md hover:border-gray-300 dark:hover:border-gray-600 transition-colors bg-white dark:bg-gray-800 cursor-pointer"
            >
              <div className="p-4">
                <div className="mt-2 text-lg text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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
