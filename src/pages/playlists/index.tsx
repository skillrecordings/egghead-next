import * as React from 'react'
import {loadAllPlaylists} from 'lib/playlists'
import Link from 'next/link'
import Image from 'next/image'

export async function getStaticProps() {
  const playlists = await loadAllPlaylists()
  return {
    props: {playlists}, // will be passed to the page component as props
  }
}

const PlaylistIndex: React.FC<{playlists: any}> = ({playlists = []}) => {
  return (
    <div>
      <ul className="space-y-5">
        {playlists.map((course: any) => {
          return (
            <li key={course.slug}>
              <Link href={course.path}>
                <a>
                  <div className="flex items-center space-x-2">
                    <Image
                      src={course.image_thumb_url}
                      width={32}
                      height={32}
                    />
                    <div>{course.title}</div>
                  </div>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PlaylistIndex
