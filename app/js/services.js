'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
var timesheetsServices = angular.module('timesheetsApp.services', []);

timesheetsServices.value('version', '0.1');

timesheetsServices.service('User', ['$http', function($http){

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

	this.getUserData = function() {
		return userData;
	}

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
}]);
