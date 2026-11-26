/**
 * @jest-environment jsdom
 *
 * Renders the real TalkPlayer with the real view-tracking path
 * (use-egghead-player + useLessonViewUrl + useLessonViewTracking). Only the
 * network (axios, the tRPC mutation) and UI shells are mocked.
 */
import * as React from 'react'
import {act, render, waitFor} from '@testing-library/react'
import axios from 'axios'
import TalkPlayer from '../talk-player'

// config/jest/cssTransform.js predates Jest 28's transformer contract
jest.mock('../talk-player.css', () => ({}))
jest.mock('axios', () => ({
  __esModule: true,
  default: {post: jest.fn(), put: jest.fn(), create: jest.fn(() => ({}))},
}))

// --- player + UI shells ----------------------------------------------------
type Listener = (e: any) => void
const mockVideo = {
  listeners: new Set<Listener>(),
  addEventListener(type: string, fn: Listener) {
    if (type === 'timeupdate') this.listeners.add(fn)
  },
  removeEventListener(type: string, fn: Listener) {
    if (type === 'timeupdate') this.listeners.delete(fn)
  },
}
const tick = (currentTime: number, paused = false) =>
  act(() => {
    mockVideo.listeners.forEach((fn) => fn({srcElement: {currentTime, paused}}))
  })

jest.mock('@skillrecordings/player', () => {
  const sel = (name: string) => Object.assign(() => name, {selName: name})
  return {
    Player: () => null,
    HLSSource: () => null,
    usePlayerPrefs: () => ({
      setPlayerPrefs: jest.fn(),
      getPlayerPrefs: () => ({
        autoplay: false,
        defaultView: '',
        subtitle: null,
      }),
    }),
    useVideo: () => ({send: jest.fn()}),
    selectWithSidePanel: sel('withSidePanel'),
    selectIsPaused: sel('isPaused'),
    selectVideo: sel('video'),
    selectIsWaiting: sel('isWaiting'),
    selectHasEnded: sel('hasEnded'),
    selectIsFullscreen: sel('isFullscreen'),
    selectViewer: sel('viewer'),
  }
})
jest.mock('@xstate/react', () => ({
  useSelector: (_service: unknown, selector: {selName?: string}) => {
    if (selector.selName === 'video') return mockVideo
    if (selector.selName === 'isWaiting') return true // keep the sync effect quiet
    return false
  },
}))
jest.mock('next/router', () => ({
  useRouter: () => ({query: {}, asPath: '/talks/x', push: jest.fn()}),
}))
jest.mock('@/hooks/use-cio', () => ({
  __esModule: true,
  default: () => ({subscriber: null, cioIdentify: jest.fn()}),
}))
jest.mock('@/components/pages/lessons/overlays', () => () => null)
jest.mock('@/components/player/download-control', () => () => null)
jest.mock('@/hooks/use-last-resource', () => ({
  __esModule: true,
  default: () => ({clearResource: jest.fn(), updateResource: jest.fn()}),
}))
jest.mock('@/hooks/use-next-up-data', () => ({
  useNextForCollection: () => undefined,
}))
jest.mock('@/utils/analytics', () => ({
  __esModule: true,
  default: {events: {}},
  track: jest.fn(),
}))

// --- the per-viewer URL mutation -------------------------------------------
const mockMutateAsync = jest.fn()
jest.mock('@/app/_trpc/client', () => ({
  trpc: {
    progress: {forLesson: {useQuery: () => ({data: undefined})}},
    lesson: {
      getLessonViewUrl: {
        useMutation: () => ({mutateAsync: mockMutateAsync}),
      },
    },
  },
}))
let mockToken: string | false = 'tok-99'
jest.mock('@/utils/get-access-token-from-cookie', () => ({
  __esModule: true,
  default: () => mockToken,
}))

const mockedAxios = axios as unknown as {post: jest.Mock; put: jest.Mock}

let slugCounter = 0
const makeTalk = () => {
  const slug = `some-talk-${++slugCounter}`
  return {
    id: 7,
    slug,
    title: 'Some Talk',
    path: `/talks/${slug}`,
    hls_url: 'https://media.example/talk.m3u8',
    lesson_view_url: null,
    tags: [],
  }
}
const urlFor = (slug: string) =>
  `https://rails.example/api/v1/lessons/${slug}/views`

