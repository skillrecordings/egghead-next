import find from 'lodash/find'
import indexOf from 'lodash/indexOf'
import first from 'lodash/first'
import {type Section} from '@/schemas/section'
import {type Module} from '@/schemas/module'

export const getNextSection = ({
  module,
  currentSection,
}: {
  module: Module
  currentSection?: Section
}) => {
  const sections = module.sections

  const current = find(sections, {_id: currentSection?._id}) || first(sections)
  const nextSectionIndex = indexOf(sections, current) + 1
  const nextSection = sections?.[nextSectionIndex] || null
  return nextSection
}
