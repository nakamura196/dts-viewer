'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Home from '@/components/page/Home';
import { useEffect } from 'react';
import Collections from '@/components/page/Collections';
import Navigation from '@/components/page/Navigation';
import Resource from '@/components/page/Resource';
import { CollectionData, MemberData } from '@/lib/collection';
import { NavigationData } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
export function Main({ base, url }: { base: string; url: string }) {
  const [component, setComponent] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState(true);
  const [, setData] = useState<CollectionData | NavigationData | MemberData | null>(null);
  const t = useTranslations('Common');
  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((responseData) => {
        const type = responseData['@type'];
        const id = responseData['@id'];
        setData(responseData);

        if (type === 'Collection') {
          setComponent(<Collections base={base} url={url} data={responseData} />);
        } else if (type === 'Resource') {
          setComponent(<Resource base={base} url={url} data={responseData} />);
        } else if (id.indexOf('navigation') !== -1) {
          setComponent(<Navigation base={base} url={url} data={responseData} />);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);

        setComponent(<div>{t('error')}</div>);
      });
  }, [url, base, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--ds-primary)]"></div>
        <span className="ml-3 text-[var(--ds-fg-muted)]">{t('loading')}</span>
      </div>
    );
  }

  return component || <div>{t('notFound')}</div>;
}

function PageContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const base = searchParams.get('base');

  return (
    <>
      {!url && <Home />}
      {url && (
        <div className="container mx-auto px-4 py-8">
          <Main base={base || ''} url={url} />
        </div>
      )}
    </>
  );
}

export default function Page() {
  const t = useTranslations('Common');
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--ds-primary)]"></div>
          <span className="ml-3 text-[var(--ds-fg-muted)]">{t('loading')}</span>
        </div>
      }
    >
      <PageContent />
    </Suspense>
  );
}
