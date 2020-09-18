import React, {FunctionComponent} from 'react'
import Link from 'next/link'

type PlayerControlsProps = {
  handlerDownload: any
  isPro: boolean
}

const availableSpeeds: string[] = ['0.85', '1', '1.25', '1.5', '1.75', '2']

const PlayerControls: FunctionComponent<PlayerControlsProps> = ({
  children,
  handlerDownload,
  isPro,
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
      {children}
      {isPro ? (
        <>
          <div className="flex items-center">
            <button
              onClick={handlerDownload}
              className="ml-4 bg-gray-300 rounded p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="red"
                className="w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div>This stuff if for Pro members only</div>
      )}
    </div>
  )
}

export default PlayerControls
