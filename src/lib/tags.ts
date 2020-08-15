import fs from 'fs'

import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
import filter from 'lodash/fp/filter'
import pipe from 'lodash/fp/pipe'

const tagsPath = './data/tags.json'

function readTags() {
  const rawdata = fs.readFileSync(tagsPath)
  return JSON.parse(rawdata.toString())
}

export function getTags() {
  const tags = readTags()

  return tags
}

export function getTagSlugs() {
  const tags = getTags()

  type Tag = {
    slug: string
    label: string
  }
  return pipe(
    filter((tag: Tag) => tag.slug != 'react'),
    map((tag: Tag) => {
      const {slug, label} = tag
      return {
        params: {
          slug,
          label,
        },
      }
    }),
  )(tags)
}

export function getTag(slug) {
  return find({slug}, readTags())
}
