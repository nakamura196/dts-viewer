import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

// SSG対応
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'en' ? 'Privacy Policy' : 'プライバシーポリシー' };
}

const GA_LINKS = {
  policy: 'https://policies.google.com/privacy',
  partner: 'https://policies.google.com/technologies/partner-sites',
  optout: 'https://tools.google.com/dlpage/gaoptout',
  issues: 'https://github.com/nakamura196/dts-viewer/issues',
};

function PrivacyJa() {
  return (
    <>
      <h1>プライバシーポリシー</h1>
      <p>
        DTS Viewer（以下「本サイト」）における利用者情報の取り扱いについて、以下のとおり定めます。
      </p>

      <h2>アクセス解析（Google Analytics）</h2>
      <p>
        本サイトは、利用状況の把握とサービス改善のため、Google LLC が提供するアクセス解析ツール
        「Google Analytics 4」を使用しています。Google Analytics は Cookie
        を利用して利用者の情報を収集します。収集される主な情報は次のとおりで、個人を特定する情報は含まれません。
      </p>
      <ul>
        <li>アクセス日時、閲覧したページ、滞在時間</li>
        <li>参照元（リンク元の URL や検索キーワード）</li>
        <li>匿名化された IP アドレス</li>
        <li>端末・OS・ブラウザの種類</li>
        <li>おおよその地域（IP アドレスから推定される国・地域）</li>
      </ul>

      <h2>外部送信について</h2>
      <p>
        上記の情報は、アクセス解析を目的として Google LLC へ送信されます。送信先・送信される情報・利用目的は次のとおりです。
      </p>
      <ul>
        <li>送信先：Google LLC</li>
        <li>送信される情報：上記「アクセス解析」に記載の情報</li>
        <li>利用目的：本サイトのアクセス解析およびサービス改善</li>
      </ul>
      <p>
        Google におけるデータの取り扱いについては、
        <a href={GA_LINKS.policy} target="_blank" rel="noopener noreferrer">
          Google プライバシーポリシー
        </a>
        および
        <a href={GA_LINKS.partner} target="_blank" rel="noopener noreferrer">
          Google のサービスを使用するサイトやアプリから収集した情報の Google による使用
        </a>
        をご確認ください。
      </p>

      <h2>オプトアウト（収集の無効化）</h2>
      <p>
        ブラウザの設定で Cookie を無効化することで、データの収集を拒否できます。また、Google が提供する
        <a href={GA_LINKS.optout} target="_blank" rel="noopener noreferrer">
          Google アナリティクス オプトアウト アドオン
        </a>
        を利用すると、Google Analytics による情報収集を無効化できます。
      </p>

      <h2>プライバシーポリシーの変更</h2>
      <p>
        本ポリシーの内容は、法令の変更や運用の見直しに応じて、予告なく変更することがあります。変更後の内容は本ページに掲載した時点で効力を生じます。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        本ポリシーに関するお問い合わせは、
        <a href={GA_LINKS.issues} target="_blank" rel="noopener noreferrer">
          GitHub の Issue
        </a>
        からお願いします。
      </p>

      <p>制定日：2026年5月25日</p>
    </>
  );
}

function PrivacyEn() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p>
        This page describes how DTS Viewer (&quot;this site&quot;) handles visitor information.
      </p>

      <h2>Analytics (Google Analytics)</h2>
      <p>
        To understand usage and improve the service, this site uses Google Analytics 4, an analytics
        tool provided by Google LLC. Google Analytics uses cookies to collect information about
        visitors. The main information collected is listed below and does not include
        personally identifiable information.
      </p>
      <ul>
        <li>Access date and time, pages viewed, and time on page</li>
        <li>Referrer (the URL or search terms that led you here)</li>
        <li>Anonymized IP address</li>
        <li>Device, OS, and browser type</li>
        <li>Approximate location (country/region estimated from the IP address)</li>
      </ul>

      <h2>Transfer to a third party</h2>
      <p>
        The information above is sent to Google LLC for analytics purposes. The recipient,
        information sent, and purpose are as follows.
      </p>
      <ul>
        <li>Recipient: Google LLC</li>
        <li>Information sent: the information described under &quot;Analytics&quot; above</li>
        <li>Purpose: analytics and improvement of this site</li>
      </ul>
      <p>
        For how Google handles this data, please see the{' '}
        <a href={GA_LINKS.policy} target="_blank" rel="noopener noreferrer">
          Google Privacy Policy
        </a>{' '}
        and{' '}
        <a href={GA_LINKS.partner} target="_blank" rel="noopener noreferrer">
          How Google uses information from sites or apps that use its services
        </a>
        .
      </p>

      <h2>Opt-out</h2>
      <p>
        You can refuse data collection by disabling cookies in your browser. You can also install
        the{' '}
        <a href={GA_LINKS.optout} target="_blank" rel="noopener noreferrer">
          Google Analytics Opt-out Browser Add-on
        </a>{' '}
        to disable collection by Google Analytics.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        This policy may be revised without notice in response to changes in laws or operations. Any
        revision takes effect when posted on this page.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about this policy, please open an issue on{' '}
        <a href={GA_LINKS.issues} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>

      <p>Effective date: May 25, 2026</p>
    </>
  );
}

export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <article className="prose prose-lg max-w-none prose-headings:text-[var(--ds-fg)] prose-headings:[font-family:var(--ds-font-serif)] prose-p:text-[var(--ds-fg-muted)] prose-li:text-[var(--ds-fg-muted)] prose-a:text-[var(--ds-primary)] prose-strong:text-[var(--ds-fg)]">
        {locale === 'en' ? <PrivacyEn /> : <PrivacyJa />}
      </article>
    </div>
  );
}
