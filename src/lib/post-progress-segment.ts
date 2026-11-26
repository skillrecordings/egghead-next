export type LastWrittenSegment = {lessonId: unknown; segment: number}

/**
 * Which 30s segment, if any, a post-player `timeupdate` should write.
 *
 * timeupdate fires about 4 times a second, so every tick in (29, 30] passes
 * `ceil(t) % 30 === 0`. Each write creates and increments a Rails lesson
 * view, so without this each segment counted about 4 times in the
 * `segments` RevenueShareQuery sums. A segment is written once per lesson.
 * Returns the segment number to write, or null to skip.
 */
export function segmentToWrite(
  currentTime: number | undefined,
  lessonId: unknown,
  last: LastWrittenSegment,
): number | null {
  const secondsWatched = Math.ceil(currentTime || 0)
  if (secondsWatched <= 0 || secondsWatched % 30 !== 0) return null
  const segment = secondsWatched / 30
  if (last.lessonId === lessonId && segment <= last.segment) return null
  return segment
}
