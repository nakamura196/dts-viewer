'use client';

import { Link, routing } from '@/i18n/routing';
import { ThemeToggle, LanguageSwitcher } from '@nakamura196/react-ui';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Suspense, useState } from 'react';

const navLinkCls =
  'text-[var(--ds-fg-muted)] hover:text-[var(--ds-primary)] transition-colors text-sm sm:text-base font-medium';

const HeaderContent = () => {
  const t = useTranslations('Common');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const base = searchParams.get('base');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(/^\/[^/]+/, '');
    const qs = searchParams.toString();
    router.push(qs ? `/${newLocale}${newPath}?${qs}` : `/${newLocale}${newPath}`);
  };

  const langItems = routing.locales.map((l) => ({ code: l, label: t(l) }));

  const toggles = (
    <>
      <a
        href="https://github.com/nakamura196/dts-viewer"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--ds-fg-muted)] transition-colors hover:bg-[var(--ds-surface-2)] hover:text-[var(--ds-fg)]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.33-1.72-1.33-1.72-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.57-2.67-.3-5.47-1.31-5.47-5.83 0-1.29.47-2.34 1.24-3.17-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 0 1 3-.4c1.02 0 2.05.13 3 .4 2.29-1.53 3.3-1.21 3.3-1.21.66 1.66.24 2.88.12 3.18.77.83 1.24 1.88 1.24 3.17 0 4.53-2.81 5.53-5.49 5.82.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .31.21.68.83.56A12.01 12.01 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
        </svg>
      </a>
      <ThemeToggle />
      <LanguageSwitcher locales={langItems} current={locale} onChange={switchLanguage} />
    </>
  );

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[var(--ds-border)] bg-[var(--ds-bg)] px-4 sm:px-8">
      <div className="flex min-w-0 items-center">
        <Link
          href={base ? `/?base=${base}` : '/'}
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <span
            className="text-lg font-semibold tracking-tight text-[var(--ds-primary)] sm:text-2xl"
            style={{ fontFamily: 'var(--ds-font-serif)' }}
          >
            DTS Viewer
          </span>
        </Link>
      </div>

      {/* モバイルメニューボタン */}
      <button
        className="p-2 text-[var(--ds-fg-muted)] hover:text-[var(--ds-primary)] sm:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* デスクトップナビゲーション */}
      <nav className="hidden items-center gap-5 sm:flex">
        <Link href="/" className={navLinkCls}>
          {t('home')}
        </Link>
        <Link href="/about" className={navLinkCls}>
          {t('about')}
        </Link>
        <div className="flex items-center gap-2">{toggles}</div>
      </nav>

      {/* モバイルナビゲーション */}
      {isMenuOpen && (
        <nav className="absolute left-0 right-0 top-16 border-b border-[var(--ds-border)] bg-[var(--ds-bg)] sm:hidden">
          <div className="flex flex-col gap-4 p-4">
            <Link href="/" className={navLinkCls} onClick={() => setIsMenuOpen(false)}>
              {t('home')}
            </Link>
            <Link href="/about" className={navLinkCls} onClick={() => setIsMenuOpen(false)}>
              {t('about')}
            </Link>
            <div className="flex items-center gap-3 pt-2">{toggles}</div>
          </div>
        </nav>
      )}
    </header>
  );
};

const Header = () => {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 flex h-16 items-center border-b border-[var(--ds-border)] bg-[var(--ds-bg)] px-4 sm:px-8">
          <span
            className="text-lg font-semibold tracking-tight text-[var(--ds-primary)] sm:text-2xl"
            style={{ fontFamily: 'var(--ds-font-serif)' }}
          >
            DTS Viewer
          </span>
        </header>
      }
    >
      <HeaderContent />
    </Suspense>
  );
};

export default Header;
