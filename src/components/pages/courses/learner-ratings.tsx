import {isEmpty} from 'lodash'
import axios from 'utils/configured-axios'
import * as React from 'react'
import {loadRatings} from 'lib/ratings'
import FiveStars from 'components/five-stars'

const LearnerRatings: React.FunctionComponent<{collection: any}> = ({
  collection,
}) => {
  const [ratings, setRatings] = React.useState([])
  const [loadingRatings, setLoadingRatings] = React.useState(true)

  React.useEffect(() => {
    loadRatings(collection.slug, collection.type).then((ratings: any) => {
      setLoadingRatings(false)
      setRatings(ratings)
    })
  }, [loadingRatings, collection])
  return isEmpty(ratings) ? null : (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-3">Learner Reviews</h2>
      <ul className="space-y-5">
        {ratings.map((rating: any) => {
          const {comment, rating_out_of_5, user} = rating

          const displayAdminContent =
            !rating.hidden &&
            (!isEmpty(comment.hide_url) || !isEmpty(comment.restore_url))
          return (
            <li
              key={`rating-${rating.id}`}
              className={`space-y-2 border p-4 ${rating.hidden && 'hidden'}`}
            >
              <div className="font-bold">{user.full_name}</div>
              <FiveStars rating={rating_out_of_5} />
              <div className="text-sm">{comment.prompt}</div>
              <div className="prose">{comment.comment}</div>
              {displayAdminContent && (
                <button
                  className="rounded text-xs px-2 py-1 flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-150 ease-in-out"
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
