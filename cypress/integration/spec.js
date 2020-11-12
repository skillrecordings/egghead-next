describe('egghead is working', () => {
  it('loads the homepage', () => {
    cy.visit('/')
    cy.contains('©egghead.io')
  })
})

describe('course dependencies', () => {
  const topicsHeader = `What you'll learn`

  it('show topics when dependencies present', () => {
    cy.visit('/courses/build-an-app-with-the-aws-cloud-development-kit')
    cy.contains(topicsHeader)
  })

  it('hides topics when dependencies absent', () => {
    cy.visit('/courses/record-badass-screencasts-for-egghead-io')
    cy.contains(topicsHeader).should('not.exist')
  })
})
