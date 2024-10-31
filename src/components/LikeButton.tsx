import {trpc} from '@/app/_trpc/client'
import {cn} from '@/ui/utils'
import {ThumbsUp} from 'lucide-react'
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

  const {mutate: toggleLike, isLoading: mutationLoading} =
    trpc.likes.toggleLike.useMutation({
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

  const isLoading = countStatus === 'loading' || likedStatus === 'loading'

  return (
    <button
      onClick={() => toggleLike({postId})}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-1.5 text-sm transition-colors',
        mounted && optimisticLiked
          ? 'text-blue-500'
          : 'text-gray-500 hover:text-blue-500',
        isLoading && 'opacity-50',
        className,
      )}
      aria-label={optimisticLiked ? 'Unlike post' : 'Like post'}
    >
      <ThumbsUp
        className={cn('h-5 w-5', isLoading && 'animate-pulse')}
        fill={mounted && optimisticLiked ? 'currentColor' : 'none'}
      />
      {optimisticCount !== null ? (
        <span>{optimisticCount}</span>
      ) : (
        <span className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      )}
    </button>
  )
}
