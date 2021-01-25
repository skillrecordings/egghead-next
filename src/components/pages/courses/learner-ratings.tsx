import {isEmpty} from 'lodash'
import axios from 'utils/configured-axios'
import * as React from 'react'
import {loadRatings} from 'lib/ratings'
import FiveStars from 'components/five-stars'
import friendlyTime from 'friendly-time'
import Image from 'next/image'
import Markdown from '../../markdown'

const LearnerRatings: React.FunctionComponent<{collection: any}> = ({
  collection,
}) => {
  const [ratings, setRatings] = React.useState(
    collection?.ratings_with_comment?.data || [],
  )
  const [loadingRatings, setLoadingRatings] = React.useState(true)
  const {type, slug} = collection

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
          return (
            <li
              key={`rating-${rating.id}`}
              className={`space-y-2 dark:border-trueGray-800 border rounded-md p-4 ${
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
                <div className="text-sm text-gray-500 dark:text-trueGray-400">
                  {friendlyTime(new Date(created_at))}
                </div>
              </div>
              <FiveStars rating={rating_out_of_5} />
              <div className="text-xs text-gray-500 dark:text-trueGray-500">
                {comment.prompt}
              </div>
              <div className="prose overflow-hidden">
                <Markdown>{comment.comment}</Markdown>
              </div>
              {displayAdminContent && (
                <button
                  className="dark:text-trueGray-900 rounded text-xs px-2 py-1 flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-150 ease-in-out"
                  onClick={() => {
                    rating.hidden = true
                    axios.post(comment.hide_url).then(() => {
                      setLoadingRatings(true)
                    })
                  }}
                >
                  hide
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default LearnerRatings
