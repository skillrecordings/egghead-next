import groq from 'groq'
import * as React from 'react'
import SearchInstructorEssential from '../instructor-essential'
import CtaCard from 'components/search/components/cta-card'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'
import {VerticalResourceCollectionCard} from 'components/card/vertical-resource-collection-card'

export default function SearchChrisBiscardi({instructor}: {instructor: any}) {
  const {courses, jamstackCollection, databaseCollection} = instructor
  const [primaryCourse, secondCourse, thirdCourse] = courses.resources
  const location = 'Chris Biscardi instructor page'

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="py-4">
        <SearchInstructorEssential
          instructor={instructor}
          CTAComponent={
            <CtaCard
              resource={primaryCourse}
              trackTitle="clicked instructor landing page CTA resource"
              location="Chris Biscardi instructor page"
              textLight
            />
          }
        />
        <section className="flex md:flex-row flex-col max-w-screen-xl mx-auto gap-4 px-4 md:px-0 ">
          <HorizontalResourceCard
            resource={secondCourse}
            location={location}
            className="md:w-1/2"
          />
          <HorizontalResourceCard
            resource={thirdCourse}
            location={location}
            className="md:w-1/2"
          />
        </section>

        <section className="flex md:flex-row flex-col max-w-screen-xl mx-auto gap-4 px-4 md:px-0 my-4">
          <div className="flex flex-row sm:flex-nowrap flex-wrap gap-4">
            <VerticalResourceCollectionCard
              resource={jamstackCollection}
              className="w-1/2"
              titleColor="purple-500"
            />
            <VerticalResourceCollectionCard
              resource={databaseCollection}
              className="w-1/2"
              titleColor="orange-500"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export const ChrisBiscardiQuery = groq`
*[_type == 'resource' && slug.current == 'chris-biscardi-landing-page'][0]{
  title,
  'courses': resources[slug.current == 'instructor-landing-page-featured-courses'][0]{
    resources[]->{
      title,
      'description': summary,
      path,
      byline,
      image,
      'background': images[label == 'feature-card-background'][0].url,
      'instructor': collaborators[]->[role == 'instructor'][0]{
        'name': person->.name
      },
    }
  },
  'jamstackCollection': resources[slug.current == 'instructor-landing-page-jamstack-featured-collection'][0]{
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
          'instructor': collaborators[]->[role == 'instructor'][0]{
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
  'databaseCollection': resources[slug.current == 'instructor-landing-page-database-featured-collection'][0]{
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
          'instructor': collaborators[]->[role == 'instructor'][0]{
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
}  
`
