import slugify from 'slugify'
const nameToSlug = (name: string) =>
  slugify(name.toLowerCase(), {remove: /[*+~.()'"!:@]/g})

export default nameToSlug
