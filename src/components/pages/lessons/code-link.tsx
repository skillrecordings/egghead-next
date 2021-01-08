import * as React from 'react'
import {FunctionComponent} from 'react'

const CodeLink: FunctionComponent<{
  url: string
  icon?: React.ReactElement
  onClick?: () => void
}> = ({url, icon, onClick = () => {}, children}) => {
  return (
    <div className="flex items-center">
      <a
        href={url}
        rel="noreferrer"
        onClick={onClick}
        target="_blank"
        className="flex items-center text-blue-600 hover:underline font-semibold"
      >
        {icon ? icon : <IconCode />}
        {children}
      </a>
    </div>
  )
}

export const IconCode: FunctionComponent<{className?: string}> = ({
  className = 'w-5 mr-1 text-blue-700',
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="18"
    viewBox="0 0 22 18"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8,16 L12,0 M16,4 L20,8 L16,12 M4,12 L0,8 L4,4"
      transform="translate(1 1)"
    />
  </svg>
)

export const IconGithub: FunctionComponent<{className?: string}> = ({
  className = 'w-5 mr-1 text-blue-700',
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
  >
    <path
      fill="currentColor"
      d="M10,-3.37507799e-14 C4.47500147,-3.37507799e-14 -1.03028697e-13,4.475 -1.03028697e-13,10 C-0.00232469848,14.3054085 2.75290297,18.1283977 6.83800147,19.488 C7.33800147,19.575 7.52500147,19.275 7.52500147,19.012 C7.52500147,18.775 7.51200147,17.988 7.51200147,17.15 C5,17.613 4.35000147,16.538 4.15000147,15.975 C4.03700147,15.687 3.55000147,14.8 3.12500147,14.562 C2.77500147,14.375 2.27500147,13.912 3.11200147,13.9 C3.90000147,13.887 4.46200147,14.625 4.65000147,14.925 C5.55000147,16.437 6.98800147,16.012 7.56200147,15.75 C7.65000147,15.1 7.91200147,14.663 8.20000147,14.413 C5.97500147,14.163 3.65000147,13.3 3.65000147,9.475 C3.65000147,8.387 4.03700147,7.488 4.67500147,6.787 C4.57500147,6.537 4.22500147,5.512 4.77500147,4.137 C4.77500147,4.137 5.61200147,3.875 7.52500147,5.163 C8.33906435,4.93706071 9.18016765,4.82334354 10.0250015,4.825 C10.8750015,4.825 11.7250015,4.937 12.5250015,5.162 C14.4370015,3.862 15.2750015,4.138 15.2750015,4.138 C15.8250015,5.513 15.4750015,6.538 15.3750015,6.788 C16.0120015,7.488 16.4000015,8.375 16.4000015,9.475 C16.4000015,13.313 14.0630015,14.163 11.8380015,14.413 C12.2000015,14.725 12.5130015,15.325 12.5130015,16.263 C12.5130015,17.6 12.5,18.675 12.5,19.013 C12.5,19.275 12.6880015,19.587 13.1880015,19.487 C17.2582356,18.112772 19.9988381,14.295964 20,10 C20,4.475 15.5250015,-3.37507799e-14 10,-3.37507799e-14 Z"
    />
  </svg>
)

export default CodeLink
