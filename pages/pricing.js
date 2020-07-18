import {Basic, Combined, Animated, bounce} from '../shared/styles'

export default function Pricing() {
  return (
    <div>
      <Basic>Cool Styles</Basic>
      <Combined>
        With <code>:hover</code>.
      </Combined>
      <Animated animation={bounce}>Let's bounce.</Animated>
    </div>
  )
}
