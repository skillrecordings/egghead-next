const axios = require('axios')
const parse = require('parse-link-header')
const fs = require('fs')
const get = require('lodash/get')
var pad = require('pad-number')

const LESSONS = 'lessons'
const COURSES = 'series'
const PODCASTS = 'podcasts'

const types = [LESSONS]

async function getAllResources(url, type) {
  const result = await axios.get(url)
  const resources = result.data.map((resource) => {
    return {...resource, id: `${type}-${pad(resource.id, 20)}`}
  })
  const nextUrl = get(parse(result.headers.link), 'next.url')

  if (nextUrl) {
    console.log(`fetching more ${type} ${resources.length}`)
    const moreResources = await getAllResources(nextUrl, type)
    return [...resources, ...moreResources]
  }

  switch (type) {
    case LESSONS:
      return resources
        .filter((lesson) => {
          return lesson.visibility_state === 'indexed'
        })
        .map((lesson) => {
          const {
            slug,
            id,
            instructor,
            title,
            primary_tag,
            url,
            path,
            transcript_url,
          } = lesson
          return {
            slug,
            id,
            instructor,
            title,
            primary_tag,
            url,
            path,
            transcript_url,
          }
        })
    default:
      return resources
  }
}

async function run(type) {
  console.log(`fetching all ${type}`)
  let numPages = 10
  if (type === LESSONS) numPages = 150

  const resources = await getAllResources(
    `https://egghead.io/api/v1/${type}?page=1&per_page=${numPages}&state=published`,
    type,
  )

  fs.writeFile(
    `./data/${type}.json`,
    JSON.stringify(resources, null, 2),
    'utf8',
    () => {},
  )
}

types.forEach(run)
