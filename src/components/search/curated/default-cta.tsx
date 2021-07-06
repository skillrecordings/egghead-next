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
      target="_blank"
      rel="noopener"
    >
      <Image
        priority
        quality={100}
        width={417}
        height={463}
        className="rounded-lg"
        alt="Get Really Good at React on EpicReact.dev by Kent C. Dodds"
        // default
        // src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611336740/next.egghead.io/react/epic_react_link_banner.png"
        // 25% off
        src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1625226676/epic-react/summer-sale-2021/banner-react-page_2x.jpg"
      />
    </ExternalTrackedLink>
  )
}

export default DefaultCTA
