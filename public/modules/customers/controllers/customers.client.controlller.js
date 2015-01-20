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
        country: this.country,
        rating: this.rating
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
    $scope.channelOptions = [
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
    //------------ ./END UPDATE-------
    */


     /*
    //------------FIND ONE CUSTOMER-------
    */
    $scope.findOne = function() {
     /*
    //------------ RATING FRONTEND-------
    */
    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };

    $scope.ratingStates = [
      {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
      {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
      {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
      {stateOn: 'glyphicon-heart'},
      {stateOff: 'glyphicon-off'}
    ];
      $scope.customer = Customers.get({
        customerId: $stateParams.customerId
      });
    };

    /*
    //------------ RATING BACKEND-------
    */
    $scope.updateRating = function (rating) {

      var rateLoop = function () {
        var lenRating = $scope.customer.rating.length;
        for (var i = 0; i < lenRating; i++) {
          return lenRating;
        }
      };
      rateLoop();

      var newRate = (rateLoop() + rating) / 2; //get average

      $scope.customer.rating.push(newRate);
      $scope.update($scope.customer);
    };

    /*
    //------------ REVIEW BACKEND-------
    */
    $scope.updateReview = function (review) {
      var data = {
        review: $scope.personReview
      };
      $scope.customer.reviews.push(data);
      $scope.update($scope.customer);
    };



    /*
    //------------ REMOVE-------
    */
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


//filter to capitalize first Letter for the reviewers name
customersApp.filter('capitalize', function() {
  return function(input, scope) {
    if (input!== null)
    input = input.toLowerCase();
    return input.substring(0,1).toUpperCase()+input.substring(1);
  };

});