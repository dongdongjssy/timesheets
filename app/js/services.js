'use strict';

/************
 * Services *
 ************/

var timesheetsServices = angular.module('timesheetsApp.services', []);

timesheetsServices.service('DataService', ['$http', function($http){
	// pupulate data for the application
	this.populateData = function(scope) {
		setDays(scope);
		setTemplates(scope);
		setCustomers(scope);
	  setTimesheets(scope);
	};

	// set days
	var setDays = function(scope) {
		scope.days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
	}

	// set templates
	var setTemplates = function(scope) {
		scope.templates = [ 
			{ name: 'overview', url: 'partials/overview.html'},
			{ name: 'reports', url: 'partials/reports.html'},
			{ name: 'analytics', url: 'partials/analytics.html'},
			{ name: 'export', url: 'partials/export.html'} 
		];

		// default template: overview page
		scope.template = scope.templates[0];
	}

	// set customers
	var setCustomers = function(scope) {
		$http({method: 'GET', url: 'data/customers.json'})
		.success(function(data) {
			var customers = [];

			$.each(data, function(index, obj) {
				customers.push(obj);
			});

			scope.customers = customers;
		});
	}

	// get all time sheets for this week.
	var setTimesheets = function(scope) {
		$http({method: 'GET', url: 'data/timesheets.json'})
		.success(function(data){
			scope.timesheets = [];

			$.each(data, function(i, timesheet) {
				var timesheets = [];
				$.each(timesheet.entries, function(j, entry) {
					timesheets.push({
						timesheetId: timesheet.timesheetId, 
						userName: timesheet.userName, 
						day: timesheet.day,
						entryId: entry.entryId,
						customerName: entry.customerName,
						customerId: entry.customerId,
						projectName: entry.projectName,
						projectId: entry.projectId,
						hour: entry.hour
					}); // end push
				}); // end each entry

				if(timesheet.day == scope.days[0]){
					scope.timesheets[0] = timesheets;
				} else if(timesheet.day == scope.days[1]){
					scope.timesheets[1] = timesheets;
				} else if(timesheet.day == scope.days[2]){
					scope.timesheets[2] = timesheets;
				} else if(timesheet.day == scope.days[3]){
					scope.timesheets[3] = timesheets;
				} else if(timesheet.day == scope.days[4]){
					scope.timesheets[4] = timesheets;
				}
			}); // end each timesheet
		});// end success function
	};
}]);// end data service

timesheetsServices.service('UserService', ['$http', '$cookieStore', function($http, $cookieStore){

	var userData = {
		isAuthenticated: false,
		username: '',
		vearerToken: '',
		expirationDate: null
	};

	this.getUserData = function() { return userData; }

	// authenticate user
	this.authenticate = function(email, password, successCallback, errorCallback) {
		$http({method: 'GET', url: 'data/accounts.json'})
		.success(function(data){
			$.each(data, function(index, obj){
				if(obj.email == email && obj.password == password) {
					console.log("Login success as [" + obj.email + ", " + obj.password + "]");
					userData.isAuthenticated = true;
					userData.username = obj.firstname + " " + obj.lastname;

					$cookieStore.put('userData', userData);

					if(typeof successCallback === 'function') {
						successCallback();
					}
				}
			});
		})
		.error(function(data) {
			if(typeof errorCallback === 'function') {
				errorCallback();
			}
		});
	};

	// register new user
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

}]);// end user service