import React, {FunctionComponent} from 'react'
import {CardResource} from 'components/pages/home/card'
import Jumbotron from 'components/pages/home/jumbotron'
import Markdown from 'react-markdown'
import Link from 'next/link'
import Image from 'next/image'
import {get} from 'lodash'
import {bpMinMD} from 'utils/breakpoints'
import {track} from 'utils/analytics'

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
      <div className="grid grid-cols-12 grid-rows-3 gap-4">
        <div className="bg-gray-200 w-full h-auto row-span-2 col-span-7" />
        {/* <CardHorizontal resource={featuredResources[0]} /> */}
        <div className="bg-gray-200 w-full h-auto row-span-2 col-span-5" />
        <div className="bg-gray-200 w-full h-40 row-span-1 col-span-4" />
        <div className="bg-gray-200 w-full h-40 row-span-1 col-span-4" />
        <div className="bg-gray-200 w-full h-40 row-span-1 col-span-4" />
      </div>
    </section>
  )
}

export default WhatsNew
