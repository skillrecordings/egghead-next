import {NextRequest, NextResponse} from 'next/server'
import {getCourseBuilderLesson} from '@/lib/get-course-builder-metadata'
import {getMuxAsset} from '@/lib/mux'
import {isMember} from '@/utils/is-member'
import fetchEggheadUser from '@/api/egghead/users/from-token'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, {headers: corsHeaders})
}

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{slug: string}>},
) {
  try {
    const {slug} = await params

    // Check if user is a member (pro or instructor)
    const token = request.cookies.get('egghead_token')?.value
    let viewer = null

    if (token) {
      try {
        viewer = await fetchEggheadUser(token)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }

    if (!isMember(viewer)) {
      return NextResponse.json(
        {
          error: 'Download access is only available to egghead members.',
          requiresMembership: true,
        },
        {status: 403, headers: corsHeaders},
      )
    }

    // Get Course Builder lesson data
    const courseBuilderLesson = await getCourseBuilderLesson(slug)

    if (!courseBuilderLesson) {
      return NextResponse.json(
        {error: 'Lesson not found in Course Builder'},
        {status: 404, headers: corsHeaders},
      )
    }

    const muxAssetId = courseBuilderLesson.muxAssetId
    const muxPlaybackId = courseBuilderLesson.muxPlaybackId

    if (!muxAssetId && !muxPlaybackId) {
      return NextResponse.json(
        {error: 'No MUX video found for this lesson'},
        {status: 404, headers: corsHeaders},
      )
    }

    let downloadUrl = null
    const filename = encodeURIComponent(`${slug}.mp4`)
    // Prefer playback ID (works across all environments without API credentials)
    if (muxPlaybackId) {
      downloadUrl = `https://stream.mux.com/${muxPlaybackId}/high.mp4?download=${filename}`
      console.log('Using playback ID directly for download:', muxPlaybackId)
    }
    // Fallback to Asset API (only works if credentials match the asset's environment)
    else if (muxAssetId) {
      try {
        const muxAsset = await getMuxAsset(muxAssetId)
        console.log('MUX asset response:', JSON.stringify(muxAsset, null, 2))

        // Try multiple download options from the asset API:
        // 1. Master access (original quality)
        // 2. Static renditions (encoded MP4s)
        // 3. Playback URL from asset

        if (muxAsset?.master?.url) {
          downloadUrl = `${muxAsset.master.url}?download=${filename}`
          console.log('Using master download URL from Asset API')
        } else if (muxAsset?.static_renditions?.files?.length > 0) {
          const mp4Files = muxAsset.static_renditions.files
            .filter((f: any) => f.ext === 'mp4')
            .sort((a: any, b: any) => (b.width || 0) - (a.width || 0))

          if (mp4Files.length > 0) {
            downloadUrl = `${mp4Files[0].url}?download=${filename}`
            console.log('Using static rendition MP4:', mp4Files[0].name)
          }
        } else if (muxAsset?.playback_ids?.length > 0) {
          const playbackId = muxAsset.playback_ids[0].id
          downloadUrl = `https://stream.mux.com/${playbackId}/high.mp4?download=${filename}`
          console.log('Using playback URL from Asset API')
        }

        if (!downloadUrl) {
          return NextResponse.json(
            {
              error:
                'No download option available. The video may still be processing.',
              debug: {
                hasMaster: !!muxAsset?.master,
                hasStaticRenditions: !!muxAsset?.static_renditions,
                hasPlaybackIds: !!muxAsset?.playback_ids?.length,
              },
            },
            {status: 503, headers: corsHeaders},
          )
        }
      } catch (error) {
        console.error('Failed to get MUX asset:', error)
        throw error // Re-throw since we have no other options
      }
    }

    if (!downloadUrl) {
      return NextResponse.json(
        {
          error: 'No MUX playback ID or asset ID available for download.',
        },
        {status: 404, headers: corsHeaders},
      )
    }

    // Return the download URL
    return NextResponse.json(downloadUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    })
  } catch (error) {
    console.error('Error generating MUX download URL:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error: 'Failed to generate download URL',
        details: errorMessage,
      },
      {status: 500, headers: corsHeaders},
    )
  }
}
