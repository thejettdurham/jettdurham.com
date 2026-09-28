import { cp, mkdir, readdir } from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { slugify } from './slugify.ts';

/** Keep non-image Obsidian attachments at the relative paths used in Markdown links. */
export function copyPostAttachments(): AstroIntegration {
  return {
    name: 'copy-post-attachments',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const source = fileURLToPath(new URL('../content/blog/', import.meta.url));
        const output = fileURLToPath(dir);
        async function findPosts(directory: string): Promise<void> {
          for (const entry of await readdir(directory, { withFileTypes: true })) {
            if (!entry.isDirectory()) continue;
            const path = join(directory, entry.name);
            const items = await readdir(path);
            if (items.includes('index.md')) {
              const slug = slugify(basename(path));
              async function copyAssets(current: string): Promise<void> {
                for (const asset of await readdir(current, { withFileTypes: true })) {
                  const assetPath = join(current, asset.name);
                  if (asset.isDirectory()) await copyAssets(assetPath);
                  else if (asset.isFile() && !asset.name.endsWith('.md')) {
                    const target = join(output, 'blog', slug, relative(path, assetPath));
                    await mkdir(dirname(target), { recursive: true });
                    await cp(assetPath, target);
                  }
                }
              }
              await copyAssets(path);
            } else await findPosts(path);
          }
        }
        await findPosts(source);
      },
    },
  };
}
