import Link from 'next/link'
import Markdown from '@/components/markdown'
import {track} from '@/utils/analytics'
import SearchInstructorEssential from '../instructor-essential'
import {CardResource} from '@/types'
import CtaCard from '@/components/search/components/cta-card'
import {VerticalResourceCard} from '@/components/card/new-vertical-resource-card'
import ExternalTrackedLink from '@/components/external-tracked-link'
import Image from 'next/legacy/image'
import {bpMinMD} from '@/utils/breakpoints'
import {get} from 'lodash'
import Grid from '@/components/grid'
import {HorizontalResourceCard} from '@/components/card/new-horizontal-resource-card'

export default function SearchMatiasHernandez({
  instructor,
}: {
  instructor: any
  props: any
}) {
  instructor = {...instructor, ...curatedInstructorData}
  const combinedInstructor = {...instructor}

  const {courses, articles} = instructor
  const [primaryCourse, ...restCourses] = courses.resources

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={combinedInstructor}
        CTAComponent={
          <FeaturedPrimaryCourse
            resource={primaryCourse}
            location="Matias Hernandez instructor page"
          />
        }
      />

      <section className="xl:px-0 px-5 mt-8">
        <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
          Courses
        </h2>
        <div className="flex sm:flex-nowrap flex-wrap justify-center gap-4 mt-4">
          {restCourses.map((course: CardResource) => {
            return (
              <VerticalResourceCard
                className=" dark:bg-gray-800 bg-white dark:bg-opacity-60 shadow-smooth dark:hover:bg-gray-700 dark:hover:bg-opacity-50 rounded w-4/5 sm:w-1/3"
                resource={course}
                location="Matias Hernandez instructor Landing page"
              />
            )
          })}
        </div>
      </section>

      <section className="xl:px-0 px-5">
        <h2 className="text-xl sm:font-semibold font-bold mb-3 mt-4 dark:text-white">
          Articles
        </h2>
        <Grid>
          {articles.resources.map((resource: CardResource, i: number) => {
            switch (articles.resources.length) {
              case 3:
                return i === 0 ? (
                  <HorizontalResourceCard
                    className="col-span-2"
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                ) : (
                  <VerticalResourceCard
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                )
              case 6:
                return i === 0 || i === 1 ? (
                  <HorizontalResourceCard
                    className="col-span-2"
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                ) : (
                  <VerticalResourceCard
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                )
              case 7:
                return i === 0 ? (
                  <HorizontalResourceCard
                    className="col-span-2"
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                ) : (
                  <VerticalResourceCard
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                )
              default:
                return (
                  <VerticalResourceCard
                    key={resource.id}
                    resource={resource}
                    location="Matias Hernandez instructor page"
                  />
                )
            }
          })}
        </Grid>
      </section>
    </div>
  )
}

