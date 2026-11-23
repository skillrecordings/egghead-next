import {pgQuery} from '@/db'
import Typesense from 'typesense'
import {getLastChargeForActiveSubscription} from '@/lib/subscriptions'
import {getInstructorFeed} from '@/lib/instructor-feed'

jest.mock('@/db', () => ({pgQuery: jest.fn()}))
jest.mock('@/adapters/stripe-adapter', () => ({
  stripeAdapter: {getSubscription: jest.fn()},
}))
jest.mock('typesense', () => ({__esModule: true, default: {Client: jest.fn()}}))
jest.mock('feed', () => ({Feed: jest.fn()}))
jest.mock('remove-markdown', () => ({__esModule: true, default: jest.fn()}))
jest.mock('@/utils/typesense-host', () => ({getTypesenseNodes: jest.fn()}))

beforeEach(() => {
  jest
    .mocked(pgQuery)
    .mockResolvedValue({rows: []} as unknown as Awaited<
      ReturnType<typeof pgQuery>
    >)
  process.env.NEXT_PUBLIC_AUTH_DOMAIN = 'https://auth.example.com'
})
afterEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

it('keeps quotes and SQL in an email and user ID out of the SQL text', async () => {
  const email = "recipient@example.com') OR 1=1 --"
  const id = '1 OR 1=1'
  jest
    .spyOn(global, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify({id})))
  await getLastChargeForActiveSubscription(email, 'test-auth')

  const [sql, params] = jest.mocked(pgQuery).mock.calls[0]
  expect(sql).toContain('users.email = lower($1) OR users.id = $2')
  expect(sql).not.toContain(email)
  expect(sql).not.toContain(id)
  expect(params).toEqual([email, id])
})

it('binds an ordinary email and authenticated user ID without changing the lookup', async () => {
  jest
    .spyOn(global, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify({id: 42})))
  await getLastChargeForActiveSubscription('Recipient@example.com', 'test-auth')
  expect(pgQuery).toHaveBeenCalledWith(expect.stringContaining('lower($1)'), [
    'Recipient@example.com',
    42,
  ])
})

it('uses a null ID when there is no authenticated user', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(new Response('{}'))
  await getLastChargeForActiveSubscription('recipient@example.com')
  expect(pgQuery).toHaveBeenCalledWith(expect.any(String), [
    'recipient@example.com',
    null,
  ])
})

it('uses a bound parameter for a valid instructor slug', async () => {
  const slug = 'valid-instructor'
  await expect(getInstructorFeed(slug)).resolves.toBeNull()
  const [sql, params] = jest.mocked(pgQuery).mock.calls[0]
  expect(sql).toContain('WHERE slug = $1')
  expect(sql).not.toContain(slug)
  expect(params).toEqual([slug])
})

it.each([
  "instructor' OR 1=1 --",
  'instructor || instructor.slug:*',
  'instructor`',
  'instructor\n',
  '',
])(
  'rejects unsafe instructor slug %p before SQL or Typesense',
  async (slug) => {
    await expect(getInstructorFeed(slug)).resolves.toBeNull()
    expect(pgQuery).not.toHaveBeenCalled()
    expect(Typesense.Client).not.toHaveBeenCalled()
  },
)
