import * as React from 'react'
import cookie from 'utils/cookies'

export const LAST_RESOURCE_COOKIE_NAME = 'last-resource'

function reducer(_: any, action: any) {
  switch (action.type) {
    case 'update':
      const {title, path, image_url, type, description} = action.resource
      const resource = cookie.set(LAST_RESOURCE_COOKIE_NAME, {
        title,
        path,
        image_url,
        type,
        description,
      })
      return {resource}
    case 'clear':
      cookie.remove(LAST_RESOURCE_COOKIE_NAME)
      return {}
    default:
      throw new Error()
  }
}

const useLastResource = (resource?: any) => {
  const [state, dispatch] = React.useReducer(reducer, {resource})

  const clearResource = React.useCallback(() => {
    dispatch({type: 'clear'})
  }, [])

  const updateResource = React.useCallback((resource) => {
    dispatch({type: 'update', resource})
  }, [])

  React.useEffect(() => {
    const savedResource = cookie.get(LAST_RESOURCE_COOKIE_NAME)
    const isResourceUpdated = resource && savedResource?.slug !== resource.slug
    if (isResourceUpdated) {
      updateResource(resource)
    } else if (savedResource) {
      updateResource(savedResource)
    }
  }, [])

  return {lastResource: state.resource, clearResource, updateResource}
}

export default useLastResource
