import { getTranslations } from 'next-intl/server';

// import { getLocale } from 'next-intl/server';
// import { getNode } from '@/lib/api/drupal/queries';

// async
export default async function Footer() {
  const t = await getTranslations('Common');
  // const locale = await getLocale();

  /*
  const node = await getNode('page', 'a13c1495-9d45-4439-a8c2-e93d4fdc32f4', locale);

  if (!node) {
    return null;
  }

  // const title = node.attributes.title;
  // const description = node.attributes.body.value;
  */

  // const description = 'test';

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 pt-8 pb-8">
      <div className="container mx-auto px-4">
        {/* Bottom Bar */}

        <div className="flex justify-center items-center">
          <p className="text-gray-600 dark:text-gray-300">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
