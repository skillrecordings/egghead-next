/**
 * MDX v3 treats bare `---` blocks mid-document as thematic breaks and tries
 * to parse `export`/`import` lines as ESM, which breaks content like Astro
 * frontmatter examples. This wraps those blocks in code fences so they
 * render as code blocks instead of crashing the parser.
 */
export function preprocessMdxFrontmatter(body: string): string {
  return body.replace(
    /(?:^|\r?\n\r?\n)---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/g,
    (match: string, inner: string, offset: number) => {
      if (!/^\s*(export|import)\s/m.test(inner)) return match

      // Skip if this --- block is inside an existing fenced code block
      const before = body.slice(0, offset)
      const fences = before.match(/^(`{3,}|~{3,})/gm) || []
      if (fences.length % 2 !== 0) return match

      // Use a fence longer than any backtick run in the inner content
      const maxRun = (inner.match(/`+/g) || []).reduce(
        (max, r) => Math.max(max, r.length),
        0,
      )
      const fence = '`'.repeat(Math.max(3, maxRun + 1))

      return match.replace(
        /---\r?\n([\s\S]*?)\r?\n---/,
        `${fence}\n---\n$1\n---\n${fence}`,
      )
    },
  )
}
