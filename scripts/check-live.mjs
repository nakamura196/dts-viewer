#!/usr/bin/env node
/**
 * 本番 (dtsview.ldas.jp) と旧 URL の転送を、実際に HTTP で叩いて確かめる。
 * 配布後・独自ドメインの設定後に手元で実行する: npm run test:live
 *
 * 見ること:
 *   1. 新ホストの主要ページが 200 で、canonical が新ホストを指す
 *   2. ページが読み込む JS / CSS が 200 (basePath のずれがあるとここで 404 になる)
 *   3. 旧 github.io/dts-viewer/<path>?<query> が同じパス・クエリのまま新ホストへ 301
 *   4. 旧 dts-viewer.vercel.app/<path>?<query> も同じく新ホストへ 308
 *   5. 既定の例 (dts.ldas.jp) が CORS 付きで JSON を返す
 */
const NEW = 'https://dtsview.ldas.jp';
const OLD_PAGES = 'https://nakamura196.github.io/dts-viewer';
const OLD_VERCEL = 'https://dts-viewer.vercel.app';
const EXAMPLE_API = 'https://dts.ldas.jp/api/v2/dts';

const errors = [];
let passed = 0;
const ok = (cond, msg) => (cond ? passed++ : errors.push(msg));

async function get(url, opts = {}) {
  return fetch(url, { redirect: 'manual', ...opts });
}

// 1, 2
for (const path of ['/', '/ja/', '/en/', '/ja/about/', '/en/privacy/', '/robots.txt', '/sitemap.xml']) {
  const res = await get(NEW + path);
  ok(res.status === 200, `${NEW}${path} → ${res.status} (200 のはず)`);
  if (!path.endsWith('/') || path === '/') continue;
  const html = await res.text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  ok(canonical === NEW + path, `${path} の canonical が ${canonical} (${NEW + path} のはず)`);
  const assets = [...html.matchAll(/(?:src|href)="(\/_next\/[^"]+)"/g)].map((m) => m[1]);
  ok(assets.length > 0, `${path} から _next の資産参照が見つからない`);
  for (const a of [...new Set(assets)].slice(0, 5)) {
    const r = await get(NEW + a);
    ok(r.status === 200, `${path} が読む ${a} → ${r.status}`);
  }
}
{
  const res = await get(NEW + '/no-such-page/');
  ok(res.status === 404, `存在しないページが ${res.status} (404 のはず)`);
}

// 3, 4
const q = '?base=' + encodeURIComponent(EXAMPLE_API);
for (const [old, status] of [
  [OLD_PAGES, 301],
  [OLD_VERCEL, 308],
]) {
  for (const path of ['/en/', '/ja/about/', '/en/' + q]) {
    const res = await get(old + path);
    const loc = res.headers.get('location');
    ok(
      res.status === status && loc === NEW + path,
      `${old}${path} → ${res.status} ${loc} (${status} ${NEW + path} のはず)`,
    );
  }
}

// 5
{
  const res = await fetch(EXAMPLE_API, { headers: { Origin: NEW } });
  ok(res.status === 200, `${EXAMPLE_API} → ${res.status}`);
  ok(res.headers.get('access-control-allow-origin') === '*', `${EXAMPLE_API} に CORS ヘッダが無い`);
  const body = await res.json().catch(() => null);
  ok(body?.['@type'] === 'EntryPoint', `${EXAMPLE_API} の @type が ${body?.['@type']}`);
}

if (errors.length) {
  console.error(`NG: ${errors.length} 件 (OK ${passed} 件)`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`OK: ${passed} 件`);
