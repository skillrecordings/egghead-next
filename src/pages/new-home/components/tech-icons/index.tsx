import * as React from 'react'
import {motion} from 'framer-motion'

import {
  Vueblue,
  Awsblue,
  Angularblue,
  Jsblue,
  Nextblue,
  Nodeblue,
  Reactblue,
  Reduxblue,
  Cssblue,
  Tsblue,
} from 'components/icons/tech-logo-icons'

const TechIcons: React.FunctionComponent = () => {
  return (
    <div className="flex flex-wrap justify-center gap-5 2xl:gap-7">
      {[
        {
          label: 'JavaScript',
          image: <Jsblue />,
        },
        {
          label: 'React',
          image: <Reactblue />,
        },
        {
          label: 'Redux',
          image: <Reduxblue />,
        },
        {
          label: 'Angular',
          image: <Angularblue />,
        },
        {
          label: 'Vue',
          image: <Vueblue />,
        },
        {
          label: 'TypeScript',
          image: <Tsblue />,
        },
        {
          label: 'CSS',
          image: <Cssblue />,
        },
        {
          label: 'Node.js',
          image: <Nodeblue />,
        },
        {
          label: 'AWS',
          image: <Awsblue />,
        },
        {
          label: 'Next.js',
          image: <Nextblue />,
        },
      ].map((tech, i) => {
        return (
          <motion.div
            className="flex-shrink-0 w-16 sm:w-20 md:w-14 lg:w-20 xl:w-24 2xl:w-28"
            key={i}
            initial={{opacity: 0, y: 40}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: i * 0.1}}
          >
            {tech.image}
          </motion.div>
        )
      })}
    </div>
  )
}
export default TechIcons
