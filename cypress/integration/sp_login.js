describe('UseCase 05. Login', function() {
	it('Login and suceeds', function() {
		cy.visit('http://localhost:2000/');
		cy.get('#login-user').type('admin');
		cy.get('#login-password').type('admin');
		cy.contains('login.login').click();
		/*cy.get('.loginError').then(($el) =>
			expect($el).to.contain('Please wait')
		);*/
		// TODO: Wait for add
	});

	it('Clear cookies, try to login but fails', function() {
		cy.clearCookies();
		cy.visit('http://localhost:2000/');
		cy.get('#login-user').type('admin');
		cy.get('#login-password').type('wrongpassword');
		cy.contains('login.login').click();
		/*cy.get('.loginError').then(($el) =>
			expect($el).to.contain('Please wait')
		);*/
		cy.wait(2000);
		cy.get('#error').then(($el) =>
			expect($el).to.contain('error')
		);
	});
});
