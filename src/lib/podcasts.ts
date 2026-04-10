import podcastArchiveJson from '@/data/podcast-archive.json'
import {PodcastResource} from '@/types'

// Static snapshot of the podcast archive captured from the public Rails API.
// Podcasts are immutable archive content, so serving them from local JSON is
// dramatically faster and avoids live SSR fetches for giant transcript payloads.

export type PodcastCardResource = Pick<
  PodcastResource,
  'id' | 'title' | 'path' | 'image_url' | 'contributors'
>

const podcastArchive = [...(podcastArchiveJson as PodcastResource[])].sort(
  (a, b) => b.episode_number - a.episode_number,
)

const podcastIndex = new Map(
  podcastArchive.map((podcast) => [podcast.slug, podcast] as const),
)

export function loadPodcasts(): PodcastResource[] {
  return podcastArchive
}

export function loadPodcast(slug: string): PodcastResource | null {
  return podcastIndex.get(slug) ?? null
}

export function loadRelatedPodcasts(
  currentPodcastId: number,
  limit = 6,
): PodcastCardResource[] {
  return podcastArchive
    .filter((podcast) => podcast.id !== currentPodcastId)
    .slice(0, limit)
    .map(({id, title, path, image_url, contributors}) => ({
      id,
      title,
      path,
      image_url,
      contributors,
    }))
}
