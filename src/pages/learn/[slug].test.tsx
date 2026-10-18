import {getServerSideProps} from './[slug]'
import {loadTag} from '@/lib/tags'
import {logEvent} from '@/utils/structured-log'

jest.mock('@/lib/tags', () => ({loadTag: jest.fn()}))
jest.mock('@/utils/structured-log', () => ({logEvent: jest.fn()}))
jest.mock('@/lib/logging', () => ({
  withSSRLogging: (handler: unknown) => handler,
}))
jest.mock('react-markdown', () => () => null)
jest.mock('@/server/nxtp-query', () => ({
  canonicalizeInternalQueryParams: jest.fn(() => null),
}))

const mockedLoadTag = jest.mocked(loadTag)
const context = {
  params: {slug: 'missing-tag'},
  query: {},
  req: {},
  res: {setHeader: jest.fn()},
} as any

beforeEach(() => jest.clearAllMocks())

test('missing tags return 404 instead of rendering a null tag', async () => {
  mockedLoadTag.mockResolvedValue(null)
  await expect(getServerSideProps(context)).resolves.toEqual({notFound: true})
  expect(logEvent).toHaveBeenCalledWith('info', 'learn.tag.not_found', {})
})

test('existing tags keep their props', async () => {
  const tag = {
    name: 'test',
    slug: 'test',
    label: null,
    description: null,
    image_480_url: null,
    path: null,
  }
  mockedLoadTag.mockResolvedValue(tag)
  await expect(getServerSideProps(context)).resolves.toEqual({props: {tag}})
  expect(logEvent).not.toHaveBeenCalled()
})
