import * as React from 'react'
import {track} from 'utils/analytics'
import {useRouter} from 'next/router'
import isEmpty from 'lodash/isEmpty'
import {Form, Formik} from 'formik'
import Image from 'next/image'

const Search = () => {
  const router = useRouter()
  return (
    <div className="pt-8 pb-24 flex flex-col items-center w-full">
      <Image
        src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637330011/egghead-next-pages/home-page/monocle-eggo.png"
        alt=""
        aria-hidden
        width={200}
        height={200}
      />

      <Formik
        initialValues={{
          query: '',
        }}
        onSubmit={(values) => {
          if (isEmpty(values.query)) {
            router.push(`/q`)
            track('clicked search icon with no query', {
              location: 'home',
            })
          } else {
            router.push(`/q?q=${values.query?.split(' ').join('+')}`)
            track('searched for query', {
              query: values.query,
              location: 'home',
            })
          }
        }}
      >
        {({values, handleChange}) => {
          return (
            <Form role="search" className="w-full">
              <h2 className="text-center lg:text-2xl sm:text-xl text-lg font-medium leading-tighter pb-8">
                What are you going to learn today?
              </h2>
              <div className="max-w-lg w-full mx-auto relative flex items-center">
                <input
                  name="query"
                  value={values.query}
                  onChange={handleChange}
                  type="search"
                  placeholder={`React, TypeScript, AWS, CSS...`}
                  autoComplete="off"
                  className="w-full py-4 px-5 pr-16 lg:text-lg sm:text-base text-sm rounded-lg dark:bg-gray-1000 border dark:border-gray-800 bg-white border-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="sm:text-base text-sm absolute px-5 text-white right-0 bg-gradient-to-t from-blue-600 to-blue-500 h-full rounded-r-lg transition-all ease-in-out duration-200 after:absolute after:left-0 after:top-0 after:w-full after:h-full after:bg-gray-900 hover:after:bg-opacity-40 after:bg-opacity-10 overflow-hidden after:transition-all after:ease-in-out after:duration-200"
                >
                  <div className="relative z-10">Search egghead</div>
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default Search
