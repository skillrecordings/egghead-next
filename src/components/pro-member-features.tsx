import * as React from 'react'

const FeaturesList = () => (
  <ul>
    {[
      'Full access to all the premium courses',
      'Download courses for offline viewing',
      'Closed captions for every video',
      'Commenting and support',
      'Enhanced Transcripts',
      'RSS course feeds',
    ].map((feature, id) => (
      <div className="flex flex-row space-x-3 mb-2">
        <CheckIcon />
        <li className="font-medium" key={id}>
          {feature}
        </li>
      </div>
    ))}
  </ul>
)

const CheckIcon = () => (
  <svg
    className="text-blue-500 inline-block flex-shrink-0 mt-1"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
  >
    <path
      fill="currentColor"
      d="M6.00266104,15 C5.73789196,15 5.48398777,14.8946854 5.29679603,14.707378 L0.304822855,9.71382936 C0.0452835953,9.46307884 -0.0588050485,9.09175514 0.0325634765,8.74257683 C0.123932001,8.39339851 0.396538625,8.12070585 0.745606774,8.02930849 C1.09467492,7.93791112 1.46588147,8.04203262 1.71655287,8.30165379 L5.86288579,12.4482966 L14.1675324,0.449797837 C14.3666635,0.147033347 14.7141342,-0.0240608575 15.0754425,0.00274388845 C15.4367507,0.0295486344 15.7551884,0.250045268 15.9074918,0.578881992 C16.0597953,0.907718715 16.0220601,1.29328389 15.8088932,1.58632952 L6.82334143,14.5695561 C6.65578773,14.8145513 6.38796837,14.9722925 6.09251656,15 C6.06256472,15 6.03261288,15 6.00266104,15 Z"
    />
  </svg>
)

export default FeaturesList
