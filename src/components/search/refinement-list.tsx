import React from 'react'
import {Highlight, connectRefinementList} from 'react-instantsearch-dom'

import useSwr from 'swr'

const TagItem = ({item, isFromSearch, refine, createURL}) => {
  const {data} = useSwr(
    `https://egghead.io/api/v1/tags/${item.label}`,
    async (url) => {
      const result = await fetch(url).then((response) => response.json())
      return result
    },
  )

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
          <div className="w-6">{data && <img src={data.image_32_url} />}</div>
          <div className="pl-2">
            {isFromSearch ? (
              <Highlight attribute="label" hit={item} />
            ) : (
              item.label
            )}
          </div>
        </div>
      </a>
    </li>
  )
}

const Item = ({item, isFromSearch, refine, createURL}) => {
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

const RefinementList = ({
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
      {items.map((item) => (
        <div key={item.label}>
          {attribute === '_tags' ? (
            <TagItem
              item={item}
              isFromSearch={isFromSearch}
              refine={refine}
              createURL={createURL}
            ></TagItem>
          ) : (
            <Item
              item={item}
              isFromSearch={isFromSearch}
              refine={refine}
              createURL={createURL}
            ></Item>
          )}
        </div>
      ))}
    </ul>
  )
}

const CustomRefinementList = connectRefinementList(RefinementList)

export default CustomRefinementList
