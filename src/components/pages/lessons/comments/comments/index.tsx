import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import Comment from 'components/pages/lessons/comments/comment'
import CommentField from 'components/pages/lessons/comments/comment-field'
import {track} from 'utils/analytics'
import {useViewer} from 'context/viewer-context'
import {saveCommentForLesson} from 'lib/lesson-comments'

type CommentsProps = {
  lesson: any
  commentingAllowed: boolean
}

const Comments: React.FunctionComponent<CommentsProps> = ({
  lesson,
  commentingAllowed,
}: CommentsProps) => {
  const {viewer} = useViewer()
  const [comments, setComments] = React.useState(lesson.comments)
  const {slug} = lesson
  const commentsAvailable =
    comments?.some((comment: any) => comment.state === 'published') ?? false

  const handleCommentSubmission = async (comment: string) => {
    const newComment = await saveCommentForLesson(slug, {
      comment,
    })
    setComments([...comments, newComment])
  }

  return (
    <div className={commentsAvailable ? 'space-y-10' : 'space-y-6'}>
      {commentsAvailable
        ? comments.map((comment: any) => {
            return (
              <Comment
                key={comment.id}
                comment={comment.comment}
                state={comment.state}
                createdAt={comment.created_at}
                isCommentableOwner={comment.is_commentable_owner}
                user={comment.user}
              />
            )
          })
        : null}
      {commentingAllowed ? (
        viewer.can_comment ? (
          <CommentField onSubmit={handleCommentSubmission} />
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
