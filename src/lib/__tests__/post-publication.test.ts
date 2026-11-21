import {getPost} from '../posts/get-post'
import {getStaticPaths, getStaticProps} from '@/pages/[post]'

// The installed generator exposes these CJS entry points without declarations.
const {createUrlSet} = require('next-sitemap/dist/cjs/url/create-url-set')
const {
  buildSitemapXml,
} = require('next-sitemap/dist/cjs/sitemap/buildSitemapXml')
const {transformSitemap} = require('next-sitemap/dist/cjs/config')

// Keep the page's real data functions, but do not load browser/player code in Node.
jest.mock('@/components/mdx', () => ({}))
jest.mock('next-mdx-remote', () => ({}))
jest.mock('react-markdown', () => ({}))
jest.mock('@/markdown/serialize-mdx', () => ({
  __esModule: true,
  default: jest.fn(async () => ({
    compiledSource: '',
    scope: {},
    frontmatter: {},
  })),
}))
jest.mock('@/components/posts/post-player', () => ({}))
jest.mock('@/components/posts/instructor-profile', () => ({}))
jest.mock('@/components/posts/tag-list', () => ({}))
jest.mock('@/components/posts/podcast-links', () => ({}))
jest.mock('@/components/posts/powered-by-mux', () => ({}))
jest.mock('@/components/posts/icons/github-icon', () => ({}))
jest.mock('@/components/tweet-resource', () => ({}))
jest.mock('@/components/copy-resource', () => ({}))
jest.mock('@/components/like-button', () => ({}))
jest.mock('@/components/share-bluesky', () => ({}))
jest.mock('@/utils/analytics', () => ({}))
jest.mock('@/components/posts/course-lesson-cta', () => ({}))
jest.mock('@/components/posts/video-player-overlay', () => ({}))
jest.mock('@/hooks/mux/use-video-player-overlay', () => ({}))
jest.mock('@/hooks/use-mux-player', () => ({}))
jest.mock('@/components/copy-as-prompt-button', () => ({}))

const fixtures = [
  ['published', 'published', null],
  ['draft', 'draft', null],
  ['deleted', 'published', new Date('2026-01-01')],
  ['archived', 'archived', null],
  ['missing-state', undefined, null],
  ['private', 'published', null],
  ['unlisted', 'published', null],
].map(([slug, state, deletedAt]) => ({
  id: `post_${slug}`,
  type: 'post',
  fields: {
    slug,
    state,
    postType: 'article',
    title: 'Fixture',
    body: '',
    visibility: ['private', 'unlisted'].includes(slug as string)
      ? slug
      : 'public',
  },
  deletedAt,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  name: 'Fixture Author',
  image: null,
}))

const mockExecute = jest.fn(async (sql: string, params?: string[]) => {
  if (!sql.includes('FROM egghead_ContentResource cr_lesson')) return [[]]

  // This fixture adapter deliberately follows the actual predicates. Removing
  // either SQL guard exposes a fixture and fails the paths/sitemap assertions.
  let rows = fixtures.filter((row) => {
    if (
      sql.includes(
        "JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.state')) = 'published'",
      ) &&
      row.fields.state !== 'published'
    )
      return false
    if (sql.includes('cr_lesson.deletedAt IS NULL') && row.deletedAt)
      return false
    if (
      sql.includes(
        "JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.visibility')) = 'public'",
      ) &&
      row.fields.visibility !== 'public'
    )
      return false
    return (
      !params ||
      params.includes(row.fields.slug as string) ||
      params.includes(row.id)
    )
  })
  if (sql.includes("cr_video.type = 'videoResource'")) rows = []
  return [rows]
})
const mockRelease = jest.fn()
jest.mock('@/lib/db', () => ({
  getPool: () => ({
    getConnection: async () => ({execute: mockExecute, release: mockRelease}),
  }),
}))

describe('public post publication boundary', () => {
  const originalEnv = process.env
  const originalFetch = global.fetch
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      COURSE_BUILDER_DATABASE_URL: 'mysql://fixture',
      LOG_LEVEL: 'off',
    }
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({}),
    })) as any
    mockExecute.mockClear()
    mockRelease.mockClear()
  })
  afterEach(() => {
    process.env = originalEnv
    global.fetch = originalFetch
  })

  test.each(['draft', 'deleted', 'archived', 'missing-state', 'nonexistent'])(
    '%s returns Next.js 404, including blocking fallback and preview requests',
    async (slug) => {
      const result = await getStaticProps({
        params: {post: slug},
        preview: true,
      } as any)
      expect(result).toEqual({notFound: true})
      expect(global.fetch).not.toHaveBeenCalled()
      expect(mockRelease).toHaveBeenCalledTimes(1)
    },
  )

  test('published returns props (Next.js 200)', async () => {
    const result = await getStaticProps({params: {post: 'published'}} as any)
    expect(result).toMatchObject({
      props: {post: {id: 'post_published'}},
      revalidate: 60,
    })
  })

  test.each(['draft', 'deleted'])(
    'private %s cannot be fetched by id',
    async (slug) => {
      await expect(getPost(`post_${slug}`)).resolves.toBeNull()
    },
  )

  test('static paths and generated sitemap XML contain only published, undeleted posts', async () => {
    const result = await getStaticPaths({} as any)
    expect(result).toEqual({
      paths: [{params: {post: 'published'}}],
      fallback: 'blocking',
    })
    const routes = Object.fromEntries(
      result.paths.map((path: any) => [`/${path.params.post}`, {}]),
    )
    // next-sitemap consumes the Next.js prerender manifest, not a separate DB query.
    const config = require('../../../next-sitemap')
    const fields = await createUrlSet(
      {...config, siteUrl: 'https://example.test', transform: transformSitemap},
      {build: {pages: {'/[post]': []}}, preRender: {routes}},
    )
    const xml = buildSitemapXml(fields)
    expect(xml).toContain('<loc>https://example.test/published</loc>')
    for (const slug of [
      'draft',
      'deleted',
      'archived',
      'missing-state',
      'private',
      'unlisted',
    ]) {
      expect(xml).not.toContain(`/${slug}</loc>`)
    }
    expect(xml.match(/<url>/g)).toHaveLength(1)
  })
})
