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

  console.log({ data });

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

  const id = navigation['@id'];

  const members = navigation.member;

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{'Navigation'}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{decodeURIComponent(id || '')}</p>
      </div>

      {members.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member: ReferenceData, index: number) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <p className="text-gray-600 dark:text-gray-400 mb-4">{member.identifier}</p>

              <Link
                href={`${getPassage(member.identifier)}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50 dark:hover:bg-blue-900/75 transition-colors"
              >
                {t('download')}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
