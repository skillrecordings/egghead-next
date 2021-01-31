import DanAbramovPageData from './dan-abramov-page-data'
import {find} from 'lodash'
import Card from 'components/pages/home/card'
import Instructor from 'components/search/components/instructor'
import Image from 'next/image'
import ExternalTrackedLink from '../../../../external-tracked-link'

export default function SearchDanAbramov() {
  const beginner: any = find(DanAbramovPageData, {id: 'beginner'})

  const location = 'Dan Abramov Instructor Page'
  return (
    <div className="mb-10 pb-10 xl:px-0 px-5 max-w-screen-xl mx-auto dark:bg-gray-900">
      <div className="md:grid md:grid-cols-12 grid-cols-1 gap-5 items-start space-y-5 md:space-y-0">
        <Instructor
          className="col-span-8"
          company="React Core Team"
          name="Dan Abramov"
          imageUrl="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1612049839/egghead-next-pages/instructors/dan-abramov-hero-image.png"
          twitterURL="https://twitter.com/dan_abramov"
          websiteURL="https://github.com/gaearon"
        >
          {`
In 2015, Abramov started working in London for Facebook as part of the React Core team to develop Facebook’s open-source user interface (UI) tool, React.js. 

He started using React for front-end development when he was working with a U.S-based startup, Stampsy in 2014. While he was working at Facebook, Abramov also developed Redux with Andrew Clark a JavaScript library used to manage application state. 
`}
        </Instructor>
        <ExternalTrackedLink
          eventName="clicked testing javascript banner"
          params={{location}}
          className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 bg-white relative text-center shadow-sm"
          href="https://justjavascript.com"
        >
          <Image
            priority
            quality={100}
            width={417}
            height={463}
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1612050169/egghead-next-pages/instructors/just-javascript-hero-image.png"
            alt="Just JavaScript"
          />
        </ExternalTrackedLink>
      </div>

      <div className="grid lg:grid-cols-12 grid-cols-1 gap-5 mt-8">
        {beginner.resources.map((resource: any) => {
          return (
            <Card
              className="col-span-6 text-center"
              key={resource.path}
              resource={resource}
              location={location}
            />
          )
        })}
      </div>
    </div>
  )
}
