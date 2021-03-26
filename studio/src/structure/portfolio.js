import S from '@sanity/desk-tool/structure-builder'

const portfolio = S.listItem().title('Portfolio').child(
  // List out all categories
  S.documentList()
    .schemaType('resource')
    .title('Portfolios')
    .filter('_type == "resource" && type == "portfolio"'),
)

export default portfolio
