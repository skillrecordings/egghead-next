import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Topic from '../../components/topic'

const SearchColbyFayock = ({instructor}) => {
  return (
    <div className="mb-10 pb-10 xl:px-0 px-5 max-w-screen-xl mx-auto dark:bg-gray-900">
      <div className="md:grid md:grid-cols-12 grid-cols-1 gap-5 items-start space-y-5 md:space-y-0 dark:bg-gray-900">
        <Topic
          className="col-span-8"
          title={instructor.full_name}
          imageUrl="https://res.cloudinary.com/fay/image/upload/v1612054925/cosmo-square_vqhl59.jpg"
        >
          {(Markdown: any) => (
            <>
              <Markdown className="prose dark:prose-dark pt-2 sm:text-base text-sm leading-normal text-gray-800 dark:text-gray-200 mt-0">
                {instructor.bio_short}
              </Markdown>
            </>
          )}
        </Topic>
        <Link href="/playlists/create-an-ecommerce-store-with-next-js-and-stripe-checkout-562c">
          <a className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 relative text-center">
            <Image
              className="mx-auto"
              priority
              quality={100}
              width={300}
              height={300}
              src="https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/412/781/square_480/ecommerce-stripe-next.png"
              alt="illustration for Create an eCommerce Store with Next.js and Stripe Checkout"
            />
            <p className="sm:text-l text-m text-gray-500 font-medium mt-3">
              Instructor's Pick
            </p>
            <p className="sm:text-xl text-m font-bold mt-1">
              Create an eCommerce Store with Next.js and Stripe Checkout
            </p>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default SearchColbyFayock
