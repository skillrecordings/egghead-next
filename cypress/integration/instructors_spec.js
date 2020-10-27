describe('instructors', () => {
  it('/instructors loads', () => {
    cy.visit('/instructors')
    cy.get('img').should('have.length', 24)
  })
})

describe('instructor/john-lindquist', () => {
  it('instructors/john-lindquist redirects to search page', () => {
    cy.visit('/instructors/john-lindquist')
    cy.url().should('include', '/s/content-by-john-lindquist')
  })
})
