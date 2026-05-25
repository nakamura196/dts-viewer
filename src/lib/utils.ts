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

export function extractVariables(str: string): string[] {
  const regex = /\{([^}]+)\}/g;
  const matches = str.match(regex);
  if (!matches) return [];

  // {xxx}形式からxxxの部分だけを抽出
  return matches.map((match) => match.slice(1, -1));
}
