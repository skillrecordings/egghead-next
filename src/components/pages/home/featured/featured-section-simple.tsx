import React, {FunctionComponent} from 'react'

type FeaturedSectionSimpleProps = {
  title: string
  children: any
}

const FeaturedSectionSimple: FunctionComponent<FeaturedSectionSimpleProps> = ({
  title,
  children,
}) => {
  return (
    <section className="mt-32">
      <div className="flex justify-between align-text-top">
        <h2 className="md:text-xl text-lg sm:font-semibold font-bold mb-3 dark:text-white">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

export default FeaturedSectionSimple
