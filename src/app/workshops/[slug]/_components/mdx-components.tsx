/**
 * MDX Components for Workshop Pages
 *
 * These components can be used in the workshop body MDX content
 * stored in Course Builder. They provide dynamic, configurable
 * elements for workshop pages.
 */

import Hero from './Hero'
import Testimonial from './testimonial'
import TestimonialBar from './TestimonialBar'
import InstructorTerminal from './instructor-terminal'
import WorkshopHistory from './workshop-history'
import FeatureList from './feature-list'
import mdxComponents from '@/components/mdx'

export const workshopMDXComponents = {
  ...mdxComponents, // Include standard MDX components for markdown rendering
  Hero,
  Testimonial,
  TestimonialBar,
  InstructorTerminal,
  WorkshopHistory,
  FeatureList,
}

export type WorkshopMDXComponents = typeof workshopMDXComponents
