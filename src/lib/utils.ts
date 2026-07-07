// URLからドメイン部分のみを取得する関数
export const getDomain = (url: string | null) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  } catch (error) {
    console.error(error);
    return url;
  }
};

// link を base に対して解決する。link が絶対URLならそのまま、相対パスなら
// base のオリジン/パスに対して解決する。文字列連結 (getDomain(base) + link) は
// link が絶対URLのときにオリジンが二重化するため、代わりにこれを使う。
export const resolveUrl = (base: string | null, link: string): string => {
  if (!link) return '';
  try {
    return new URL(link, base ?? undefined).href;
  } catch {
    return link;
  }
};

export const removeVars = (url: string) => {
  return url.replace(/\{[^}]+\}/g, '');
};

// ナビゲーションのリンクから、ビューアの遷移先 `url` パラメータ用の
// エンコード済み絶対URLを組み立てる。navigation は絶対URL・相対パスの
// どちらでもよく、resolveUrl で現在の url を基準に解決される。
export const buildNavigationUrl = (
  navigation: string,
  url: string,
  level: number = 1,
  tree?: string,
): string => {
  let nav = decodeURIComponent(navigation);
  nav = removeVars(nav) + `&down=${level}`;
  if (tree) {
    nav += `&tree=${tree}`;
  }
  return encodeURIComponent(resolveUrl(url, nav));
};

export const getPath = (base: string, path: string) => {
  return removeVars(path.replace(base, ''));
};

export function extractVariables(str: string): string[] {
  const regex = /\{([^}]+)\}/g;
  const matches = str.match(regex);
  if (!matches) return [];

  // {xxx}形式からxxxの部分だけを抽出
  return matches.map((match) => match.slice(1, -1));
}
