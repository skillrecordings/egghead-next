import groq from 'groq'

export const jumbotronQuery = groq`
*[_type == 'resource' && slug.current == "jumbotron-banner"][0]{
  title,
  resources[]->{
    title,
    image,
    'banner': images[label == 'banner-image-blank'][0].url,
    summary,
    'instructor': collaborators[]->[role == 'instructor'][0]{
      'name': person->name,
    	'image': person->image.url
    }
  },
}
`
