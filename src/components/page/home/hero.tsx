import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Hero() {
  const t = useTranslations('Common');

  return (
    <section className="relative">
      {/* 背景画像 */}
      <div
        className="absolute inset-0 z-0"
        style={{
          // backgroundImage: 'url(https://toyo-vellum.vercel.app/assets/images/home.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/70 dark:bg-black/80" />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              DTS (Distributed Text Services) Viewer
            </h1>
            <div className="text-lg md:text-xl mb-8 text-white/90 dark:text-white/80 prose dark:prose-invert">
              {t('description')}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="https://distributed-text-services.github.io/specifications/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                DTS仕様を確認
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
