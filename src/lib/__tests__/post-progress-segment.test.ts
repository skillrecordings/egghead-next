import {segmentToWrite, type LastWrittenSegment} from '../post-progress-segment'

// Replays a stream of timeupdate ticks the way post-player does.
function writes(times: number[], lessonId: unknown = 42) {
  let last: LastWrittenSegment = {lessonId: null, segment: 0}
  const out: number[] = []
  for (const t of times) {
    const segment = segmentToWrite(t, lessonId, last)
    if (segment !== null) {
      last = {lessonId, segment}
      out.push(segment)
    }
  }
  return out
}

test('four ticks inside (29, 30] write the segment once, not four times', () => {
  expect(writes([29.1, 29.35, 29.6, 29.85, 30.0])).toEqual([1])
})

test('each 30s boundary writes once across a minute and a half', () => {
  const ticks = Array.from({length: 360}, (_, i) => (i + 1) * 0.25)
  expect(writes(ticks)).toEqual([1, 2, 3])
})

test('seeking back does not write a segment again', () => {
  expect(writes([29.5, 59.5, 20, 29.5])).toEqual([1, 2])
})

test('a different lesson starts its own count', () => {
  const last = {lessonId: 1, segment: 3}
  expect(segmentToWrite(29.5, 2, last)).toBe(1)
  expect(segmentToWrite(29.5, 1, last)).toBeNull()
})

test('off-boundary and zero times write nothing', () => {
  expect(segmentToWrite(0, 1, {lessonId: null, segment: 0})).toBeNull()
  expect(segmentToWrite(undefined, 1, {lessonId: null, segment: 0})).toBeNull()
  expect(segmentToWrite(31, 1, {lessonId: null, segment: 0})).toBeNull()
})
