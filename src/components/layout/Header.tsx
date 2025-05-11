'use client';

import { Link } from '@/i18n/routing';
import { ToggleLanguage } from '@/components/layout/toggle-language';
import { ToggleTheme } from '@/components/layout/toggle-theme';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

const HeaderContent = () => {
  const t = useTranslations('Common');
  const searchParams = useSearchParams();
  const base = searchParams.get('base');

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 sm:px-8 justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center space-x-4 sm:space-x-6 min-w-0">
        <Link
          href={base ? `/?base=${base}` : '/'}
          className="hover:opacity-80 transition-opacity shrink-0 flex items-center group"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            DTS Viewer
          </h1>
        </Link>
      </div>
      <nav className="flex items-center space-x-4 sm:space-x-6">
        <Link
          href={`/`}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base font-medium"
        >
          {t('home')}
        </Link>
        <Link
          href={`/about`}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base font-medium"
        >
          {t('about')}
        </Link>
        <div className="flex items-center space-x-2">
          <ToggleTheme />
          <ToggleLanguage />
        </div>
      </nav>
    </header>
  );
};

const Header = () => {
  return (
    <Suspense
      fallback={
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 sm:px-8 justify-between sticky top-0 z-50 shadow-sm">
          <div className="flex items-center space-x-4 sm:space-x-6 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none tracking-tight">
              DTS Viewer
            </h1>
          </div>
        </header>
      }
    >
      <HeaderContent />
    </Suspense>
  );
};

export default Header;
