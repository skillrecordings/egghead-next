import * as React from 'react'
import {isEmpty} from 'lodash'
import axios from 'utils/configured-axios'
import {loadRatings} from 'lib/ratings'
import FiveStars from 'components/five-stars'
import friendlyTime from 'friendly-time'
import Image from 'next/image'
import Markdown from '../../markdown'
import {useViewer} from 'context/viewer-context'
import {NextSeo} from 'next-seo'
import {
  shareUrlBuilder,
  useShareCourseReview,
} from 'hooks/use-share-course-review'
import {useRouter} from 'next/router'

const LearnerRatings: React.FunctionComponent<{collection: any}> = ({
  collection,
}) => {
  const router = useRouter()
  const [ratings, setRatings] = React.useState(
    collection?.ratings_with_comment?.data || [],
  )
  const [loadingRatings, setLoadingRatings] = React.useState(true)
  const {type, slug} = collection
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

  const {reviewImageUrl} = useShareCourseReview(ratings, collection)

  return isEmpty(ratings) ? null : (
    <>
      {reviewImageUrl && (
        <NextSeo
          openGraph={{
            images: [
              {
                url: reviewImageUrl,
              },
            ],
          }}
        />
      )}
      <div className="mt-8 ">
        <h2 className="text-lg font-semibold mb-3">Learner Reviews</h2>
        <ul className="space-y-5 md:space-y-0  md:grid-cols-2 grid gap-3">
          {ratings.map((rating: any) => {
            const {comment, rating_out_of_5, user, created_at} = rating
            const displayAdminContent =
              !rating.hidden &&
              (!isEmpty(comment.hide_url) || !isEmpty(comment.restore_url))

            const shareUrl = shareUrlBuilder(rating.id, router.asPath)
            const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              shareUrl,
            )}`

            return (
              <li
                key={`rating-${rating.id}`}
                className={`space-y-2 dark:border-gray-800 border rounded-md p-4 ${
                  rating.hidden && 'hidden'
                }`}
              >
                <FiveStars rating={rating_out_of_5} />
                <div className="text-sm text-gray-600 dark:text-blue-100 opacity-80">
                  {comment.prompt}
                </div>
                <div className="prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 overflow-hidden">
                  <Markdown>{comment.comment}</Markdown>
                </div>
                <div className=" flex items-center space-x-2">
                  <div className="flex items-center justify-center">
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
                  <div className="flex items-baseline">
                    <div className="font-bold">
                      {user.full_name || 'Learner'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 pl-2">
                      {friendlyTime(new Date(created_at))}
                    </div>
                  </div>
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
                    <a
                      href={twitterShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row items-center px-2 py-1 text-sm text-gray-600 transition-colors ease-in-out bg-white border border-gray-300 rounded shadow-sm dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-800 dark:border-gray-600 "
                    >
                      Tweet this review
                    </a>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default LearnerRatings
