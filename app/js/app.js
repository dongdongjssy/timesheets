'use strict';

$(document).ready(function(){
  // Disable caching for all AJAX requests (this is necessary to prevent IE from caching AJAX requests).
  $.ajaxSetup({
      cache:false
  });
});

// Declare app level module which depends on filters, and services
var timesheetsApp = angular.module('timesheetsApp', [
	'ngRoute',
  'ngCookies',
  'ngAnimate',
	'ui.bootstrap',
	'timesheetsApp.filters',
	'timesheetsApp.services',
	'timesheetsApp.directives',
	'timesheetsApp.controllers'
  ], function($httpProvider){
	// Use x-www-form-urlencoded Content-Type
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
   var param = function(obj) {
   	var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
   	
   	for(name in obj) {
   		value = obj[name];
   		
   		if(value instanceof Array) {
   			for(i=0; i<value.length; ++i) {
   				subValue = value[i];
   				fullSubName = name + '[' + i + ']';
   				innerObj = {};
   				innerObj[fullSubName] = subValue;
   				query += param(innerObj) + '&';
   			}
   		}
   		else if(value instanceof Object) {
   			for(subName in value) {
   				subValue = value[subName];
   				fullSubName = name + '[' + subName + ']';
   				innerObj = {};
   				innerObj[fullSubName] = subValue;
   				query += param(innerObj) + '&';
   			}
   		}
   		else if(value !== undefined && value !== null)
   			query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
   	}
   	
   	return query.length ? query.substr(0, query.length - 1) : query;
   };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
  	return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});

timesheetsApp.config(['$routeProvider', 
	function($routeProvider) {
		$routeProvider
		.when('/login', {
			templateUrl: 'partials/login.html', 
			controller: 'LoginController'
		})
    .when('/overview', {
      templateUrl: 'partials/main.html', 
      controller: 'MainController'
    })
    .when('/reports', {
      templateUrl: 'partials/main.html', 
      controller: 'MainController'
    })
    .when('/analytics', {
      templateUrl: 'partials/main.html', 
      controller: 'MainController'
    })
    .when('/export', {
      templateUrl: 'partials/main.html', 
      controller: 'MainController'
    })
		.otherwise({redirectTo: '/login'});
	}
]);
