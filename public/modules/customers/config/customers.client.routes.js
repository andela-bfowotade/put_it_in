'use strict';

angular.module('customers').config(['$stateProvider', 
  function($stateProvider) {

    $stateProvider
      .state('listCustomers', {
        url: '/customers',
        templateUrl: 'modules/customers/views/list-customers.client.view.html'
      })
      .state('reviewCustomers', {
      	url: '/customers/:customerId',
      	templateUrl: 'modules/customers/views/reviews-customer.client.view.html'
      });
   }
]);