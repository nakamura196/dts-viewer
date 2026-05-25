'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { SectionHeading, Button } from '@nakamura196/react-ui';
import { useRouter } from '@/i18n/routing';
import { getDomain, removeVars } from '@/lib/utils';
import { EntryPoint } from '@/lib/entryPoint';
import { useSearchParams } from 'next/navigation';

export default function UrlForm({ url }: { url: string }) {
  const [_url, setUrl] = useState('');
  const t = useTranslations('Common');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const moveTo = useCallback((urlParam: string) => {
    if (urlParam) {
      setLoading(true);
      // URLの形式を検証
      try {
        fetch(urlParam)
          .then((res) => res.json())
          .then((data) => {
            const domain = getDomain(urlParam);

            const result = EntryPoint.convert(domain, data);

            const id = result['@id'];

            const baseUrl = domain + id.replace(domain, '');

            let url = domain + result.collection;

            url = removeVars(url);

            router.push(`/?base=${baseUrl}&url=${url}`);
          })
          .catch((error) => {
            console.error(error);
            // 無効なURLの場合、エラーメッセージを表示
            alert(t('invalidUrl'));
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error(error);
        // 無効なURLの場合、エラーメッセージを表示
        alert(t('invalidUrl'));
        setLoading(false);
      }
    }
  }, [router, t]);

  useEffect(() => {
    setUrl(url);
    moveTo(url);
  }, [url, moveTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    moveTo(_url);
  };

  const searchParams = useSearchParams();
  const base = searchParams.get('base');

  // トップページ
  useEffect(() => {
    if (base) {
      setUrl(base);
    }
  }, [base]);

  return (
    <section className="container mx-auto px-4 py-16">
      <SectionHeading>{t('form')}</SectionHeading>
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
            className="flex-1 px-4 py-2 rounded-lg border border-[var(--ds-border)] bg-[var(--ds-bg)] text-[var(--ds-fg)] placeholder-[var(--ds-fg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-ring)]"
            required
            disabled={loading}
          />
          <Button type="submit" disabled={loading} className="min-w-[100px]">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('loading')}
              </>
            ) : (
              t('view')
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
