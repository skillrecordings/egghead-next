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
import tip from './documents/tip'
import podcastEpisode from './documents/podcastEpisode'
import podcastSeason from './documents/podcastSeason'
import caseStudy from './documents/caseStudy'
import category from './documents/category'
import section from './documents/section'
import guide from './documents/guide'
import authorReference from './objects/author-reference'
import excerptPortableText from './objects/excerpt-portable-text'
import bodyPortableText from './objects/body-portable-text'
import mainImage from './objects/main-image'
import seo from './objects/seo'
import productionProcessState from './objects/production-process-state'
import muxAsset from './objects/muxAsset'
import scrimbaResource from './objects/scrimba-resource'
import emailBroadcast from './documents/email-broadcast'
import emailAddress from './documents/email-address'
import emailTemplate from './documents/email-template'
import emailSendAt from './objects/email-send-at'

export const schema = [
  versionedLibrary,
  markdownText,
  blockContent,
  blockText,
  link,
  cta,
  ctaPlug,
  productionProcessState,
  stringList,
  authorReference,
  excerptPortableText,
  bodyPortableText,
  mainImage,
  seo,
  muxAsset,
  scrimbaResource,
  emailBroadcast,
  emailAddress,
  emailTemplate,
  emailSendAt,
  resource,
  imageUrl,
  course,
  section,
  lesson,
  tip,
  videoResource,
  post,
  library,
  collaborator,
  person,
  podcastEpisode,
  podcastSeason,
  caseStudy,
  category,
  essentialQuestion,
  bigIdea,
  guide,
]
