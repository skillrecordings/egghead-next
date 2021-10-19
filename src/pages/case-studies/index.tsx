import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Link from 'next/link'
import Image from 'next/image'

const CaseStudies: React.FC = (allCaseStudies: any) => {
  return (
    <div className="mx-auto max-w-screen-xl lg:py-16 py-10">
      <h1 className="md:text-4xl text-2xl text-center font-bold pb-16">
        egghead Case Studies
      </h1>

      <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
        {allCaseStudies.allCaseStudies.map((caseStudy: any) => {
          const fullSlug = `/case-studies/${caseStudy.slug.current}`

          return (
            <div
              key={fullSlug}
              className="flex flex-col rounded-lg shadow-md overflow-hidden  bg-white dark:bg-gray-800 transition duration-500 ease-in-out hover:-translate-y-1"
            >
              <Link href={fullSlug}>
                <a className="">
                  {caseStudy.coverImage?.url && (
                    <div className="flex-shrink-0">
                      <Image
                        src={caseStudy.coverImage.url}
                        alt={caseStudy.coverImage.alt || caseStudy.title}
                        width={100}
                        height={100}
                        quality={100}
                        layout="responsive"
                        className="h-88 w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      {caseStudy.title && (
                        <h2 className="text-xl font-bold leading-tighter hover:text-blue-600 dark:hover:text-blue-300">
                          {caseStudy.title}
                        </h2>
                      )}

                      {caseStudy.description && (
                        <div className="opacity-70 text-sm leading-snug pt-4">
                          {caseStudy.description}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CaseStudies

const allCaseStudiesQuery = groq`
*[_type == "caseStudy" && publishedAt < now()]|order(publishedAt desc) {
  title,
  slug,
  coverImage,
  description,
  publishedAt,
}
`

export async function getStaticProps() {
  const allCaseStudies = await sanityClient.fetch(allCaseStudiesQuery)

  return {
    props: {
      allCaseStudies,
    },
  }
}
