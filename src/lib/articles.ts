import groq from 'groq'

export const allArticlesQuery = groq`
*[_type == "post" && publishedAt < now()]|order(publishedAt desc) {
  title,
  slug,
  coverImage,
  description,
  publishedAt,
  "author": authors[0].author-> {
    name, 
   'image': image.url,
   }
}
`
