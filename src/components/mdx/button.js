import React from 'react'
import Link from 'next/link'

const Button = ({children, href}) => {
  return (
    <Link href={href}>
      <p className="bg-amber-400 py-2 font-bold text-white px-4 rounded inline-block text-center ">
        {children}
      </p>
    </Link>
  )
}

export default Button
