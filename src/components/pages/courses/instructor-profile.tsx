import Link from 'next/link'
import * as React from 'react'
import Markdown from 'react-markdown'

const InstructorProfile: React.FunctionComponent<{
  name: string
  avatar_url: string
  url: string
  bio_short?: string
  twitter?: string
  className?: string
}> = ({className, url, name, avatar_url, bio_short, twitter}) => (
  <div className={className ? className : ''}>
    <div className="flex flex-shrink-0 items-center">
      <div
        className="w-10 h-10 rounded-full flex-shrink-0 bg-cover"
        style={{
          backgroundImage: `url(${avatar_url})`,
        }}
      />
      <div className="ml-2 flex flex-col justify-center">
        <h4 className="text-gray-700 dark:text-gray-400 text-sm leading-tighter">
          Instructor
        </h4>
        <Link href={`/q/resources-by-${url}`}>
          <a className="flex hover:underline flex-shrink-0">
            <span className="font-semibold text-base">{name}</span>
          </a>
        </Link>
      </div>
    </div>
    {/* {twitter && <div className="text-gray-600 text-sm">@{twitter}</div>} */}
  </div>
)

export default InstructorProfile
