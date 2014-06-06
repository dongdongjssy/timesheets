'use strict';

/* Controllers */

var timesheetsControllers = angular.module('timesheetsApp.controllers', []);

/* Login Controller */
var LoginController = function($scope, $modal) {
	$scope.openCreateAccountModal = function() {
		var modalInstance = $modal.open({
			templateUrl: 'createAccount.html',
			controller: CreateAccountModalController,
			keyboard: false, // hitting ESC key will not close the modal
			backdrop: 'static' // modal window is ont closed when clicking outside of the modal window
		});
	};

	$scope.openForgotPasswordModal = function() {
		var modalInstance = $modal.open({
			templateUrl: 'forgotPassword.html',
			controller: ForgotPasswordModalController,
			keyboard: false, // hitting ESC key will not close the modal
			backdrop: 'static' // modal window is ont closed when clicking outside of the modal window
		});
	};
};

/* Create Account Modal Controller */
var CreateAccountModalController = function ($scope, $modalInstance) {
	$scope.create = function () {
		var newPerson = {
			Email: $('#inputEmail').val(),
			FirstName: $('#inputFirstName').val(),
			LastName: $('#inputLastName').val(),
			Password: $('#inputPassword').val(),
			ConfirmPassword: $('#inputConfirmPassword').val()
		};
		var formData = JSON.stringify(newPerson);

		$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "http://192.168.0.153/TimesheetsWebAPI/api/Account/Register",
			data: formData,
			success: function(data, textStatus, jqXHR){
				$modalInstance.close();
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
				console.log($scope.errors);
			}
		});
	};

	$scope.cancelCreate = function () {
		$modalInstance.dismiss('cancel');
	};
};

/* Forgot Password Modal Controller */
var ForgotPasswordModalController = function ($scope, $modalInstance, $http) {
	$scope.sendEmail = function () {
		$modalInstance.close();
	};

	$scope.cancelSend = function () {
		$modalInstance.dismiss('cancel');
	};
};

/* Main Controller */
var MainController = function ($scope) {
	$scope.myData = [{name: "Moroni", age: 50},
	{name: "Tiancum", age: 43},
	{name: "Jacob", age: 27},
	{name: "Nephi", age: 29},
	{name: "Enos", age: 34}];

	$scope.gridOptions = {
		data: 'myData',
		enableCellSelection: true,
		enableRowSelection: false,
		enableCellEdit: true,
		columnDefs: [{field: 'name', displayName: 'Name', enableCellEdit: true}, 
		{field:'age', displayName:'Age', enableCellEdit: true}]
	};
};

// Register controllers
timesheetsControllers.controller('LoginController', LoginController);
timesheetsControllers.controller('MainController', MainController);
