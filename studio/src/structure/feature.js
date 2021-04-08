import S from '@sanity/desk-tool/structure-builder'

const portfolio = S.listItem().title('Feature').child(
  // List out all categories
  S.documentList()
    .schemaType('resource')
    .title('Features')
    .filter('_type == "resource" && type == "feature"'),
)

export default portfolio
