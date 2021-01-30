import * as React from 'react'
import Image from 'next/image'
import ExternalTrackedLink from '../../external-tracked-link'

const DefaultCTA: React.FC<{location: string}> = ({location}) => {
  return (
    <ExternalTrackedLink
      eventName="clicked epic react banner"
      params={{location}}
      className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 relative text-center"
      href="https://epicreact.dev"
    >
      <Image
        priority
        quality={100}
        width={417}
        height={463}
        src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611336740/next.egghead.io/react/epic_react_link_banner.png"
        alt="epicreact.dev by Kent C. Dodds"
      />
    </ExternalTrackedLink>
  )
}

export default DefaultCTA
