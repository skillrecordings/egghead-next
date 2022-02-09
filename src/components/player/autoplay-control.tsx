import React from 'react'
import {getPlayerPrefs, savePlayerPrefs} from '@skillrecordings/player'
import classNames from 'classnames'

const AutoplayControl = () => {
  const [isAutoPlayActive, setIsAutoPlayActive] = React.useState<boolean>(false)
  const {autoplay} = getPlayerPrefs()

  React.useEffect(() => {
    setIsAutoPlayActive(autoplay)
  }, [autoplay])

  return (
    <div className="bg-player-bg bg-opacity-80">
      <button
        onClick={() => {
          savePlayerPrefs({autoplay: !autoplay})
          setIsAutoPlayActive(!isAutoPlayActive)
        }}
        type="button"
        role="switch"
        aria-checked={isAutoPlayActive}
        className="px-3 py-2 flex items-center w-full group"
      >
        <span className="text-xs pr-2 font-mono uppercase">
          Autoplay{' '}
          <span className="sr-only">is {isAutoPlayActive ? 'on' : 'off'}</span>
        </span>
        <div
          className={`${classNames({
            'bg-indigo-500': isAutoPlayActive,
            'bg-gray-200 dark:bg-gray-600 group-hover:bg-indigo-200 group-hover:bg-opacity-60 bg-opacity-100 transition':
              !isAutoPlayActive,
          })} scale-90 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          <span
            className={`${classNames({
              'translate-x-0': !isAutoPlayActive,
              'translate-x-5': isAutoPlayActive,
            })} pointer-events-none inline-flex h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 text-indigo-500 text-[0.5rem] tracking-tight font-mono uppercase font-bold items-center justify-center leading-none`}
            aria-hidden="true"
          >
            {isAutoPlayActive ? (
              <>on</>
            ) : (
              <span className="group-hover:opacity-40 text-black opacity-0 transition">
                off
              </span>
            )}
          </span>
        </div>
      </button>
    </div>
  )
}

export default AutoplayControl
