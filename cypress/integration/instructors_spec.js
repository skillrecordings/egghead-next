describe('instructors', () => {
  it('/instructors loads', () => {
    cy.visit('/instructors')
    cy.get('img').should('have.length', 24)
  })
})

describe('instructor/john-lindquist', () => {
  it('instructors/john-lindquist loads', () => {
    cy.visit('/instructors/john-lindquist')
    cy.get('img').should('have.length', 1)
  })
})
