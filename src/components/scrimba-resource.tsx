import * as React from 'react'
import scrimbaLogo from './icons/scrimba-logo.png'
import Image from 'next/image'

const ScrimbaResource: React.FunctionComponent<{type?: string}> = ({
  type = 'lesson',
}) => {
  return (
    <>
      <div className="flex items-center">
        <div className="w-10 h-10 mr-4 rounded-full flex-shrink-0">
          <Image
            className="w-full h-full rounded-full"
            src={scrimbaLogo}
            alt="Scrimba Resource Icon"
          />
        </div>
        <h4 className="text-xl font-semibold flex-grow">
          Scrimba Course Resource
        </h4>
      </div>

      <p className="prose dark:prose-dark w-full mt-4">
        This is a Scrimba Course Resource. It will bring extra interactivity to
        the course. This is also a free resource.
      </p>
    </>
  )
}

export default ScrimbaResource
