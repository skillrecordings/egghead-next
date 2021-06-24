export default function resolveProductionUrl(document) {
  return `https://egghead.io/courses/${document.slug.current}`
}
