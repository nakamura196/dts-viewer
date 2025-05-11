import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { getDomain, removeVars } from '@/lib/utils';
import { Collection, MemberData } from '@/lib/collection';

interface CollectionProps {
  base: string;
  url: string;
  data: {
    [key: string]: string;
  };
}

export default function Collections({ base, url, data }: CollectionProps) {
  const t = useTranslations('Common');
  const collection = Collection.convert(getDomain(url), data);

  const getNavigationUrl = (navigation: string) => {
    navigation = decodeURIComponent(navigation);
    if (navigation.indexOf('down') != -1) {
      navigation = removeVars(navigation) + '&down=1';
    } else {
      navigation = removeVars(navigation);
    }
    const combined = getDomain(url) + navigation;
    return encodeURIComponent(combined);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('collection')}: {collection.title}
          </h1>
          <div className="flex items-center gap-4">
            {collection.member && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {collection.member.length} {t('items')}
              </div>
            )}
            <a
              href={url}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition-colors"
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
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-600 dark:text-gray-300">{collection.description}</p>
          </div>
        )}
      </div>

      {collection.member && collection.member.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collection.member.map((member: MemberData) => (
            <div
              key={member['@id']}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6"
            >
              <div className="space-y-4">
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {member.title}
                  </h2>
                  {member.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {truncateText(member.description)}
                    </p>
                  )}
                </div>

                {member.totalChildren !== undefined && member.totalChildren > 0 && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {t('itemCount', { count: member.totalChildren })}
                    </p>
                    <Link
                      href={`/?base=${base}&url=${encodeURIComponent(
                        `${url.split('?')[0]}?id=${member['@id']}`
                      )}`}
                      className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
                    >
                      {t('viewItems')}
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

                {member.totalChildren === 0 && (
                  <div className="pt-2 space-y-2">
                    <a
                      href={getDownloadUrl(member)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
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

                    {member.navigation && (
                      <Link
                        href={`/?base=${base}&url=${getNavigationUrl(member.navigation || '')}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors"
                      >
                        {t('navigation')}
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
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {data.collections && (
        <div className="flex justify-center mt-8">
          <Link
            href={`/collections/?url=${url}${data.collections}`}
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {t('viewCollections')}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
