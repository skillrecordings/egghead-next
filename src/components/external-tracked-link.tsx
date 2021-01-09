import * as React from 'react'
import {isFunction} from 'formik'
import {track} from 'utils/analytics'

const isModifiedEvent = (event: any) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

const ExternalTrackedLink: React.FunctionComponent<any> = ({
  eventName,
  params,
  label,
  children,
  ...props
}) => {
  const handleClick = (event: any) => {
    const {href, eventName, params} = props

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

      if (eventName) {
        track(eventName, params, updateLocation)
      } else {
        updateLocation()
      }
    }
  }
  return (
    <a {...props} aria-label={label || ''} onClick={handleClick}>
      {children}
    </a>
  )
}

export default ExternalTrackedLink
