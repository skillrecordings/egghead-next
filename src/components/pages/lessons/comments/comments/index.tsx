import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import Comment from 'components/pages/lessons/comments/comment'
import CommentField from 'components/pages/lessons/comments/comment-field'
import {track} from 'utils/analytics'

type CommentsProps = {
  lesson: any
  commentingAllowed: boolean
}

const Comments: React.FunctionComponent<CommentsProps> = ({
  lesson,
  commentingAllowed,
}: CommentsProps) => {
  const {comments, add_comment_url} = lesson
  const commentsAvailable =
    comments?.some((comment: any) => comment.state === 'published') ?? false
  return (
    <div className={commentsAvailable ? 'space-y-10' : 'space-y-6'}>
      {
        commentsAvailable
          ? comments.map((comment: any) => (
              <Comment
                key={comment.id}
                comment={comment.comment}
                state={comment.state}
                createdAt={comment.created_at}
                isCommentableOwner={comment.is_commentable_owner}
                user={comment.user}
              />
            ))
          : null
        // <h4 className="font-semibold dark:text-white">
        //   There are no comments yet.
        // </h4>
      }
      {commentingAllowed ? (
        add_comment_url ? (
          <CommentField url="some-url" />
        ) : (
          <div className="flex flex-col space-y-4 dark:text-white">
            <h4 className="font-semibold">
              Become a Member to join discussion
            </h4>
            <Link href="/pricing">
              <a
                onClick={() =>
                  track('clicked pricing', {
                    location: 'comments',
                  })
                }
                className="inline-flex px-3 py-2 text-center rounded-md bg-blue-600 text-white font-semibold shadow-lg hover:bg-indigo-600 transform hover:scale-105 transition-all duration-150 ease-in-out"
              >
                View Pricing
              </a>
            </Link>
          </div>
        )
      ) : null}
    </div>
  )
}

export default Comments
