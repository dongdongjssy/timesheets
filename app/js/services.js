'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
var timesheetsServices = angular.module('timesheetsApp.services', []);

timesheetsServices.service('DataService', ['$http', function($http){

	this.getDays = function() {
		var days = ['Monday','Tuesday','Wensday','Thursday','Friday']; 
		return days;
	};

	this.getTemplates = function() { 
		var templates = [ 
			{ name: 'overview', url: 'partials/overview.html'},
			{ name: 'reports', url: 'partials/reports.html'},
			{ name: 'analytics', url: 'partials/analytics.html'},
			{ name: 'export', url: 'partials/export.html'} 
		];

		return templates; 
	};

	this.getCustomers = function() {
		var customers = [];

		$http({method: 'GET', url: 'data/customers.json'})
		.success(function(data) {
			$.each(data, function(index, obj) {
				customers.push({id: obj.Id, name: obj.Name});
			});
		});

		return customers; 
	};

	this.getProjects = function() { 
		var projects = []; 

		$http({method: 'GET', url: 'data/projects.json'})
		.success(function(data) {
			$.each(data, function(index, obj) {
				projects.push({id: obj.Id, name: obj.Name});
			});
		});

		return projects; 
	};

	this.getTimesheets = function() {
		var timesheets = [];

		$http({method: 'GET', url: 'data/timesheets.json'})
		.success(function(data){
			$.each(data, function(index, obj) {
				
			});
		});

		return timesheets;
	} 
}]);

timesheetsServices.service('UserService', ['$http', function($http){

	var userData = {
		isAuthenticated: false,
		username: '',
		vearerToken: '',
		expirationDate: null
	};

	this.authenticate = function(email, password) {
		$http({method: 'GET', url: 'data/accounts.json'})
		.success(function(data){
			$.each(data, function(index, obj){
				if(obj.Email == email && obj.Password == password) {
					console.log("Login success as [" + obj.Email + ", " + obj.Password + "]");
					userData.isAuthenticated = true;
					userData.username = obj.FirstName + " " + obj.LastName;

					return userData;
				}
			});
		})
		.error(function(status) {
			console.log(status);
		});

		return userData;
	};

	this.register = function(formData, modalInstance) {
		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "http://192.168.0.153/TimesheetsWebAPI/api/Account/Register",
			data: formData,
			success: function(data, textStatus, jqXHR){
				modalInstance.close();
			},
			error: function(data, textStatus, errorThrown) {
				var errors = [];
				for (var key in data.responseJSON.ModelState) {
					for (var i = 0; i < data.responseJSON.ModelState[key].length; i++) {
						errors.push(data.responseJSON.ModelState[key][i]);
					}
				}
				//var obj = data.responseJSON.ModelState;
				//console.log(obj.length);
				$scope.errors = errors;
			}
		});
	};

	this.getUserData = function() { return userData; }
}]);