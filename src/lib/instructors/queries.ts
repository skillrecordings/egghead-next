import groq from 'groq'

export const stephanieEcklesQuery = groq`*[_type == 'resource' && slug.current == "stephanie-eckles-landing-page"][0]{
  'projects': resources[slug.current == 'instructor-landing-page-projects'][0]{
    resources[]{
      title,
      'path': url,
      description,
      image
    }
  },
	'courses': resources[slug.current == 'instructor-landing-page-featured-courses'][0]{
    resources[]->{
      title,
      'description': summary,
    	path,
      byline,
    	image,
      'background': images[label == 'feature-card-background'][0].url,
      'instructor': collaborators[]->[role == 'instructor'][0]{
        'name': person->.name
    	},
    }
  },
}`

export const sanityInstructorHash = {
  'stephanie-eckles': stephanieEcklesQuery,
}

export type SelectedInstructor = keyof typeof sanityInstructorHash

export const canLoadSanityInstructor = (
  selectedInstructor: string,
): selectedInstructor is SelectedInstructor => {
  const keyNames = Object.keys(sanityInstructorHash)

  return keyNames.includes(selectedInstructor)
}
