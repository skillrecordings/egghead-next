const portfolio = (S) =>
  S.listItem().title('Feature').child(
    // List out all categories
    S.documentList()
      .schemaType('resource')
      .title('Features')
      .filter('_type == "resource" && type == "feature"')
  )

export default portfolio
