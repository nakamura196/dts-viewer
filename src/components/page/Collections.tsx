import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getDomain, removeVars } from '@/lib/utils';
import { Collection, MemberData, CollectionData } from '@/lib/collection';

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

const getNavigationUrl = (navigation: string, url: string, level: number) => {
  navigation = decodeURIComponent(navigation);
  /*
  if (navigation.indexOf('down') != -1) {
    // navigation = removeVars(navigation) + '&down=1';
    navigation = removeVars(navigation) + `&down=${level}`;
  } else {
    // navigation = removeVars(navigation);
    navigation = removeVars(navigation) + `&down=${level}`;
  }
  */
  navigation = removeVars(navigation) + `&down=${level}`;
  const combined = getDomain(url) + navigation;
  return encodeURIComponent(combined);
};

const Nav = ({ member, base, url }: { member: MemberData; base: string; url: string }) => {
  const citationTrees = member.citationTrees || [];
  const t = useTranslations('Common');

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

        for (const citeStructure2 of citeStructures2) {
          items.push({
            level: 2,
            citeType: citeStructure2['citeType'],
          });
        }
      }
    }
  } else {
    items.push({
      level: 1,
      // citeType: t('navigation'),
    });
  }

  /*
  return (
    <Link
      href={`/?base=${base}&url=${getNavigationUrl(member.navigation || '')}`}
      className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors"
    >
      {t('navigation')}
    </Link>
  );
  */

  return (
    <>
      {items.map((item, index) => (
        <Link
          key={index}
          href={`/?base=${base}&url=${getNavigationUrl(member.navigation || '', url, item.level)}`}
          className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors"
        >
          {t('navigation')} {t('level')}: {item.level} {item.citeType && t('citeType')}:{' '}
          {item.citeType}
        </Link>
      ))}
    </>
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 break-words">
            {t('collection')}: {collection.title}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            {collection.member && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {collection.member.length} {t('items')}
              </div>
            )}
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
        {collection.description && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4">
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {collection.description}
            </p>
          </div>
        )}
      </div>

      {collection.view && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 mb-4">
          <div className="flex justify-center space-x-2">
            {collection.view.first && (
              <Link
                href={`/?base=${base}&url=${encodeURIComponent(
                  getDomain(base) + collection.view.first
                )}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                {t('first')}
              </Link>
            )}
            {collection.view.previous && (
              <Link
                href={`/?base=${base}&url=${encodeURIComponent(
                  getDomain(base) + collection.view.previous
                )}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                {t('previous')}
              </Link>
            )}
            {collection.view.next && (
              <Link
                href={`/?base=${base}&url=${encodeURIComponent(
                  getDomain(base) + collection.view.next
                )}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                {t('next')}
              </Link>
            )}
            {collection.view.last && (
              <Link
                href={`/?base=${base}&url=${encodeURIComponent(
                  getDomain(base) + collection.view.last
                )}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-4 sm:p-6"
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 break-words">
                    {member.title}
                  </h2>
                  {member.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {truncateText(member.description)}
                    </p>
                  )}
                </div>

                {member['@type'] === 'Collection' && (
                  <div className="pt-2">
                    {member.totalChildren !== undefined && member.totalChildren > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                        {t('itemCount', { count: member.totalChildren })}
                      </p>
                    )}
                    <Link
                      href={`/?base=${base}&url=${encodeURIComponent(
                        `${url.split('?')[0]}?id=${member['@id']}`
                      )}`}
                      className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
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
                    <a
                      href={getDownloadUrl(member)}
                      className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
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
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
