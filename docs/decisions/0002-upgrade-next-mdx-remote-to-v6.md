---
status: proposed
date: 2026-03-05
decision-makers: Cree
consulted: ''
informed: ''
---

# Upgrade next-mdx-remote from v4.4.1 to v6.0.0+ to fix CVE-2026-0969

## Context and Problem Statement

The project uses `next-mdx-remote` v4.4.1 for server-side MDX compilation and client-side rendering. This version is affected by [CVE-2026-0969](https://advisories.gitlab.com/pkg/npm/next-mdx-remote/CVE-2026-0969/) (CVSS 8.8 High), which allows arbitrary code execution via the `serialize` function when processing untrusted MDX content during React server-side rendering.

Vercel now [blocks new deployments](https://vercel.com/changelog/new-deployments-with-vulnerable-versions-of-next-mdx-remote-are-now-blocked-by-default) with vulnerable versions of `next-mdx-remote` by default. The fix was introduced in v6.0.0, which sets `blockJS: true` by default in both `serialize` and `compileMDX`.

All current MDX usage is in the Next.js `pages/` directory (not `app/`), using the `serialize` + `MDXRemote` pattern with `getStaticProps` and `getServerSideProps`.

## Decision Drivers

- **Security**: CVE-2026-0969 is a High-severity RCE vulnerability in the serialize function
- **Deployment**: Vercel blocks deployments with vulnerable versions
- **Compatibility**: Must continue working with Next.js `pages/` directory and `getStaticProps`/`getServerSideProps`
- **Syntax highlighting**: `@code-hike/mdx` v0.9.0 targets MDX v2; next-mdx-remote v5+ uses MDX v3 — likely incompatible
- **Minimize disruption**: MDX content is trusted (developer-authored via Sanity CMS), so the RCE risk is mitigated but the deployment blocker is not

## Considered Options

- **Option 1**: Upgrade directly to v6.0.0+ (replace `@code-hike/mdx` with shiki-based highlighting)
- **Option 2**: Staged upgrade — v5.0.0 first, then v6.0.0
- **Option 3**: Fork/pin v4.4.1 with manual `blockJS` backport

## Decision Outcome

Chosen option: **"Option 1: Upgrade directly to v6.0.0+"**, because the v5-to-v6 delta is minimal (just `blockJS` defaults), so staging the upgrade adds cost without meaningful risk reduction. The `@code-hike/mdx` incompatibility must be addressed regardless, so doing it in one pass is more efficient.

Since all MDX content is developer-authored (from Sanity CMS or course-builder), we will set `blockJS: false` with `blockDangerousJS: true` to allow JS expressions while blocking dangerous operations like `eval`, `Function`, `process`, and `require`.

### Consequences

- Good, because CVE-2026-0969 is fully remediated
- Good, because Vercel deployment blocking is resolved
- Good, because we move to MDX v3 (better performance, modern ecosystem)
- Bad, because `@code-hike/mdx` v0.9.0 must be replaced — it targets MDX v2
- Bad, because `useDynamicImport` option (used in 4 call sites) may be removed in v5+ and requires investigation
- Neutral, because the `serialize` + `MDXRemote` pages-directory pattern is still supported in v6

## Implementation Plan

- **Affected paths**:

  - `package.json` — update `next-mdx-remote`, potentially remove `@code-hike/mdx`
  - `src/components/markdown/serialize-mdx.ts` — update serialize options, remove `useDynamicImport`, add `blockJS`/`blockDangerousJS`, replace code-hike remark plugin
  - `src/markdown/serialize-mdx.ts` — same changes (duplicate file)
  - `src/components/markdown/mdx.tsx` — update types (`MDXRemoteSerializeResult`, `MDXRemoteProps`), remove `CH` component
  - `src/markdown/mdx.tsx` — same changes (duplicate file)
  - `src/pages/blog/[slug].tsx` — verify `serialize` call still works, update if needed
  - `src/pages/[post].tsx` — verify `serialize` + `MDXRemote` usage
  - `src/pages/cloudflare.tsx` — verify `serialize` + `MDXRemote` usage
  - `src/pages/case-studies/[slug].tsx` — verify `serialize` + `MDXRemote` usage
  - `src/pages/own-your-online-presence/[slug].tsx` — verify `serialize` + `MDXRemote` usage
  - `src/pages/developer-portfolio-foundations/[slug].tsx` — verify `serialize` + `MDXRemote` usage

- **Dependencies**:

  - Update: `next-mdx-remote` from `4.4.1` to `^6.0.0`
  - Evaluate removal: `@code-hike/mdx` `^0.9.0` (MDX v2 only, incompatible with MDX v3)
  - The existing `shikiRemotePlugin` in `src/components/markdown/shiki-remote-plugin.ts` and `src/markdown/shiki-remote-plugin.ts` may serve as the replacement for code-hike — investigate before adding new dependencies
  - Evaluate: `rehype-shiki` `^0.0.9` (used in blog/case-study pages) — may need update for MDX v3

- **Patterns to follow**:

  - Keep the `serialize` (server) + `MDXRemote` (client) pattern for all `pages/` routes
  - Use `blockJS: false, blockDangerousJS: true` in all `serialize` calls since content is trusted but we want defense-in-depth
  - Maintain the `serializeMDX` wrapper functions as the single entry point for serialization config

- **Patterns to avoid**:

  - Do NOT import from `next-mdx-remote/rsc` — that's for `app/` directory React Server Components
  - Do NOT set `blockDangerousJS: false` — all content is trusted enough for expressions but not for arbitrary globals
  - Do NOT use `useDynamicImport: true` — this option is removed or changed in v5+

- **Configuration**: No env var changes needed. The `blockJS`/`blockDangerousJS` settings go in the `serialize` options.

- **Migration steps**:
  1. Update `next-mdx-remote` to `^6.0.0` in `package.json`, run `pnpm install`
  2. Remove `useDynamicImport: true` from all `serialize` calls (4 sites in `serialize-mdx.ts` files)
  3. Add `blockJS: false, blockDangerousJS: true` to all `serialize` calls
  4. Test if `@code-hike/mdx` v0.9.0 still works with MDX v3 — if not:
     a. Remove `@code-hike/mdx` from dependencies
     b. Remove `remarkCodeHike` from remark plugins in `serialize-mdx.ts`
     c. Replace with shiki-based syntax highlighting (the `shikiRemotePlugin` already exists in the codebase)
     d. Remove the `CH` placeholder component from `mdx.tsx` files
  5. Verify `MDXRemoteSerializeResult` and `MDXRemoteProps` types still export from `next-mdx-remote`
  6. Run `pnpm build` to check for type errors
  7. Manually test MDX pages: blog posts, case studies, cloudflare page, post pages

### Verification

- [ ] `pnpm install` completes without peer dependency conflicts
- [ ] `pnpm build` succeeds with no TypeScript errors related to `next-mdx-remote`
- [ ] `pnpm test:ci` passes (no test regressions)
- [ ] Blog posts render with syntax highlighting (`/blog/[slug]`)
- [ ] Post pages render with syntax highlighting (`/[post]`)
- [ ] Case study pages render (`/case-studies/[slug]`)
- [ ] Cloudflare page renders (`/cloudflare`)
- [ ] No `useDynamicImport` references remain in codebase
- [ ] All `serialize` calls include `blockJS: false, blockDangerousJS: true`
- [ ] `next-mdx-remote` version in `pnpm-lock.yaml` is `>=6.0.0`
- [ ] No imports from `@code-hike/mdx` remain (if removed)

## Pros and Cons of the Options

### Option 1: Upgrade directly to v6.0.0+

Jump from v4.4.1 to v6.0.0 in a single upgrade, addressing both the MDX v2-to-v3 migration and the security defaults.

- Good, because it fixes CVE-2026-0969 in one PR
- Good, because the v5-to-v6 delta is tiny (just `blockJS` defaults + `unist-util-remove` v4)
- Good, because it avoids an intermediate state on v5 that would still need another upgrade
- Bad, because `@code-hike/mdx` v0.9.0 is MDX v2 only and must be replaced simultaneously
- Bad, because the change surface is larger — both MDX version + security defaults + plugin replacement

### Option 2: Staged upgrade (v5 first, then v6)

Upgrade to v5.0.0 first to handle MDX v3 migration, then upgrade to v6.0.0 for security defaults.

- Good, because each step has a smaller blast radius
- Good, because v5 lets you isolate MDX v3 issues from security config issues
- Bad, because v5 is still vulnerable to CVE-2026-0969 (versions 4.3.0 through 5.x are affected)
- Bad, because two rounds of testing, two PRs, and the `@code-hike/mdx` breakage still happens at v5

### Option 3: Fork/pin v4.4.1 with manual blockJS backport

Fork the package or manually patch the `serialize` function to add `blockJS` behavior.

- Good, because zero migration effort for consuming code
- Bad, because maintaining a fork is an ongoing burden
- Bad, because Vercel may still block based on declared version
- Bad, because it misses all other bug fixes and improvements in v5/v6
- Bad, because it keeps the project on MDX v2, which is end-of-life

## More Information

**Repository is archived:** The `hashicorp/next-mdx-remote` repository is archived and no longer maintained. v6.0.0 is likely the final release. This means no future bug fixes or security patches. Alternatives like `next-mdx-remote-client` (actively maintained, requires React 19.1+) or `mdx-bundler` should be evaluated in a future ADR if the project upgrades to React 19.

**API stability confirmed:** Research confirms `serialize` signature, `MDXRemoteSerializeResult` type, `MDXRemoteProps`, and the `MDXRemote` component API are all unchanged across v4/v5/v6. The only additions in v6 are `blockJS` and `blockDangerousJS` parameters to `serialize`. The `react-dom` peer dependency was dropped in v5 (only `react` is required).

**CVE Details:**

- CVE-2026-0969 (GHSA-g4xw-jxrg-5f6m), CVSS 3.1: 8.8 High
- Affects versions 4.3.0 through 5.x; fixed in 6.0.0
- [Socket.dev advisory](https://socket.dev/blog/high-severity-rce-vulnerability-disclosed-in-next-mdx-remote)
- [Vercel deployment blocking announcement](https://vercel.com/changelog/new-deployments-with-vulnerable-versions-of-next-mdx-remote-are-now-blocked-by-default)

**Duplicate files note:** The codebase has two copies of the MDX utilities:

- `src/components/markdown/serialize-mdx.ts` and `src/markdown/serialize-mdx.ts`
- `src/components/markdown/mdx.tsx` and `src/markdown/mdx.tsx`
  Both must be updated. Consider consolidating in a follow-up.

**Revisit conditions:**

- If `@code-hike/mdx` releases a v1.0 with MDX v3 support, evaluate re-adoption
- If migrating pages to `app/` directory, switch from `serialize`+`MDXRemote` to `next-mdx-remote/rsc`
