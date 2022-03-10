import {AbilityBuilder, Ability} from '@casl/ability'

type Actions = 'manage' | 'upload'
type Subjects = 'Video' | 'all'
type AppAbility = Ability<[Actions, Subjects]>

export default function defineAbilityFor(user: any) {
  const {can, build} = new AbilityBuilder<AppAbility>(Ability)

  if (user.roles?.includes('admin')) {
    can('manage', 'all') // read-write access to everything
  }

  if (user.roles?.includes('admin', 'editor', 'publisher')) {
    can('upload', 'Video')
  }

  return build()
}
