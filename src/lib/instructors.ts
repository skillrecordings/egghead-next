import {request} from 'graphql-request'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import {stephanieEcklesQuery} from 'components/search/instructors/stephanie-eckles'
import {kamranAhmedQuery} from 'components/search/instructors/kamran-ahmed'
import {alexReardonQuery} from 'components/search/instructors/alex-reardon'
import {kevinCunninghamQuery} from 'components/search/instructors/kevin-cunningham'
import {hirokoNishimuraQuery} from 'components/search/instructors/hiroko-nishimura'
import {kristianFreemanQuery} from 'components/search/instructors/kristian-freeman'
import {christianNwambaQuery} from 'components/search/instructors/christian-nwamba'
import {kentCDoddsQuery} from 'components/search/instructors/kent-c-dodds'
import {KyleShevlinQuery} from 'components/search/instructors/kyle-shevlin'
import {jamundFergusonQuery} from 'components/search/instructors/jamund-ferguson'
import {RyanChenkieQuery} from 'components/search/instructors/ryan-chenkie'
import {MatiasHernandezQuery} from 'components/search/instructors/matias-hernandez'
import {ChrisBiscardiQuery} from 'components/search/instructors/chris-biscardi'
import {LazarNikolovQuery} from 'components/search/instructors/lazar-nikolov'
import {ChrisAchardQuery} from 'components/search/instructors/chris-achard'
import {KadiKramanQuery} from 'components/search/instructors/kadi-kraman'
import {filipHricQuery} from 'components/search/instructors/filip-hric'

import config from './config'

export type Instructor = {
  full_name: string
  avatar_64_url: string
}

type SanityInstructor = {
  _id: string
  eggheadInstructorId: string
  person: {
    _id: string
    image: string
    name: string
  }
}

export async function loadInstructors(page = 1) {
  const query = `query getInstructors($page: Int!){
    instructors(per_page: 24, page:$page){
      id
      full_name
      avatar_url
      slug
    }
  }`
  const {instructors} = await request(config.graphQLEndpoint, query, {page})

  return instructors
}

export async function loadInstructor(slug: string) {
  const query = `query getInstructor($slug: String!){
    instructor(slug: $slug){
      id
      full_name
      avatar_url
      slug
      bio_short
      twitter
      website
    }
  }`
  const {instructor} = await request(config.graphQLEndpoint, query, {slug})
  let sanityInstructor

  if (canLoadSanityInstructor(slug)) {
    sanityInstructor = await loadSanityInstructor(slug)
  }

  return {...instructor, ...sanityInstructor}
}

const sanityInstructorHash = {
  'stephanie-eckles': stephanieEcklesQuery,
  'kamran-ahmed': kamranAhmedQuery,
  'alex-reardon': alexReardonQuery,
  'kevin-cunningham': kevinCunninghamQuery,
  'hiroko-nishimura': hirokoNishimuraQuery,
  'kristian-freeman': kristianFreemanQuery,
  'christian-nwamba': christianNwambaQuery,
  'kent-c-dodds': kentCDoddsQuery,
  'kyle-shevlin': KyleShevlinQuery,
  'jamund-ferguson': jamundFergusonQuery,
  'ryan-chenkie': RyanChenkieQuery,
  'matias-hernandez': MatiasHernandezQuery,
  'chris-biscardi': ChrisBiscardiQuery,
  'lazar-nikolov': LazarNikolovQuery,
  'chris-achard': ChrisAchardQuery,
  'kadi-kraman': KadiKramanQuery,
  'filip-hric': filipHricQuery,
}

type SelectedInstructor = keyof typeof sanityInstructorHash

const canLoadSanityInstructor = (
  selectedInstructor: string,
): selectedInstructor is SelectedInstructor => {
  const keyNames = Object.keys(sanityInstructorHash)

  return keyNames.includes(selectedInstructor)
}

export const loadSanityInstructor = async (selectedInstructor: string) => {
  if (!canLoadSanityInstructor(selectedInstructor)) return

  const query = sanityInstructorHash[selectedInstructor]
  if (!query) return
  console.log(await sanityClient.fetch(query))
  return await sanityClient.fetch(query)
}

const instructorQuery = groq`
  *[_type == 'collaborator' && role == 'instructor' && eggheadInstructorId == $eggheadInstructorId][]{
    'person': person-> {
        _id,
        name,
        'image': image.url,
      },
    eggheadInstructorId,
    _id
  }`

const topicQuery = groq`
  *[_type == 'software-library'][]{
    'id': _id,
    name
  }
`

export const loadSanityInstructorByEggheadId = async (eggheadId: number) => {
  const instructor: SanityInstructor[] = await sanityClient.fetch(
    instructorQuery,
    {eggheadInstructorId: String(eggheadId)},
  )

  return instructor.find(
    (instructor) => instructor.eggheadInstructorId === String(eggheadId),
  )
}

export const loadInstructorWipContent = async (id: string) => {
  //   const instructor: Instructor[] = await sanityClient.fetch(instructorQuery)
  //   const topics: Topic[] = await sanityClient.fetch(topicQuery)
}
