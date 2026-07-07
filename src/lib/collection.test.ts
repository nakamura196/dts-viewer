import { describe, it, expect } from 'vitest';
import { Collection } from '@/lib/collection';
import { getDomain, resolveUrl, removeVars } from '@/lib/utils';

describe('Collection.convert', () => {
  it('絶対URL のメンバー（archivebase）を保持し、resolveUrl で二重化しない', () => {
    const url = 'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/collection';
    const domain = getDomain(url);
    const data = {
      '@id': 'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji',
      '@type': 'Collection',
      'dts:version': '1-alpha',
      title: '源氏物語',
      member: [
        {
          '@id': 'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/01',
          '@type': 'Resource',
          title: '桐壺',
          navigation:
            'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/navigation?resource=01',
          document:
            'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/document?resource=01',
        },
      ],
    };

    const result = Collection.convert(domain, data);
    const member = result.member[0];
    // 絶対URL はそのまま保持される
    expect(member.navigation).toBe(
      'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/navigation?resource=01',
    );
    // ダウンロードURL 生成（Collections の getDownloadUrl 相当）が二重化しない
    expect(resolveUrl(url, removeVars(member.document || ''))).toBe(
      'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/document?resource=01',
    );
  });

  it('相対URL のメンバー（参照実装）はそのまま相対で保持し、resolveUrl で復元できる', () => {
    const url = 'https://dts-typescript.vercel.app/api/v1/dts/collection';
    const domain = getDomain(url);
    const data = {
      '@id': '/api/v1/dts',
      '@type': 'Collection',
      'dts:version': '1-alpha',
      title: 'Root',
      member: [
        {
          '@id': '/api/v1/dts/doc1',
          '@type': 'Resource',
          title: 'Doc 1',
          navigation: '/api/v1/dts/navigation?resource=doc1',
          document: '/api/v1/dts/document?resource=doc1',
        },
      ],
    };

    const result = Collection.convert(domain, data);
    const member = result.member[0];
    expect(resolveUrl(url, member.navigation || '')).toBe(
      'https://dts-typescript.vercel.app/api/v1/dts/navigation?resource=doc1',
    );
  });

  it('totalItems / dts:references / dts:passage の別名を取り込む', () => {
    const domain = 'https://a.example';
    const data = {
      '@id': '/dts',
      '@type': 'Collection',
      'dts:version': '1-alpha',
      title: 'X',
      member: [
        {
          '@id': '/dts/c1',
          '@type': 'Collection',
          title: 'Child',
          totalItems: 42,
          'dts:references': '/dts/navigation?id=c1',
          'dts:passage': '/dts/document?id=c1',
        },
      ],
    };
    const member = Collection.convert(domain, data).member[0];
    expect(member.totalChildren).toBe(42);
    expect(member.navigation).toBe('/dts/navigation?id=c1');
    expect(member.document).toBe('/dts/document?id=c1');
  });
});
