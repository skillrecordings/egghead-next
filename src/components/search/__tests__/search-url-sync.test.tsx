/** @jest-environment jsdom */

import '../../../../config/jest/web-streams'
import React, {act} from 'react'
import {EventEmitter} from 'events'
import {cleanup, fireEvent, render, screen} from '@testing-library/react'
import {
  ClearRefinements,
  useInstantSearch,
  usePagination,
  useRefinementList,
  useSearchBox,
} from 'react-instantsearch'
import SearchUrlSync from '../search-url-sync'
import SearchBox from '../search-box'
import analytics from '@/utils/analytics'
import {createUrl} from '@/lib/search-url-builder'

jest.mock('next/router', () => ({useRouter: () => mockRouter}))
jest.mock('@/utils/typesense', () => ({TYPESENSE_COLLECTION_NAME: 'resources'}))
jest.mock('@/utils/breakpoints', () => ({
  __esModule: true,
  default: () => ({sm: false}),
}))
jest.mock('@/utils/analytics', () => ({
  __esModule: true,
  default: {events: {engagementSearchedWithQuery: jest.fn()}},
}))

type SearchState = ReturnType<typeof useInstantSearch>['indexUiState']
type PendingReplace = {href: string; resolve: (value: boolean) => void}

let pendingReplaces: PendingReplace[]
const mockRouter = {
  isReady: true,
  asPath: '/q',
  events: new EventEmitter(),
  replace: jest.fn(),
}

const facets = {
  _tags: {react: 10, typescript: 10},
  instructor_name: {'Kent C. Dodds': 10, 'John Lindquist': 10},
  access_state: {free: 10, pro: 10},
  type: {course: 10, lesson: 10},
}

const Controls = () => {
  const {indexUiState} = useInstantSearch()
  const {refine: refineInstructor} = useRefinementList({
    attribute: 'instructor_name',
  })
  const {refine: refineAccess} = useRefinementList({attribute: 'access_state'})
  useRefinementList({attribute: '_tags'})
  useRefinementList({attribute: 'type'})
  usePagination()
  const {refine: refineQuery} = useSearchBox()

  return (
    <>
      <output data-testid="live-state">{JSON.stringify(indexUiState)}</output>
      <button onClick={() => refineInstructor('Kent C. Dodds')}>Kent</button>
      <button onClick={() => refineAccess('free')}>Free</button>
      <button onClick={() => refineQuery('')}>Reset query</button>
      <ClearRefinements />
    </>
  )
}

function renderSearch(initialState: SearchState = {}) {
  const client = {
    search: jest.fn(
      async (requests: Array<{params?: {query?: string; page?: number}}>) => ({
        results: requests.map(({params}) => ({
          hits: [],
          nbHits: 100,
          nbPages: 5,
          page: params?.page ?? 0,
          hitsPerPage: 20,
          processingTimeMS: 0,
          query: params?.query ?? '',
          params: '',
          exhaustiveNbHits: true,
          facets,
        })),
      }),
    ),
  }
  const onSearchStateChange = jest.fn()
  const tree = (
    <SearchUrlSync
      searchClient={client}
      initialUiState={{resources: initialState}}
      onSearchStateChange={onSearchStateChange}
    >
      <SearchBox />
      <Controls />
    </SearchUrlSync>
  )
  return {...render(tree), tree, client, onSearchStateChange}
}

function liveState(): SearchState {
  return JSON.parse(screen.getByTestId('live-state').textContent || '{}')
}

const searchInput = () => screen.getByRole<HTMLInputElement>('searchbox')

async function advance(ms = 0) {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(ms)
  })
}

async function navigate(href: string) {
  await act(async () => {
    mockRouter.events.emit('routeChangeStart', href, {shallow: false})
    mockRouter.asPath = href
    mockRouter.events.emit('routeChangeComplete', href, {shallow: false})
  })
  await advance()
}

async function completeReplace(index = 0) {
  await act(async () => {
    const {href, resolve} = pendingReplaces[index]
    mockRouter.asPath = href
    mockRouter.events.emit('routeChangeComplete', href, {shallow: true})
    resolve(true)
  })
  await advance()
}

beforeEach(() => {
  jest.useFakeTimers()
  mockRouter.isReady = true
  mockRouter.asPath = '/q'
  mockRouter.events.removeAllListeners()
  pendingReplaces = []
  mockRouter.replace.mockReset().mockImplementation((href: string) => {
    const promise = new Promise<boolean>((resolve) => {
      pendingReplaces.push({href, resolve})
    })
    mockRouter.events.emit('routeChangeStart', href, {shallow: true})
    return promise
  })
  jest.mocked(analytics.events.engagementSearchedWithQuery).mockClear()
})

