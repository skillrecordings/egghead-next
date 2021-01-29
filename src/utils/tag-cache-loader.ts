import tags from 'pages/site-directory/tags.json'
import {find} from 'lodash'

export function tagCacheLoader(slug: string) {
  return find(tags, {slug})
}
