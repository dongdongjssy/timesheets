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

var CreateAccountModalController = function ($scope, $modalInstance, $http) {
	$scope.create = function () {
		var newPerson = {
			Email: $('#inputEmail').val(),
			FirstName: $('#inputFirstName').val(),
			LastName: $('#inputLastName').val(),
			Password: $('#inputPassword').val(),
			ConfirmPassword: $('#inputConfirmPassword').val()
		};

		$http.post(
			'http://192.168.0.153/TimesheetsWebAPI/Help/Api/POST-api-Account-Register',
			JSON.stringify(newPerson)).success(function(data, status){
				console.log(data);
			});

    //$modalInstance.close();
  };

  $scope.cancelCreate = function () {
  	$modalInstance.dismiss('cancel');
  };
};

var ForgotPasswordModalController = function ($scope, $modalInstance, $http) {
	$scope.sendEmail = function () {
    $modalInstance.close();
  };

  $scope.cancelSend = function () {
  	$modalInstance.dismiss('cancel');
  };
};

/* Forgot Password Controller */

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
