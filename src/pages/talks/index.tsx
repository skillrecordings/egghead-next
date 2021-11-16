import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const Talks: React.FC = ({allTalks}: any) => {
  return (
    <div className="container">
      <div className="max-w-screen-lg py-10 mx-auto lg:py-16">
        <h1 className="pb-16 text-2xl font-bold text-center md:text-4xl">
          egghead Talks
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
          {allTalks.map((talk: any) => {
            return (
              <div key={talk.path} className="flex flex-col">
                {talk.image ? (
                  <div className="mb-2 md:mb-4">
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
                  <div className="mb-2 aspect-w-16 aspect-h-9 md:mb-4">
                    <Link href={talk.path}>
                      <a>
                        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full text-gray-400 bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-gray-600">
                          <IconPlaceholder />
                        </div>
                      </a>
                    </Link>
                  </div>
                )}
                <Link href={talk.path}>
                  <a>
                    <h2 className="text-xl font-bold md:text-2xl leading-tighter hover:text-blue-600 dark:hover:text-blue-300">
                      {talk.title}
                    </h2>
                  </a>
                </Link>
                <h2 className="mt-2 text-xs font-semibold text-gray-700 uppercase dark:text-gray-300">
                  {talk.instructor.name}
                </h2>
                {talk.summary && (
                  <div className="mt-2 prose-sm prose text-gray-700 sm:prose dark:prose-dark dark:text-white">
                    {talk.summary}
                  </div>
                )}
              </div>
            )
          })}
        </div>
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