const renderTalk = (talk: any, value = 'playing') => {
  const send = jest.fn()
  const props = (lesson: any, v: string) => ({
    initialLesson: talk,
    state: [{value: v, context: {lesson}}, send],
    watchCount: 0,
    setWatchCount: jest.fn(),
  })
  const utils = render(<TalkPlayer {...(props(talk, value) as any)} />)
  return {
    ...utils,
    rerenderWith: (lesson: any, v = value) =>
      utils.rerender(<TalkPlayer {...(props(lesson, v) as any)} />),
  }
}

const viewCreates = (slug: string) =>
  mockedAxios.post.mock.calls.filter(([url]) => url === urlFor(slug))

beforeEach(() => {
  mockToken = 'tok-99'
  mockVideo.listeners.clear()
  mockMutateAsync.mockReset()
  mockMutateAsync.mockImplementation(async ({slug}: {slug: string}) => ({
    slug,
    lesson_view_url: urlFor(slug),
  }))
  mockedAxios.post.mockReset()
  mockedAxios.put.mockReset()
  mockedAxios.post.mockImplementation(async (url: string) => ({
    data: {
      increment_url: `${url}/1/increment`,
      complete_url: `${url}/1/complete`,
      series: null,
    },
  }))
  mockedAxios.put.mockResolvedValue({data: {series: null}})
  jest.spyOn(console, 'debug').mockImplementation(() => undefined)
  jest.spyOn(console, 'log').mockImplementation(() => undefined)
})

afterEach(() => jest.restoreAllMocks())

test('a signed-in play posts one view across many timeupdate ticks', async () => {
  const talk = makeTalk()
  renderTalk(talk)

  await tick(0.5) // first real playback: fetch the URL
  await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledTimes(1))
  await act(async () => undefined)

  for (const t of [10, 20, 29.4, 29.8, 30, 30.1, 30.3]) await tick(t)
  await waitFor(() => expect(viewCreates(talk.slug)).toHaveLength(1))
  expect(mockMutateAsync).toHaveBeenCalledTimes(1)
})

test('paused or seek events post nothing and fetch nothing', async () => {
  const talk = makeTalk()
  renderTalk(talk)

  await tick(0, true)
  await tick(30, true) // seek to a segment boundary while paused
  await tick(60, true)
  await act(async () => undefined)

  expect(mockMutateAsync).not.toHaveBeenCalled()
  expect(mockedAxios.post).not.toHaveBeenCalled()
})

test('an anonymous play never asks Rails for a URL or posts', async () => {
  mockToken = false
  const talk = makeTalk()
  renderTalk(talk)
  await tick(1)
  await tick(30)
  await act(async () => undefined)
  expect(mockMutateAsync).not.toHaveBeenCalled()
  expect(mockedAxios.post).not.toHaveBeenCalled()
})

test('a getLessonbySlug refetch does not refetch the URL', async () => {
  const talk = makeTalk()
  const {rerenderWith} = renderTalk(talk)
  await tick(1)
  await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledTimes(1))

  // the page merges a refetched lesson object into the machine context
  rerenderWith({...talk, title: 'Some Talk (refetched)'})
  rerenderWith({...talk, title: 'Some Talk (refetched again)'})
  await tick(2)
  await tick(30)
  await waitFor(() => expect(viewCreates(talk.slug)).toHaveLength(1))
  expect(mockMutateAsync).toHaveBeenCalledTimes(1)
})

test('completion goes through the tracked lesson and PUTs complete_url from the view response', async () => {
  const talk = makeTalk()
  const {rerenderWith} = renderTalk(talk)
  await tick(1)
  await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledTimes(1))
  await act(async () => undefined)

  rerenderWith(talk, 'completed')

  await waitFor(() =>
    expect(mockedAxios.put).toHaveBeenCalledWith(
      `${urlFor(talk.slug)}/1/complete`,
      {},
      expect.anything(),
    ),
  )
  // onEnded received the tracked lesson: the create went to the viewer's URL
  expect(viewCreates(talk.slug)).toHaveLength(1)
})
