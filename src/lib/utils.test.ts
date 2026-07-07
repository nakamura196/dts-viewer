import { describe, it, expect } from 'vitest';
import {
  getDomain,
  resolveUrl,
  removeVars,
  getPath,
  extractVariables,
  buildNavigationUrl,
} from '@/lib/utils';

describe('getDomain', () => {
  it('protocol と host のみを返す', () => {
    expect(getDomain('https://example.com/api/dts?x=1')).toBe('https://example.com');
    expect(getDomain('http://localhost:3000/a/b')).toBe('http://localhost:3000');
  });

  it('null は空文字を返す', () => {
    expect(getDomain(null)).toBe('');
  });

  it('URL として解釈できない場合は入力をそのまま返す', () => {
    expect(getDomain('not-a-url')).toBe('not-a-url');
  });
});

describe('resolveUrl', () => {
  const base = 'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/collection';

  it('絶対URL の link はオリジンを二重化せずそのまま解決する（本バグの回帰テスト）', () => {
    const absolute =
      'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/navigation?resource=01&down=1';
    expect(resolveUrl(base, absolute)).toBe(absolute);
    // 旧実装（getDomain(base) + link）で発生していた二重オリジンを含まないこと
    expect(resolveUrl(base, absolute)).not.toContain('ldas.jphttps');
  });

  it('別オリジンの絶対URL もそのまま返す', () => {
    const other = 'https://other.example.org/foo';
    expect(resolveUrl(base, other)).toBe(other);
  });

  it('ルート相対パス（参照実装が返す形式）を base のオリジンに解決する', () => {
    expect(resolveUrl('https://dts-typescript.vercel.app/api/v1/dts/collection', '/api/v1/dts/navigation?resource=01&down=1')).toBe(
      'https://dts-typescript.vercel.app/api/v1/dts/navigation?resource=01&down=1',
    );
  });

  it('空文字は空文字を返す', () => {
    expect(resolveUrl(base, '')).toBe('');
  });

  it('base が null で link が相対だと解決できず link をそのまま返す', () => {
    expect(resolveUrl(null, '/api/v1/dts/navigation')).toBe('/api/v1/dts/navigation');
  });

  it('base が null でも link が絶対URL なら解決できる', () => {
    expect(resolveUrl(null, 'https://example.com/x')).toBe('https://example.com/x');
  });
});

describe('removeVars', () => {
  it('URI テンプレート変数を除去する', () => {
    expect(removeVars('https://a.example/navigation{?resource,ref,down}')).toBe(
      'https://a.example/navigation',
    );
    expect(removeVars('/api/document{?ref}')).toBe('/api/document');
  });

  it('テンプレートが無ければそのまま', () => {
    expect(removeVars('/api/navigation?resource=01')).toBe('/api/navigation?resource=01');
  });
});

describe('getPath', () => {
  it('base を除去しテンプレートも外す', () => {
    expect(
      getPath('https://a.example', 'https://a.example/api/navigation{?ref}'),
    ).toBe('/api/navigation');
  });
});

describe('extractVariables', () => {
  it('テンプレート変数名の配列を返す', () => {
    expect(extractVariables('/doc{?resource,ref}')).toEqual(['?resource,ref']);
    expect(extractVariables('/doc')).toEqual([]);
  });
});

describe('buildNavigationUrl', () => {
  it('絶対URL のナビゲーションを二重化せず、down を付与してエンコードする（回帰テスト）', () => {
    const url = 'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/collection';
    const navigation =
      'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/navigation?resource=01';
    const encoded = buildNavigationUrl(navigation, url, 1);
    const decoded = decodeURIComponent(encoded);
    expect(decoded).toBe(
      'https://archivebase.ldas.jp/api/na-kamura-1263/dts/genji/navigation?resource=01&down=1',
    );
    expect(decoded).not.toContain('ldas.jphttps');
  });

  it('相対パスのナビゲーション（参照実装）を base のオリジンに解決する', () => {
    const url = 'https://dts-typescript.vercel.app/api/v1/dts/collection';
    const encoded = buildNavigationUrl('/api/v1/dts/navigation?resource=01', url, 2);
    expect(decodeURIComponent(encoded)).toBe(
      'https://dts-typescript.vercel.app/api/v1/dts/navigation?resource=01&down=2',
    );
  });

  it('URI テンプレートを展開し、tree を付与する', () => {
    const url = 'https://a.example/dts/collection';
    const navigation = 'https://a.example/dts/navigation?resource=01{&ref,down,tree}';
    const decoded = decodeURIComponent(buildNavigationUrl(navigation, url, 3, 'waka'));
    expect(decoded).toBe('https://a.example/dts/navigation?resource=01&down=3&tree=waka');
  });
});
