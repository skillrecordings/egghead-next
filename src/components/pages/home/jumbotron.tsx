import * as React from 'react'
import {ResourceLink} from 'components/card/new-vertical-resource-card'
import Image from 'next/image'
import PlayIcon from 'components/pages/courses/play-icon'

const Jumbotron: React.FC<React.PropsWithChildren<any>> = ({data}) => {
  const resource = data.resources[0]
  return (
    <div>
      <ResourceLink
        location="jumbotron"
        path={resource.path}
        resource_type={resource.name}
        instructor={resource.instructor.name}
        className="group"
        tag={resource.tag?.name}
      >
        <header className="md:aspect-w-16 md:aspect-h-6 relative h-full rounded-b-lg text-white ">
          <div className="flex items-center justify-center relative z-10 md:pb-16 pb-32 md:px-0 px-5 md:pt-0 pt-10">
            <div className="w-full lg:max-w-screen-lg md:max-w-screen-sm flex md:flex-row flex-col items-center justify-center md:text-left text-center md:pt-8 md:px-5 xl:px-0">
              <div
                aria-hidden
                className="flex-shrink-0 relative flex items-center justify-center p-5 w-[240px] lg:w-[300px] xl:w-[360px]"
              >
                <Image
                  src={resource.image}
                  alt={resource.title}
                  width={360}
                  height={360}
                  quality={100}
                  loading="eager"
                  priority
                  className="group-hover:scale-95 group-hover:opacity-90 transition-all ease-in-out duration-300"
                />
                <div
                  aria-hidden
                  className="absolute flex items-center justify-center group-hover:opacity-100 opacity-0 group-hover:scale-100 scale-0 transition-all ease-in-out duration-300 w-10 h-10 rounded-full bg-white bg-opacity-80 shadow-smooth"
                >
                  <PlayIcon className="w-4 text-black" />
                </div>
              </div>
              <div>
                <p className="uppercase font-mono text-xs pb-1 opacity-80">
                  Fresh Course
                </p>
                <h1 className="md:pt-0 pt-2 leading-tighter lg:text-3xl sm:text-2xl md:text-xl text-xl tracking-tight font-bold">
                  {resource.title}
                </h1>
                <div className="flex items-center md:justify-start justify-center py-4">
                  <div className="flex items-center justify-center rounded-full overflow-hidden">
                    <Image
                      aria-hidden
                      alt={resource.instructor.name}
                      src={resource.instructor.image}
                      width={32}
                      height={32}
                    />
                  </div>
                  <p className="pl-2 text-sm opacity-80 leading-none">
                    <span className="sr-only">{resource.type} by </span>
                    {resource.instructor.name}
                  </p>
                </div>
                <p className="opacity-80 text-sm">{resource.description}</p>
              </div>
            </div>
          </div>
          <Image
            aria-hidden
            alt=""
            src={data.image}
            layout="fill"
            priority={true}
            quality={100}
            className="pointer-events-none object-cover"
          />
        </header>
      </ResourceLink>
    </div>
  )
}

export default Jumbotron
