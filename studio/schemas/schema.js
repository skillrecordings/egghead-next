// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'
// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// We import object and document schemas
import collaborator from './documents/collaborator'
import resource from './documents/resource'
import person from './documents/person'
import library from './documents/software-library'
import bigIdea from './documents/bigIdea'
import essentialQuestion from './documents/essentialQuestion'
import blockText from './objects/blockText'
import blockContent from './objects/blockContent'
import markdownText from './objects/markdownText'
import link from './objects/link'
import versionedLibrary from './objects/versioned-software-library'
import cta from './objects/cta'
import ctaPlug from './plugs/ctaPlug'
import imageUrl from './objects/image-url'
import stringList from './objects/string-list'
import videoResource from './documents/videoResource'
import post from './documents/post'
import course from './documents/course'
import lesson from './documents/lesson'
import podcastEpisode from './documents/podcastEpisode'
import podcastSeason from './documents/podcastSeason'
import caseStudy from './documents/caseStudy'
import category from './documents/category'
import authorReference from './objects/author-reference'
import excerptPortableText from './objects/excerpt-portable-text'
import bodyPortableText from './objects/body-portable-text'
import mainImage from './objects/main-image'
import seo from './objects/seo'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    versionedLibrary,
    markdownText,
    blockContent,
    blockText,
    link,
    cta,
    ctaPlug,
    // The following are document types which will appear
    // in the studio.
    resource,
    imageUrl,
    collaborator,
    person,
    library,
    essentialQuestion,
    bigIdea,
    stringList,
    videoResource,
    post,
    course,
    lesson,
    podcastEpisode,
    podcastSeason,
    caseStudy,
    category,
    authorReference,
    excerptPortableText,
    bodyPortableText,
    mainImage,
    seo,
  ]),
})
