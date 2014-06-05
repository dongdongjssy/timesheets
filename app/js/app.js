'use strict';


// Declare app level module which depends on filters, and services
var timesheetsApp = angular.module('timesheetsApp', [
  'ngRoute',
  'ngGrid',
  'ui.bootstrap',
  'timesheetsApp.filters',
  'timesheetsApp.services',
  'timesheetsApp.directives',
  'timesheetsApp.controllers'
]);

timesheetsApp.config(['$routeProvider', 
	function($routeProvider) {
  		$routeProvider.
	  		when('/login', {
	  			templateUrl: 'partials/login.html', 
	  			controller: 'LoginController'
	  		}).
	  		when('/main', {
	  			templateUrl: 'partials/main.html', 
	  			controller: 'MainController'
	  		})
	  		.otherwise({redirectTo: '/login'});
}]);
