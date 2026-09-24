import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// リポジトリ直下の配布設定を読む（vitest はリポジトリ直下で動く）。
const read = (p: string) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

describe('vercel.json（旧 dts-viewer.vercel.app の転送）', () => {
  const config = JSON.parse(read('vercel.json'));

  it('全パスを dtsview.ldas.jp の同じパスへ恒久転送する', () => {
    expect(config.redirects).toEqual([
      {
        source: '/:rest(.*)',
        destination: 'https://dtsview.ldas.jp/:rest',
        permanent: true,
      },
    ]);
  });

  it('転送先にサブパス (/dts-viewer) を付けない', () => {
    for (const r of config.redirects) expect(r.destination).not.toContain('/dts-viewer');
  });
});

describe('vercel-static/index.html（/ の転送ページ）', () => {
  const html = read('vercel-static/index.html');

  it('canonical・JS・meta refresh の 3 か所とも新ホストを指す', () => {
    expect(html).toContain('<link rel="canonical" href="https://dtsview.ldas.jp/" />');
    expect(html).toContain("'https://dtsview.ldas.jp/' +");
    expect(html).toContain('content="0; url=https://dtsview.ldas.jp/"');
  });

  it('旧ホストを指していない', () => {
    expect(html).not.toContain('github.io');
    expect(html).not.toContain('vercel.app');
  });
});

describe('GitHub Pages のビルド (deploy-pages.yml)', () => {
  const yml = read('.github/workflows/deploy-pages.yml');

  it('独自ドメインのホスト直下に置くので basePath を設定しない', () => {
    expect(yml).not.toMatch(/^\s*NEXT_PUBLIC_BASE_PATH:/m);
  });

  it('書き出し結果のリンク検査を配布前に通す', () => {
    const check = yml.indexOf('npm run test:export');
    const upload = yml.indexOf('upload-pages-artifact');
    expect(check).toBeGreaterThan(0);
    expect(check).toBeLessThan(upload);
  });
});

describe('public/index.html（ホスト直下の / → /en/）', () => {
  it('相対パスで転送する（basePath の有無どちらでも壊れない）', () => {
    const html = read('public/index.html');
    expect(html).toMatch(/url=en\//);
    expect(html).not.toMatch(/url=\//);
  });
});
