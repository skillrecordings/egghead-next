import * as React from 'react'
import {FunctionComponent} from 'react'

type AchievementsProps = {
  viewer: {
    lessons_completed: number
    series_completed: number
  }
}

const Achievements: FunctionComponent<
  React.PropsWithChildren<AchievementsProps>
> = ({viewer}) => {
  return (
    <div className="sm:p-5 p-4 bg-white rounded-lg overflow-hidden text-center flex md:flex-row flex-col items-center md:space-x-5 md:space-y-0 space-y-5">
      <div>
        <div className="text-2xl font-semibold leading-tight">
          {viewer.lessons_completed}
        </div>
        <div className="text-xs uppercase">Lessons watched</div>
      </div>
      <div>
        <div className="text-2xl font-semibold leading-tight">
          {viewer.series_completed}
        </div>
        <div className="text-xs uppercase">Courses watched</div>
      </div>
    </div>
  )
}

export default Achievements
