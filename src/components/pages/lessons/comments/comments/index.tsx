import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import Comment from '@/components/pages/lessons/comments/comment'
import CommentField from '@/components/pages/lessons/comments/comment-field'
import {track} from '@/utils/analytics'
import {useViewer} from '@/context/viewer-context'
import {saveCommentForLesson} from '@/lib/lesson-comments'
import {LockClosedIcon} from '@heroicons/react/solid'

type CommentsProps = {
  lesson: any
}

const defaultComment = {
  id: 'default',
  comment: `Member comments are a way for members to communicate, interact, and ask questions about a lesson. 
  
  The instructor or someone from the community might respond to your question Here are a few basic guidelines to commenting on egghead.io 
  
  **Be on-Topic**
  
  Comments are for discussing a lesson. If you're having a general issue with the website functionality, please contact us at support@egghead.io.
  
  **Avoid meta-discussion**
  - This was great!
  - This was horrible!
  - I didn't like this because it didn't match my skill level.
  - +1
  It will likely be deleted as spam.
  
  **Code Problems?**
  
  Should be accompanied by code! Codesandbox or Stackblitz provide a way to share code and discuss it in context
  
  **Details and Context**
  
  Vague question? Vague answer. Any details and context you can provide will lure more interesting answers!`,
  state: 'published',
  is_commentable_owner: false,
  user: {
    full_name: 'egghead',
    avatar_url:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1566948117/transcript-images/Eggo_Notext.png',
  },
}

const Comments: React.FunctionComponent<
  React.PropsWithChildren<CommentsProps>
> = ({lesson}: CommentsProps) => {
  const {viewer} = useViewer()
  const [mounted, setMounted] = React.useState(false)
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

  React.useEffect(() => {
    setMounted(true)
    setComments(lesson.comments)
  }, [lesson])

  return mounted ? (
    <div className={commentsAvailable ? 'space-y-10' : 'space-y-6'}>
      {commentsAvailable ? (
        comments.map((comment: any) => {
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
      ) : (
        <Comment
          key={defaultComment.id}
          comment={defaultComment.comment}
          state={defaultComment.state}
          isCommentableOwner={defaultComment.is_commentable_owner}
          user={defaultComment.user}
        />
      )}
      {viewer?.can_comment ? (
        <CommentField onSubmit={handleCommentSubmission} />
      ) : (
        <div className="relative flex flex-col dark:text-white">
          <CommentField disabled onSubmit={() => {}} />

          <div className="absolute backdrop-blur-sm bg-gray-50/20 dark:bg-black/20 p-8 w-[105%] h-[105%] -top-1 -right-1 flex flex-col justify-center items-center gap-4">
            <span className="font-semibold flex gap-2 justify-center">
              <LockClosedIcon height={20} width={20} /> Become a member to join
              the discussion
            </span>
            <Link
              href="/pricing"
              onClick={() =>
                track('clicked pricing', {
                  location: 'comments',
                })
              }
              className="w-fit px-3 py-2 text-center rounded-md bg-blue-600 text-white font-semibold shadow-lg hover:bg-indigo-600 hover:scale-105 transition-all duration-150 ease-in-out"
            >
              Enroll Today
            </Link>
          </div>
        </div>
      )}
    </div>
  ) : null
}

export default Comments
