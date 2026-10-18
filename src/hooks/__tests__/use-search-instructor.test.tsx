/** @jest-environment jsdom */

import {act} from 'react'
import {renderHook} from '@testing-library/react'
import {request} from 'graphql-request'
import useSearchInstructor from '../use-search-instructor'

jest.mock('graphql-request', () => ({request: jest.fn()}))

const mockRequest = request as jest.MockedFunction<typeof request>

const john = {slug: 'john-lindquist', full_name: 'John Lindquist'}
const kent = {slug: 'kent-c-dodds', full_name: 'Kent C. Dodds'}

type Instructor = {
  slug: string
  full_name: string
  bio_short?: string
}

function deferredInstructor() {
  let resolve!: (value: {instructor: Instructor}) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<{instructor: Instructor}>((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

function renderInstructor(
  instructorNames: string[],
  initialInstructor: Instructor | null = null,
) {
  return renderHook(
    (props: {
      instructorNames: string[]
      initialInstructor: Instructor | null
    }) => useSearchInstructor(props),
    {initialProps: {instructorNames, initialInstructor}},
  )
}

beforeEach(() => {
  mockRequest.mockReset()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('useSearchInstructor', () => {
  test('uses matching initial metadata, including normalized slug aliases', () => {
    const initialInstructor = {
      slug: 'hiro-nishimura',
      full_name: 'Hiro Nishimura',
    }
    const {result, rerender} = renderInstructor(
      ['Hiroko Nishimura'],
      initialInstructor,
    )

    expect(result.current).toBe(initialInstructor)
    expect(mockRequest).not.toHaveBeenCalled()

    rerender({instructorNames: [], initialInstructor: null})
    expect(result.current).toBeNull()

    rerender({instructorNames: ['Hiro Nishimura'], initialInstructor: null})
    expect(result.current).toBe(initialInstructor)
    expect(mockRequest).not.toHaveBeenCalled()
  })

  test('never displays mismatched initial metadata while a selection loads', async () => {
    const response = deferredInstructor()
    mockRequest.mockReturnValue(response.promise)
    const {result} = renderInstructor(['Kent C. Dodds'], john)

    expect(result.current).toBeNull()
    expect(mockRequest).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      {slug: kent.slug},
    )

    await act(async () => {
      response.resolve({instructor: kent})
    })
    expect(result.current).toEqual(kent)
  })

  test('uses a stable canonical slug across equivalent selection arrays', async () => {
    const response = deferredInstructor()
    mockRequest.mockReturnValue(response.promise)
    const {result, rerender} = renderInstructor(['Hiro Nishimura'])

    rerender({
      instructorNames: ['Hiroko Nishimura'],
      initialInstructor: null,
    })
    rerender({
      instructorNames: ['Hiroko Nishimura'],
      initialInstructor: null,
    })
    expect(mockRequest).toHaveBeenCalledTimes(1)
    expect(mockRequest).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      {slug: 'hiroko-nishimura'},
    )

    await act(async () => {
      response.resolve({
        instructor: {slug: 'hiroko-nishimura', full_name: 'Hiroko Nishimura'},
      })
    })
    expect(result.current?.slug).toBe('hiroko-nishimura')
  })

  test('reuses fetched metadata without showing the previous selection', async () => {
    const johnResponse = deferredInstructor()
    const kentResponse = deferredInstructor()
    mockRequest
      .mockReturnValueOnce(johnResponse.promise)
      .mockReturnValueOnce(kentResponse.promise)
    const {result, rerender} = renderInstructor(['John Lindquist'])

    await act(async () => {
      johnResponse.resolve({instructor: john})
    })
    expect(result.current).toEqual(john)

    rerender({instructorNames: ['Kent C. Dodds'], initialInstructor: null})
    expect(result.current).toBeNull()

    await act(async () => {
      kentResponse.resolve({instructor: kent})
    })
    expect(result.current).toEqual(kent)

    rerender({instructorNames: ['John Lindquist'], initialInstructor: null})
    expect(result.current).toEqual(john)
    expect(mockRequest).toHaveBeenCalledTimes(2)
  })

  test('ignores a late A response after B has become visible', async () => {
    const johnResponse = deferredInstructor()
    const kentResponse = deferredInstructor()
    mockRequest
      .mockReturnValueOnce(johnResponse.promise)
      .mockReturnValueOnce(kentResponse.promise)
    const {result, rerender} = renderInstructor(['John Lindquist'])

    rerender({instructorNames: ['Kent C. Dodds'], initialInstructor: null})
    await act(async () => {
      kentResponse.resolve({instructor: kent})
    })
    expect(result.current).toEqual(kent)

    await act(async () => {
      johnResponse.resolve({instructor: john})
    })
    expect(result.current).toEqual(kent)

    await act(async () => {
      rerender({instructorNames: ['John Lindquist'], initialInstructor: null})
    })
    expect(result.current).toEqual(john)
    expect(mockRequest).toHaveBeenCalledTimes(2)
  })

  test('reuses pending A across A -> B -> A without installing late B', async () => {
    const johnResponse = deferredInstructor()
    const kentResponse = deferredInstructor()
    mockRequest
      .mockReturnValueOnce(johnResponse.promise)
      .mockReturnValueOnce(kentResponse.promise)
    const {result, rerender} = renderInstructor(['John Lindquist'])

    rerender({instructorNames: ['Kent C. Dodds'], initialInstructor: null})
    rerender({instructorNames: ['John Lindquist'], initialInstructor: null})
    expect(mockRequest).toHaveBeenCalledTimes(2)

    await act(async () => {
      johnResponse.resolve({instructor: john})
    })
    expect(result.current).toEqual(john)

    await act(async () => {
      kentResponse.resolve({instructor: kent})
    })
    expect(result.current).toEqual(john)
  })

  test.each([
    {instructorNames: []},
    {instructorNames: ['John Lindquist', 'Kent C. Dodds']},
  ])(
    'clears metadata for selection $instructorNames and ignores its pending response',
    async ({instructorNames}) => {
      const response = deferredInstructor()
      mockRequest.mockReturnValue(response.promise)
      const {result, rerender} = renderInstructor(['John Lindquist'])

      rerender({instructorNames, initialInstructor: null})
      expect(result.current).toBeNull()

      await act(async () => {
        response.resolve({instructor: john})
      })
      expect(result.current).toBeNull()
      expect(mockRequest).toHaveBeenCalledTimes(1)
    },
  )

  test('clears already loaded metadata for empty and multiple selections', () => {
    const {result, rerender} = renderInstructor(['John Lindquist'], john)
    expect(result.current).toBe(john)

    rerender({instructorNames: [], initialInstructor: john})
    expect(result.current).toBeNull()

    rerender({
      instructorNames: ['John Lindquist', 'Kent C. Dodds'],
      initialInstructor: john,
    })
    expect(result.current).toBeNull()
    expect(mockRequest).not.toHaveBeenCalled()
  })

  test('new initial metadata supersedes an in-flight lookup and stays cached', async () => {
    const response = deferredInstructor()
    const updatedJohn = {...john, bio_short: 'Updated route metadata'}
    mockRequest.mockReturnValue(response.promise)
    const {result, rerender} = renderInstructor(['John Lindquist'])

    rerender({
      instructorNames: ['John Lindquist'],
      initialInstructor: updatedJohn,
    })
    expect(result.current).toBe(updatedJohn)

    await act(async () => {
      response.resolve({instructor: john})
    })
    rerender({instructorNames: ['John Lindquist'], initialInstructor: null})
    expect(result.current).toBe(updatedJohn)
    expect(mockRequest).toHaveBeenCalledTimes(1)
  })

  test('new initial metadata for another slug never replaces the selection', async () => {
    const response = deferredInstructor()
    mockRequest.mockReturnValue(response.promise)
    const {result, rerender} = renderInstructor(['John Lindquist'])

    rerender({instructorNames: ['John Lindquist'], initialInstructor: kent})
    expect(result.current).toBeNull()

    await act(async () => {
      response.resolve({instructor: john})
    })
    expect(result.current).toEqual(john)

    rerender({instructorNames: ['Kent C. Dodds'], initialInstructor: null})
    expect(result.current).toBe(kent)
    expect(mockRequest).toHaveBeenCalledTimes(1)
  })

  test('handles lookup failure without retrying or blocking another selection', async () => {
    const warning = jest.spyOn(console, 'warn')
    const failedResponse = deferredInstructor()
    const nextResponse = deferredInstructor()
    mockRequest
      .mockReturnValueOnce(failedResponse.promise)
      .mockReturnValueOnce(nextResponse.promise)
    const {result, rerender} = renderInstructor(['John Lindquist'])

    await act(async () => {
      failedResponse.reject(new Error('Instructor service unavailable'))
    })
    expect(result.current).toBeNull()
    expect(warning).toHaveBeenCalledWith(
      JSON.stringify({
        event: 'search.instructor.lookup_failed',
        instructor_slug: john.slug,
        error: 'Instructor service unavailable',
      }),
    )

    rerender({instructorNames: ['John Lindquist'], initialInstructor: null})
    expect(mockRequest).toHaveBeenCalledTimes(1)

    rerender({instructorNames: ['Kent C. Dodds'], initialInstructor: null})
    await act(async () => {
      nextResponse.resolve({instructor: kent})
    })
    expect(result.current).toEqual(kent)
  })

  test('does not install an unmounted lookup in a later hook instance', async () => {
    const oldResponse = deferredInstructor()
    const currentResponse = deferredInstructor()
    const updatedJohn = {...john, bio_short: 'Current instance'}
    mockRequest
      .mockReturnValueOnce(oldResponse.promise)
      .mockReturnValueOnce(currentResponse.promise)
    const previous = renderInstructor(['John Lindquist'])
    previous.unmount()
    const current = renderInstructor(['John Lindquist'])

    await act(async () => {
      oldResponse.resolve({instructor: john})
    })
    expect(current.result.current).toBeNull()

    await act(async () => {
      currentResponse.resolve({instructor: updatedJohn})
    })
    expect(current.result.current).toEqual(updatedJohn)
    expect(mockRequest).toHaveBeenCalledTimes(2)
  })
})
