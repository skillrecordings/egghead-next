import {
  canDownloadLesson,
  canViewLessonMedia,
  defineAbilityFor,
  includesRoles,
  Roles,
} from '../ability'

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
