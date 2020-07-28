import fs from 'fs'
import {map, find} from 'lodash/fp'

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

  return map((tag) => {
    const {slug, label} = tag
    return {
      params: {
        slug,
        label,
      },
    }
  })(tags)
}

export function getTag(slug) {
  return find({slug}, readTags())
}
