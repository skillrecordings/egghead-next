import * as React from 'react'

import Hero from './components/hero'
import TechIcons from './components/tech-icons'

const NewHome: React.FunctionComponent = () => {
  return (
    <div className="pt-4 md:pt-8 lg:pt-16">
      <Hero />
      <section className="mt-16 md:mt-28">
        <TechIcons />
      </section>
    </div>
  )
}
export default NewHome
