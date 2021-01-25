import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import friendlyTime from 'friendly-time'

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

const Comment: React.FunctionComponent<CommentProps> = ({
  comment,
  state,
  createdAt,
  isCommentableOwner,
  user,
}: CommentProps) => {
  if (state === 'hidden') {
    return null
  }
  return (
    <div className="flex">
      {user.avatar_url && (
        <div className="flex-shrink-0 mr-3 sm:mr-4">
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className="rounded-full w-10 mt-0"
          />
        </div>
      )}
      <div>
        <div className="flex items-baseline text-sm md:text-base">
          <div className="flex items-center flex-wrap flex-grow">
            <span className="font-semibold mr-2">{user.full_name}</span>
            {isCommentableOwner && (
              <span className="text-green-500 text-sm whitespace-nowrap">
                (instructor)
              </span>
            )}
          </div>
          <div className="ml-2 sm:ml-3 whitespace-nowrap text-xs sm:text-sm opacity-50">
            ~ {friendlyTime(new Date(createdAt))}
          </div>
        </div>
        <div
          className="mt-2 sm:mt-3"
          css={{
            '> :first-child': {marginTop: 0},
            '> :last-child': {marginBottom: 0},
          }}
        >
          <ReactMarkdown>{comment}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default Comment
