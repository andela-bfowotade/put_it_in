'use strict';

var customersApp = angular.module('customers');

customersApp.controller('CustomersController', ['$scope', '$stateParams', 'Authentication', 'Customers', '$modal', '$log', 'Notify',
  function($scope, $stateParams, Authentication, Customers, $modal, $log, Notify) {
    
    $scope.authentication = Authentication;

    //find a list of customers
    $scope.customers = Customers.query();

     /*
    //------------CREATE-------
    */
    $scope.create = function() {
      var customer = new Customers ({
        firstName: this.firstName,
        lastName: this.lastName,
        suburb: this.suburb,
        email: this.email,
        phone: this.phone,
        industry: this.industry,
        channel: this.channel,
        referred: this.referred,
        country: this.country
      });
      //redirect after save
      customer.$save(function(response) {
        Notify.sendMsg('NewCustomer', {'id': response._id});

      },

      function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

     //open a modal window to create a single customer record
    $scope.modalCreate = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'modules/customers/views/create-customer.client.view.html',
        controller: function ($scope, $modalInstance) {

          $scope.ok = function () {
              $modalInstance.close();
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        },
        size: size
      });

      modalInstance.result.then(function (selectedItem) {
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    /*
    //------------UPDATE-------
    */
    $scope.update = function(updatedCustomer) {
      var customer = updatedCustomer;

      customer.$update(function() {
        // $location.path('customers/' + customer._id);
      },
      function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });

    };

    //options for channels
    $scope.channelOPtions = [
      {id:'1', channelReferral:'Facebook'},
      {id:'2', channelReferral:'Twitter'},
      {id:'3', channelReferral:'Google'},
      {id:'4', channelReferral:'Email'}
    ];

    //open a modal window to update a single customer record
  $scope.modalUpdate = function (size, selectedCustomer) {

    var modalInstance = $modal.open({
      templateUrl: 'modules/customers/views/edit-customer.client.view.html',
      controller: function ($scope, $modalInstance, customer) {
        $scope.customer = customer;

        $scope.ok = function () {
            $modalInstance.close($scope.customer);
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      },
      size: size,
      resolve: {
        customer: function () {
          return selectedCustomer;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

   /*
    //------------ END UPDATE-------
    */

    //remove existing user
    $scope.remove = function(customer) {
      if  (customer) {
          customer.$remove();

          for (var i in this.customers) {
            if (this.customers[i] === customer) {
                this.customers.splice(i, 1);
            }
          }
      }
      else {
        this.customer.$remove(function() {
          // $location.path('customers');
        });
      }
    };
  }

]); //end module

customersApp.controller('CustomersCreateController', ['$scope', 'Customers', 'Notify',
  function($scope, Customers, Notify) {

     $scope.create = function() {
      var customer = new Customers ({
        firstName: this.firstName,
        lastName: this.lastName,
        suburb: this.suburb,
        email: this.email,
        phone: this.phone,
        industry: this.industry,
        channel: this.channel,
        referred: this.referred,
        country: this.country
      });
      //redirect after save
      customer.$save(function(response) {
        Notify.sendMsg('NewCustomer', {'id': response._id});

      },

      function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

  }
]); //end module


//Customer views directive
customersApp.directive('customerList', ['Customers', 'Notify', function(Customers, Notify) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/customers/views/customer-directive.client.view.html',
    link: function (scope, element, attrs) {
      //when a new customer is added, update the customer list
      Notify.getMsg('NewCustomer', function(event, data) {

        //find a list of customers
        scope.customers = Customers.query();

      });
    }
  };
}]);
