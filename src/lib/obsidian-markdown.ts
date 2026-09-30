import type { Link, PhrasingContent, Root, RootContent } from 'mdast';
import { visit } from 'unist-util-visit';
import { slugify } from './slugify.ts';

function siteFields(value: string, allowed: string[], line?: number): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const rawLine of value.split(/\r?\n/)) {
    if (!rawLine.trim()) continue;
    const separator = rawLine.indexOf('=');
    const key = rawLine.slice(0, separator).trim();
    if (separator < 1 || !allowed.includes(key) || Object.hasOwn(fields, key)) {
      throw new Error(`Invalid site directive field at line ${line ?? '?'}: ${rawLine}`);
    }
    fields[key] = rawLine.slice(separator + 1).trim();
  }
  return fields;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

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
      const next = parent.children[index + 1];
      const directive = next?.type === 'code' && next.lang === 'site' ? next : undefined;

      if (child.type === 'image' && directive) {
        const fields = siteFields(
          directive.value,
          ['alt', 'caption'],
          directive.position?.start.line,
        );
        if (!Object.hasOwn(fields, 'alt')) {
          throw new Error(
            `Image site directive at line ${directive.position?.start.line ?? '?'} needs alt`,
          );
        }
        child.alt = fields.alt;
        if (fields.caption) {
          (parent.children as RootContent[])[index] = {
            type: 'paragraph',
            data: { hName: 'figure' },
            children: [
              child,
              {
                type: 'text',
                data: { hName: 'figcaption' },
                value: fields.caption,
              },
            ],
          };
        }
        parent.children.splice(index + 1, 1);
        return index + 1;
      }

      if (child.type !== 'link') return;
      const id = youtubeId(child.url);
      if (!id) return;
      const fields = directive
        ? siteFields(directive.value, ['title', 'caption'], directive.position?.start.line)
        : {};
      const title = escapeHtml(fields.title || 'YouTube video');
      const embed = `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${title}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
      (parent.children as RootContent[])[index] = {
        type: 'html',
        value: fields.caption
          ? `<figure>${embed}<figcaption>${escapeHtml(fields.caption)}</figcaption></figure>`
          : embed,
      };
      if (directive) parent.children.splice(index + 1, 1);
      return index + 1;
    });

    visit(tree, 'code', (node) => {
      if (node.lang === 'site') {
        throw new Error(
          `Site directive at line ${node.position?.start.line ?? '?'} must follow a standalone image or YouTube URL`,
        );
      }
    });
  };
}
