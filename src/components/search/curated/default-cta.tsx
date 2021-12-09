import * as React from 'react'
import Image from 'next/image'
import ExternalTrackedLink from '../../external-tracked-link'

const DefaultCTA: React.FC<{location: string}> = ({location}) => {
  return (
    <ExternalTrackedLink
      eventName="clicked epic react banner"
      params={{location}}
      className="block md:col-span-4 w-full h-full overflow-hidden border-0 border-gray-100 relative text-center"
      href="https://epicreact.dev"
      target="_blank"
      rel="noopener"
    >
      <Image
        priority
        quality={100}
        width={417}
        height={463}
        alt="Get Really Good at React on EpicReact.dev by Kent C. Dodds"
        src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1626109728/epic-react/default-banners/banner-react-page_2x.jpg"
        // 25% off
        // src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1625226676/epic-react/summer-sale-2021/banner-react-page_2x.jpg"
      />
    </ExternalTrackedLink>
  )
}

export default DefaultCTA
