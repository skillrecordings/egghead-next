import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import friendlyTime from 'friendly-time'
import Image from 'next/image'

type CommentProps = {
  comment: string
  state: string
  createdAt: any
  isCommentableOwner: boolean
  user: {
    avatar_url: string
    full_name: string
    instructor: {
      first_name: string
    }
  }
}

const Comment: React.FunctionComponent<
  React.PropsWithChildren<CommentProps>
> = ({comment, state, createdAt, isCommentableOwner, user}: CommentProps) => {
  if (state === 'hidden') {
    return null
  }

  // gravatar url is protocol-relative (start with //),
  // but next/image excepts an absolute URL
  const gravatarUrl =
    user.avatar_url.slice(0, 2) === '//'
      ? user.avatar_url.replace('//', 'https://')
      : user.avatar_url

  return (
    <div className="flex">
      {user.avatar_url && (
        <div className="flex-shrink-0 mr-3 sm:mr-4">
          <Image
            width={48}
            height={48}
            src={gravatarUrl}
            alt={user.full_name}
            className="rounded-full border-2 border-gray-100 dark:border-gray-700"
          />
        </div>
      )}
      <div>
        <div className="flex items-baseline text-sm md:text-base sm:flex-row flex-col">
          <div className="flex  items-baseline ">
            <span className="font-semibold text-black dark:text-white">
              {user.full_name}
            </span>
            {isCommentableOwner && (
              <span className="text-green-600 text-sm whitespace-nowrap ml-1">
                instructor
              </span>
            )}
          </div>
          <div className="sm:ml-2 whitespace-nowrap text-xs text-gray-400 dark:text-gray-500">
            ~ {friendlyTime(new Date(createdAt))}
          </div>
        </div>
        <style jsx>{`
          & > :first-child {
            margin-top: 0;
          }
          & > :last-child {
            margin-bottom: 0;
          }
        `}</style>
        <div className="comment-container prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 max-w-none mt-1">
          <ReactMarkdown>{comment}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default Comment
