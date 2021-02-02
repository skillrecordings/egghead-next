import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import Comment from 'components/pages/lessons/comments/comment'
import CommentField from 'components/pages/lessons/comments/comment-field'
import {track} from 'utils/analytics'

type CommentsProps = {
  lesson: any
}

const Comments: React.FunctionComponent<CommentsProps> = ({
  lesson,
}: CommentsProps) => {
  const {comments, add_comment_url = true} = lesson
  console.log('comments: ', comments)
  const commentsAvailable =
    comments?.some((comment: any) => comment.state === 'published') ?? false
  return (
    <div className={commentsAvailable ? 'space-y-10' : 'space-y-6'}>
      {commentsAvailable ? (
        comments.map((comment: any) => (
          <Comment
            key={comment.id}
            comment={comment.comment}
            state={comment.state}
            createdAt={comment.created_at}
            isCommentableOwner={comment.is_commentable_owner}
            user={comment.user}
          />
        ))
      ) : (
        <h4 className="font-semibold text-center">
          There are no comments yet.
        </h4>
      )}
      {add_comment_url ? (
        <CommentField url="some-url" />
      ) : (
        <div className="flex flex-col items-center space-y-6">
          <h4 className="font-semibold">
            You have to be a Pro to leave a comment
          </h4>
          <Link href="/pricing">
            <a
              onClick={() =>
                track('clicked pricing', {
                  location: 'header',
                })
              }
              className="inline-flex px-3 py-2 text-center rounded-md bg-blue-600 text-white font-semibold shadow-lg hover:bg-indigo-600 transform hover:scale-105 transition-all duration-150 ease-in-out"
            >
              Join egghead
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Comments
