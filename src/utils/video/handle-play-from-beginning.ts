import {type NextRouter, useRouter} from 'next/router'
import {type Section} from '@/schemas/section'
import {type Module} from '@/schemas/module'

export const pathnameForPath = ({
  section,
  path,
}: {
  section?: Section
  path: string
}) => {
  return section
    ? `/${path}/[module]/[section]/[lesson]`
    : `/${path}/[module]/[lesson]`
}

export const getRouteQuery = ({
  section,
  module,
}: {
  section?: Section
  module: Module
}) => {
  return section
    ? {
        module: module.slug.current,
        section: module.sections && module.sections[0].slug,
        lesson:
          module.sections &&
          module.sections[0].lessons &&
          module.sections[0].lessons[0].slug,
      }
    : {
        module: module.slug.current,
        lesson: module.lessons && module.lessons[0].slug,
      }
}
export const handlePlayFromBeginning = ({
  router,
  section,
  module,
  path,
  handlePlay = () => {},
}: {
  router: NextRouter
  section?: Section
  module: Module
  path: string
  handlePlay: () => void
}) => {
  // needs to be updated to new router
  return router
    .push({
      pathname: pathnameForPath({section, path}),
      query: getRouteQuery({section, module}),
    })
    .then(handlePlay)
}
