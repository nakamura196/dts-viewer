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

  const getDownloadUrl = (document: string) => {
    // return encodeURIComponent(getDomain(url) + document);
    return getDomain(url) + removeVars(document);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('collection')}: {collection.title}
        </h1>
      </div>
      {collection.member && collection.member.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collection.member.map((member: MemberData) => (
            <div
              key={member['@id']}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {member.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{member.description}</p>
              {member.totalChildren !== undefined && member.totalChildren > 0 && (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('itemCount', { count: member.totalChildren })}
                  </p>
                  <Link
                    href={`/?base=${base}&url=${encodeURIComponent(
                      `${url.split('?')[0]}?id=${member['@id']}`
                    )}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50 dark:hover:bg-blue-900/75 transition-colors"
                  >
                    {t('viewItems')}
                    <svg
                      className="w-4 h-4 ml-1.5"
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
                </>
              )}
              {member.totalChildren === 0 && (
                <div className="flex flex-col gap-2">
                  {/*
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    dts:citeDepth: {member['dts:citeDepth']}
                  </p>
                  */}

                  <Link
                    href={`/?base=${base}&url=${getNavigationUrl(member.navigation || '')}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50 dark:hover:bg-blue-900/75 transition-colors"
                  >
                    {t('navigation')}
                  </Link>

                  <a
                    href={getDownloadUrl(member.document || '')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50 dark:hover:bg-blue-900/75 transition-colors"
                  >
                    {t('download')}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {data.collections && (
        <div className="flex justify-center">
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
