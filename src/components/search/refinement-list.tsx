import React, {FunctionComponent} from 'react'
import {Highlight, connectRefinementList} from 'react-instantsearch-dom'
import nameToSlug from 'lib/name-to-slug'

import useSwr from 'swr'

type RefinementListProps = {
  items?: any[]
  item?: any
  isFromSearch: boolean
  refine?: any
  searchForItems?: any
  createURL: any
  attribute?: string
  isShown?: boolean
  tabIndex?: number
}

const TagItem: FunctionComponent<RefinementListProps> = ({
  item,
  isFromSearch,
  refine,
  createURL,
  tabIndex,
}) => {
  // const {data} = useSwr(
  //   `https://egghead.io/api/v1/tags/${item.label}`,
  //   async (url) => {
  //     const result = await fetch(url).then((response) => response.json())
  //     return result
  //   },
  // )

  return (
    <li key={item.label}>
      <a
        tabIndex={tabIndex}
        className={`block hover:bg-gray-100 px-2 py-2 rounded-md transition ease-in-out duration-150 ${
          item.isRefined ? 'text-blue-600 font-semibold' : 'font-normal'
        }`}
        href={createURL(item.value)}
        onClick={(event) => {
          event.preventDefault()
          refine(item.value)
        }}
      >
        <div className="flex items-center">
          {/* <div className="w-6">{data && <img src={data.image_32_url} />}</div> */}
          {/* ${isFromSearch && 'font-bold'} */}
          <div className={`pl-2`}>{item.label}</div>
          {item.isRefined && ( // prettier-ignore
            <svg
              className="ml-2 inline text-blue-600"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                  fill="currentColor"
                />
              </g>
            </svg>
          )}
        </div>
      </a>
    </li>
  )
}

const InstructorItem: FunctionComponent<RefinementListProps> = ({
  item,
  isFromSearch,
  refine,
  createURL,
  tabIndex,
}) => {
  // const {data} = useSwr(
  //   `https://egghead.io/api/v1/instructors/${nameToSlug(item.label)}`,
  //   async (url) => {
  //     const result = await fetch(url).then((response) => response.json())
  //     return result
  //   },
  // )

  return (
    <li key={item.label}>
      <a
        tabIndex={tabIndex}
        className={`block hover:bg-gray-100 px-2 py-2 rounded-md transition ease-in-out duration-150 ${
          item.isRefined ? 'text-blue-600 font-semibold' : 'font-normal'
        }`}
        href={createURL(item.value)}
        onClick={(event) => {
          event.preventDefault()
          refine(item.value)
        }}
      >
        <div className="flex items-center">
          {/* <div className="w-6">
              <img className="rounded-full" src={data.avatar_32_url} />
            </div> */}
          <div className={`w-full flex items-center justify-between`}>
            <span>{item.label}</span>
            {item.isRefined && ( // prettier-ignore
              <svg
                className="ml-2 inline text-blue-600"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            )}
          </div>
        </div>
      </a>
    </li>
  )
}

const Item: FunctionComponent<RefinementListProps> = ({
  item,
  isFromSearch,
  refine,
  createURL,
  tabIndex,
}) => {
  return (
    <li key={item.label}>
      <a
        tabIndex={tabIndex}
        className={`block hover:bg-gray-100 px-2 py-2 rounded-md transition ease-in-out duration-150 ${
          item.isRefined ? 'text-blue-600 font-semibold' : 'font-normal'
        }`}
        href={createURL(item.value)}
        onClick={(event) => {
          event.preventDefault()
          refine(item.value)
        }}
      >
        {isFromSearch ? <Highlight attribute="label" hit={item} /> : item.label}{' '}
        {item.isRefined && ( // prettier-ignore
          <svg
            className="ml-2 inline text-blue-600"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                fill="currentColor"
              />
            </g>
          </svg>
        )}
      </a>
    </li>
  )
}

const RefinementList: FunctionComponent<RefinementListProps> = ({
  items,
  isFromSearch,
  refine,
  searchForItems,
  createURL,
  attribute,
  isShown,
}) => {
  function label(attribute: any) {
    switch (attribute) {
      case '_tags':
        return 'topics'
        break
      case 'instructor_name':
        return 'instructors'
        break
      case 'type':
        return 'type'
        break
      default:
        break
    }
  }
  const tabIndex = isShown ? 0 : -1

  return (
    <div>
      <div className="relative">
        {attribute !== `type` && (
          <>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {/* prettier-ignore */}
              <svg className="text-gray-500" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
            </div>
            <input
              tabIndex={tabIndex}
              type="search"
              className="bg-gray-200 rounded-md px-3 pl-8 py-2 w-full"
              placeholder={`Search ${label(attribute)}`}
              onChange={(event) => searchForItems(event.currentTarget.value)}
            />
          </>
        )}
      </div>
      <ul className={`${attribute !== 'type' && 'mt-2'}`}>
        {items &&
          items.map((item) => {
            switch (attribute) {
              case `_tags`:
                return (
                  <TagItem
                    tabIndex={tabIndex}
                    key={item.label}
                    item={item}
                    isFromSearch={isFromSearch}
                    refine={refine}
                    createURL={createURL}
                  />
                )
              case `instructor_name`:
                return (
                  <InstructorItem
                    tabIndex={tabIndex}
                    key={item.label}
                    item={item}
                    isFromSearch={isFromSearch}
                    refine={refine}
                    createURL={createURL}
                  />
                )
              case `type`:
                return (
                  <Item
                    tabIndex={tabIndex}
                    key={item.label}
                    item={item}
                    isFromSearch={isFromSearch}
                    refine={refine}
                    createURL={createURL}
                  />
                )
              default:
                return null
            }
          })}
      </ul>
    </div>
  )
}

const CustomRefinementList = connectRefinementList(RefinementList)

export default CustomRefinementList
