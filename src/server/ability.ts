import {AbilityBuilder, Ability} from '@casl/ability'

export default function defineAbilityFor(user: any) {
  const {can, build} = new AbilityBuilder(Ability)

  if (user.roles?.includes('admin')) {
    can('manage', 'all') // read-write access to everything
  }

  if (user.roles?.includes('admin', 'editor', 'publisher')) {
    can('upload', 'Video')
  }

  return build()
}
