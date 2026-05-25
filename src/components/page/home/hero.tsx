import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { buttonClass } from '@nakamura196/react-ui';

export default function Hero() {
  const t = useTranslations('Common');

  return (
    <section className="relative">
      {/* 背景: UTokyo ブルーのグラデーション */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[var(--ds-blue-950)] via-[var(--ds-blue-800)] to-[var(--ds-blue-600)]">
        {/* 上端の銀杏イエローの細いアクセント */}
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--ds-accent)]" />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
              style={{ fontFamily: 'var(--ds-font-serif)' }}
            >
              DTS (Distributed Text Services) Viewer
            </h1>
            <div className="text-lg md:text-xl mb-8 text-white/90 prose prose-invert">
              {t('description')}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://distributed-text-services.github.io/specifications/"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('primary', 'lg')}
              >
                {t('viewDtsSpec')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
