/// <reference types="cypress" />

describe('Character count limits', () => {
    beforeEach(() => {
        cy.visit(__dirname + '/index.html');
    });

    it('adds the character count to the default statusbar', () => {
        cy.get('.editor-statusbar .characters')
            .should('have.text', '0 / 10 (minimum 5)')
            .and('have.class', 'character-count-warning')
            .and('have.attr', 'aria-live', 'polite')
            .and('have.attr', 'aria-label', '0 characters out of 10 maximum; 5 minimum');
    });

    it('warns near the maximum and alerts at and above it', () => {
        cy.get('.CodeMirror').type('12345');
        cy.get('.editor-statusbar .characters')
            .should('have.text', '5 / 10')
            .and('not.have.class', 'character-count-warning')
            .and('not.have.class', 'character-count-error');

        cy.get('.CodeMirror').type('6789');
        cy.get('.editor-statusbar .characters')
            .should('have.text', '9 / 10 (near limit)')
            .and('have.class', 'character-count-warning')
            .and('not.have.class', 'character-count-error');

        cy.get('.CodeMirror').type('0');
        cy.get('.editor-statusbar .characters')
            .should('have.text', '10 / 10 (limit reached)')
            .and('have.class', 'character-count-error')
            .and('have.attr', 'aria-live', 'assertive');

        cy.get('.CodeMirror').type('1');
        cy.get('.editor-statusbar .characters')
            .should('have.text', '11 / 10 (1 over limit)')
            .and('have.class', 'character-count-error');
    });

    it('supports a character count without limits', () => {
        cy.visit(__dirname + '/index-no-limits.html');
        cy.get('.editor-statusbar .characters').should('have.text', '0');

        cy.get('.CodeMirror').type('Hello world');
        cy.get('.editor-statusbar .characters')
            .should('have.text', '11')
            .and('not.have.class', 'character-count-warning')
            .and('not.have.class', 'character-count-error');
    });
});
