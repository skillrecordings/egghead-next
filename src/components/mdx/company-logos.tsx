import * as React from 'react'
import Image from 'next/image'

const companies = [
  'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683158310/assets/apple.png',
  'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683158310/assets/sony.png',
  'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683158310/assets/facebook.png',
  'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683158310/assets/goldman-sachs.png',
  'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683158310/assets/epic-games.png',
  'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683158310/assets/windows.png',
]

const CompanyList = () => {
  return (
    <div className="flex items-center space-x-4 px-4 justify-center">
      {companies.map((company, index) => (
        <div key={index} className="w-[100px] h-[100px]">
          <Image
            src={company}
            alt="Company Logo"
            className="h-10 px-4 "
            width={70}
            height={70}
          />
        </div>
      ))}
    </div>
  )
}

export default CompanyList
