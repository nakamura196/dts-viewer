'use client';

import { News } from '@nakamura196/react-ui';
import { useLocale } from 'next-intl';

export default function NewsSection() {
  const locale = useLocale();
  const ja = locale !== 'en';

  return (
    <News
      heading={ja ? 'お知らせ' : 'News'}
      items={[
        {
          date: '2026-05-25',
          title: ja ? '解説動画を公開しました' : 'Published a tutorial video',
          href: ja
            ? 'https://www.youtube.com/watch?v=gFM5UsNn5dw'
            : 'https://www.youtube.com/watch?v=uypWo_qEcmA',
          external: true,
        },
      ]}
    />
  );
}
