describe('egghead is working', () => {
  it('loads the homepage', () => {
    cy.visit('/')
    cy.contains('©egghead.io')
  })
})
