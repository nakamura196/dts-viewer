import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getDomain, removeVars } from '@/lib/utils';
import { MemberData } from '@/lib/collection';
import DublinCoreMetadata from '@/components/metadata/DublinCoreMetadata';

interface ResourceProps {
  base: string;
  url: string;
  data: MemberData & {
    [key: string]: any;
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

  const getNavigationUrl = (navigation: string, url: string, level: number = 1) => {
    navigation = decodeURIComponent(navigation);
    navigation = removeVars(navigation) + `&down=${level}`;
    const combined = getDomain(url) + navigation;
    return encodeURIComponent(combined);
  };

  const Nav = ({ resource }: { resource: MemberData }) => {
    const citationTrees = resource.citationTrees || [];
    
    const items = [];

    if (citationTrees.length > 0) {
      for (const citationTree of citationTrees) {
        const citeStructures1 = citationTree.citeStructure;
        for (const citeStructure1 of citeStructures1) {
          items.push({
            level: 1,
            citeType: (citeStructure1 as { citeType: string })['citeType'],
          });

          const citeStructures2 = (citeStructure1 as { citeStructure: unknown[] })[
            'citeStructure'
          ] as unknown as {
            citeType: string;
          }[];

          if (citeStructures2) {
            for (const citeStructure2 of citeStructures2) {
              items.push({
                level: 2,
                citeType: citeStructure2['citeType'],
              });
            }
          }
        }
      }
    } else {
      items.push({
        level: 1,
      });
    }

    return (
      <div className="space-y-2">
        {items.map((item, index) => (
          <Link
            key={index}
            href={`/?base=${base}&url=${getNavigationUrl(resource.navigation || '', url, item.level)}`}
            className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors"
          >
            {t('navigation')} {t('level')}: {item.level} 
            {item.citeType && (
              <>
                {' '}{t('citeType')}: {item.citeType}
              </>
            )}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 break-words">
            {data.title}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
              {t('type')}: {data['@type']}
            </span>
            <a
              href={url}
              className="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition-colors"
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
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 mb-4">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
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
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
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
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('navigation')}
            </h2>
            <Nav resource={data} />
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t('resourceDetails')}
        </h2>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('identifier')}:
            </dt>
            <dd className="text-sm text-gray-900 dark:text-gray-100 mt-1 break-all">
              {data['@id']}
            </dd>
          </div>
          
        </dl>
      </div>
    </div>
  );
}