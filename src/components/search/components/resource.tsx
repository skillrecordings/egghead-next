import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import Image from 'next/legacy/image'

type ResourceProps = {
  title: string
  path: string
  imageUrl: string
}

const Resource: FunctionComponent<React.PropsWithChildren<ResourceProps>> = ({
  title,
  path,
  imageUrl,
}) => {
  return (
    <li>
      <Link
        href={path}
        className="flex items-center font-semibold py-2 hover:underline cursor-pointer leading-tight"
      >
        <div className="flex-shrink-0 flex items-center">
          <Image src={imageUrl} width={24} height={24} alt={title} />
        </div>
        <span className="ml-2">{title}</span>
      </Link>
    </li>
  )
}

export default Resource
