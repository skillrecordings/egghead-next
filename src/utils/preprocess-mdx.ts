/**
 * MDX v3 treats bare `---` blocks mid-document as thematic breaks and tries
 * to parse `export`/`import` lines as ESM, which breaks content like Astro
 * frontmatter examples. This wraps those blocks in code fences so they
 * render as code blocks instead of crashing the parser.
 */
export function preprocessMdxFrontmatter(body: string): string {
  return body.replace(
    /(?:^|\r?\n\r?\n)---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/g,
    (match: string, inner: string) =>
      /^\s*(export|import)\s/m.test(inner)
        ? match.replace(/---\r?\n([\s\S]*?)\r?\n---/, '```\n---\n$1\n---\n```')
        : match,
  )
}
