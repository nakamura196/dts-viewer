import { describe, it, expect } from 'vitest';
import { Navigation } from '@/lib/navigation';
import { getDomain, resolveUrl, removeVars } from '@/lib/utils';

describe('Navigation.convert', () => {
  it('絶対URL を返すサーバ（archivebase）— resource.document から domain を剥がし、resolveUrl で復元できる', () => {
    const url =
      'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/navigation?resource=01&down=1';
    const domain = getDomain(url);
    const data = {
      '@id':
        'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/navigation?resource=01',
      '@type': 'Navigation',
      'dts:version': '1-alpha',
      resource: {
        '@id': 'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/01',
        document:
          'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/document{?resource,ref}',
        navigation:
          'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/navigation{?resource,ref}',
      },
      member: [
        { identifier: '1', citeType: 'page', level: 1 },
        { identifier: '2', citeType: 'page', level: 1 },
      ],
    };

    const result = Navigation.convert(domain, data);
    expect(result.member).toHaveLength(2);
    expect(result.member[0].identifier).toBe('1');
    // getPassage 相当: resolveUrl(url, removeVars(document)) が二重化しない
    const passageBase = resolveUrl(url, removeVars(result.resource.document));
    expect(passageBase).toBe(
      'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/document',
    );
  });

  it('単一 member（配列でない）も配列化する', () => {
    const domain = 'https://a.example';
    const data = {
      '@id': '/dts/navigation',
      '@type': 'Navigation',
      'dts:version': '1-alpha',
      resource: { document: '/dts/document{?ref}', navigation: '/dts/navigation{?ref}' },
      member: { identifier: '1', citeType: 'page', level: 1 },
    };
    const result = Navigation.convert(domain, data);
    expect(result.member).toHaveLength(1);
    expect(result.member[0].identifier).toBe('1');
  });

  it('hydra:member（校異）と parent 階層を取り込む', () => {
    const domain = 'https://a.example';
    const data = {
      '@id': '/dts/navigation',
      '@type': 'Navigation',
      'dts:version': '1-alpha',
      'dts:level': 2,
      'dts:citeType': 'line',
      resource: { document: '/dts/document', navigation: '/dts/navigation' },
      'hydra:member': [{ ref: 'a', parent: 'root' }],
    };
    const result = Navigation.convert(domain, data);
    expect(result.member[0].identifier).toBe('a');
    expect(result.member[0].parent).toBe('root');
    expect(result.member[0].level).toBe(2);
    expect(result.member[0].citeType).toBe('line');
  });
});
