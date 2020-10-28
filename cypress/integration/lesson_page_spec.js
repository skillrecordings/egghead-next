describe('lesson page', () => {
  it('video element loads', () => {
    cy.visit(
      '/lessons/react-using-react-error-boundaries-to-handle-errors-in-react-components',
    )
    cy.get('#egghead-player', {timeout: 10000}).should('exist')
  })
  it('tabs load', () => {
    cy.visit(
      '/lessons/react-using-react-error-boundaries-to-handle-errors-in-react-components',
    )
    cy.get('#tabs--1--tab--0').should('be.visible')
    cy.get('#tabs--1--panel--0').should('be.visible')
    cy.get('#tabs--1--panel--1').should('not.be.visible')
    cy.get('#tabs--1--tab--1').click()
    cy.get('#tabs--1--panel--1').should('be.visible')
    cy.get('#tabs--1--panel--0').should('not.be.visible')
  })
})
