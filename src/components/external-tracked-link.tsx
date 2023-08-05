import * as React from 'react'
import {isFunction} from 'formik'
import {track} from 'utils/analytics/track'

const isModifiedEvent = (event: any) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

const ExternalTrackedLink: React.FunctionComponent<
  React.PropsWithChildren<any>
> = ({eventName, params, label, children, onClick = () => {}, ...props}) => {
  const handleClick = (event: any) => {
    const {href} = props

    if (isFunction(props.onClick)) props.onClick(event)

    function updateLocation() {
      window.location.href = href || '#'
    }

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore right clicks
      !props.target && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault()
      event.stopPropagation()

      if (eventName) {
        // need to refactor to new tracking format
        track(eventName, params).then(() => {
          if (isFunction(onClick)) {
            onClick()
          }

          updateLocation()
        })
      } else {
        if (isFunction(onClick)) {
          onClick()
        }
        updateLocation()
      }
      return false
    }
  }
  return (
    <a {...props} aria-label={label || ''} onClick={handleClick}>
      {children}
    </a>
  )
}

export default ExternalTrackedLink
