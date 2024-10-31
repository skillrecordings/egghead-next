import {pgQuery} from '@/db'

export type LikeResponse = {
  success: boolean
  error?: string
  count?: number
}

export async function addLikeToPostForUser({
  postId,
  userId,
}: {
  postId: number
  userId: string
}): Promise<LikeResponse> {
  try {
    const result = await pgQuery(
      `INSERT INTO reactions (
        likeable_id,
        likeable_type,
        reaction_type,
        user_id,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (user_id, likeable_type, likeable_id, reaction_type) 
      DO NOTHING
      RETURNING *`,
      [postId, 'Lesson', 'like', userId],
    )
    return {
      success: result.rowCount !== null && result.rowCount > 0,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function removeLikeFromPostForUser({
  postId,
  userId,
}: {
  postId: number
  userId: string
}): Promise<LikeResponse> {
  try {
    const result = await pgQuery(
      `DELETE FROM reactions 
      WHERE likeable_id = $1 
      AND likeable_type = $2
      AND user_id = $3
      AND reaction_type = $4`,
      [postId, 'Lesson', userId, 'like'],
    )
    return {
      success: result.rowCount !== null && result.rowCount > 0,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function getLikesForPost({postId}: {postId: number}) {
  const result = await pgQuery(
    `SELECT COUNT(*) as count 
    FROM reactions 
    WHERE likeable_id = $1 
    AND likeable_type = $2 
    AND reaction_type = $3`,
    [postId, 'Lesson', 'like'],
  )
  return parseInt(result.rows[0].count, 10)
}

export async function hasUserLikedPost({
  postId,
  userId,
}: {
  postId: number
  userId: string
}) {
  const result = await pgQuery(
    `SELECT EXISTS(
      SELECT 1 FROM reactions 
      WHERE likeable_id = $1 
      AND likeable_type = $2
      AND user_id = $3
      AND reaction_type = $4
    ) as liked`,
    [postId, 'Lesson', userId, 'like'],
  )
  return result.rows[0].liked
}

export async function getLikedPostIdsForUser({userId}: {userId: string}) {
  const result = await pgQuery(
    `SELECT likeable_id 
    FROM reactions 
    WHERE user_id = $1 
    AND likeable_type = $2 
    AND reaction_type = $3`,
    [userId, 'Lesson', 'like'],
  )
  return result.rows.map((row) => row.likeable_id)
}
