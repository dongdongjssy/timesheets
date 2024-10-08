'use strict';

$(document).ready(function(){
  // Disable caching for all AJAX requests (this is necessary to prevent IE from caching AJAX requests).
  $.ajaxSetup({
      cache:false
  });
});

// Declare app level module which depends on filters, and services
var timesheetsApp = angular.module('timesheetsApp', [
  'ngCookies',
  'ngAnimate',
  'ui.router',
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

timesheetsApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
      })
      .state('main', {
        url: '/main',
        templateUrl: 'partials/main.html',
        controller: 'MainController'
      })
      .state('main.overview', {
        url: '/overview',
        templateUrl: 'partials/main-overview.html',
        controller: 'MainController'
      })
      .state('main.analytics', {
        url: '/analytics',
        templateUrl: 'partials/main-analytics.html',
        controller: 'MainController'
      })
      .state('main.reports', {
        url: '/reports',
        templateUrl: 'partials/main-reports.html',
        controller: 'MainController'
      })
      .state('main.export', {
        url: '/export',
        templateUrl: 'partials/main-export.html',
        controller: 'MainController'
      })
      .state('main.users', {
        url: '/users',
        templateUrl: 'partials/admin-users.html',
        controller: 'AdminController'
      })
      .state('main.customers', {
        url: '/customers',
        templateUrl: 'partials/admin-customers.html',
        controller: 'AdminController'
      })
      .state('main.projects', {
        url: '/projects',
        templateUrl: 'partials/admin-projects.html',
        controller: 'AdminController'
      });
	}
]);
