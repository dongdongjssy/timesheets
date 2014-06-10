'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var timesheetsServices = angular.module('timesheetsApp.services', []);

timesheetsServices.value('version', '0.1');

timesheetsServices.service('User', function User(){
  var userData = {
    isAuthenticated: false,
    username: '',
    vearerToken: '',
    expirationDate: null
  };

  this.getUserData = function() {
    return userData;
  }
});
