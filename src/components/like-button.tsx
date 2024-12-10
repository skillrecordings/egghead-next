import {trpc} from '@/app/_trpc/client'
import {useViewer} from '@/context/viewer-context'
import Spinner from '@/spinner'
import {cn} from '@/ui/utils'
import {useEffect, useState} from 'react'

interface LikeButtonProps {
  postId: number
  className?: string
}

export function LikeButton({postId, className}: LikeButtonProps) {
  const utils = trpc.useUtils()
  const [mounted, setMounted] = useState(false)
  const [optimisticLiked, setOptimisticLiked] = useState(false)
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null)
  const {authenticated, loading: viewerLoading} = useViewer()

  const {
    data: likeCount,
    isLoading: countLoading,
    status: countStatus,
  } = trpc.likes.getLikesForPost.useQuery({postId})
  const {
    data: hasLiked,
    isLoading: likedLoading,
    status: likedStatus,
  } = trpc.likes.hasUserLikedPost.useQuery({postId})

  const {
    mutate: toggleLike,
    isLoading: mutationLoading,
    isIdle,
  } = trpc.likes.toggleLike.useMutation({
    onMutate: () => {
      setOptimisticLiked(!optimisticLiked)
      setOptimisticCount((prev) =>
        prev !== null ? (optimisticLiked ? prev - 1 : prev + 1) : null,
      )
    },
    onSettled: () => {
      utils.likes.getLikesForPost.invalidate({postId})
      utils.likes.hasUserLikedPost.invalidate({postId})
    },
    onError: () => {
      setOptimisticLiked(!optimisticLiked)
      setOptimisticCount((prev) =>
        prev !== null ? (optimisticLiked ? prev + 1 : prev - 1) : null,
      )
    },
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (hasLiked !== undefined) setOptimisticLiked(hasLiked)
  }, [hasLiked])

  useEffect(() => {
    if (likeCount !== undefined) setOptimisticCount(likeCount)
  }, [likeCount])

  const isLoading =
    countStatus !== 'success' || likedStatus !== 'success' || viewerLoading
  const isLiked = mounted && optimisticLiked

  return (
    <button
      onClick={() => !viewerLoading && toggleLike({postId})}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-1.5 text-sm transition  duration-300 ease-in-out dark:shadow-md px-3 py-2 rounded bg-gradient-to-tr dark:from-gray-800 dark:to-gray-700 from-yellow-300/20 border-pink-400/5 relative border dark:border-0 to-amber-300/20 hover:bg-amber-300/30',
        {
          '': isLiked,
          'dark:text-gray-200 hover:dark:text-white': !isLiked,
          'animate-pulse opacity-50': isLoading,
        },
        className,
      )}
      aria-label={optimisticLiked ? 'Unlike post' : 'Like post'}
    >
      {isLiked ? (
        <svg
          className={cn('h-4 w-4', {
            'animate-pulse': isLoading,
          })}
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-label="Unlike post"
        >
          <g fill="currentColor">
            <path
              d="M9.956,4.5H6.731v-3A1.314,1.314,0,0,0,5.634,0a1.3,1.3,0,0,0-.4,0,.5.5,0,0,0-.45.375L3,6v6H9.431a2.009,2.009,0,0,0,1.95-1.725l.6-3.45a1.9,1.9,0,0,0-.45-1.575A1.883,1.883,0,0,0,9.956,4.5Z"
              fill="currentColor"
            />
            <path d="M.5,6H2v6H.5a.5.5,0,0,1-.5-.5v-5A.5.5,0,0,1,.5,6Z" />
          </g>
        </svg>
      ) : (
        <svg
          className={cn('h-4 w-4', {
            'animate-pulse': isLoading,
          })}
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-label="Like post"
        >
          <g
            strokeWidth="1"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline
              points="2.5 11.5 0.5 11.5 0.5 6.5 2.5 6.5"
              stroke="currentColor"
            />
            <path d="M2.5,6.5l2-6H5A1.5,1.5,0,0,1,6.5,2V4.5H9.77a1.5,1.5,0,0,1,1.485,1.712l-.571,4A1.5,1.5,0,0,1,9.2,11.5H2.5Z" />
          </g>
        </svg>
      )}
      {optimisticCount !== null ? (
        <span className="min-w-3 text-center tabular-nums">
          {optimisticCount}
        </span>
      ) : (
        <Spinner className="w-3" />
      )}
    </button>
  )
}
