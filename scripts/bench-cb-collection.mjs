#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import mysql from 'mysql2/promise'

function loadEnvFile(file) {
  try {
    const raw = fs.readFileSync(path.resolve(file), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/i)
      if (!m) continue
      if (!process.env[m[1]]) process.env[m[1]] = m[2]
    }
  } catch {}
}
loadEnvFile('.env.local')
loadEnvFile('.env.development.local')
loadEnvFile('.env.development')

const SLUG = process.argv[2] || 'scaling-objects~le03z'
const RUNS = Number(process.argv[3] || 8)

const url = new URL(process.env.COURSE_BUILDER_DATABASE_URL)
const pool = mysql.createPool({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, ''),
  ssl: url.searchParams.get('ssl') !== 'false' ? {rejectUnauthorized: true} : undefined,
  waitForConnections: true,
  connectionLimit: 10,
})

const hashFromSlug = SLUG.includes('~') ? SLUG.split('~').pop() : ''

async function approachA_separateBranch(slug) {
  // Single join to find parent course directly from lesson slug.
  const [parentRows] = await pool.execute(
    `
      SELECT cr_course.id, cr_course.fields, cr_course.type
      FROM egghead_ContentResource cr_lesson
      JOIN egghead_ContentResourceResource crr ON cr_lesson.id = crr.resourceId
      JOIN egghead_ContentResource cr_course ON crr.resourceOfId = cr_course.id
      WHERE (
        cr_lesson.id = ?
        OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = ?
        ${hashFromSlug ? 'OR cr_lesson.id LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, "$.slug")) LIKE ?' : ''}
      )
      AND (
        cr_course.type = 'course'
        OR (cr_course.type = 'post' AND JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.postType')) = 'course')
      )
      LIMIT 1
    `,
    hashFromSlug ? [slug, slug, `%${hashFromSlug}`, `%${hashFromSlug}`] : [slug, slug],
  )
  const parent = parentRows[0]
  if (!parent) return null

  const [siblings] = await pool.execute(
    `
      SELECT cr_lesson.id, cr_lesson.fields, crr.position
      FROM egghead_ContentResourceResource crr
      JOIN egghead_ContentResource cr_lesson ON crr.resourceId = cr_lesson.id
      WHERE crr.resourceOfId = ?
        AND cr_lesson.deletedAt IS NULL
        AND (
          cr_lesson.type = 'lesson'
          OR (cr_lesson.type = 'post' AND JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.postType')) = 'lesson')
        )
        AND JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.state')) IN ('published','approved','flagged','revised','retired')
      ORDER BY crr.position ASC, cr_lesson.createdAt ASC, cr_lesson.id ASC
    `,
    [parent.id],
  )
  return {parentId: parent.id, lessonCount: siblings.length}
}

async function approachB_lessonIdFirst(slug) {
  // Existing getCourseBuilderLesson flow: look up lesson row (gets id), then parent by id, then siblings.
  const [lessonRows] = await pool.execute(
    `
      SELECT cr_lesson.id
      FROM egghead_ContentResource cr_lesson
      WHERE (
        cr_lesson.id = ?
        OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = ?
        ${hashFromSlug ? 'OR cr_lesson.id LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, "$.slug")) LIKE ?' : ''}
      )
      AND cr_lesson.type IN ('post','lesson')
      LIMIT 1
    `,
    hashFromSlug ? [slug, slug, `%${hashFromSlug}`, `%${hashFromSlug}`] : [slug, slug],
  )
  const lesson = lessonRows[0]
  if (!lesson) return null

  const [parentRows] = await pool.execute(
    `
      SELECT cr_course.id
      FROM egghead_ContentResourceResource crr
      JOIN egghead_ContentResource cr_course ON crr.resourceOfId = cr_course.id
      WHERE crr.resourceId = ?
        AND (
          cr_course.type = 'course'
          OR (cr_course.type = 'post' AND JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.postType')) = 'course')
        )
      LIMIT 1
    `,
    [lesson.id],
  )
  const parent = parentRows[0]
  if (!parent) return null

  const [siblings] = await pool.execute(
    `
      SELECT cr_lesson.id
      FROM egghead_ContentResourceResource crr
      JOIN egghead_ContentResource cr_lesson ON crr.resourceId = cr_lesson.id
      WHERE crr.resourceOfId = ?
        AND cr_lesson.deletedAt IS NULL
      ORDER BY crr.position ASC
    `,
    [parent.id],
  )
  return {parentId: parent.id, lessonCount: siblings.length}
}

async function time(label, fn) {
  const timings = []
  let result
  for (let i = 0; i < RUNS; i++) {
    const t = process.hrtime.bigint()
    result = await fn()
    timings.push(Number(process.hrtime.bigint() - t) / 1e6)
  }
  const sorted = [...timings].sort((a, b) => a - b)
  const p50 = sorted[Math.floor(sorted.length / 2)]
  const min = sorted[0]
  const max = sorted[sorted.length - 1]
  const avg = timings.reduce((s, v) => s + v, 0) / timings.length
  console.log(
    `${label.padEnd(40)} min=${min.toFixed(1)}ms p50=${p50.toFixed(1)}ms avg=${avg.toFixed(1)}ms max=${max.toFixed(1)}ms  result=${JSON.stringify(result)}`,
  )
}

async function main() {
  console.log(`slug=${SLUG} runs=${RUNS}`)
  // warm
  await approachA_separateBranch(SLUG)
  await approachB_lessonIdFirst(SLUG)

  await time('A: single-join parent + siblings', () => approachA_separateBranch(SLUG))
  await time('B: lesson→parent→siblings (3q)', () => approachB_lessonIdFirst(SLUG))

  await pool.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
