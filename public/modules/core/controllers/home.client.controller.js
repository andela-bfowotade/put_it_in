'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Customers',
  function($scope, Authentication, Customers) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.customers = Customers.query();

    $scope.alerts = [
      {
        icon: 'glyphicon-user',
        color: 'btn-success',
        total: $scope.customers,
        description: 'TOTAL CUSTOMERS'
      },
      {
        icon: 'glyphicon-calendar',
        color: 'btn-primary',
        total: '8,382',
        description: 'UPCOMING EVENTS'
      },
      {
        icon: 'glyphicon-edit',
        color: 'btn-success',
        total: '527',
        description: 'NEW CUSTOMERS IN 24hrs'
      }, 
      {
        icon: 'glyphicon-record',
        color: 'btn-info',
        total: '85,000',
        description: 'EMAILS SENT'
      },
      {
        icon: 'glyphicon-eye-open',
        color: 'btn-warning',
        total: '268',
        description: 'FOLLOW UPS REQUIRED'
      },
      {
        icon: 'glyphicon-flag',
        color: 'btn-danger',
        total: '348',
        description: 'REFERRALS TO MODERATE'
      }
    ];
  }
]);