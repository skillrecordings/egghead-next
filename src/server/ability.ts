import {AbilityBuilder, Ability, defineAbility} from '@casl/ability'
import {intersection, isString} from 'lodash'
import {loadCurrentViewerRoles} from '../lib/viewer'

type Actions = 'manage' | 'upload'
type Subjects = 'Video' | 'all'
export type Roles = 'admin' | 'editor' | 'publisher'
type AppAbility = Ability<[Actions, Subjects]>

export async function getAbilityFromToken(token: string) {
  const viewerRoles = await loadCurrentViewerRoles(token)
  return defineAbilityFor(viewerRoles)
}

/**
 * @see {@link https://casl.js.org/v5/en/guide/define-rules#ability-builder-class|AbilityBuilder}
 * @param viewerRoles an array of roles for the current viewer
 */
function defineAbilityFor(viewerRoles: Roles[]) {
  const {can, build} = new AbilityBuilder<AppAbility>(Ability)

  if (includesRoles(viewerRoles, 'admin')) {
    can('manage', 'all') // read-write access to everything
  }

  if (includesRoles(viewerRoles, ['editor', 'publisher'])) {
    can('upload', 'Video')
  }

  return build()
}

export function includesRoles(
  roles: Roles[] = [],
  rolesToCheck: Roles | Roles[] = [],
) {
  if (isString(rolesToCheck)) {
    rolesToCheck = [rolesToCheck]
  }
  // check if at least one role overlaps
  return intersection(roles, rolesToCheck).length > 0
}

// this can be used as a default/initial ability object while waiting for
// viewer roles to be loaded. It's an `ability` with no permissions. Sort of
// like the Null Object pattern.
export const canDoNothingAbility = defineAbility(() => {})
