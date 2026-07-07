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

// ユーザー向けに理由を表示できる想定内エラー。message はすでに翻訳済みの文言。
class AppError extends Error {}

function ErrorBox({ title, detail, url }: { title: string; detail: string; url: string }) {
  const t = useTranslations('Common');
  return (
    <div className="max-w-2xl mx-auto my-8 rounded-xl border border-red-300 bg-red-50 p-6 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
      <div className="flex items-start gap-3">
        <svg className="mt-0.5 h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm">{detail}</p>
          <p className="mt-3 text-xs opacity-80">{t('errorRequestedUrl')}:</p>
          <p className="text-xs font-mono break-all opacity-80">{url}</p>
        </div>
      </div>
    </div>
  );
}

export function Main({ base, url }: { base: string; url: string }) {
  const [component, setComponent] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState(true);
  const [, setData] = useState<CollectionData | NavigationData | MemberData | null>(null);
  const t = useTranslations('Common');
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        let res: Response;
        try {
          res = await fetch(url);
        } catch {
          // fetch の reject はネットワーク不達 / CORS 拒否 / 無効URL が典型
          throw new AppError(t('errorNetwork'));
        }

        if (!res.ok) {
          throw new AppError(t('errorHttp', { status: res.status }));
        }

        let responseData;
        try {
          responseData = await res.json();
        } catch {
          throw new AppError(t('errorParse'));
        }

        if (cancelled) return;

        const type = responseData['@type'];
        const id = (responseData['@id'] as string) || '';
        setData(responseData);

        if (type === 'Collection') {
          setComponent(<Collections base={base} url={url} data={responseData} />);
        } else if (type === 'Resource') {
          setComponent(<Resource base={base} url={url} data={responseData} />);
        } else if (id.indexOf('navigation') !== -1) {
          setComponent(<Navigation base={base} url={url} data={responseData} />);
        } else {
          throw new AppError(t('errorUnknownType', { type: String(type ?? '') }));
        }
      } catch (error) {
        if (cancelled) return;
        console.error('Error fetching data:', error);
        const detail = error instanceof AppError ? error.message : t('errorNetwork');
        setComponent(<ErrorBox title={t('errorTitle')} detail={detail} url={url} />);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
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
