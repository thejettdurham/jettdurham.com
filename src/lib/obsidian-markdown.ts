import type { Link, PhrasingContent, Root, RootContent } from 'mdast';
import { visit } from 'unist-util-visit';
import { slugify } from './slugify.ts';

function youtubeId(value: string): string | null {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');
    const id =
      host === 'youtu.be'
        ? url.pathname.slice(1)
        : ['youtube.com', 'm.youtube.com'].includes(host)
          ? url.pathname === '/watch'
            ? url.searchParams.get('v')
            : url.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)?.[1]
          : null;
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** Adapt links left in Publish to Git Repo's Markdown during the Astro build. */
export function obsidianMarkdown() {
  return (tree: Root): void => {
    visit(tree, 'text', (node, index, parent) => {
      if (index === undefined || !parent || !/\[\[[^\]]+\]\]/.test(node.value)) return;

      const replacements: PhrasingContent[] = [];
      for (const part of node.value.split(/(\[\[[^\]]+\]\])/g)) {
        const match = /^\[\[([^\]]+)\]\]$/.exec(part);
        if (!match) {
          if (part) replacements.push({ type: 'text', value: part });
          continue;
        }
        const [target, label] = match[1].split('|');
        const [note, fragment] = target.split('#');
        const link: Link = {
          type: 'link',
          url: `/blog/${slugify(note.replace(/\.md$/i, '').split('/').pop() ?? '')}/${fragment ? `#${slugify(fragment)}` : ''}`,
          children: [{ type: 'text', value: label || note }],
        };
        replacements.push(link);
      }
      (parent.children as PhrasingContent[]).splice(index, 1, ...replacements);
      return index + replacements.length;
    });

    visit(tree, 'link', (node) => {
      if (!/^(?:[a-z]+:|\/|#)/i.test(node.url) && /\.md(?:#.*)?$/i.test(node.url)) {
        const [path, fragment] = node.url.split('#');
        const note = decodeURIComponent(
          path
            .replace(/\.md$/i, '')
            .split('/')
            .filter((part) => part !== '.' && part !== '..')
            .pop() ?? '',
        );
        node.url = `/blog/${slugify(note)}/${fragment ? `#${slugify(fragment)}` : ''}`;
      }
    });

    visit(tree, 'paragraph', (node, index, parent) => {
      if (index === undefined || !parent || node.children.length !== 1) return;
      const child = node.children[0];
      if (child.type !== 'link') return;
      const id = youtubeId(child.url);
      if (!id) return;
      (parent.children as RootContent[])[index] = {
        type: 'html',
        value: `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`,
      };
    });
  };
}
