import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const Talks: React.FC = ({allTalks}: any) => {
  return (
    <div className="mx-auto max-w-screen-lg lg:py-16 py-10">
      <h1 className="md:text-4xl text-2xl text-center font-bold pb-16">
        egghead Talks
      </h1>
      <div className="grid md:grid-cols-2 grid-cols-1 md:gap-16 gap-8">
        {allTalks.map((talk: any) => {
          return (
            <div key={talk.path} className="flex flex-col">
              {talk.image ? (
                <div className="md:mb-4 mb-2">
                  <Link href={talk.path}>
                    <a>
                      <Image
                        src={talk.image}
                        alt={talk.title}
                        width={1280}
                        height={720}
                        quality={100}
                        className="rounded-lg"
                      />
                    </a>
                  </Link>
                </div>
              ) : (
                <div className="aspect-w-16 aspect-h-9 md:mb-4 mb-2">
                  <Link href={talk.path}>
                    <a>
                      <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-600">
                        <IconPlaceholder />
                      </div>
                    </a>
                  </Link>
                </div>
              )}
              <Link href={talk.path}>
                <a>
                  <h2 className="md:text-2xl text-xl font-bold leading-tighter hover:text-blue-600 dark:hover:text-blue-300">
                    {talk.title}
                  </h2>
                </a>
              </Link>
              <h2 className="uppercase font-semibold text-xs mt-2 text-gray-700 dark:text-gray-300">
                {talk.instructor.name}
              </h2>
              {talk.summary && (
                <div className="prose sm:prose prose-sm dark:prose-dark mt-2 text-gray-700 dark:text-white">
                  {talk.summary}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Talks

const IconPlaceholder = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
        fill="currentColor"
      />
    </g>
  </svg>
)

const allTalksQuery = groq`
*[_type == 'resource' && type == "talk"]{
  title,
 path,
 byline,
 image,
 description,
 summary,
 'instructor': collaborators[]->[role == 'instructor'][0]{
   'name': person->.name
 },
}
`

export async function getStaticProps() {
  const allTalks = await sanityClient.fetch(allTalksQuery)

  return {
    props: {
      allTalks,
    },
  }
}
