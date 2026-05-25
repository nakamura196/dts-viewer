import React from 'react';
import { buttonClass } from '@nakamura196/react-ui';
import { useTranslations } from 'next-intl';
import { getDomain, removeVars, extractVariables } from '@/lib/utils';
import { Navigation, ReferenceData } from '@/lib/navigation';

interface CollectionProps {
  base: string;
  url: string;
  data: { [key: string]: unknown };
}

export default function NavigationPage({ url, data }: CollectionProps) {
  const t = useTranslations('Common');

  const navigation = Navigation.convert(getDomain(url), data);

  const getPassage = (identifier: string) => {
    const documentTemplate = navigation.resource.document;

    let result = getDomain(url) + removeVars(documentTemplate);

    const variables = extractVariables(documentTemplate);

    if (variables.some((v) => v.indexOf('ref') !== -1)) {
      result = result + '&ref=' + identifier;
    }

    // 元のナビゲーションURLからtreeパラメータを引き継ぐ
    try {
      const navUrl = new URL(url);
      const tree = navUrl.searchParams.get('tree');
      if (tree) {
        result = result + '&tree=' + tree;
      }
    } catch {
      // ignore
    }

    // ブラウザで表示できるようにmediaTypeを指定
    result = result + '&mediaType=application/xml';

    return result;
  };

  const truncateIdentifier = (identifier: string) => {
    if (identifier.length <= 50) return identifier;
    return identifier.substring(0, 25) + '...' + identifier.substring(identifier.length - 25);
  };

  const id = navigation['@id'];
  const members = navigation.member;

  // 親子関係があるかチェック
  const hasHierarchy = members.some((m) => m.parent !== null);

  // 階層構造を構築
  const rootMembers = hasHierarchy ? members.filter((m) => m.parent === null) : members;
  const childrenByParent = new Map<string, ReferenceData[]>();
  if (hasHierarchy) {
    for (const member of members) {
      if (member.parent) {
        const children = childrenByParent.get(member.parent) || [];
        children.push(member);
        childrenByParent.set(member.parent, children);
      }
    }
  }

  // 再帰的にツリー行をレンダリング
  const renderTreeRows = (parentMembers: ReferenceData[], depth: number): React.ReactNode => {
    return parentMembers.map((member, index) => {
      const children = childrenByParent.get(member.identifier) || [];
      return (
        <React.Fragment key={`${depth}-${index}`}>
          <tr className="hover:bg-[var(--ds-surface-2)] transition-colors">
            <td className="px-3 sm:px-4 py-2 text-sm font-mono text-[var(--ds-fg)] break-all">
              <span style={{ paddingLeft: `${depth * 1.5}rem` }} className="inline-flex items-center">
                {depth > 0 && <span className="text-[var(--ds-fg-muted)] mr-1.5">└</span>}
                {member.identifier}
              </span>
            </td>
            <td className="px-3 sm:px-4 py-2 text-sm text-[var(--ds-fg-muted)]">
              {member.citeType}
            </td>
            <td className="px-3 sm:px-4 py-2 text-sm text-center text-[var(--ds-fg-muted)]">
              {member.level}
            </td>
            <td className="px-3 sm:px-4 py-2 text-sm text-center">
              <a
                href={getPassage(member.identifier)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('primary', 'sm')}
              >
                XML
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </td>
          </tr>
          {children.length > 0 && renderTreeRows(children, depth + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-[var(--ds-surface)] rounded-xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--ds-fg)]" style={{ fontFamily: 'var(--ds-font-serif)' }}>
            {t('navigation')}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="text-sm text-[var(--ds-fg-muted)]">
              {members.length} {t('items')}
            </div>
            <a
              href={url}
              className={buttonClass('secondary', 'sm')}
            >
              {t('jsonDownload')}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="bg-[var(--ds-surface-2)] rounded-lg p-3 sm:p-4">
          <p className="text-sm sm:text-base text-[var(--ds-fg-muted)] break-all">
            {decodeURIComponent(id || '')}
          </p>
        </div>
      </div>

      {members.length > 0 && (
        <div className="bg-[var(--ds-surface)] rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--ds-surface-2)] border-b border-[var(--ds-border)]">
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-[var(--ds-fg-muted)] uppercase tracking-wider">
                    {t('identifier')}
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-[var(--ds-fg-muted)] uppercase tracking-wider">
                    {t('citeType')}
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-[var(--ds-fg-muted)] uppercase tracking-wider">
                    {t('level')}
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-[var(--ds-fg-muted)] uppercase tracking-wider">
                    XML
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--ds-border)]">
                {hasHierarchy
                  ? renderTreeRows(rootMembers, 0)
                  : members.map((member, index) => (
                      <tr key={index} className="hover:bg-[var(--ds-surface-2)] transition-colors">
                        <td className="px-3 sm:px-4 py-2 text-sm font-mono text-[var(--ds-fg)] break-all">
                          {truncateIdentifier(member.identifier)}
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-sm text-[var(--ds-fg-muted)]">
                          {member.citeType}
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-sm text-center text-[var(--ds-fg-muted)]">
                          {member.level}
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-sm text-center">
                          <a
                            href={getPassage(member.identifier)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonClass('primary', 'sm')}
                          >
                            XML
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
