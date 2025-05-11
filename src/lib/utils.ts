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

export const removeVars = (url: string) => {
  return url.replace(/\{[^}]+\}/g, '');
};

export const getPath = (base: string, path: string) => {
  return removeVars(path.replace(base, ''));
};

export function combineUrls(domain: string, ...urls: string[]): string {
  if (urls.length === 0) return domain;

  // 各URLの先頭と末尾のスラッシュを削除
  const cleanUrls = urls.map((url) => url.replace(/^\/+|\/+$/g, ''));

  // ドメインの末尾のスラッシュを削除
  const cleanDomain = domain.replace(/\/+$/, '');

  // URLからドメイン部分を削除し、パス部分を取得
  const pathParts = cleanUrls
    .map((url) => {
      try {
        const urlObj = new URL(url);
        // クエリパラメータを保持
        const query = urlObj.search;
        const path = url.replace(urlObj.origin, '').replace(query, '');
        return { path, query };
      } catch (error) {
        console.error(error);
        // URLとして解析できない場合は、クエリパラメータとして扱う
        if (url.includes('?')) {
          const [path, query] = url.split('?');
          return { path, query: '?' + query };
        }
        return { path: url, query: '' };
      }
    })
    .map(({ path, query }) => ({
      parts: path.split('/').filter(Boolean),
      query,
    }));

  // 重複するパス部分を削除（パスの順序を保持）
  const uniqueParts: string[] = [];
  let lastQuery = '';

  for (const { parts, query } of pathParts) {
    let i = 0;
    while (i < parts.length) {
      const currentPart = parts[i];
      let isDuplicate = false;

      // 現在のパートが後続のパートと重複するかチェック
      for (let j = i + 1; j < parts.length; j++) {
        if (currentPart === parts[j]) {
          // 重複が見つかった場合、その位置までスキップ
          i = j;
          isDuplicate = true;
          break;
        }
      }

      // 重複していない場合、または最初の出現の場合のみ追加
      if (!isDuplicate || uniqueParts.indexOf(currentPart) === -1) {
        uniqueParts.push(currentPart);
      }
      i++;
    }
    // 最後のクエリパラメータを保持
    if (query) {
      lastQuery = query;
    }
  }

  // 最終的なURLを組み立て
  let result = cleanDomain;
  if (uniqueParts.length > 0) {
    result += '/' + uniqueParts.join('/');
  }
  if (lastQuery) {
    result += lastQuery;
  }

  return result;
}

export function extractVariables(str: string): string[] {
  const regex = /\{([^}]+)\}/g;
  const matches = str.match(regex);
  if (!matches) return [];

  // {xxx}形式からxxxの部分だけを抽出
  return matches.map((match) => match.slice(1, -1));
}
