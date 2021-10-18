import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import Link from 'next/link'
import Image from 'next/image'

const CaseStudies: React.FC = (allCaseStudies: any) => {
  return (
    <div className="mx-auto max-w-screen-lg lg:py-16 py-10">
      <h1 className="md:text-4xl text-2xl text-center font-bold pb-16">
        Case Studies
      </h1>

      {allCaseStudies.allCaseStudies.map((caseStudy: any) => {
        const fullSlug = `/case-studies/${caseStudy.slug.current}`
        return (
          <div key={fullSlug} className="flex flex-col">
            {caseStudy.coverImage?.url ? (
              <div className="md:mb-4 mb-2">
                <Link href={fullSlug}>
                  <a>
                    <Image
                      src={caseStudy.coverImage.url}
                      alt={caseStudy.coverImage.alt || caseStudy.title}
                      width={320}
                      height={320}
                      quality={100}
                      className="rounded-lg"
                    />
                  </a>
                </Link>
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9 md:mb-4 mb-2">lol</div>
            )}

            <Link href={fullSlug}>
              <a>
                <h2 className="md:text-2xl text-xl font-bold leading-tighter">
                  {caseStudy.title}
                </h2>
              </a>
            </Link>

            {caseStudy.description && (
              <div className="opacity-70 text-sm leading-snug  pl-2">
                {caseStudy.description}
              </div>
            )}
          </div>
        )
      })}
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
