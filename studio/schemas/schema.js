// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'
// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// We import object and document schemas
import collaborator from './collaborator'
import resource from './resource'
import person from './person'
import npmDependency from './npmDependency'
import staffReview from './staffReview'
import bigIdea from './bigIdea'
import essentialQuestion from './essentialQuestion'
import blockText from './blockText'
import blockContent from './blockContent'
import markdownText from './markdownText'
import link from './link'
import npmVersionedDependency from './npmVersionedDependency'
import cta from './cta'
import ctaPlug from './ctaPlug'
import imageUrl from './image-url'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    npmVersionedDependency,
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
    npmDependency,
    staffReview,
    essentialQuestion,
    bigIdea,
  ]),
})
