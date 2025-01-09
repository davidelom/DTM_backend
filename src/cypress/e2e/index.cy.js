describe('Home Page Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the Get Started button when user is not logged in', () => {
    cy.get('#get_started')
      .should('be.visible')
      .and('have.attr', 'href', '/login')
      .and('contain.text', 'Get Started');
  });

  it('should redirect to the login page when clicking Get Started', () => {
    cy.get('#get_started').click();
    cy.url().should('include', '/login');
  });

});
