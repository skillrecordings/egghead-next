import * as metadata from '../get-course-builder-metadata'
import {getAIDevEssentialsPosts} from '../ai-dev-essentials'
import {
  getLatestCourses,
  getCourseWithActivity,
} from '../courses/get-latest-courses'
import {getCourseForPost} from '../posts/get-course'
import {getGuideFromCourseBuilder} from '../guides-from-course-builder'
import {courseRouter} from '@/server/routers/course'

jest.mock('@/lib/ratings', () => ({}))
jest.mock('@/lib/courses', () => ({}))
jest.mock('@/server/trpc', () => {
  const t = require('@trpc/server').initTRPC.create()
  return {router: t.router, baseProcedure: t.procedure}
})

const mockExecute = jest.fn(
  async (_sql: string, _params?: unknown[]) => [[]] as any,
)
const mockQuery = jest.fn(
  async (_sql: string, _params?: unknown[]) => [[]] as any,
)
const mockConnection = {
  execute: mockExecute,
  query: mockQuery,
  release: jest.fn(),
}
jest.mock('mysql2/promise', () => ({
  createPool: () => ({getConnection: async () => mockConnection}),
}))
jest.mock('@/lib/db', () => ({
  getPool: () => ({getConnection: async () => mockConnection}),
}))

function expectPublishedUndeleted(sql: string, alias: string) {
  expect(sql).toContain(
    `JSON_UNQUOTE(JSON_EXTRACT(${alias}.fields, '$.state')) = 'published'`,
  )
  expect(sql).toContain(`${alias}.deletedAt IS NULL`)
}

describe('other public Course Builder post readers', () => {
  const originalEnv = process.env
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      COURSE_BUILDER_DATABASE_URL: 'mysql://fixture',
    }
    mockExecute.mockReset().mockResolvedValue([[]])
    mockQuery.mockReset().mockResolvedValue([[]])
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  test.each(['fixture', 'fixture~abc12'])(
    'all metadata lookup branches gate posts: %s',
    async (slug) => {
      for (const [reader, aliases] of [
        [metadata.getCourseBuilderLesson, ['cr_lesson']],
        [metadata.getCourseBuilderVideoResource, ['cr_lesson']],
        [metadata.loadCourseBuilderCourseMetadata, ['cr_course']],
        [metadata.getCourseBuilderLessonStates, ['cr_course', 'cr_lesson']],
        [
          metadata.getCourseBuilderLessonCourse,
          ['cr_target', 'cr_course_inner', 'cr_course', 'cr_lesson'],
        ],
        [metadata.getCourseBuilderCaseStudy, ['cr']],
      ] as const) {
        mockExecute.mockClear()
        await reader(slug)
        expect(mockExecute).toHaveBeenCalledTimes(1)
        const sql = mockExecute.mock.calls[0][0]
        for (const alias of aliases) expectPublishedUndeleted(sql, alias)
      }
    },
  )

  test('case-study index, AI posts, course lists and activity exclude hidden posts', async () => {
    for (const [reader, aliases] of [
      [() => metadata.getCourseBuilderCaseStudies(), ['cr']],
      [() => metadata.getAllCourseBuilderPublicCourseSlugs(), ['cr_course']],
      [() => getAIDevEssentialsPosts(), ['cr_lesson']],
      [() => getLatestCourses(), ['cr_course', 'cr_lesson']],
      [() => getCourseWithActivity('fixture'), ['cr_course', 'cr_lesson']],
      [
        () => getCourseForPost('fixture', mockConnection as any),
        ['cr_course', 'cr_lesson'],
      ],
    ] as const) {
      mockExecute.mockClear()
      await reader()
      const sql = mockExecute.mock.calls[0][0]
      for (const alias of aliases) expectPublishedUndeleted(sql, alias)
    }
  })

  test('course and case-study sitemap enumerators require public visibility', async () => {
    await metadata.getAllCourseBuilderPublicCourseSlugs()
    expect(mockExecute.mock.calls[0][0]).toContain(
      "JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.visibility')) = 'public'",
    )
    await metadata.getCourseBuilderCaseStudies()
    expect(mockExecute.mock.calls[1][0]).toContain(
      "JSON_UNQUOTE(JSON_EXTRACT(cr.fields, '$.visibility')) = 'public'",
    )
  })

  test('public API resource-ID lookup gates post courses', async () => {
    const caller = courseRouter.createCaller({} as any)
    await expect(
      caller.getCourseByResourceId({resourceId: 'fixture'}),
    ).resolves.toBeNull()
    const sql = mockExecute.mock.calls[0][0]
    expect(sql).toContain(
      "JSON_UNQUOTE(JSON_EXTRACT(fields, '$.state')) = 'published'",
    )
    expect(sql).toContain('deletedAt IS NULL')
  })

  test.each(['course', 'post'])(
    'course lesson lists gate post children of %s',
    async (type) => {
      mockExecute.mockResolvedValueOnce([
        [
          {
            id: 'course_fixture',
            type,
            fields: {slug: 'fixture', state: 'published'},
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      ])
      await metadata.getCourseBuilderCourseLessons('fixture')
      expectPublishedUndeleted(mockExecute.mock.calls[0][0], 'cr_course')
      expectPublishedUndeleted(mockExecute.mock.calls[1][0], 'cr_lesson')
    },
  )

  test('guide section resource query gates post children without excluding legacy resource types', async () => {
    mockExecute
      .mockResolvedValueOnce([
        [{id: 'guide_fixture', fields: {slug: 'fixture'}}],
      ])
      .mockResolvedValueOnce([
        [{id: 'section_fixture', fields: {title: 'Section'}}],
      ])
    await getGuideFromCourseBuilder('fixture')
    const sql = mockQuery.mock.calls[0][0]
    expectPublishedUndeleted(sql, 'cr_resource')
    expect(sql).toContain("cr_resource.type <> 'post' OR")
  })
})