const curatedInstructorData = {
  articles: {
    resources: [
      {
        byline: null,
        collaborators: {
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/176/medium/profile.png',
          name: 'Matías Hernández',
        },
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1681326663/articles/DALL_E_2023-01-26_23.webp',
        path: '/blog/an-introduction-to-typescript-generics',
        summary: null,
        title: 'An Introduction to TypeScript Generics',
      },
      {
        byline: null,
        collaborators: {
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/176/medium/profile.png',
          name: 'Matías Hernández',
        },
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1681327032/articles/cover.webp',
        path: '/blog/typescript-s-powerful-type-inference-with-conditional-types-and-string-literals',
        summary: null,
        title:
          "TypeScript's Powerful Type Inference with Conditional Types and String Literals",
      },
      {
        byline: null,
        collaborators: {
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/176/medium/profile.png',
          name: 'Matías Hernández',
        },
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1681327157/articles/DALL_E_2022-12-08_14.webp',
        path: '/blog/learn-the-key-concepts-of-typescript-s-powerful-generic-and-mapped-types',
        summary: null,
        title:
          'Learn the Key Concepts of TypeScript’s Powerful Generic and Mapped Types',
      },
      {
        byline: null,
        collaborators: {
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/176/medium/profile.png',
          name: 'Matías Hernández',
        },
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1681327334/articles/DALL_E_2023-02-28_16.webp',
        path: '/blog/3-effective-type-narrowing-techniques-in-typescript',
        summary: null,
        title: '3 Effective Type Narrowing Techniques in TypeScript',
      },
    ],
  },
  courses: {
    resources: [
      {
        byline: 'Matías Hernández • Course • 1h 05m',
        description:
          'Learn how to write, test, communicate, and interact with a smart contract using Solidity and SvelteKit.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/611/059/full/egh_svelte-eth_2000-new.png',
        instructor: {
          name: 'Matías Hernández',
        },
        path: '/courses/full-stack-web3-and-blockchain-development-on-ethereum-with-sveltekit-f522ceec',
        title:
          'Full Stack Web3 and Blockchain Development on Ethereum with SvelteKit',
      },
      {
        byline: 'Matías Hernández・27m・Course',
        description:
          'Learn how to build complex components using different design patterns implemented with the React Hooks API.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/404/918/full/React1_Lv1_Base_424_2x.png',
        instructor: {
          name: 'Matías Hernández',
        },
        path: '/courses/build-advanced-component-with-react-hooks-cd6a',
        title: 'Build Advanced Components with React Hooks',
      },
      {
        byline: ' Matías Hernández • 11m • Course',
        description:
          'En este curso aprender diferentes métodos para resolver problemas que encontrarás en tu día a día como desarrollador web.\n',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/383/584/full/JS_Lv1_Base_424_2x.png',
        instructor: {
          name: 'Matías Hernández',
        },
        path: '/courses/manipulacion-de-arreglos-con-javascript-12bd',
        title: 'Manipulación Eficiente de Arreglos con Javascript',
      },
      {
        byline: ' Matías Hernández • 3m • Course',
        description:
          'Javascript offers multiple ways to create solutions for different manipulations and transformations needed to work with arrays. ',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/424/829/full/JS_Lv1_Base_424_2x.png',
        instructor: {
          name: 'Matías Hernández',
        },
        path: '/courses/efficient-javascript-array-manipulation-da4e',
        title: 'Efficient JavaScript Array Manipulation',
      },
    ],
  },
} as Record<string, any>

const FeaturedPrimaryCourse: React.FC<
  React.PropsWithChildren<{location: string; resource: any}>
> = ({location, resource}) => {
  const {path, title, byline, description, image, background} = resource
  return (
    <ExternalTrackedLink
      eventName="clicked Matiaz Hernandez instructor page CTA"
      params={{location}}
      className="block md:col-span-4 rounded-md w-full h-full overflow-hidden dark:bg-gray-800 border-0 bg-white border-gray-100 shadow-sm relative text-center"
      href={path}
    >
      <div className="md:min-h-[477px] md:-mt-5 flex items-center justify-center text-white overflow-hidden ">
        <div className="absolute top-0 left-0 bg-gradient-to-r from-indigo-500 to-pink-900 w-full h-2 z-20" />
        <div className="relative z-10 px-5 sm:py-16 py-10 sm:text-left text-center">
          <div className="space-y-5 mx-auto flex items-center justify-center max-w-screen-xl">
            <div className="flex flex-col items-center justify-center sm:space-x-5 sm:space-y-0 space-y-5 gap-10">
              <div className="flex-shrink-0">
                <Link
                  href={path}
                  tabIndex={-1}
                  onClick={() =>
                    track('clicked jumbotron resource', {
                      resource: path,
                      linkType: 'image',
                    })
                  }
                >
                  <Image
                    quality={100}
                    src={get(image, 'src', image)}
                    width={250}
                    height={250}
                    alt={get(image, 'alt', `illustration for ${title}`)}
                  />
                </Link>
              </div>
              <div className="flex flex-col sm:items-start items-center">
                <p className="text-xs text-gray-900 dark:text-white  uppercase font-semibold mb-2">
                  {byline}
                </p>
                <Link
                  href={path}
                  className="text-xl font-extrabold leading-tighter text-gray-900 dark:text-white hover:text-cyan-400"
                  onClick={() =>
                    track('clicked jumbotron resource', {
                      resource: path,
                      linkType: 'text',
                    })
                  }
                >
                  <h2>{title}</h2>
                </Link>
                <p className="mt-4 text-gray-900 dark:text-white">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <img
          className="absolute top-0 left-0 z-0 w-full"
          src={background}
          alt=""
        />
      </div>
    </ExternalTrackedLink>
  )
}
