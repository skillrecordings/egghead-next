import {ClockIcon} from '@heroicons/react/solid'
import ClosedCaptionIcon from 'components/icons/closed-captioning'

export const Duration: React.FunctionComponent<
  React.PropsWithChildren<{duration: string}>
> = ({duration}) => (
  <div className="flex flex-row items-center">
    <ClockIcon className="w-4 h-4 mr-1 opacity-60" />
    <span>{duration}</span>{' '}
    <ClosedCaptionIcon className="inline-block w-4 h-4 ml-2" />
  </div>
)
