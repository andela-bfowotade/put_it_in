'use strict';

//require mongoose
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Customer = mongoose.model('Customer'),
  _= require('lodash');

  /*
  'Create a customer'
  */
  exports.create = function(req, res) {
    var customer = new Customer(req.body);
    customer.user = req.user;

    customer.save(function(err) {
      if(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      else {
        res.json(customer);
      }
    });
  };

  /*show customers*/
  exports.read = function(req, res) {
    res.json(req.customer);
  };

  //update customers record

  exports.update = function(req, res) {
    var customer = req.customer;

    customer = _.extend(customer, req.body);

    customer.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      else {
        res.json(customer);
      }
    });
  };

  /**delete a customer */
  exports.delete = function(req, res) {
    var customer = req.customer;

    customer.remove(function(err) {
      if(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      else {
        res.json(customer);
      }
    });
  };

/**list the customers */
exports.list = function(req, res) {
  Customer.find().sort('-created').populate('user', 'displayName').exec(function(err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else {
      res.json(customers);
    }
  });
};

//cutomers middleware --this will find a customer by ID
exports.customerByID = function(req, res, next, id) {
  Customer.findById(id).populate('user', 'displayName').exec(function(err, customer) {
    if (err) return next(err);
    if(!customer) return next(new Error('Sorry Customer data could be loaded ' + id));
    req.customer = customer;
    next();
  });
};

/**authorization middleware**/
exports.hasAuthorization = function(req, res, next) {
  if (req.customer.user.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};