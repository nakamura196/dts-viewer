'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Home from '@/components/page/Home';
import { useEffect } from 'react';
import Collections from '@/components/page/Collections';
import Navigation from '@/components/page/Navigation';
import { CollectionData } from '@/lib/collection';
import { NavigationData } from '@/lib/navigation';

export function Main({ base, url }: { base: string; url: string }) {
  const [component, setComponent] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState(true);
  const [, setData] = useState<CollectionData | NavigationData | null>(null);

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
        } else if (id.indexOf('navigation') !== -1) {
          setComponent(<Navigation base={base} url={url} data={responseData} />);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);

        setComponent(<div>エラーが発生しました</div>);
      });
  }, [url, base]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">読み込み中...</span>
      </div>
    );
  }

  return component || <div>コンテンツが見つかりません</div>;
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
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">読み込み中...</span>
        </div>
      }
    >
      <PageContent />
    </Suspense>
  );
}