afterEach(() => {
  cleanup()
  jest.clearAllTimers()
  jest.useRealTimers()
})

test('hydrates combined query filters into live InstantSearch when the router becomes ready', async () => {
  mockRouter.isReady = false
  mockRouter.asPath =
    '/q?q=hooks&tags=react&instructors=kent-c-dodds&type=course&access_state=free&page=2'
  const {rerender, tree, onSearchStateChange, client} = renderSearch()
  await advance()
  expect(liveState().refinementList).toBeUndefined()

  mockRouter.isReady = true
  rerender(React.cloneElement(tree))
  await advance()

  expect(liveState()).toMatchObject({
    query: 'hooks',
    page: 2,
    refinementList: {
      _tags: ['react'],
      instructor_name: ['Kent C. Dodds'],
      type: ['course'],
      access_state: ['free'],
    },
  })
  expect(searchInput().value).toBe('hooks')
  expect(onSearchStateChange).toHaveBeenLastCalledWith(
    expect.objectContaining({query: 'hooks', page: 2}),
    mockRouter.asPath,
  )
  expect(client.search).toHaveBeenLastCalledWith(
    expect.arrayContaining([
      expect.objectContaining({
        params: expect.objectContaining({
          query: 'hooks',
          page: 1,
          facetFilters: expect.arrayContaining([
            ['_tags:react'],
            ['instructor_name:Kent C. Dodds'],
            ['type:course'],
            ['access_state:free'],
          ]),
        }),
      }),
    ]),
  )
  await advance(1000)
  expect(mockRouter.replace).not.toHaveBeenCalled()
})

test('replaces live state on canonical navigation and history-style route completions', async () => {
  mockRouter.asPath = '/q/react'
  renderSearch({refinementList: {_tags: ['react']}})
  await advance()
  expect(liveState().refinementList?._tags).toEqual(['react'])

  const combined =
    '/q?q=hooks&tags=typescript&instructors=john-lindquist&access_state=free'
  await navigate(combined)
  expect(liveState()).toMatchObject({
    query: 'hooks',
    refinementList: {
      _tags: ['typescript'],
      instructor_name: ['John Lindquist'],
      access_state: ['free'],
    },
  })
  await navigate('/q/resources-by-kent-c-dodds')
  expect(liveState().query ?? '').toBe('')
  expect(liveState().refinementList).toEqual({
    instructor_name: ['Kent C. Dodds'],
  })
  expect(searchInput().value).toBe('')

  await navigate(combined)
  expect(liveState().query).toBe('hooks')
  expect(liveState().refinementList?._tags).toEqual(['typescript'])
  await navigate('/q')
  expect(liveState().refinementList).toBeUndefined()
  expect(liveState().query ?? '').toBe('')
  await advance(1000)
  expect(mockRouter.replace).not.toHaveBeenCalled()
})

test('applies a destination page even when the existing URL builder omits an otherwise empty state page', async () => {
  renderSearch()
  await advance()
  await navigate('/q?page=3')
  expect(liveState().page).toBe(3)
  await navigate('/q')
  expect(liveState().page ?? 1).toBe(1)
})

test('commits fast clicks synchronously and never replays an older self-written URL', async () => {
  const {onSearchStateChange} = renderSearch()
  await advance()
  fireEvent.click(screen.getByText('Kent'))
  expect(onSearchStateChange).toHaveBeenLastCalledWith(
    expect.objectContaining({
      refinementList: {instructor_name: ['Kent C. Dodds']},
    }),
    '/q/resources-by-kent-c-dodds',
  )
  await advance(500)
  expect(mockRouter.replace).toHaveBeenCalledTimes(1)

  fireEvent.click(screen.getByText('Free'))
  expect(onSearchStateChange).toHaveBeenLastCalledWith(
    expect.objectContaining({
      refinementList: {
        instructor_name: ['Kent C. Dodds'],
        access_state: ['free'],
      },
    }),
    '/q?access_state=free&instructors=kent-c-dodds',
  )
  await completeReplace()
  expect(liveState().refinementList?.access_state).toEqual(['free'])

  await advance(500)
  expect(mockRouter.replace).toHaveBeenLastCalledWith(
    createUrl(liveState()),
    undefined,
    {shallow: true},
  )
  await completeReplace(1)
  expect(liveState().refinementList?.access_state).toEqual(['free'])
  await advance(1000)
  expect(mockRouter.replace).toHaveBeenCalledTimes(2)
})

