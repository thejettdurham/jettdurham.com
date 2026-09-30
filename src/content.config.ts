import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { slugify } from './lib/slugify.ts';

const blogDirectory = new URL('./content/blog/', import.meta.url);

// The Obsidian plugin leaves the old flat file when an image moves a post into a folder.
// Prefer the folder's index.md so the post keeps its URL and gains its images.
function supersededFlatPosts(directory: string, prefix = ''): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (!entry.isDirectory()) return [];
    const relative = `${prefix}${entry.name}`;
    const folder = join(directory, entry.name);
    return [
      ...(existsSync(join(directory, `${entry.name}.md`)) && existsSync(join(folder, 'index.md'))
        ? [`!${relative}.md`]
        : []),
      ...supersededFlatPosts(folder, `${relative}/`),
    ];
  });
}

const blog = defineCollection({
  loader: glob({
    base: blogDirectory,
    pattern: ['**/*.md', ...supersededFlatPosts(fileURLToPath(blogDirectory))],
    generateId: ({ entry }) =>
      slugify(
        entry
          .replace(/(?:\/index)?\.md$/, '')
          .split('/')
          .pop()!,
      ),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    summary: z.string().optional(), // Historical Hugo frontmatter.
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.preprocess(
      (value) => (value === 'true' ? true : value === 'false' ? false : value),
      z.boolean().default(false),
    ),
    image: z.string().optional(),
  }),
});

export const collections = { blog };
