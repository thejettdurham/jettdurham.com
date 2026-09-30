import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) =>
    item.isDirectory() ? files(join(dir, item.name)) : [join(dir, item.name)],
  );
}
const outputs = files(root);
const pages = outputs.filter((file) => file.endsWith('.html'));
const errors: string[] = [];
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  if (!html.includes('<link rel="canonical"'))
    errors.push(`${relative(root, file)} missing canonical`);
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(url)) continue;
    const pathname = decodeURIComponent(
      new URL(url, `https://www.jettdurham.com/${relative(root, dirname(file))}/`).pathname,
    );
    const target = join(root, pathname.replace(/^\//, ''));
    if (!existsSync(target) && !existsSync(join(target, 'index.html')))
      errors.push(`${relative(root, file)} → ${url}`);
  }
}
for (const required of [
  'index.html',
  '404.html',
  'blog/index.html',
  'blog/maybe-start-with-monorepo/index.html',
  'rss.xml',
  'sitemap-index.xml',
  'images/jett.jpg',
]) {
  if (!existsSync(join(root, required))) errors.push(`Missing ${required}`);
}
if (existsSync(join(root, 'blog/xstate-is-the-future/index.html')))
  errors.push('Draft was published');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Verified ${pages.length} static HTML pages and their local asset links.`);