test('cancels pending URL writes at navigation start and on unmount', async () => {
  const {unmount} = renderSearch()
  await advance()
  fireEvent.click(screen.getByText('Kent'))
  await advance(200)
  act(() => {
    mockRouter.events.emit('routeChangeStart', '/q/typescript', {
      shallow: false,
    })
  })
  await advance(1000)
  expect(mockRouter.replace).not.toHaveBeenCalled()

  await navigate('/q/typescript')
  expect(liveState().refinementList).toEqual({_tags: ['typescript']})
  fireEvent.click(screen.getByText('Free'))
  unmount()
  await advance(1000)
  expect(mockRouter.replace).not.toHaveBeenCalled()
  expect(mockRouter.events.listenerCount('routeChangeComplete')).toBe(0)
})

test('preserves normal typing and analytics debounce without resetting a newer draft', async () => {
  renderSearch()
  await advance()
  const input = searchInput()
  fireEvent.change(input, {target: {value: 'hoo'}})
  await advance(449)
  expect(liveState().query ?? '').toBe('')
  fireEvent.change(input, {target: {value: 'hooks'}})
  await advance(450)
  expect(liveState().query).toBe('hooks')
  expect(input.value).toBe('hooks')
  expect(analytics.events.engagementSearchedWithQuery).not.toHaveBeenCalled()
  await advance(1050)
  expect(analytics.events.engagementSearchedWithQuery).toHaveBeenCalledTimes(1)
  expect(analytics.events.engagementSearchedWithQuery).toHaveBeenCalledWith(
    'search page',
    'hooks',
  )
})

test('discards pending drafts and analytics when navigation retains the committed query', async () => {
  mockRouter.asPath = '/q?q=hooks'
  renderSearch({query: 'hooks'})
  await advance()
  fireEvent.change(screen.getByRole('searchbox'), {
    target: {value: 'stale draft'},
  })
  await advance(200)
  await navigate('/q?q=hooks&tags=react')
  expect(searchInput().value).toBe('hooks')
  await advance(2000)
  expect(liveState().query).toBe('hooks')
  expect(liveState().refinementList?._tags).toEqual(['react'])
  expect(mockRouter.replace).not.toHaveBeenCalled()
  expect(analytics.events.engagementSearchedWithQuery).not.toHaveBeenCalled()
})

test('cancels input and analytics timers on navigation start and unmount', async () => {
  const {unmount} = renderSearch()
  await advance()
  fireEvent.change(screen.getByRole('searchbox'), {target: {value: 'draft'}})
  act(() => {
    mockRouter.events.emit('routeChangeStart', '/q/react', {shallow: false})
  })
  await advance(2000)
  expect(liveState().query ?? '').toBe('')
  expect(analytics.events.engagementSearchedWithQuery).not.toHaveBeenCalled()

  await navigate('/q/react')
  fireEvent.change(screen.getByRole('searchbox'), {
    target: {value: 'unmounted'},
  })
  unmount()
  await advance(2000)
  expect(mockRouter.replace).not.toHaveBeenCalled()
  expect(analytics.events.engagementSearchedWithQuery).not.toHaveBeenCalled()
})

test('resets the draft with a query reset while ClearRefinements retains the query', async () => {
  mockRouter.asPath = '/q?q=hooks&tags=react'
  renderSearch()
  await advance()
  fireEvent.click(screen.getByRole('button', {name: 'Clear refinements'}))
  await advance()
  expect(liveState().refinementList).toBeUndefined()
  expect(liveState().query).toBe('hooks')
  expect(searchInput().value).toBe('hooks')

  fireEvent.change(screen.getByRole('searchbox'), {target: {value: 'stale'}})
  fireEvent.click(screen.getByText('Reset query'))
  await advance(2000)
  expect(liveState().query ?? '').toBe('')
  expect(searchInput().value).toBe('')
  expect(analytics.events.engagementSearchedWithQuery).not.toHaveBeenCalled()
})

test('keeps a newer draft when an older self-written URL completes', async () => {
  renderSearch()
  await advance()
  fireEvent.change(searchInput(), {target: {value: 'hooks'}})
  await advance(950)
  expect(pendingReplaces).toHaveLength(1)

  fireEvent.change(searchInput(), {target: {value: 'hooks effects'}})
  await completeReplace()
  expect(searchInput().value).toBe('hooks effects')
  await advance(450)
  expect(liveState().query).toBe('hooks effects')
  await advance(1050)
  expect(analytics.events.engagementSearchedWithQuery).toHaveBeenLastCalledWith(
    'search page',
    'hooks effects',
  )
})
