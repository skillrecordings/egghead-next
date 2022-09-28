import CourseGrid from 'components/pages/20-days-of-egghead/course-grid'
import {sanityClient} from 'utils/sanity-client'
import {CardResource} from 'types'
import groq from 'groq'

const saleOn = process.env.NEXT_PUBLIC_FLASH_SALE

export type HolidaySaleProps = {
  data: CardResource
}

async function loadHolidayCourses() {
  const data = await sanityClient.fetch(
    groq`
            *[slug.current == $slug][0]{
              title,
              resources[]->{
                'id': _id,
                title,
                'slug': slug.current,
                image,
                path,
                'instructor': collaborators[]->[role == 'instructor'][0]{
                  title,
                  'slug': person->slug.current,
                  'name': person->name,
                  'path': person->website,
                  'twitter': person->twitter,
                  'image': person->image.url
                },
              }
            }
          `,
    {slug: '20-days-of-egghead'},
  )

  return data
}

export {saleOn, loadHolidayCourses, CourseGrid}
