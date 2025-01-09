describe('Page Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.get('form[action="/login"]').should('be.visible');
    cy.get('input[name="username"]').should('have.attr', 'placeholder', 'Username');
    cy.get('input[name="password"]').should('have.attr', 'placeholder', 'Password');
    cy.get('button[type="submit"]').should('contain.text', 'Sign in');
  });

  it('should display an error message on failed login', () => {
    cy.get('form').fillFormAndSubmit({
      username: { text: Cypress.env('INCORRECT_USER') || "wronguserdemo" },
      password: { text: Cypress.env('INCORRECT_PASSWORD') || "WrongPassword8@" },
    })

    cy.get('#message_error').should('be.visible').and('contain.text', 'Invalid username or password.');
  });

  it('should redirect to /tasks on successful login', () => {
    cy.get('form').fillFormAndSubmit({
      username: { text: Cypress.env('CREATE_USER') || "user" },
      password: { text: Cypress.env('CREATE_PASSWORD') || "DemoPasswword8@" },
    })

    cy.url().should('include', '/tasks');
  });

  it('should redirect to register page when clicking Register here', () => {
    cy.get('#link_register').click();
    cy.url().should('include', '/register');
  });

});
