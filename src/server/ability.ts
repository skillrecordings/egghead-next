import {defineAbility} from '@casl/ability'

export default (user: any) =>
  defineAbility((can) => {
    if (user.roles.includes('admin', 'editor', 'publisher')) {
      can('upload', 'Video')
    }
  })
