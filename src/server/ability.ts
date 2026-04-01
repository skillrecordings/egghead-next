import {AbilityBuilder, Ability, defineAbility} from '@casl/ability'
import {intersection, isString} from 'lodash'
import {loadCurrentViewerRoles} from '../lib/viewer'
import {logEvent} from '@/utils/structured-log'

export type Actions = 'manage' | 'view' | 'download' | 'upload' | 'create'
export type Subjects =
  | 'LessonMedia'
  | 'Lesson'
  | 'Course'
  | 'Video'
  | 'Content'
  | 'all'

export type Roles =
  | 'admin'
  | 'editor'
  | 'publisher'
  | 'instructor'
  | 'basic'
  | 'pro'
  | 'content_tester'
  | 'reviewer'

export type AppAbility = Ability<[Actions, Subjects]>

type LessonLike = {
  state?: string | null
  free_forever?: boolean | null
  is_pro_content?: boolean | null
  collection?: {
    free_forever?: boolean | null
  } | null
}

type LessonPermissionContext = {
  ability?: AppAbility
  roles?: Roles[]
  hasSellablePurchase?: boolean
  isBasic?: boolean
  isPro?: boolean
  isInstructor?: boolean
  isContentTester?: boolean
  canPublish?: boolean
  freeStreamingPromo?: boolean
}

const PUBLIC_MEDIA_STATES = ['published', 'retired', 'flagged', 'revised']

export async function getAbilityFromToken(token?: string) {
  if (!token) {
    return canDoNothingAbility
  }

  try {
    const viewerRoles = await loadCurrentViewerRoles(token)
    return defineAbilityFor(viewerRoles)
  } catch (error: any) {
    if (typeof window === 'undefined') {
      logEvent('warn', 'auth.viewer_roles.failed_soft', {
        degraded_to_anon: true,
        has_token: Boolean(token),
        status: error?.response?.status ?? null,
      })
    }

    return canDoNothingAbility
  }
}

/**
 * @see {@link https://casl.js.org/v5/en/guide/define-rules#ability-builder-class|AbilityBuilder}
 * @param viewerRoles an array of roles for the current viewer
 */
export function defineAbilityFor(viewerRoles: Roles[] = []) {
  const {can, build} = new AbilityBuilder<AppAbility>(Ability)

  if (includesRoles(viewerRoles, 'admin')) {
    can('manage', 'all')
  }

  if (includesRoles(viewerRoles, ['instructor'])) {
    can('upload', 'Video')
    can('create', 'Content')
    can('view', 'Lesson')
    can('view', 'Course')
  }

  if (includesRoles(viewerRoles, ['basic', 'pro'])) {
    can('view', 'Lesson')
    can('view', 'Course')
  }

  if (includesRoles(viewerRoles, ['content_tester', 'reviewer'])) {
    can('view', 'LessonMedia')
    can('download', 'Lesson')
    can('view', 'Lesson')
    can('view', 'Course')
  }

  if (includesRoles(viewerRoles, ['editor', 'publisher'])) {
    can('upload', 'Video')
    can('view', 'LessonMedia')
    can('download', 'Lesson')
    can('view', 'Lesson')
    can('view', 'Course')
  }

  if (includesRoles(viewerRoles, ['pro'])) {
    can('download', 'Lesson')
  }

  return build()
}

export function canViewLessonMedia(
  lesson: LessonLike,
  context: LessonPermissionContext = {},
) {
  const ability = context.ability
  const roles = context.roles ?? []
  const isContentTester =
    context.isContentTester ?? includesRoles(roles, 'content_tester')
  const isBasic = context.isBasic ?? includesRoles(roles, 'basic')
  const isPro = context.isPro ?? includesRoles(roles, 'pro')
  const isInstructor =
    context.isInstructor ?? includesRoles(roles, 'instructor')

  if (context.freeStreamingPromo) return true
  if (ability?.can('manage', 'all')) return true
  if (context.canPublish) return true
  if (isContentTester) return true
  if (context.hasSellablePurchase) return true
  if (ability?.can('view', 'LessonMedia')) return true

  const lessonState = lesson.state ?? null
  if (!lessonState || !PUBLIC_MEDIA_STATES.includes(lessonState)) return false

  if (!lesson.is_pro_content || lesson.free_forever) return true
  if (lesson.collection?.free_forever) return true
  if (isBasic || isPro || isInstructor) return true

  return false
}

export function canDownloadLesson(
  _lesson: LessonLike, // Reserved for future lesson-specific checks.
  context: LessonPermissionContext = {},
) {
  const ability = context.ability

  if (ability?.can('manage', 'all')) return true
  if (context.hasSellablePurchase) return true
  if (ability?.can('download', 'Lesson')) return true
  if (context.canPublish) return true

  return false
}

export function includesRoles(
  roles: Roles[] = [],
  rolesToCheck: Roles | Roles[] = [],
) {
  if (isString(rolesToCheck)) {
    rolesToCheck = [rolesToCheck]
  }

  return intersection(roles, rolesToCheck).length > 0
}

// this can be used as a default/initial ability object while waiting for
// viewer roles to be loaded. It's an `ability` with no permissions. Sort of
// like the Null Object pattern.
export const canDoNothingAbility = defineAbility(() => {})
