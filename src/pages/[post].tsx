import {GetServerSideProps} from 'next'
import {LessonResource} from '@/types'
import {pgQuery} from '@/db'
import MuxPlayer from '@mux/mux-player-react'
import * as mysql from 'mysql2/promise'
import {ConnectionOptions, RowDataPacket} from 'mysql2/promise'

const access: ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
  rowsAsArray: true,
}

function convertToSerializeForNextResponse(result: any) {
  for (const resultKey in result) {
    if (result[resultKey] instanceof Date) {
      result[resultKey] = result[resultKey].toISOString()
    } else if (
      result[resultKey]?.constructor?.name === 'Decimal' ||
      result[resultKey]?.constructor?.name === 'i'
    ) {
      result[resultKey] = result[resultKey].toNumber()
    } else if (result[resultKey]?.constructor?.name === 'BigInt') {
      result[resultKey] = Number(result[resultKey])
    } else if (result[resultKey] instanceof Object) {
      result[resultKey] = convertToSerializeForNextResponse(result[resultKey])
    }
  }

  return result
}

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
  query,
}) {
  if (!params?.post) {
    return {
      notFound: true,
    }
  }
  const conn = await mysql.createConnection(access)
  const [videoResourceRows] = await conn.execute<RowDataPacket[]>(`
SELECT *
		FROM egghead_ContentResource cr_lesson
		JOIN egghead_ContentResourceResource crr ON cr_lesson.id = crr.resourceOfId
		JOIN egghead_ContentResource cr_video ON crr.resourceId = cr_video.id
		WHERE (cr_lesson.id = 'test-lesson-for-course-builder-ixntp' OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = '${params.post}')
			AND cr_video.type = 'videoResource'
		LIMIT 1`)
  const [postRows] = await conn.execute<RowDataPacket[]>(`
SELECT *
		FROM egghead_ContentResource cr_lesson
		WHERE (cr_lesson.id = 'test-lesson-for-course-builder-ixntp' OR JSON_UNQUOTE(JSON_EXTRACT(cr_lesson.fields, '$.slug')) = '${params.post}')
		LIMIT 1`)
  await conn.end()

  const videoResource = videoResourceRows[0]
  const post = postRows[0]

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post: convertToSerializeForNextResponse(post),
      videoResource: convertToSerializeForNextResponse(videoResource),
    },
  }
}

export default function PostPage({
  post,
  videoResource,
}: {
  post: any
  videoResource: any
}) {
  return (
    <div>
      {post.fields.title}
      <MuxPlayer playbackId={videoResource.fields.muxPlaybackId} />
    </div>
  )
}
