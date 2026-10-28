import {loadPlaylistProgress} from '@/lib/progress'

const mockRequest = jest.fn()

jest.mock('@/utils/configured-graphql-client', () => ({
  getGraphQLClient: () => ({request: mockRequest}),
}))

jest.mock('@/utils/get-access-token-from-cookie', () => () => undefined)

const progress = {
  lesson_count: 10,
  completed_lesson_count: 0,
  completed_lessons: [],
}

describe('loadPlaylistProgress', () => {
  beforeEach(() => mockRequest.mockReset())

  test('treats a null is_complete from Rails as incomplete', async () => {
    mockRequest.mockResolvedValue({
      playlist_progress: {...progress, is_complete: null},
    })

    await expect(
      loadPlaylistProgress({token: 't', slug: 'some-course'}),
    ).resolves.toEqual({...progress, is_complete: false})
  })

  test('keeps a real is_complete value', async () => {
    mockRequest.mockResolvedValue({
      playlist_progress: {...progress, is_complete: true},
    })

    await expect(
      loadPlaylistProgress({token: 't', slug: 'some-course'}),
    ).resolves.toEqual({...progress, is_complete: true})
  })

  test('returns null when there is no progress', async () => {
    mockRequest.mockResolvedValue({playlist_progress: null})

    await expect(
      loadPlaylistProgress({token: 't', slug: 'some-course'}),
    ).resolves.toBeNull()
  })
})
