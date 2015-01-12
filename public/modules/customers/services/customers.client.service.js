'use strict';

angular.module('customers')

//Customers service used for communicating with the customers REST endpoints
.factory('Customers', ['$resource',
	function($resource) {
		return $resource('customers/:customerId', {
			customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])

//service to update customer list without manual page refresh
.factory('Notify', ['$rootScope',
	function($rootScope) {

		var notify = {};
		notify.sendMsg = function(msg, data) {
			data = data || {};
			$rootScope.$emit(msg, data);

			console.log('mesage sent!');
		};

		notify.getMsg = function(msg, func, scope) {
			var unbind = $rootScope.$on(msg, func);

			if(scope) {
				scope.$on('destroy', unbind);
			}
		};
		return notify;
	}
]);