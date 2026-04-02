import {
  canDownloadLesson,
  canViewLessonMedia,
  defineAbilityFor,
  getAbilityFromToken,
  includesRoles,
  Roles,
} from '../ability'
import {loadCurrentViewerRoles} from '../../lib/viewer'

jest.mock('../../lib/viewer', () => ({
  loadCurrentViewerRoles: jest.fn(),
}))

const mockLoadCurrentViewerRoles = loadCurrentViewerRoles as jest.Mock

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  mockLoadCurrentViewerRoles.mockReset()
})

afterEach(() => {
  jest.restoreAllMocks()
})

test('returns true for a single matching role', () => {
  const roles = ['publisher'] as Roles[]

  expect(includesRoles(roles, 'publisher')).toBe(true)
})

test('returns true if at least one role matches', () => {
  const roles = ['publisher'] as Roles[]

  expect(includesRoles(roles, ['editor', 'publisher'])).toBe(true)
})

test('returns false if no role matches', () => {
  const roles = ['publisher', 'editor'] as Roles[]

  expect(includesRoles(roles, 'admin')).toBe(false)
})

test('getAbilityFromToken returns a no-op ability without a token', async () => {
  const ability = await getAbilityFromToken()

  expect(mockLoadCurrentViewerRoles).not.toHaveBeenCalled()
  expect(ability.can('view', 'Course')).toBe(false)
})

test('getAbilityFromToken fails soft when viewer roles lookup returns 403', async () => {
  mockLoadCurrentViewerRoles.mockRejectedValue({response: {status: 403}})

  const ability = await getAbilityFromToken('stale-token')

  expect(ability.can('view', 'Course')).toBe(false)
  expect(ability.can('download', 'Lesson')).toBe(false)
})

test('getAbilityFromToken preserves permissions when roles load succeeds', async () => {
  mockLoadCurrentViewerRoles.mockResolvedValue(['pro'])

  const ability = await getAbilityFromToken('fresh-token')

  expect(ability.can('view', 'Course')).toBe(true)
  expect(ability.can('download', 'Lesson')).toBe(true)
})

test('editor ability can view lesson media and download lessons', () => {
  const ability = defineAbilityFor(['editor'])

  expect(ability.can('view', 'LessonMedia')).toBe(true)
  expect(ability.can('download', 'Lesson')).toBe(true)
  expect(ability.can('upload', 'Video')).toBe(true)
})

test('instructor ability keeps upload/create surface without blanket media access', () => {
  const ability = defineAbilityFor(['instructor'])

  expect(ability.can('upload', 'Video')).toBe(true)
  expect(ability.can('create', 'Content')).toBe(true)
  expect(ability.can('view', 'LessonMedia')).toBe(false)
})

test('canViewLessonMedia allows public free lessons without auth', () => {
  expect(
    canViewLessonMedia({
      state: 'published',
      free_forever: true,
      is_pro_content: false,
    }),
  ).toBe(true)
})

test('canViewLessonMedia denies unpublished pro lessons to non-privileged viewers', () => {
  expect(
    canViewLessonMedia(
      {
        state: 'approved',
        free_forever: false,
        is_pro_content: true,
      },
      {
        roles: ['pro'],
      },
    ),
  ).toBe(false)
})

test('canViewLessonMedia allows published pro lessons for pro/basic/instructor viewers', () => {
  const lesson = {
    state: 'published',
    free_forever: false,
    is_pro_content: true,
  }

  expect(canViewLessonMedia(lesson, {roles: ['pro']})).toBe(true)
  expect(canViewLessonMedia(lesson, {roles: ['basic']})).toBe(true)
  expect(canViewLessonMedia(lesson, {roles: ['instructor']})).toBe(true)
})

test('canViewLessonMedia allows privileged reviewers outside the public-state path', () => {
  const ability = defineAbilityFor(['reviewer'])

  expect(
    canViewLessonMedia(
      {
        state: 'approved',
        free_forever: false,
        is_pro_content: true,
      },
      {ability, roles: ['reviewer']},
    ),
  ).toBe(true)
})

test('canViewLessonMedia allows sellable purchases and publish overrides', () => {
  const lesson = {
    state: 'approved',
    free_forever: false,
    is_pro_content: true,
  }

  expect(canViewLessonMedia(lesson, {hasSellablePurchase: true})).toBe(true)
  expect(canViewLessonMedia(lesson, {canPublish: true})).toBe(true)
})

test('canDownloadLesson requires purchase or explicit download privilege', () => {
  const publicProLesson = {
    state: 'published',
    free_forever: false,
    is_pro_content: true,
  }

  expect(canDownloadLesson(publicProLesson, {roles: ['basic']})).toBe(false)
  expect(
    canDownloadLesson(publicProLesson, {ability: defineAbilityFor(['pro'])}),
  ).toBe(true)
  expect(canDownloadLesson(publicProLesson, {hasSellablePurchase: true})).toBe(
    true,
  )
})

test('canViewLessonMedia derives viewer privileges from ability-only context', () => {
  const publishedProLesson = {
    state: 'published',
    free_forever: false,
    is_pro_content: true,
  }

  expect(
    canViewLessonMedia(publishedProLesson, {
      ability: defineAbilityFor(['pro']),
    }),
  ).toBe(true)
  expect(
    canViewLessonMedia(
      {
        state: 'approved',
        free_forever: false,
        is_pro_content: true,
      },
      {
        ability: defineAbilityFor(['reviewer']),
      },
    ),
  ).toBe(true)
})

test('canDownloadLesson derives download privilege from roles-only context', () => {
  const publicProLesson = {
    state: 'published',
    free_forever: false,
    is_pro_content: true,
  }

  expect(canDownloadLesson(publicProLesson, {roles: ['reviewer']})).toBe(true)
  expect(canDownloadLesson(publicProLesson, {roles: ['pro']})).toBe(true)
})
