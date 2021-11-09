import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Link from 'next/link'
import Image from 'next/image'

const CaseStudies: React.FC = (allCaseStudies: any) => {
  return (
    <div className="container py-10 lg:py-16">
      <h1 className="pb-16 text-2xl font-bold text-center md:text-4xl">
        egghead Case Studies
      </h1>

      <div className="grid max-w-lg gap-5 mx-auto mt-12 lg:grid-cols-3 lg:max-w-none">
        {allCaseStudies.allCaseStudies.map((caseStudy: any) => {
          const fullSlug = `/case-studies/${caseStudy.slug.current}`

          return (
            <div
              key={fullSlug}
              className="flex flex-col overflow-hidden transition duration-500 ease-in-out bg-white rounded-lg shadow-md dark:bg-gray-800 hover:-translate-y-1"
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
                        className="object-cover w-full h-88"
                      />
                    </div>
                  )}

                  <div className="flex flex-col justify-between flex-1 p-6">
                    <div className="flex-1">
                      {caseStudy.title && (
                        <h2 className="text-xl font-bold leading-tighter hover:text-blue-600 dark:hover:text-blue-300">
                          {caseStudy.title}
                        </h2>
                      )}

                      {caseStudy.description && (
                        <div className="pt-4 text-sm leading-snug opacity-70">
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
