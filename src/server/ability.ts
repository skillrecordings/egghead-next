import {AbilityBuilder, Ability} from '@casl/ability'
import {loadCurrentUser} from 'lib/users'
import {intersection, isString} from 'lodash'

type Actions = 'manage' | 'upload'
type Subjects = 'Video' | 'all'
type AppAbility = Ability<[Actions, Subjects]>

export async function getAbilityFromToken(token: string) {
  const user = await loadCurrentUser(token)
  return defineAbilityFor(user)
}

function defineAbilityFor(user: any) {
  // AbilityBuilder https://casl.js.org/v5/en/guide/define-rules#ability-builder-class
  const {can, build} = new AbilityBuilder<AppAbility>(Ability)

  if (hasRoles(user, 'admin')) {
    can('manage', 'all') // read-write access to everything
  }

  if (hasRoles(user, ['editor', 'publisher'])) {
    can('upload', 'Video')
  }

  return build()
}

function hasRoles(user: any, rolesToCheck: string | string[]) {
  // ensure rolesToCheck is an array
  let rolesToCheckArray: string[]
  if (isString(rolesToCheck)) {
    rolesToCheckArray = [rolesToCheck]
  } else {
    rolesToCheckArray = rolesToCheck
  }

  const userRoles = user?.roles || []

  // check if at least one role overlaps
  return intersection(userRoles, rolesToCheckArray).length > 0
}
