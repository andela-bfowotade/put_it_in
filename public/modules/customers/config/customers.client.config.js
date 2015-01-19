
'use strict';

// Configuring the Customers module
angular.module('customers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Show All', 'customers', 'customers');
	}
]);