import React from 'react';
import { buttonClass } from '@nakamura196/react-ui';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getDomain, removeVars } from '@/lib/utils';
import { Collection, MemberData, CollectionData } from '@/lib/collection';
import DublinCoreMetadata from '@/components/metadata/DublinCoreMetadata';

interface CollectionView {
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
}

interface CollectionProps {
  base: string;
  url: string;
  data: {
    [key: string]: string;
  };
}

const getNavigationUrl = (navigation: string, url: string, level: number, tree?: string) => {
  navigation = decodeURIComponent(navigation);
  navigation = removeVars(navigation) + `&down=${level}`;
  if (tree) {
    navigation += `&tree=${tree}`;
  }
  const combined = getDomain(url) + navigation;
  return encodeURIComponent(combined);
};

const Nav = ({ member, base, url }: { member: MemberData; base: string; url: string }) => {
  const citationTrees = member.citationTrees || [];
  const t = useTranslations('Common');

  if (citationTrees.length === 0) {
    return (
      <Link
        href={`/?base=${base}&url=${getNavigationUrl(member.navigation || '', url, 1)}`}
        className={buttonClass('secondary', 'sm', 'w-full')}
      >
        {t('navigation')}
      </Link>
    );
  }

  const renderCiteStructure = (
    citeStructures: unknown[],
    treeIdentifier: string | undefined,
    level: number,
  ): React.ReactNode => {
    return citeStructures.map((cs, index) => {
      const citeType = (cs as { citeType: string }).citeType;
      const children = (cs as { citeStructure?: unknown[] }).citeStructure;
      return (
        <div key={index} className={level > 1 ? 'ml-4 border-l-2 border-[var(--ds-border)] pl-2' : ''}>
          <Link
            href={`/?base=${base}&url=${getNavigationUrl(member.navigation || '', url, level, treeIdentifier)}`}
            className={buttonClass('secondary', 'sm', 'w-full justify-start')}
          >
            <span className="text-[var(--ds-fg-muted)] mr-2">{level > 1 ? '└' : '▸'}</span>
            {citeType}
          </Link>
          {children && (
            <div className="mt-1">
              {renderCiteStructure(children, treeIdentifier, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-3">
      {citationTrees.map((citationTree, treeIndex) => (
        <div key={treeIndex} className="space-y-1">
          <p className="text-xs font-medium text-[var(--ds-fg-muted)]">
            {citationTree.description || (citationTree.identifier ? citationTree.identifier : t('navigation'))}
          </p>
          {renderCiteStructure(citationTree.citeStructure, citationTree.identifier, 1)}
        </div>
      ))}
    </div>
  );
};

export default function Collections({ base, url, data }: CollectionProps) {
  const t = useTranslations('Common');

  const collection = Collection.convert(getDomain(url), data) as CollectionData & {
    view?: CollectionView;
  };

  const getDownloadUrl = (member: MemberData) => {
    if (member.download) {
      return member.download;
    }
    const downloadUrl = getDomain(url) + removeVars(member.document || '');
    return downloadUrl;
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-[var(--ds-surface)] rounded-xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--ds-fg)] break-words" style={{ fontFamily: 'var(--ds-font-serif)' }}>
              {collection.title}
            </h1>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-[var(--ds-surface-2)] text-[var(--ds-fg-muted)] rounded-full w-fit">
              {t('type')}: {collection['@type']}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            {collection.member && (
              <div className="text-sm text-[var(--ds-fg-muted)]">
                {collection.member.length} {t('items')}
              </div>
            )}
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
        {collection.description && (
          <div className="bg-[var(--ds-surface-2)] rounded-lg p-3 sm:p-4 mb-4">
            <p className="text-sm sm:text-base text-[var(--ds-fg-muted)]">
              {collection.description}
            </p>
          </div>
        )}
        {collection.dublinCore && (
          <DublinCoreMetadata dublinCore={collection.dublinCore} className="mb-4" />
        )}
      </div>

      {collection.view && (
        <div className="bg-[var(--ds-surface-2)] rounded-lg p-3 sm:p-4 mb-4">
          <div className="flex justify-center space-x-2">
            {collection.view.first && (
              <Link
                href={`/?base=${base}&url=${encodeURIComponent(
                  getDomain(url) + collection.view.first
                )}`}
                className={buttonClass('primary', 'sm')}
              >
                {t('first')}
              </Link>
            )}
            {collection.view.previous && (
              <Link
                href={`/?base=${base}&url=${encodeURIComponent(
                  getDomain(url) + collection.view.previous
                )}`}
                className={buttonClass('primary', 'sm')}
              >
                {t('previous')}
              </Link>
            )}
            {collection.view.next && (
              <Link
                href={`/?base=${base}&url=${encodeURIComponent(
                  getDomain(url) + collection.view.next
                )}`}
                className={buttonClass('primary', 'sm')}
              >
                {t('next')}
              </Link>
            )}
            {collection.view.last && (
              <Link
                href={`/?base=${base}&url=${encodeURIComponent(
                  getDomain(url) + collection.view.last
                )}`}
                className={buttonClass('primary', 'sm')}
              >
                {t('last')}
              </Link>
            )}
          </div>
        </div>
      )}

      {collection.member && collection.member.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {collection.member.map((member: MemberData) => (
            <div
              key={member['@id']}
              className="bg-[var(--ds-surface)] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-4 sm:p-6"
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col">
                  <h2 className="text-lg sm:text-xl font-semibold text-[var(--ds-fg)] mb-2 break-words">
                    {member.title}
                  </h2>
                  {member.description && (
                    <p className="text-sm text-[var(--ds-fg-muted)] line-clamp-3">
                      {truncateText(member.description)}
                    </p>
                  )}
                </div>

                {member['@type'] === 'Collection' && (
                  <div className="pt-2">
                    {member.totalChildren !== undefined && member.totalChildren > 0 && (
                      <p className="text-sm text-[var(--ds-fg-muted)] mb-3 sm:mb-4">
                        {t('itemCount', { count: member.totalChildren })}
                      </p>
                    )}
                    <Link
                      href={`/?base=${base}&url=${encodeURIComponent(
                        `${url.split('?')[0]}?id=${member['@id']}`
                      )}`}
                      className={buttonClass('primary', 'sm', 'w-full')}
                    >
                      {t('viewChildCollection')}
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                )}

                {member['@type'] === 'Resource' && (
                  <div className="pt-2 space-y-2">
                    <Link
                      href={`/?base=${base}&url=${encodeURIComponent(
                        `${url.split('?')[0]}?id=${member['@id']}`
                      )}`}
                      className={buttonClass('primary', 'sm', 'w-full')}
                    >
                      {t('viewResourceDetail')}
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </Link>
                    
                    <a
                      href={getDownloadUrl(member)}
                      className={buttonClass('primary', 'sm', 'w-full')}
                    >
                      {t('download')}
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </a>

                    {member.navigation && <Nav member={member} base={base} url={url} />}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {data.collections && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <Link
            href={`/collections/?url=${url}${data.collections}`}
            className={buttonClass('primary', 'md')}
          >
            {t('viewCollections')}
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
