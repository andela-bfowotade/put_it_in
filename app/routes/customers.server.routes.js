'use strict';


var users = require('../../app/controllers/users.server.controller'),
  customers = require('../../app/controllers/customers.server.controller');

  module.exports = function(app) {
    //customer routes
    app.route('/customers')
        .get(customers.list)
        .post(users.requiresLogin, customers.create);

    app.route('/customers/:customerId')
      .get(customers.read)
      .put(users.requiresLogin, customers.update)
      .delete(users.requiresLogin, customers.hasAuthorization, customers.delete);

      //finish by binding the customer middleware
      app.param('customerId', customers.customerByID);
  };