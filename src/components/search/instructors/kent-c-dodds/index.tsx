import groq from 'groq'
import Image from 'next/legacy/image'
import {get} from 'lodash'
import ExternalTrackedLink from '@/components/external-tracked-link'

import SearchInstructorEssential from '../instructor-essential'
import CtaCard from '@/components/search/components/cta-card'
import {VerticalResourceCard} from '@/components/card/verticle-resource-card'

const SearchKentCDodds = ({instructor}: any) => {
  const {
    collection,
    courses,
    podcast,
    products,
    caseStudy,
    epicReactCaseStudy,
  } = instructor

  const courseResources = courses?.resources ?? []
  const collectionResources = collection?.resources ?? []
  const testingJavascriptProduct = products?.testingJavascript
  const epicReactProduct = products?.epicReact
  const [primaryCourse] = courseResources

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          primaryCourse ? (
            <CtaCard
              resource={primaryCourse}
              trackTitle="clicked instructor landing page CTA resource"
              location="Kent C. Dodds instructor page"
            />
          ) : undefined
        }
      />
      <section className="mt-4 mb-10 flex sm:flex-nowrap flex-wrap flex-shrink justify-between gap-4 xl:px-0 px-5">
        {testingJavascriptProduct ? (
          <ExternalTrackedLink
            eventName="clicked testing javascript banner"
            location="Kent C. Dodds instructor page"
            href={get(testingJavascriptProduct, 'url')}
          >
            <Image
              quality={100}
              src={get(testingJavascriptProduct, 'image')}
              width={620}
              height={350}
              layout="intrinsic"
              alt={get(
                testingJavascriptProduct,
                'alt',
                `illustration for testingJavascript`,
              )}
            />
          </ExternalTrackedLink>
        ) : null}
        {epicReactProduct ? (
          <ExternalTrackedLink
            eventName="clicked epic react banner"
            location="Kent C. Dodds instructor page"
            href={get(epicReactProduct, 'url')}
          >
            <Image
              quality={100}
              src={get(epicReactProduct, 'image')}
              width={620}
              height={350}
              alt={get(epicReactProduct, 'alt', `illustration for epicreact`)}
            />
          </ExternalTrackedLink>
        ) : null}
      </section>

      <section className="xl:px-0 px-5">
        <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
          {collection?.title ?? 'Featured Collection'}
        </h2>
        <p className="max-w-md">{collection?.description ?? ''}</p>
        <div className="flex sm:flex-nowrap flex-wrap gap-4 my-12">
          {collectionResources.map((resource: any) => {
            return (
              <VerticalResourceCard
                resource={resource}
                className="sm:w-1/2 border-none flex flex-col items-center justify-center text-center sm:py-8 py-6"
                location="Kent C. Dodds instructor Landing page"
              />
            )
          })}
        </div>
      </section>

      <section className="xl:px-0 px-5">
        <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
          More From Kent
        </h2>
        <div className="flex sm:flex-nowrap flex-wrap gap-4 mt-4">
          {podcast ? (
            <VerticalResourceCard
              className="mt-0 sm:w-1/2 w-full flex flex-col items-center justify-center text-center sm:py-8 py-6"
              resource={podcast}
              describe
              location="Kent C. Dodds instructor Landing page"
            />
          ) : null}
          {epicReactCaseStudy ? (
            <VerticalResourceCard
              resource={epicReactCaseStudy}
              className="sm:w-1/2 w-full border-none flex flex-col items-center justify-center text-center sm:py-8 py-6"
              location="Kent C. Dodds instructor Landing page"
            />
          ) : null}
          {caseStudy ? (
            <VerticalResourceCard
              className="sm:w-1/2 w-full border-none flex flex-col items-center justify-center text-center sm:py-8 py-6"
              resource={caseStudy}
              describe
              location="Kent C. Dodds instructor Landing page"
            />
          ) : null}
        </div>
      </section>
    </div>
  )
}
export default SearchKentCDodds

export const kentCDoddsQuery = groq`
*[_type == 'resource' && slug.current == 'kent-c-dodds-landing-page'][0]{
  title,
  'courses': resources[slug.current == 'instructor-landing-page-featured-courses'][0]{
    resources[]->{
       title,
       'description': summary,
       path,
       byline,
       image,
       'background': images[label == 'feature-card-background'][0].url,
       'instructor': collaborators[@->.role == 'instructor'][0]->{
         'name': person->.name
       },
     }
    },
   'products': resources[slug.current == 'instructor-landing-page-featured-products'][0]{
     'epicReact': resources[slug.current == 'epicreact'][0]{
       url,
       image,
     },
     'testingJavascript': resources[slug.current == 'testingjavascript'][0]{
       url,
       image,
     }
   },
   'collection': resources[slug.current == 'instructor-landing-page-featured-collection'][0]{
     title,
     description,
     resources[]{
       title,
       select(_type == 'reference') =>
          @->{
           title,
           description,
           path,
           byline,
           image,
           'background': images[label == 'feature-card-background'][0].url,
           'instructor': collaborators[@->.role == 'instructor'][0]->{
             'name': person->.name
           }
         },
 
       _type == 'resource' => {
         title,
         image,
         byline,
         "path": url,
       }
     }
   },
   'podcast': resources[slug.current == 'instructor-landing-page-featured-podcast'][0]{
     title,
     'path': url,
     byline,
     description,
     image,
   },
   'epicReactCaseStudy': resources[slug.current == 'epic-react-case-study'][0]{
    title,
    'path': url,
    byline,
    description,
    image,
  },
   'caseStudy': resources[slug.current == 'instructor-landing-page-egghead-case-study'][0]{
    title,
    'path': url,
    byline,
    description,
    image,
  },
 }
`
