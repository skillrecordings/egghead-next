import {isEmpty} from 'lodash'
import axios from 'utils/configured-axios'
import * as React from 'react'
import {loadRatings} from 'lib/ratings'
import FiveStars from 'components/five-stars'
import friendlyTime from 'friendly-time'
import Image from 'next/image'
import Markdown from '../../markdown'
import queryString from 'query-string'
import {useViewer} from 'context/viewer-context'
import {IconTwitter} from 'components/share'

const LearnerRatings: React.FunctionComponent<{collection: any}> = ({
  collection,
}) => {
  const [ratings, setRatings] = React.useState(
    collection?.ratings_with_comment?.data || [],
  )
  const [loadingRatings, setLoadingRatings] = React.useState(true)
  const {type, slug, title, image_thumb_url} = collection
  const {viewer} = useViewer()

  React.useEffect(() => {
    if (!isEmpty(ratings)) {
      setLoadingRatings(false)
    }
    if (loadingRatings) {
      setLoadingRatings(false)
      loadRatings(slug, type).then((ratings: any) => {
        setRatings(ratings)
      })
    }
  }, [loadingRatings, type, slug, ratings])

  return isEmpty(ratings) ? null : (
    <div className="mt-8 ">
      <h2 className="text-lg font-semibold mb-3">Learner Reviews</h2>
      <ul className="space-y-5 md:space-y-0  md:grid-cols-2 grid gap-3">
        {ratings.map((rating: any) => {
          const {comment, rating_out_of_5, user, created_at} = rating
          const displayAdminContent =
            !rating.hidden &&
            (!isEmpty(comment.hide_url) || !isEmpty(comment.restore_url))

          const userAvatar =
            user.avatar_url.substring(0, 2) === '//'
              ? 'https:' + user.avatar_url
              : user.avatar_url

          const reviewImageUrl = queryString.stringifyUrl({
            url: 'https://share-learner-review.vercel.app/api/image',
            query: {
              review: comment.comment,
              rating: rating_out_of_5,
              authorName: user.full_name,
              authorAvatar: userAvatar,
              courseIllustration: image_thumb_url,
              courseTitle: title,
            },
          })

          return (
            <li
              key={`rating-${rating.id}`}
              className={`space-y-2 dark:border-gray-800 border rounded-md p-4 ${
                rating.hidden && 'hidden'
              }`}
            >
              <div className=" flex items-center space-x-3">
                <div>
                  <Image
                    className="rounded-full"
                    src={
                      user.avatar_url.includes('gravatar')
                        ? `https:${user.avatar_url}`
                        : user.avatar_url
                    }
                    width={32}
                    height={32}
                  />
                </div>
                <div className="font-bold">{user.full_name || 'Learner'}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {friendlyTime(new Date(created_at))}
                </div>
              </div>
              <FiveStars rating={rating_out_of_5} />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {comment.prompt}
              </div>
              <div className="prose dark:prose-dark overflow-hidden">
                <Markdown>{comment.comment}</Markdown>
              </div>
              <div className="flex items-center space-x-2">
                {displayAdminContent && (
                  <button
                    className="flex flex-row items-center px-2 py-1 text-sm text-gray-600 transition-colors ease-in-out bg-white border border-gray-300 rounded shadow-sm dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-800 dark:border-gray-600 "
                    onClick={() => {
                      rating.hidden = true
                      axios.post(comment.hide_url).then(() => {
                        setLoadingRatings(true)
                      })
                    }}
                  >
                    Hide
                  </button>
                )}
                {(viewer?.is_instructor || displayAdminContent) && (
                  <button
                    onClick={() => {
                      const tweetText =
                        'Check out this review of my course on @eggheadio'
                      const twitterUrl = `https://twitter.com/intent/tweet?url=${window.location}&text=${tweetText}`
                      window.open(twitterUrl, '_blank')
                      window.open(reviewImageUrl, '_blank')
                    }}
                    className="flex flex-row items-center px-2 py-1 text-sm text-gray-600 transition-colors ease-in-out bg-white border border-gray-300 rounded shadow-sm dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-800 dark:border-gray-600 "
                  >
                    <IconTwitter className="w-4" />
                    <span className="pl-1">Tweet</span>
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default LearnerRatings
