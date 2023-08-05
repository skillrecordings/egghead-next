import Link from 'next/link'
import Image from 'next/image'
import {track} from 'utils/analytics/track'

export const CourseArtwork: React.FunctionComponent<
  React.PropsWithChildren<{
    course: any
    path?: string
    size: number
    trackText: string
  }>
> = ({course, path, size, trackText}) => {
  return path ? (
    <Link href={path}>
      <a
        onClick={() =>
          track(trackText, {
            course: course.slug,
          })
        }
      >
        <Image
          src={course.square_cover_480_url}
          alt={`illustration for ${course.title}`}
          height={size}
          width={size}
          quality={100}
        />
      </a>
    </Link>
  ) : (
    <Image
      src={course.square_cover_480_url}
      alt={`illustration for ${course.title}`}
      height={size}
      width={size}
      quality={100}
    />
  )
}
