import { buttonClass } from '@nakamura196/react-ui';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getDomain, removeVars } from '@/lib/utils';
import { MemberData } from '@/lib/collection';
import DublinCoreMetadata from '@/components/metadata/DublinCoreMetadata';

interface ResourceProps {
  base: string;
  url: string;
  data: MemberData & {
    [key: string]: unknown;
  };
}

export default function Resource({ base, url, data }: ResourceProps) {
  const t = useTranslations('Common');


  const getDownloadUrl = (resource: MemberData) => {
    if (resource.download) {
      return resource.download;
    }
    if (resource.document) {
      return getDomain(url) + removeVars(resource.document);
    }
    return '#';
  };

  const getNavigationUrl = (navigation: string, url: string, level: number = 1, tree?: string) => {
    navigation = decodeURIComponent(navigation);
    navigation = removeVars(navigation) + `&down=${level}`;
    if (tree) {
      navigation += `&tree=${tree}`;
    }
    const combined = getDomain(url) + navigation;
    return encodeURIComponent(combined);
  };

  const Nav = ({ resource }: { resource: MemberData }) => {
    const citationTrees = resource.citationTrees || [];

    if (citationTrees.length === 0) {
      return (
        <Link
          href={`/?base=${base}&url=${getNavigationUrl(resource.navigation || '', url, 1)}`}
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
          <div key={index} className={level > 1 ? 'ml-3 border-l-2 border-[var(--ds-accent)] pl-3' : ''}>
            <Link
              href={`/?base=${base}&url=${getNavigationUrl(resource.navigation || '', url, level, treeIdentifier)}`}
              className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-[var(--ds-primary)] transition-colors hover:bg-[var(--ds-surface-2)]"
            >
              <span className="text-[var(--ds-accent)]">{level > 1 ? '└' : '▸'}</span>
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
      <div className="space-y-4">
        {citationTrees.map((citationTree, treeIndex) => (
          <div key={treeIndex} className="space-y-2">
            <p className="text-sm font-medium text-[var(--ds-fg-muted)]">
              {citationTree.description || (citationTree.identifier ? citationTree.identifier : t('navigation'))}
            </p>
            {renderCiteStructure(citationTree.citeStructure, citationTree.identifier, 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-[var(--ds-surface)] rounded-xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--ds-fg)] break-words" style={{ fontFamily: 'var(--ds-font-serif)' }}>
            {data.title}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-[var(--ds-surface-2)] text-[var(--ds-fg-muted)] rounded-full">
              {t('type')}: {data['@type']}
            </span>
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

        {data.description && (
          <div className="bg-[var(--ds-surface-2)] rounded-lg p-3 sm:p-4 mb-4">
            <p className="text-sm sm:text-base text-[var(--ds-fg-muted)]">
              {data.description}
            </p>
          </div>
        )}

        {data.dublinCore && (
          <DublinCoreMetadata dublinCore={data.dublinCore} className="mb-4" />
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <a
            href={getDownloadUrl(data)}
            className={buttonClass('secondary', 'md')}
          >
            {t('download')}
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

        {data.navigation && (
          <div className="border-t border-[var(--ds-border)] pt-6">
            <h2 className="text-lg font-semibold text-[var(--ds-fg)] mb-4">
              {t('navigation')}
            </h2>
            <Nav resource={data} />
          </div>
        )}
      </div>

      <div className="bg-[var(--ds-surface)] rounded-xl shadow-lg p-4 sm:p-8">
        <h2 className="text-xl font-semibold text-[var(--ds-fg)] mb-4">
          {t('resourceDetails')}
        </h2>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-[var(--ds-fg-muted)]">
              {t('identifier')}:
            </dt>
            <dd className="text-sm text-[var(--ds-fg)] mt-1 break-all">
              {data['@id']}
            </dd>
          </div>
          
        </dl>
      </div>
    </div>
  );
}