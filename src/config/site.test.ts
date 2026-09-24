import { describe, it, expect } from 'vitest';
import { siteUrl, localizedUrl, languageAlternates, alternatesFor } from '@/config/site';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';

// NEXT_PUBLIC_SITE_URL を設定していない状態 (本番ビルドと同じ) を前提にする。
describe('siteUrl（公開ホスト）', () => {
  it('既定は dtsview.ldas.jp のホスト直下で、サブパスも末尾スラッシュも無い', () => {
    expect(siteUrl).toBe('https://dtsview.ldas.jp');
    expect(new URL(siteUrl).pathname).toBe('/');
  });

  it('旧ホスト (github.io/dts-viewer, vercel.app) を指さない', () => {
    expect(siteUrl).not.toContain('github.io');
    expect(siteUrl).not.toContain('vercel.app');
    expect(siteUrl).not.toContain('/dts-viewer');
  });
});

describe('localizedUrl', () => {
  it('ロケールのトップは末尾スラッシュ付き', () => {
    expect(localizedUrl('ja')).toBe('https://dtsview.ldas.jp/ja/');
    expect(localizedUrl('en')).toBe('https://dtsview.ldas.jp/en/');
  });

  it('下層ページも末尾スラッシュ付き（trailingSlash: true と一致）', () => {
    expect(localizedUrl('en', 'about')).toBe('https://dtsview.ldas.jp/en/about/');
  });

  it('前後のスラッシュを正規化し、二重スラッシュを作らない', () => {
    expect(localizedUrl('ja', '/privacy/')).toBe('https://dtsview.ldas.jp/ja/privacy/');
    expect(localizedUrl('ja', '//about//')).toBe('https://dtsview.ldas.jp/ja/about/');
  });
});

describe('hreflang / canonical', () => {
  it('全ロケールと x-default（既定ロケール ja）を返す', () => {
    expect(languageAlternates('about')).toEqual({
      en: 'https://dtsview.ldas.jp/en/about/',
      ja: 'https://dtsview.ldas.jp/ja/about/',
      'x-default': 'https://dtsview.ldas.jp/ja/about/',
    });
  });

  it('canonical はそのページ自身', () => {
    expect(alternatesFor('en', 'privacy').canonical).toBe('https://dtsview.ldas.jp/en/privacy/');
  });
});

describe('sitemap.xml', () => {
  const entries = sitemap();

  it('3 ページ × 2 ロケール', () => {
    expect(entries).toHaveLength(6);
  });

  it('すべて新ホストの直下', () => {
    for (const e of entries) {
      expect(e.url.startsWith('https://dtsview.ldas.jp/')).toBe(true);
      expect(e.url).not.toContain('/dts-viewer/');
      for (const alt of Object.values(e.alternates?.languages ?? {})) {
        expect(String(alt).startsWith('https://dtsview.ldas.jp/')).toBe(true);
      }
    }
  });

  it('トップの優先度が最も高い', () => {
    const top = entries.filter((e) => e.priority === 1).map((e) => e.url);
    expect(top.sort()).toEqual(['https://dtsview.ldas.jp/en/', 'https://dtsview.ldas.jp/ja/']);
  });
});

describe('robots.txt', () => {
  it('Sitemap はホスト直下の sitemap.xml を指す', () => {
    expect(robots().sitemap).toBe('https://dtsview.ldas.jp/sitemap.xml');
  });
});
