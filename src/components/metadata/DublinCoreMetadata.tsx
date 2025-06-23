import { DublinCore, DublinCoreValue } from '@/lib/collection';
import { useTranslations } from 'next-intl';

interface DublinCoreMetadataProps {
  dublinCore: DublinCore;
  className?: string;
}

const formatValue = (value: DublinCoreValue): string => {
  if (!value) return '';
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    
    if (typeof value[0] === 'string') {
      return (value as string[]).join(', ');
    }
    
    if (typeof value[0] === 'object' && 'value' in value[0]) {
      return (value as { lang: string; value: string }[])
        .map(item => item.value)
        .join(', ');
    }
  }
  
  if (typeof value === 'object' && 'value' in value) {
    return (value as { lang: string; value: string }).value;
  }
  
  return String(value);
};

const isUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

const renderValue = (value: DublinCoreValue) => {
  const formatted = formatValue(value);
  if (!formatted) return null;
  
  if (isUrl(formatted)) {
    return (
      <a 
        href={formatted} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
      >
        {formatted}
      </a>
    );
  }
  
  return <span className="break-words">{formatted}</span>;
};

export default function DublinCoreMetadata({ dublinCore, className = '' }: DublinCoreMetadataProps) {
  const t = useTranslations('Common');
  
  const fields = [
    { key: 'creator', label: t('creator') },
    { key: 'title', label: t('title') },
    { key: 'description', label: t('description') },
    { key: 'license', label: t('license') },
    { key: 'publisher', label: t('publisher') },
    { key: 'date', label: t('date') },
    { key: 'type', label: t('type') },
    { key: 'format', label: t('format') },
    { key: 'identifier', label: t('identifier') },
    { key: 'source', label: t('source') },
    { key: 'language', label: t('language') },
    { key: 'relation', label: t('relation') },
    { key: 'coverage', label: t('coverage') },
    { key: 'rights', label: t('rights') },
    { key: 'contributor', label: t('contributor') },
    { key: 'subject', label: t('subject') },
  ] as const;

  const hasMetadata = fields.some(field => {
    const value = dublinCore[field.key];
    return value && formatValue(value);
  });

  if (!hasMetadata) {
    return null;
  }

  return (
    <div className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {t('metadata')}
      </h3>
      <dl className="space-y-2">
        {fields.map(field => {
          const value = dublinCore[field.key];
          if (!value) return null;
          
          const formattedValue = formatValue(value);
          if (!formattedValue) return null;
          
          return (
            <div key={field.key} className="flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:w-24 flex-shrink-0">
                {field.label}:
              </dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100 mt-1 sm:mt-0">
                {renderValue(value)}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}