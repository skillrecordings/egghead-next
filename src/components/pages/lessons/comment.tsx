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
        <div className="flex-shrink-0 mr-4">
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className="rounded-full w-10"
          />
        </div>
      )}
      <div>
        <div className="flex items-center">
          <div
            className={`flex items-center ${
              isCommentableOwner ? 'bg-blue-100 px-2 py-1 rounded-md' : ''
            }`}
          >
            <span className={isCommentableOwner ? 'font-medium' : ''}>
              {user.full_name}
            </span>
            {isCommentableOwner && (
              <span className="ml-3 text-blue-600 text-sm">(instructor)</span>
            )}
          </div>
          <div className="ml-3">~ {friendlyTime(new Date(createdAt))}</div>
        </div>
        <div className="mt-3">
          <ReactMarkdown>{comment}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default Comment
