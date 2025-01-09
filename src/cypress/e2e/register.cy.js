describe('Page Register', () => {
  beforeEach(() => {
    cy.visit('/register');

  });

  it('should display the register form', () => {
    cy.get('form[action="/register"]').should('be.visible');
    cy.get('input[name="username"]').should('have.attr', 'placeholder', 'Username');
    cy.get('input[name="email"]').should('have.attr', 'placeholder', 'Email');
    cy.get('input[name="password"]').should('have.attr', 'placeholder', 'Password');
    cy.get('button[type="submit"]').should('contain.text', 'Register');
  });

  it('should display an error message on failed registration', () => {
    cy.get('form').fillFormAndSubmit({
      username: { text: Cypress.env('CREATE_USER') || "user" },
      email: { text: Cypress.env('CREATE_EMAIL') || "demoUser@demo.com" },
      password: { text: Cypress.env('CREATE_PASSWORD') || "DemoPasswword8@" },
    });

    cy.get('#message_error').should('be.visible').and('contain.text', 'Le nom d\'utilisateur ou l\'email existe déjà.');
  });

  it('should redirect to /tasks on successful registration', () => {
    cy.get('form').fillFormAndSubmit({
      username: { text: Cypress.env('INCORRECT_USER') || "test_wronguserdemo" },
      email: { text: Cypress.env('INCORRECT_EMAIL') || "wrongemaildemo@wrongemail.com" },
      password: { text: Cypress.env('INCORRECT_PASSWORD') || "WrongPassword8@" },
    });

    cy.url().should('include', '/tasks');
  });

  it('should redirect to login page when clicking Sign in', () => {
    cy.get('#link_login').click();
    cy.url().should('include', '/login');
  });

});

describe('Password Validation UI', () => {
    beforeEach(() => {
        cy.visit('/register')
    })

    it('should show password requirements in real-time', () => {
        const password = cy.get('#password')
        
        password.type('a')
        cy.get('#lowercase').should('have.class', 'text-green-500')
        cy.get('#uppercase').should('have.class', 'text-red-500')
        
        password.clear().type('A')
        cy.get('#lowercase').should('have.class', 'text-red-500')
        cy.get('#uppercase').should('have.class', 'text-green-500')
        
        password.clear().type('Ab1')
        cy.get('#number').should('have.class', 'text-green-500')
        
        password.clear().type('Ab1!')
        cy.get('#special').should('have.class', 'text-green-500')
        
        // Test un mot de passe valide
        password.clear().type('Password123!')
        cy.get('#length').should('have.class', 'text-green-500')
        cy.get('#uppercase').should('have.class', 'text-green-500')
        cy.get('#lowercase').should('have.class', 'text-green-500')
        cy.get('#number').should('have.class', 'text-green-500')
        cy.get('#special').should('have.class', 'text-green-500')
        cy.get('#space').should('have.class', 'text-green-500')
    })

    it('should prevent form submission with invalid password', () => {
        // Remplir le formulaire avec un mot de passe invalide
        cy.get('#username').type('testuser')
        cy.get('#email').type('test@test.com')
        cy.get('#password').type('weak')
        
        cy.get('form').submit()
        
        // Vérifier que nous sommes toujours sur la page d'inscription
        cy.url().should('include', '/register')
    })
})