import {includesRoles, Roles} from '../ability'

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
