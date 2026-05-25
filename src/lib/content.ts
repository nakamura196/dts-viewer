import { promises as fs } from 'fs';
import path from 'path';

/**
 * content/<slug>.<locale>.md を読み込む（ビルド時に静的書き出し）。
 * 指定ロケールが無ければ ja にフォールバック。
 */
export async function getDoc(slug: string, locale: string): Promise<string> {
  const dir = path.join(process.cwd(), 'src', 'content');
  try {
    return await fs.readFile(path.join(dir, `${slug}.${locale}.md`), 'utf8');
  } catch {
    return await fs.readFile(path.join(dir, `${slug}.ja.md`), 'utf8');
  }
}
