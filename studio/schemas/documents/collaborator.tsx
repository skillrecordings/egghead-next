import {SparkleIcon} from '@sanity/icons'
import * as React from 'react'

export default {
  name: 'collaborator',
  title: 'Collaborator',
  type: 'document',
  icon: SparkleIcon,
  fields: [
    {
      name: 'department',
      title: 'Department',
      type: 'string',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
    },
    {
      name: 'person',
      title: 'Person',
      type: 'reference',
      to: [{type: 'person'}],
    },
    {
      name: 'externalId',
      title: 'External ID (egghead contact id/CIO id)',
      type: 'number',
    },
    {
      name: 'eggheadInstructorId',
      title: 'egghead Instructor ID',
      type: 'string',
      hidden: ({parent}: {parent: {role: string}}) => parent?.role !== 'instructor',
    },
  ],
  preview: {
    select: {
      title: 'title',
      role: 'role',
      name: 'person.name',
      department: 'department',
      media: 'person.image.url',
    },
    prepare(selection: any) {
      const {name, title, department, media, role} = selection
      return {
        title: `${name}${title ? ` • ${title}` : ''}`,
        subtitle: `${role}${department ? ` • ${department}` : ''}`,
        media: media ? <img src={media} alt={`${name}`} /> : null,
      }
    },
  },
}
