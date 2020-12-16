import * as React from 'react'

const PlayIcon: React.FunctionComponent<{className: string}> = ({
  className,
}) => {
  return (
    // prettier-ignore
    <svg className={className ? className : ""} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16"><g fill="none" fillRule="evenodd" transform="translate(-5 -4)"><polygon points="0 0 24 0 24 24 0 24"/><path fill="currentColor" fillRule="nonzero" d="M19.376,12.416 L8.777,19.482 C8.62358728,19.5840889 8.42645668,19.5935191 8.26399944,19.5065407 C8.10154219,19.4195623 8,19.2502759 8,19.066 L8,4.934 C8,4.74972414 8.10154219,4.58043768 8.26399944,4.49345928 C8.42645668,4.40648088 8.62358728,4.41591114 8.777,4.518 L19.376,11.584 C19.5150776,11.6767366 19.5986122,11.8328395 19.5986122,12 C19.5986122,12.1671605 19.5150776,12.3232634 19.376,12.416 Z"/></g></svg>
  )
}

export default PlayIcon
