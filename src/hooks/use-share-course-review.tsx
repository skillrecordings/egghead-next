import * as React from 'react'
import get from 'lodash/get'
import find from 'lodash/find'
import toast from 'react-hot-toast'
import {useRouter} from 'next/router'
import queryString from 'query-string'
import {useCopyToClipboard} from 'react-use'

export function useShareCourseReview(ratings: any, collection: any): any {
  const router = useRouter()
  const reviewIdFromParam = get(router, 'query.review')
  const reviewFromParam =
    reviewIdFromParam && find(ratings, {id: Number(reviewIdFromParam)})

  const [copied, setCopied] = useCopyToClipboard()

  const userAvatar =
    reviewFromParam &&
    (reviewFromParam.user.avatar_url.substring(0, 2) === '//'
      ? 'https:' + reviewFromParam.user.avatar_url
      : reviewFromParam.user.avatar_url)

  const reviewImageUrl =
    reviewFromParam &&
    queryString.stringifyUrl({
      url: 'https://share-learner-review.vercel.app/api/image',
      query: {
        review: reviewFromParam.comment.comment,
        rating: reviewFromParam.rating_out_of_5,
        authorName: reviewFromParam.user.full_name,
        authorAvatar: userAvatar,
        courseIllustration: collection.image_thumb_url,
        courseTitle: collection.title,
        instructorAvatar: collection.instructor.avatar_url,
        instructorName: collection.instructor.full_name,
      },
    })

  const handleCopyReviewUrlToClipboard = (shareUrl: string) => {
    setCopied(shareUrl)
    toast('Link copied to clipboard', {duration: 2000})
  }

  return {
    reviewImageUrl,
    handleCopyReviewUrlToClipboard,
  }
}

export function shareUrlBuilder(reviewId: string, path: string) {
  return queryString.stringifyUrl({
    url: (process.env.NEXT_PUBLIC_DEPLOYMENT_URL + path) as string,
    query: {
      review: reviewId,
    },
  })
}
