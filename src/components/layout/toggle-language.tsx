'use client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
export const ToggleLanguage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Common');

  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    // 現在のパスから言語部分を除去して新しい言語を追加
    const newPath = pathname.replace(/^\/[^\/]+/, '');
    const searchParams = new URLSearchParams(window.location.search);
    const url = new URL(window.location.href);
    url.pathname = `/${newLocale}${newPath}`;
    url.search = searchParams.toString();
    router.push(url.toString());
  };

  return (
    <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
      {routing.locales.map((loc) => {
        if (loc !== locale) {
          return (
            <button
              key={loc}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => switchLanguage(loc)}
            >
              {t(loc)}
            </button>
          );
        }
      })}
    </div>
  );
};
