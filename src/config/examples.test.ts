import { describe, it, expect } from 'vitest';
import { DTS_EXAMPLES } from '@/config/examples';
import { EntryPoint } from '@/lib/entryPoint';
import { getDomain, removeVars, resolveUrl } from '@/lib/utils';

describe('DTS_EXAMPLES（トップとフッターの「例」）', () => {
  const genji = DTS_EXAMPLES.find((e) => e.label === '校異源氏物語');

  it('校異源氏物語は dts.ldas.jp の最終エンドポイントを直接指す（302 を経由しない）', () => {
    expect(genji?.url).toBe('https://dts.ldas.jp/api/v2/dts');
  });

  it('旧ホスト (dts-typescript.vercel.app) を指す例が残っていない', () => {
    for (const e of DTS_EXAMPLES) expect(e.url).not.toContain('vercel.app');
  });

  it('すべて https の絶対 URL で、ラベルが重複しない', () => {
    for (const e of DTS_EXAMPLES) expect(new URL(e.url).protocol).toBe('https:');
    const labels = DTS_EXAMPLES.map((e) => e.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  // dts.ldas.jp/api/v2/dts が実際に返す EntryPoint（2026-09-24 に取得、DTS 1.0・相対パス）。
  // url-form.tsx が行う変換を同じ順でたどり、コレクションの URL が新ホストに解決されることを確かめる。
  it('dts.ldas.jp の EntryPoint からコレクションの URL を組み立てられる', () => {
    const url = genji!.url;
    const domain = getDomain(url);
    const data = {
      '@context': 'https://dtsapi.org/context/v1.0.json',
      dtsVersion: '1.0',
      '@id': '/api/v2/dts',
      '@type': 'EntryPoint',
      collection: '/api/v2/dts/collection{?id,page,nav}',
      navigation: '/api/v2/dts/navigation{?resource,ref,start,end,down,tree,page}',
      document: '/api/v2/dts/document{?resource,ref,start,end,tree,mediaType}',
    };
    const result = EntryPoint.convert(domain, data);
    const baseUrl = domain + result['@id'].replace(domain, '');
    expect(baseUrl).toBe('https://dts.ldas.jp/api/v2/dts');
    const collection = removeVars(domain + result.collection);
    expect(collection).toBe('https://dts.ldas.jp/api/v2/dts/collection');
    expect(resolveUrl(baseUrl, result.collection)).toContain('https://dts.ldas.jp/api/v2/dts/collection');
  });
});
