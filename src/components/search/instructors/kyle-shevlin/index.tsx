import CtaCard from '@/components/search/components/cta-card'
import {CardResource} from '@/types'
import SearchInstructorEssential from '../instructor-essential'
import {VerticalResourceCard} from '@/components/card/verticle-resource-card'

const SearchKyleShevlin = ({instructor}: {instructor: any}) => {
  instructor = {...instructor, ...curatedInstructorData}
  const {courses} = instructor

  if (!courses) {
    return (
      <div className="max-w-screen-xl mx-auto">
        <SearchInstructorEssential instructor={instructor} />
      </div>
    )
  }

  const [primaryCourse, ...restCourses] = courses.resources

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          <CtaCard
            resource={primaryCourse}
            textLight
            trackTitle="clicked instructor landing page CTA resource"
            location="Kyle Shevlin instructor page"
          />
        }
      />

      <section className="xl:px-0 px-5">
        <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
          Get Good at JavaScript
        </h2>
        <div className="flex sm:flex-nowrap flex-wrap gap-4 mt-4">
          {restCourses.map((course: CardResource) => {
            return (
              <VerticalResourceCard
                className="mt-0 sm:w-1/2 w-full flex flex-col items-center justify-center text-center sm:py-8 py-6"
                resource={course}
                describe
                location="Kyle Shevlin instructor Landing page"
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}
export default SearchKyleShevlin

const curatedInstructorData = {
  courses: {
    resources: [
      {
        background:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1629303449/egghead-next-pages/manage-complex-tic-tac-toe-game-state-in-react/feature-card-background--react-tic-tac-toe.png',
        byline: 'Kyle Shevlin • Course • 24m',
        description:
          'Learn how to build a grid with CSS Grid and manage complex state with useReducer while building a Tic Tac Toe Game.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/384/937/full/react_tictactoe_424_2x.png',
        instructor: {
          name: 'Kyle Shevlin',
        },
        path: '/courses/manage-complex-tic-tac-toe-game-state-in-react-dddda3f8',
        title: 'Manage Complex Tic Tac Toe Game State in React',
      },
      {
        background: null,
        byline: 'Kyle Shevlin • Course • 49m',
        description:
          'Learn how to implement data structures, sorting algorithms, and the trade-offs between what algorithms to choose.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/446/full/EGH_JSAlgorithms_Final.png',
        instructor: {
          name: 'Kyle Shevlin',
        },
        path: '/courses/data-structures-and-algorithms-in-javascript',
        title: 'Data Structures and Algorithms in JavaScript',
      },
      {
        background: null,
        byline: 'Kyle Shevlin • Course • 58m',
        description:
          'Managing state is one of the primary reasons our applications become so complex. See how to simplify state with state machines.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/472/full/IntroxState_1000.png',
        instructor: {
          name: 'Kyle Shevlin',
        },
        path: '/courses/introduction-to-state-machines-using-xstate',
        title: 'Introduction to State Machines Using XState',
      },
      {
        background: null,
        byline: 'Kyle Shevlin • Course • 30m',
        description:
          'Functional Programming can be overwhelming to learn with all the new jargon and concepts. Learn this style without all the headaches.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/473/full/Functional_Programming.png',
        instructor: {
          name: 'Kyle Shevlin',
        },
        path: '/courses/just-enough-functional-programming-in-javascript',
        title: 'Just Enough Functional Programming in JavaScript',
      },
    ],
  },
  title: 'Kyle Shevlin Landing Page',
} as Record<string, any>
