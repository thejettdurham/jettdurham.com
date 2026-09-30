import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { slugify } from './lib/slugify.ts';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.md',
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
