describe('lesson page', () => {
  it('/lesson loads', () => {
    cy.visit(
      '/lessons/react-using-react-error-boundaries-to-handle-errors-in-react-components',
    )
    cy.expect('#bmpui-id-204 > .bmpui-image').to.exist

    // the code tab is there and clickable
    cy.expect('#tabs--1--tab--0').to.exist
    cy.get('#tabs--1--tab--1').click().get('#tabs--1--panel--1 > p')

    // another free video page
    cy.visit('/lessons/react-what-is-jsx')
    cy.expect('#bmpui-id-204 > .bmpui-image').to.exist
  })
})
