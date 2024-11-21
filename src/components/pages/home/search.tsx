import * as React from 'react'
import {track} from '@/utils/analytics'
import {useRouter} from 'next/router'
import isEmpty from 'lodash/isEmpty'
import {Form, Formik} from 'formik'
import Image from 'next/legacy/image'
import {SearchIcon} from 'lucide-react'

const Search = () => {
  const router = useRouter()
  return (
    <div className="lg:pt-20 sm:pt-16 pt-10 px-5 flex flex-col bg-gradient-to-b dark:from-gray-800/50 from-gray-200 to-transparent items-center w-full">
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
              <h1 className="text-center lg:text-3xl text-balance max-w-3xl mx-auto sm:text-2xl text-2xl font-bold leading-tighter sm:pb-20 pb-10">
                Bite-Sized Screencasts for Web Developers that Hate Long Boring
                Videos
              </h1>
              <div className="max-w-2xl w-full mx-auto relative flex items-center shadow-smooth rounded-lg">
                <input
                  name="query"
                  value={values.query}
                  onChange={handleChange}
                  type="search"
                  placeholder={`React, TypeScript, AWS, CSS...`}
                  autoComplete="off"
                  className="w-full py-4 px-5 pr-16 lg:text-lg sm:text-base text-sm rounded-lg dark:bg-gray-1000 border dark:border-gray-800 bg-white border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 sm:text-base font-medium text-sm absolute px-5 text-white right-0 bg-gradient-to-t from-blue-600 to-blue-500 h-full rounded-r-lg transition-all ease-in-out duration-200 after:absolute overflow-hidden"
                >
                  <SearchIcon className="w-4 h-4" aria-hidden="true" />
                  <span className="sm:not-sr-only sr-only">Search egghead</span>
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
