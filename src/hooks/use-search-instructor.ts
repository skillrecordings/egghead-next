import * as React from 'react'
import {loadInstructor} from '@/lib/instructors'
import {normalizeInstructorSlug} from '@/lib/instructor-slug-aliases'
import nameToSlug from '@/lib/name-to-slug'
import {logEvent} from '@/utils/structured-log'

type InstructorMetadata = {
  slug: string
  full_name?: string
  avatar_url?: string | null
  bio_short?: string | null
  twitter?: string | null
  website?: string | null
}

type SearchInstructorOptions = {
  instructorNames: string[]
  initialInstructor: InstructorMetadata | null
}

export default function useSearchInstructor({
  instructorNames,
  initialInstructor,
}: SearchInstructorOptions): InstructorMetadata | null {
  const slug =
    instructorNames.length === 1
      ? normalizeInstructorSlug(nameToSlug(instructorNames[0]))
      : null
  const initialSlug = initialInstructor?.slug
    ? normalizeInstructorSlug(initialInstructor.slug.toLowerCase())
    : null
  const [cache, setCache] = React.useState(
    () =>
      new Map<string, InstructorMetadata>(
        initialSlug && initialInstructor
          ? [[initialSlug, initialInstructor]]
          : [],
      ),
  )
  const lookups = React.useRef<Map<
    string,
    Promise<InstructorMetadata | null>
  > | null>(null)

  React.useEffect(() => {
    if (!initialSlug || !initialInstructor) return

    setCache((current) => {
      if (current.get(initialSlug) === initialInstructor) return current
      return new Map(current).set(initialSlug, initialInstructor)
    })
  }, [initialInstructor, initialSlug])

  React.useEffect(() => {
    if (!slug || slug === initialSlug || cache.has(slug)) return

    let cancelled = false
    if (!lookups.current) lookups.current = new Map()
    let lookup = lookups.current.get(slug)

    if (!lookup) {
      lookup = loadInstructor(slug).catch((error) => {
        lookups.current?.delete(slug)
        logEvent('warn', 'search.instructor.lookup_failed', {
          instructor_slug: slug,
          error: error instanceof Error ? error.message : String(error),
        })
        return null
      })
      lookups.current.set(slug, lookup)
    }

    // Keep pending or completed lookups reusable across A -> B -> A selections.
    lookup.then((instructor) => {
      if (cancelled || !instructor) return
      setCache((current) => {
        // Route metadata received during this lookup takes precedence.
        if (current.has(slug)) return current
        return new Map(current).set(slug, instructor)
      })
    })

    return () => {
      cancelled = true
    }
  }, [slug, initialSlug, cache])

  if (!slug) return null
  if (slug === initialSlug) return initialInstructor
  return cache.get(slug) ?? null
}
