import {loadPlaylist} from './playlists'

export async function loadCourse(slug: string, token?: string) {
  return loadPlaylist(slug, token)
}
