#!/usr/bin/env node

const axios = require("axios")
const parse = require("parse-link-header")
const fs = require("fs")
const path = require("path")
const get = require("lodash/get")
var pad = require("pad-number")
const commandLineArgs = require("command-line-args")
const { cwd } = require("process")

const LESSONS = "lessons"
const INSTRUCTORS = "instructors"
const SERIES = "series"

async function getAllResources(url, type) {
  const result = await axios.get(url)
  const resources = result.data.map(resource => {
    return {
      ...resource,
      id: `${type}-${pad(resource.id, 20)}`,
    }
  })
  const nextUrl = get(
    parse(result.headers.link),
    "next.url"
  )

  if (nextUrl) {
    console.log(`fetching more ${type} ${resources.length}`)
    const moreResources = await getAllResources(
      nextUrl,
      type
    )
    return [...resources, ...moreResources]
  }

  return resources
    .filter(series => {
      return series.visibility_state === "indexed"
    })
    .map(series => {
      const {
        slug,
        title,
        summary,
        instructor,
        square_cover_256_url,
        lessons,
        rating_out_of_5,
        rating_count,
        watched_count,
      } = series
      return {
        slug,
        title,
        summary,
        instructor,
        square_cover_256_url,
        lessons: lessons.map(lesson => {
          const {
            slug,
            title,
            primary_tag,
            url,
            path,
            transcript_url,
          } = lesson
          return {
            slug,
            title,
            primary_tag,
            url,
            path,
            transcript_url,
          }
        }),
        rating_out_of_5,
        rating_count,
        watched_count,
      }
    })
}

async function run(type) {
  console.log(`fetching all ${type}`)
  let numPages = 10
  if (type === LESSONS) numPages = 150

  const resources = await getAllResources(
    `https://egghead.io/api/v1/${type}?page=1&per_page=${numPages}&state=published`,
    type
  )

  fs.writeFile(
    path.join(cwd(), `./data/${type}.json`),
    JSON.stringify(resources, null, 2),
    "utf8",
    () => {}
  )
}

const optionDefinitions = [
  {
    name: SERIES,
    alias: "s",
    group: "types",
    type: Boolean,
  },
  {
    name: LESSONS,
    alias: "l",
    group: "types",
    type: Boolean,
  },
  {
    name: INSTRUCTORS,
    alias: "i",
    group: "types",
    type: Boolean,
  },
]

const { types } = commandLineArgs(optionDefinitions)

Object.keys(types).forEach(run)
