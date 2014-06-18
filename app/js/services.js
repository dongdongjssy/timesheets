'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
var timesheetsServices = angular.module('timesheetsApp.services', []);

timesheetsServices.service('DataService', ['$http', function($http){
	var getTimesheets = function(index, scope) {

		$http({method: 'GET', url: 'data/timesheets.json'})
		.success(function(data){
			var timesheets = [];

			$.each(data, function(i, timesheet) {
				if(timesheet.Date === scope.days[index]){
					$.each(timesheet.Entries, function(j, entry) {
						timesheets.push({
							timesheetId: timesheet.Id, 
							user: timesheet.ApplicationUserName, 
							day: timesheet.Date,
							id: entry.Id,
							customer: entry.CustomerName,
							customerId: entry.CustomerId,
							project: entry.ProjectName,
							projectId: entry.ProjectId,
							hour: entry.Hours
						});
					});
				}
			});

			switch(index) {
				case 0:
					scope.mondays = timesheets;
					break;
				case 1:
					scope.tuesdays = timesheets;
					break;
				case 2:
					scope.wednesdays = timesheets;
					break;
				case 3:
					scope.thursdays = timesheets;
					break;
				case 4:
					scope.fridays = timesheets;
					break;
				default:
					break;
			}

		});

	};

	this.populateData = function(scope) {
		// set days
		scope.days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
		//scope.today = (new Date()).getDay();

		// set templates
		scope.templates = [ 
			{ name: 'overview', url: 'partials/overview.html'},
			{ name: 'reports', url: 'partials/reports.html'},
			{ name: 'analytics', url: 'partials/analytics.html'},
			{ name: 'export', url: 'partials/export.html'} 
		];

		scope.template = scope.templates[0];

		// set customers
		$http({method: 'GET', url: 'data/customers.json'})
		.success(function(data) {
			var customers = [];

			$.each(data, function(index, obj) {
				customers.push({ id: obj.Id, name: obj.Name, projects: obj.Projects });
			});

			scope.customers = customers;
		});

		// set timesheets
	  for(var i=0; i<5; i++) {
	  	getTimesheets(i, scope);
	  }
	};

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