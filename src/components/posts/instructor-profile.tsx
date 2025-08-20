import Image from 'next/image'
import Link from 'next/link'

interface InstructorProfileProps {
  instructor: {
    full_name: string
    avatar_url: string
    path?: string
  }
}

export function InstructorProfile({instructor}: InstructorProfileProps) {
  const content = (
    <div className="flex flex-shrink-0 items-center">
      {instructor?.avatar_url ? (
        <Image
          src={instructor.avatar_url}
          width={40}
          height={40}
          alt={instructor.full_name}
          className="rounded-full"
        />
      ) : null}
      <div className="ml-2 flex flex-col justify-center">
        <span className="text-gray-700 dark:text-gray-400 text-sm leading-tighter">
          Instructor
        </span>
        <h2 className="font-semibold text-base group-hover:underline">
          {instructor.full_name}
        </h2>
      </div>
    </div>
  )

  return instructor.path ? (
    <Link className="group" href={instructor.path}>
      {content}
    </Link>
  ) : (
    content
  )
}
