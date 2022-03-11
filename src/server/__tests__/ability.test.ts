import {hasRoles} from '../ability'

test('returns true for a single matching role', () => {
  const user = {roles: ['publisher']}

  expect(hasRoles(user, 'publisher')).toBe(true)
})

test('returns true if at least one role matches', () => {
  const user = {roles: ['publisher']}

  expect(hasRoles(user, ['editor', 'publisher'])).toBe(true)
})

test('returns false if no role matches', () => {
  const user = {roles: ['publisher', 'editor']}

  expect(hasRoles(user, 'admin')).toBe(false)
})
