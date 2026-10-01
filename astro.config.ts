import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { obsidianMarkdown } from './src/lib/obsidian-markdown.ts';
import { copyPostAttachments } from './src/lib/copy-attachments.ts';

export default defineConfig({
  site: 'https://www.jettdurham.com',
  output: 'static',
  trailingSlash: 'always',
  image: { service: passthroughImageService() },
  integrations: [sitemap(), copyPostAttachments()],
  markdown: { processor: unified({ remarkPlugins: [obsidianMarkdown] }) },
});
