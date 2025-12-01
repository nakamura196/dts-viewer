'use client';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
export const ToggleLanguage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Common');

  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    // 現在のパスから言語部分を除去して新しい言語を追加
    const newPath = pathname.replace(/^\/[^\/]+/, '');
    // クエリパラメータを引き継ぐ
    const queryString = searchParams.toString();
    const fullPath = queryString ? `/${newLocale}${newPath}?${queryString}` : `/${newLocale}${newPath}`;
    router.push(fullPath);
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
