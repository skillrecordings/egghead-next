import {RowDataPacket} from 'mysql2/promise'
import {getPool} from '@/lib/db'
import type {Guide, GuideSection, GuideResource} from '@/schemas/guide'

function parseFields(row: RowDataPacket): Record<string, any> {
  return typeof row.fields === 'string' ? JSON.parse(row.fields) : row.fields
}

/**
 * Fetches all published guides from Course Builder.
 * Returns data matching the existing Guide[] shape used by the guides index page.
 */
export async function getGuidesFromCourseBuilder(): Promise<Guide[]> {
  if (!process.env.COURSE_BUILDER_DATABASE_URL) {
    console.warn(
      'COURSE_BUILDER_DATABASE_URL not configured, skipping Course Builder guides lookup',
    )
    return []
  }

  const pool = getPool()
  let conn

  try {
    conn = await pool.getConnection()

    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT cr.*
       FROM egghead_ContentResource cr
       WHERE cr.type = 'list'
         AND JSON_UNQUOTE(JSON_EXTRACT(cr.fields, '$.type')) = 'guide'
         AND cr.deletedAt IS NULL
       ORDER BY cr.updatedAt DESC`,
    )

    return rows.map((row) => {
      const fields = parseFields(row)
      const slug = fields.slug?.split('~')[0] ?? null

      return {
        _id: row.id,
        _updatedAt: row.updatedAt
          ? new Date(row.updatedAt).toISOString()
          : new Date().toISOString(),
        _createdAt: row.createdAt
          ? new Date(row.createdAt).toISOString()
          : new Date().toISOString(),
        title: fields.title,
        slug,
        description: fields.description ?? undefined,
        subTitle: fields.subTitle ?? null,
        path: fields.path ?? null,
        image: fields.image ?? undefined,
        ogImage: fields.ogImage ?? null,
        state: fields.state ?? null,
      } satisfies Guide
    })
  } catch (error) {
    console.error('Error fetching guides from Course Builder:', error)
    return []
  } finally {
    if (conn) conn.release()
  }
}

/**
 * Fetches a single guide with full hierarchy (sections + resources) from Course Builder.
 * Returns data matching the existing Guide shape used by GuideTemplate.
 */
export async function getGuideFromCourseBuilder(
  slug: string,
): Promise<Guide | null> {
  if (!process.env.COURSE_BUILDER_DATABASE_URL) {
    console.warn(
      'COURSE_BUILDER_DATABASE_URL not configured, skipping Course Builder guide lookup',
    )
    return null
  }

  const pool = getPool()
  let conn

  try {
    conn = await pool.getConnection()

    // Find the guide resource
    const [guideRows] = await conn.execute<RowDataPacket[]>(
      `SELECT cr.*
       FROM egghead_ContentResource cr
       WHERE cr.type = 'list'
         AND JSON_UNQUOTE(JSON_EXTRACT(cr.fields, '$.type')) = 'guide'
         AND (
           cr.id = ?
           OR JSON_UNQUOTE(JSON_EXTRACT(cr.fields, '$.slug')) = ?
           OR JSON_UNQUOTE(JSON_EXTRACT(cr.fields, '$.slug')) LIKE ?
         )
         AND cr.deletedAt IS NULL
       LIMIT 1`,
      [slug, slug, `${slug}~%`],
    )

    const guideRow = guideRows[0]
    if (!guideRow) {
      console.log(`No Course Builder guide found for slug: ${slug}`)
      return null
    }

    const guideFields = parseFields(guideRow)
    const guideId = guideRow.id

    // Fetch sections linked to this guide
    const [sectionRows] = await conn.execute<RowDataPacket[]>(
      `SELECT cr_section.*, crr.position
       FROM egghead_ContentResourceResource crr
       JOIN egghead_ContentResource cr_section ON crr.resourceId = cr_section.id
       WHERE crr.resourceOfId = ?
         AND cr_section.type = 'section'
       ORDER BY crr.position ASC`,
      [guideId],
    )

    // Batch-fetch all resources for all sections in one query
    const sectionIds = sectionRows.map((row) => row.id)
    const resourcesBySectionId = new Map<string, GuideResource[]>()

    if (sectionIds.length > 0) {
      const [allResourceRows] = await conn.query<RowDataPacket[]>(
        `SELECT cr_resource.*, crr.position, crr.metadata, crr.resourceOfId
         FROM egghead_ContentResourceResource crr
         JOIN egghead_ContentResource cr_resource ON crr.resourceId = cr_resource.id
         WHERE crr.resourceOfId IN (?)
         ORDER BY crr.position ASC`,
        [sectionIds],
      )

      for (const resourceRow of allResourceRows) {
        const resourceFields = parseFields(resourceRow)
        const resourceSlug = resourceFields.slug?.split('~')[0] ?? null

        // Parse join-row metadata for path/type overrides
        const metadata = resourceRow.metadata
          ? typeof resourceRow.metadata === 'string'
            ? JSON.parse(resourceRow.metadata)
            : resourceRow.metadata
          : {}

        // Determine resource type - metadata overrides CB type mapping
        const resourceType = metadata.type
          ? (metadata.type as GuideResource['type'])
          : mapResourceType(resourceRow.type, resourceFields.postType)

        // Path priority: metadata > resource fields > null
        const resourcePath = metadata.path ?? resourceFields.path ?? null

        const resource: GuideResource = {
          _id: resourceRow.id,
          title: resourceFields.title ?? 'Untitled',
          description:
            metadata.description ??
            resourceFields.description ??
            resourceFields.summary ??
            null,
          type: resourceType,
          slug: resourceSlug,
          image: metadata.image ?? resourceFields.image ?? null,
          url: resourceFields.url ?? null,
          path: resourcePath,
          lessonCount:
            metadata.lessonCount ?? resourceFields.totalLessons ?? null,
          instructor: metadata.instructor ?? resourceFields.instructor ?? null,
          firstLesson:
            metadata.firstLesson ?? resourceFields.firstLesson ?? null,
        }

        const parentId = resourceRow.resourceOfId
        if (!resourcesBySectionId.has(parentId)) {
          resourcesBySectionId.set(parentId, [])
        }
        resourcesBySectionId.get(parentId)!.push(resource)
      }
    }

    const sections: GuideSection[] = sectionRows.map((sectionRow) => {
      const sectionFields = parseFields(sectionRow)
      return {
        _id: sectionRow.id,
        title: sectionFields.title ?? 'Untitled Section',
        type: 'collection',
        description: sectionFields.description ?? null,
        resources: resourcesBySectionId.get(sectionRow.id) ?? [],
      } satisfies GuideSection
    })

    const guideSlug = guideFields.slug?.split('~')[0] ?? null

    return {
      _id: guideRow.id,
      _updatedAt: guideRow.updatedAt
        ? new Date(guideRow.updatedAt).toISOString()
        : new Date().toISOString(),
      _createdAt: guideRow.createdAt
        ? new Date(guideRow.createdAt).toISOString()
        : new Date().toISOString(),
      title: guideFields.title,
      slug: guideSlug,
      description: guideFields.body ?? guideFields.description ?? undefined,
      subTitle: guideFields.subTitle ?? null,
      path: guideFields.path ?? null,
      image: guideFields.image ?? undefined,
      ogImage: guideFields.ogImage ?? null,
      sections,
      state: guideFields.state ?? null,
    } satisfies Guide
  } catch (error) {
    console.error('Error fetching guide from Course Builder:', error)
    return null
  } finally {
    if (conn) conn.release()
  }
}

/**
 * Maps Course Builder resource types to the guide resource type enum.
 */
function mapResourceType(
  cbType: string,
  postType?: string,
): GuideResource['type'] {
  if (cbType === 'post') {
    switch (postType) {
      case 'course':
        return 'course'
      case 'article':
        return 'article'
      case 'podcast':
        return 'podcast'
      case 'tip':
        return 'article'
      default:
        return 'course'
    }
  }

  // Direct type mappings for non-post resources
  const typeMap: Record<string, GuideResource['type']> = {
    list: 'playlist',
    lesson: 'course',
    playlist: 'playlist',
    collection: 'collection',
    project: 'project',
    talk: 'talk',
    resource: 'article',
  }

  return typeMap[cbType] ?? 'course'
}
