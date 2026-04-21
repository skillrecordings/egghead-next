#!/usr/bin/env node
// Autoresearch verify target.
// Emits ONE line: `METRIC <p50_ms>` so the verify command can extract it.
//
// Edit the `currentApproach` function to iterate on query strategy.
// Run: node scripts/bench-cb-collection.mjs [slug] [runs]
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
const RUNS = Number(process.argv[3] || 10)

const url = new URL(process.env.COURSE_BUILDER_DATABASE_URL)
const pool = mysql.createPool({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, ''),
  ssl:
    url.searchParams.get('ssl') !== 'false'
      ? {rejectUnauthorized: true}
      : undefined,
  waitForConnections: true,
  connectionLimit: 10,
})

const hashFromSlug = SLUG.includes('~') ? SLUG.split('~').pop() : ''

// =====================================================================
// currentApproach — autoresearch iterates HERE.
// Contract: given slug, return {parentId, lessonCount} or null.
// =====================================================================
async function currentApproach(slug) {
  // Iter 1: single query with correlated subquery — one round-trip.
  const [rows] = await pool.execute(
    `
      SELECT
        cr_lesson.id AS lessonId,
        crr.resourceOfId AS parentId,
        crr.position
      FROM egghead_ContentResourceResource crr
      JOIN egghead_ContentResource cr_lesson ON crr.resourceId = cr_lesson.id
      WHERE crr.resourceOfId = (
        SELECT cr_course.id
        FROM egghead_ContentResource cr_target
        JOIN egghead_ContentResourceResource crr2 ON cr_target.id = crr2.resourceId
        JOIN egghead_ContentResource cr_course ON crr2.resourceOfId = cr_course.id
        WHERE (
          cr_target.id = ?
          OR JSON_UNQUOTE(JSON_EXTRACT(cr_target.fields, '$.slug')) = ?
          ${hashFromSlug ? 'OR cr_target.id LIKE ? OR JSON_UNQUOTE(JSON_EXTRACT(cr_target.fields, "$.slug")) LIKE ?' : ''}
        )
        AND (
          cr_course.type = 'course'
          OR (cr_course.type = 'post' AND JSON_UNQUOTE(JSON_EXTRACT(cr_course.fields, '$.postType')) = 'course')
        )
        LIMIT 1
      )
      AND cr_lesson.deletedAt IS NULL
      AND (
        cr_lesson.type = 'lesson'
        OR (cr_lesson.type = 'post' AND JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.postType')) = 'lesson')
      )
      AND JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.state')) IN ('published','approved','flagged','revised','retired')
      ORDER BY crr.position ASC, cr_lesson.createdAt ASC, cr_lesson.id ASC
    `,
    hashFromSlug
      ? [slug, slug, `%${hashFromSlug}`, `%${hashFromSlug}`]
      : [slug, slug],
  )
  if (rows.length === 0) return null
  return {parentId: rows[0].parentId, lessonCount: rows.length}
}
// =====================================================================

async function time(fn) {
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
  return {p50, min, max, avg, result}
}

async function main() {
  // warm
  await currentApproach(SLUG)
  const {p50, min, max, avg, result} = await time(() => currentApproach(SLUG))
  console.error(
    `slug=${SLUG} runs=${RUNS} min=${min.toFixed(1)}ms p50=${p50.toFixed(1)}ms avg=${avg.toFixed(1)}ms max=${max.toFixed(1)}ms result=${JSON.stringify(result)}`,
  )
  console.log(`METRIC ${p50.toFixed(2)}`)
  await pool.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
