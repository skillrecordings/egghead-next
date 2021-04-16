import React, {FunctionComponent} from 'react'
import {CardResource} from 'components/pages/home/card'
import Jumbotron from 'components/pages/home/jumbotron'
import CardHorizontal from 'components/pages/home/card/card-horizontal'

type WhatsNewProps = {
  jumbotron: CardResource
  featuredResources: any
}

const WhatsNew: FunctionComponent<WhatsNewProps> = ({
  jumbotron,
  featuredResources,
}) => {
  return (
    <section className="mt-16">
      <h2 className="md:text-xl text-lg sm:font-semibold font-bold mb-3">
        What's New
      </h2>
      <Jumbotron resource={jumbotron} />
      <div className="grid grid-cols-12 grid-rows-2 gap-4">
        <CardHorizontal
          className="h-auto row-span-2 w-full col-span-7"
          resource={featuredResources[0]}
        />
        <CardHorizontal
          className="w-full h-auto col-span-5"
          resource={featuredResources[1]}
        />
        <CardHorizontal
          className="w-full row-span-1 col-span-5"
          resource={featuredResources[0]}
        />
        <CardHorizontal
          className="w-full row-span-1 col-span-6"
          resource={featuredResources[1]}
        />
        <CardHorizontal
          className="w-full row-span-1 col-span-6"
          resource={featuredResources[1]}
        />
      </div>
    </section>
  )
}

export default WhatsNew
