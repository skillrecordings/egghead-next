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
}

const TagItem: FunctionComponent<RefinementListProps> = ({
  item,
  isFromSearch,
  refine,
  createURL,
}) => {
  // const {data} = useSwr(
  //   `https://egghead.io/api/v1/tags/${item.label}`,
  //   async (url) => {
  //     const result = await fetch(url).then((response) => response.json())
  //     return result
  //   },
  // )

  return (
    <li className="pt-2">
      <a
        href={createURL(item.value)}
        style={{fontWeight: item.isRefined ? 600 : 400}}
        onClick={(event) => {
          event.preventDefault()
          refine(item.value)
        }}
      >
        <div className="flex items-center">
          {/* <div className="w-6">{data && <img src={data.image_32_url} />}</div> */}
          <div className={`pl-2 ${isFromSearch && 'font-bold'}`}>
            {item.label}
          </div>
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
}) => {
  // const {data} = useSwr(
  //   `https://egghead.io/api/v1/instructors/${nameToSlug(item.label)}`,
  //   async (url) => {
  //     const result = await fetch(url).then((response) => response.json())
  //     return result
  //   },
  // )

  return (
    <li className="pt-2">
      <a
        href={createURL(item.value)}
        style={{fontWeight: item.isRefined ? 600 : 400}}
        onClick={(event) => {
          event.preventDefault()
          refine(item.value)
        }}
      >
        <div className="flex items-center">
          {/* <div className="w-6">
              <img className="rounded-full" src={data.avatar_32_url} />
            </div> */}
          <div className={`pl-2 ${isFromSearch && 'font-bold'}`}>
            {item.label}
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
}) => {
  return (
    <li>
      <a
        href={createURL(item.value)}
        style={{fontWeight: item.isRefined ? 600 : 400}}
        onClick={(event) => {
          event.preventDefault()
          refine(item.value)
        }}
      >
        {isFromSearch ? <Highlight attribute="label" hit={item} /> : item.label}{' '}
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
}) => {
  return (
    <ul>
      <li>
        <input
          type="search"
          className="border border-black"
          onChange={(event) => searchForItems(event.currentTarget.value)}
        />
      </li>
      {items &&
        items.map((item) => (
          <div key={item.label}>
            {attribute === `_tags` && (
              <TagItem
                item={item}
                isFromSearch={isFromSearch}
                refine={refine}
                createURL={createURL}
              />
            )}
            {attribute === `instructor_name` && (
              <InstructorItem
                item={item}
                isFromSearch={isFromSearch}
                refine={refine}
                createURL={createURL}
              />
            )}
            {attribute === `type` && (
              <Item
                item={item}
                isFromSearch={isFromSearch}
                refine={refine}
                createURL={createURL}
              />
            )}
          </div>
        ))}
    </ul>
  )
}

const CustomRefinementList = connectRefinementList(RefinementList)

export default CustomRefinementList
