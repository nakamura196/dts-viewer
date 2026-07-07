import { describe, it, expect } from 'vitest';
import { EntryPoint } from '@/lib/entryPoint';
import { getDomain, resolveUrl } from '@/lib/utils';

describe('EntryPoint.convert', () => {
  it('絶対URL を返すサーバ（archivebase）— domain を剥がし、resolveUrl で復元できる', () => {
    const url = 'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji';
    const domain = getDomain(url);
    const data = {
      '@id': 'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji',
      '@type': 'EntryPoint',
      'dts:version': '1-alpha',
      collection: 'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/collection',
      navigation: 'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/navigation{?resource}',
      document: 'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/document{?resource}',
    };

    const result = EntryPoint.convert(domain, data);
    expect(result.collection).toBe('/api/na-kamura-1263/dts/genji/collection');
    // domain を足し直しても二重化しない
    expect(resolveUrl(url, result.collection)).toBe(
      'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/collection',
    );
  });

  it('相対URL を返すサーバ（参照実装）', () => {
    const url = 'https://dts-typescript.vercel.app/api/v1/dts';
    const domain = getDomain(url);
    const data = {
      '@id': '/api/v1/dts',
      '@type': 'EntryPoint',
      'dts:version': '1-alpha',
      collection: '/api/v1/dts/collection',
      navigation: '/api/v1/dts/navigation',
      document: '/api/v1/dts/document',
    };

    const result = EntryPoint.convert(domain, data);
    expect(result.collection).toBe('/api/v1/dts/collection');
    expect(resolveUrl(url, result.collection)).toBe(
      'https://dts-typescript.vercel.app/api/v1/dts/collection',
    );
  });

  it('collections / documents の別名フィールドを優先する', () => {
    const domain = 'https://a.example';
    const data = {
      '@id': '/dts',
      '@type': 'EntryPoint',
      'dts:version': '1-alpha',
      collection: '/dts/collection',
      collections: '/dts/collections-alt',
      document: '/dts/document',
      documents: '/dts/documents-alt',
    };
    const result = EntryPoint.convert(domain, data);
    expect(result.collection).toBe('/dts/collections-alt');
    expect(result.document).toBe('/dts/documents-alt');
  });
});
