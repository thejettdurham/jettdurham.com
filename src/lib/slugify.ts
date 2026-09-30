/**
 * Turn an Obsidian note name into the URL segment used for posts and links.
 * NFKD separates many accented letters from their accents (é → e + ◌́),
 * allowing the next step to remove those accents without losing the letter.
 *
 */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');
}
