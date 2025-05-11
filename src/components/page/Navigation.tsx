// import { Navigation, Reference } from '@/types/dts';
import { Link } from '@/i18n/routing';
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

    return result;
  };

  const truncateIdentifier = (identifier: string) => {
    if (identifier.length <= 50) return identifier;
    return identifier.substring(0, 25) + '...' + identifier.substring(identifier.length - 25);
  };

  const id = navigation['@id'];
  const members = navigation.member;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('navigation')}</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {members.length} {t('items')}
            </div>
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
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <p className="text-gray-600 dark:text-gray-300 break-all">
            {decodeURIComponent(id || '')}
          </p>
        </div>
      </div>

      {members.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member: ReferenceData, index: number) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6"
            >
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {t('identifier')}
                  </span>
                  <div className="group relative">
                    <span
                      className="text-sm text-gray-900 dark:text-gray-100 font-mono break-all cursor-help"
                      title={member.identifier}
                    >
                      {truncateIdentifier(member.identifier)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('citeType')}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {member.citeType}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('level')}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">{member.level}</span>
                </div>

                <div className="pt-4">
                  <Link
                    href={`${getPassage(member.identifier)}`}
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
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
