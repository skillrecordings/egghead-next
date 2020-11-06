import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import Image from 'next/image'

type ResourceProps = {
  title: string
  path: string
  imageUrl: string
}

const Resource: FunctionComponent<ResourceProps> = ({
  title,
  path,
  imageUrl,
}) => {
  return (
    <li>
      <Link href={path}>
        <a className="flex items-center font-semibold py-2 hover:underline cursor-pointer leading-tight">
          <div className="flex-shrink-0 flex items-center">
            <Image src={imageUrl} width={24} height={24} alt={title} />
          </div>
          <span className="ml-2">{title}</span>
        </a>
      </Link>
    </li>
  )
}

export default Resource
