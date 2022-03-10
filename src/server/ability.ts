import {AbilityBuilder, Ability} from '@casl/ability'
import {loadCurrentUser} from 'lib/users'

type Actions = 'manage' | 'upload'
type Subjects = 'Video' | 'all'
type AppAbility = Ability<[Actions, Subjects]>

export async function getAbilityFromToken(token: string) {
  const user = await loadCurrentUser(token)
  return defineAbilityFor(user)
}

function defineAbilityFor(user: any) {
  const {can, build} = new AbilityBuilder<AppAbility>(Ability)

  if (user.roles?.includes('admin')) {
    can('manage', 'all') // read-write access to everything
  }

  if (user.roles?.includes('editor', 'publisher')) {
    can('upload', 'Video')
  }

  return build()
}
