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
  // Iter 3: branch on hash — PK-only IN(...) when hashed (common path),
  // JSON slug match only when bare.
  const targetMatch = hashFromSlug
    ? {
        clause: 'cr_target.id IN (?, ?, ?)',
        params: [slug, `post_${hashFromSlug}`, `lesson_${hashFromSlug}`],
      }
    : {
        clause: `JSON_UNQUOTE(JSON_EXTRACT(cr_target.fields, '$.slug')) = ?`,
        params: [slug],
      }

  // Iter 4: flat JOIN chain (no subquery) — target → parent course → siblings.
  const [rows] = await pool.execute(
    `
      SELECT
        sib.id AS lessonId,
        c.id AS parentId,
        sib_crr.position
      FROM egghead_ContentResource tgt
      JOIN egghead_ContentResourceResource tgt_crr ON tgt.id = tgt_crr.resourceId
      JOIN egghead_ContentResource c ON tgt_crr.resourceOfId = c.id
        AND (
          c.type = 'course'
          OR (c.type = 'post' AND JSON_UNQUOTE(JSON_EXTRACT(c.fields, '$.postType')) = 'course')
        )
      JOIN egghead_ContentResourceResource sib_crr ON c.id = sib_crr.resourceOfId
      JOIN egghead_ContentResource sib ON sib_crr.resourceId = sib.id
      WHERE ${targetMatch.clause.replace(/cr_target/g, 'tgt')}
        AND sib.deletedAt IS NULL
        AND (
          sib.type = 'lesson'
          OR (sib.type = 'post' AND JSON_UNQUOTE(JSON_EXTRACT(sib.fields, '$.postType')) = 'lesson')
        )
        AND JSON_UNQUOTE(JSON_EXTRACT(sib.fields, '$.state')) IN ('published','approved','flagged','revised','retired')
      ORDER BY sib_crr.position ASC, sib.createdAt ASC, sib.id ASC
    `,
    targetMatch.params,
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
