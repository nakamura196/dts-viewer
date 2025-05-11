import { useTranslations } from 'next-intl';

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
          </div>
        </div>
      </div>
    </section>
  );
}
