const axios = require('axios')
const parse = require('parse-link-header')
const fs = require('fs')
const get = require('lodash/get')
var pad = require('pad-number')

const types = ['lessons', 'series', 'podcasts']

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

  return resources
}

async function run(type) {
  console.log(`fetching all ${type}`)

  const resources = await getAllResources(
    `https://egghead.io/api/v1/${type}?page=1&per_page=100&without_course_or_published_course=false`,
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
