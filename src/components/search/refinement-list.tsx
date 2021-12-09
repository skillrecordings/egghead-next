import React, {FunctionComponent} from 'react'
import {Highlight, connectRefinementList} from 'react-instantsearch-dom'
import {track} from '../../utils/analytics'
import capitalize from 'lodash/capitalize'
import cx from 'classnames'
import {scroller} from 'react-scroll'

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
  expand?: boolean
}

const TagItem: FunctionComponent<RefinementListProps> = ({
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
        className={`text-sm block hover:bg-white sm:dark:hover:bg-gray-800 dark:hover:bg-gray-900 px-2 py-1 transition ease-in-out duration-150 ${cx(
          {'font-semibold': item.isRefined},
        )}`}
        href={createURL(item.value)}
        onClick={(event) => {
          event.preventDefault()
          refine(item.value)
          track('search refined for topic', {
            topic: item.value,
          })
          scroller.scrollTo('page', {})
        }}
      >
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            readOnly
            checked={item.isRefined}
            aria-label={item.label}
            className={`rounded-sm bg-gray-200 dark:border-gray-600 border-gray-300 pointer-events-none ${cx(
              {
                'bg-blue-500': item.isRefined,
                'dark:bg-gray-800': !item.isRefined,
              },
            )}`}
          />
          <span className="pl-2">{item.label}</span>
        </label>
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
  return (
    <li key={item.label}>
      <a
        tabIndex={tabIndex}
        className={`text-sm block hover:bg-white sm:dark:hover:bg-gray-800 dark:hover:bg-gray-900 px-2 py-1 transition ease-in-out duration-150 ${cx(
          {'font-semibold': item.isRefined},
        )}`}
        href={createURL(item.value)}
        onClick={(event) => {
          event.preventDefault()
          refine(item.value)
          track('search refined for instructor', {
            instructor: item.value,
          })
          scroller.scrollTo('page', {})
        }}
      >
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            readOnly
            checked={item.isRefined}
            aria-label={item.label}
            className={`rounded-sm bg-gray-200 dark:border-gray-600 border-gray-300 pointer-events-none ${cx(
              {
                'bg-blue-500': item.isRefined,
                'dark:bg-gray-800': !item.isRefined,
              },
            )}`}
          />

          <span className="pl-2">{item.label}</span>
        </label>
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
        className={`text-sm block hover:bg-white sm:dark:hover:bg-gray-800 dark:hover:bg-gray-900 px-2 py-1 transition ease-in-out duration-150 ${cx(
          {'font-semibold': item.isRefined},
        )}`}
        href={createURL(item.value)}
        onClick={(event) => {
          event.preventDefault()
          refine(item.value)
          track('search refined for type', {
            type: item.value,
          })
          scroller.scrollTo('page', {})
        }}
      >
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            readOnly
            checked={item.isRefined}
            aria-label={item.label}
            className={`rounded-sm bg-gray-200 dark:border-gray-600 border-gray-300 pointer-events-none ${cx(
              {
                'bg-blue-500': item.isRefined,
                'dark:bg-gray-800': !item.isRefined,
              },
            )}`}
          />

          <span className="pl-2">
            {isFromSearch ? (
              <Highlight attribute="label" hit={item} />
            ) : (
              item.label
            )}
          </span>
        </label>
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
      case 'instructor_name':
        return 'instructors'
      case 'access_state':
        return 'Free or Pro'
      case 'type':
        return 'Content Type'
      default:
        break
    }
  }
  const tabIndex = isShown ? 0 : -1

  const propsNotSearched = ['type', 'access_state']

  return (
    <div>
      <label className="text-sm px-2 font-medium">
        {capitalize(label(attribute))}
      </label>
      {!propsNotSearched.includes(attribute || '') && (
        <div className="relative group">
          {/* search icon */}
          {/* <div className="group-focus-within:opacity-100 opacity-0 absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className="text-gray-500" width={16} height={16} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
            </div> */}
          <div>
            <input
              tabIndex={tabIndex}
              type="search"
              className="dark:placeholder-gray-400 px-2 placholder-gray-600 text-black dark:text-white bg-transparent border border-transparent py-1 w-full text-sm dark:hover:bg-gray-800 transition"
              placeholder={`Search ${label(attribute)}`}
              onChange={(event) => searchForItems(event.currentTarget.value)}
            />
          </div>
        </div>
      )}
      {/* {propsNotSearched.includes(attribute || '') && (
        <div className="text-sm py-3 font-medium">{label(attribute)}</div>
      )} */}
      <ul>
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
                if (item.label === 'playlist') item.label = 'course'
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
              case `access_state`:
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
