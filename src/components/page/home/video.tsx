'use client';

import { SectionHeading, VideoEmbed } from '@nakamura196/react-ui';
import { useLocale, useTranslations } from 'next-intl';

// UI 言語に連動して埋め込む YouTube 動画を切り替える（ja=ナレーションJP / en=ナレーションEN）。
// 動画の制作・公開は kakeai-tutorials リポジトリ（~/git/blog/dts-viewer）を参照。
const VIDEO_IDS = {
  ja: 'gFM5UsNn5dw',
  en: 'uypWo_qEcmA',
} as const;

export default function Video() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const videoId = locale === 'en' ? VIDEO_IDS.en : VIDEO_IDS.ja;

  return (
    <section className="container mx-auto px-4 py-12">
      <SectionHeading>{t('introVideo')}</SectionHeading>
      <VideoEmbed videoId={videoId} title={t('introVideo')} />
    </section>
  );
}
