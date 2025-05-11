'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { getDomain, removeVars, combineUrls } from '@/lib/utils';
import { EntryPoint } from '@/lib/entryPoint';
import { useSearchParams } from 'next/navigation';
export default function UrlForm({ url }: { url: string }) {
  const [_url, setUrl] = useState('');
  const t = useTranslations('Common');
  const router = useRouter();

  useEffect(() => {
    setUrl(url);
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (_url) {
      // URLの形式を検証
      try {
        fetch(_url)
          .then((res) => res.json())
          .then((data) => {
            const domain = getDomain(_url);

            const result = EntryPoint.convert(domain, data);

            const id = result['@id'];

            const baseUrl = combineUrls(domain, id);

            let url = domain + result.collection;

            url = removeVars(url);

            router.push(`/?base=${baseUrl}&url=${url}`);
          });

        /*+ '/collections'*/
      } catch (error) {
        console.error(error);
        // 無効なURLの場合、エラーメッセージを表示
        alert(t('invalidUrl'));
      }
    }
  };

  const searchParams = useSearchParams();
  const base = searchParams.get('base');

  useEffect(() => {
    if (base) {
      setUrl(base);
    }
  }, [base]);

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">{t('form')}</h2>
      <div className="space-y-3">
        <p>{t('formDescription')}</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full mx-auto mt-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            value={_url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t('urlPlaceholder')}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {t('view')}
          </button>
        </div>
      </form>
    </section>
  );
}
