import * as React from 'react'
import cookie from 'utils/cookies'

export const LAST_RESOURCE_COOKIE_NAME = 'last-resource'

export type Resource = {
  title: string
  path: string
  type: string
  description: string
  slug: string
  image_url?: string
}

type LastResourceAction = {type: 'update'; resource: Resource} | {type: 'clear'}

function reducer(_: any, action: LastResourceAction) {
  switch (action.type) {
    case 'update':
      const {title, path, image_url, type, description, slug} = action.resource
      const resource = cookie.set(
        LAST_RESOURCE_COOKIE_NAME,
        {
          title,
          path,
          image_url,
          type,
          description,
          slug,
        },
        {expires: 7},
      )
      return {resource}
    case 'clear':
      cookie.remove(LAST_RESOURCE_COOKIE_NAME)
      return {}
    default:
      throw new Error()
  }
}

const useLastResource = (resource?: Resource) => {
  const [state, dispatch] = React.useReducer(reducer, {resource})
  const clearResource = React.useCallback(() => {
    dispatch({type: 'clear'})
  }, [])

  const updateResource = React.useCallback((resource: Resource) => {
    dispatch({type: 'update', resource})
  }, [])

  React.useEffect(() => {
    const savedResource = cookie.get(LAST_RESOURCE_COOKIE_NAME)
    const isResourceUpdated = resource && savedResource?.slug !== resource.slug
    if (resource && isResourceUpdated) {
      updateResource(resource)
    } else if (savedResource) {
      updateResource(savedResource)
    }
  }, [resource?.slug])

  return {lastResource: state.resource, clearResource, updateResource}
}

export default useLastResource
