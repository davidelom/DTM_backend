
  beforeEach(() => {
    cy.visit('/login');

    const user = Cypress.env('CREATE_USER') || "user"
    const password = Cypress.env('CREATE_PASSWORD') || "DemoPasswword8@"

    cy.get('#username').type(user);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();

  });

describe('Task Management', () => {

  it('should add a new task', () => {
      cy.url().should('include', '/tasks');

      const taskTitle = `Task ${Date.now()}`
      
      cy.get('form').fillFormAndSubmit({
        title: {text:taskTitle},
        description: {text:'test_e2e_This is a test task description', type:'textarea'}
      })

      cy.get('.bg-gray-50.p-4')
      .should('contain', taskTitle)
        .and('contain', 'test_e2e_This is a test task description')
    })

  it('should mark task as completed', () => {
    cy.url().should('include', '/tasks');
    const taskTitle = `Task ${Date.now()}`
    
    cy.get('form').fillFormAndSubmit({
      title: {text:taskTitle},
      description: {text:'test_e2e_Task to be completed', type:'textarea'}
    })

     cy.get('.bg-gray-50.p-4') 
      .contains('h3', taskTitle) 
      .closest('.bg-gray-50.p-4')
      .within(() => {
        cy.get('input[type="checkbox"]').check()
      })

    cy.get('.bg-gray-50.p-4')
      .contains('h3', taskTitle)
      .should('have.class', 'line-through')
  })

  it('should delete a task', () => {
    cy.url().should('include', '/tasks');
    const taskTitle = `Task to delete ${Date.now()}`
    

    cy.get('form').fillFormAndSubmit({
      title: {text:taskTitle},
      description: {text:'This task will be deleted', type:'textarea'}
    })

    cy.get('.bg-gray-50.p-4')
      .contains('h3', taskTitle)
      .closest('.bg-gray-50.p-4')
      .within(() => {
        cy.get('a')
          .contains('Supprimer')
          .click()
      })
    })
})