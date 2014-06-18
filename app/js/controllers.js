'use strict';

/* Controllers */
var timesheetsControllers = angular.module('timesheetsApp.controllers', []);

/********************
 * Login Controller *
 ********************/
 var LoginController = function($scope, $location, $modal, UserService) {
 	$scope.login = function() {
		// clear error
		$scope.loginEmailError = null;
		$scope.loginPasswordError = null;
		$('#loginEmailGroup').removeClass('has-error');
		$('#loginPasswordGroup').removeClass('has-error');

		var email = $('#loginEmail').val();
		var password = $('#loginPassword').val();
		var emailFormatPattern = new RegExp("^\\s*\\w+(?:\\.{0,1}[\\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\\.[a-zA-Z]+\\s*$");

		if(!email) {
			$scope.loginEmailError = "Please enter an email address";
			$('#loginEmailGroup').toggleClass('has-error');
			return;
		} else if(!emailFormatPattern.test(email)) {
			$scope.loginEmailError = "Invalid email address";
			$('#loginEmailGroup').toggleClass('has-error');
			return;
		} else if(!password) {
			$scope.loginPasswordError = "Please enter your password";
			$('#loginPasswordGroup').toggleClass('has-error');
			return;
		}

		var user = UserService.authenticate(email, password);
		console.log(user);
		if(!user.isAuthenticated) {
			$scope.loginEmailError = "Account not exist or wrong password";
			return;
		}

		window.location = '#/overview';
	}

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

	/* Create Account Modal Controller */
	var CreateAccountModalController = function ($scope, $modalInstance, UserService) {
		$scope.errors = null;

		$scope.create = function () {
			var newPerson = {
				Email: $('#inputEmail').val(),
				FirstName: $('#inputFirstName').val(),
				LastName: $('#inputLastName').val(),
				Password: $('#inputPassword').val(),
				ConfirmPassword: $('#inputConfirmPassword').val()
			};
			var formData = JSON.stringify(newPerson);
			UserService.register(formData, $modalInstance);
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
};

/*******************
 * Main Controller *
 *******************/
var MainController = function ($scope, $filter, $http, $location, UserService, DataService) {
	// user authentication
	var user = UserService.getUserData();
	//if(!user.isAuthenticated) {
	//	window.location = "#/login";
	//} else {
		$scope.user = user;
	//}

	$scope.logout = function () {
		user.isAuthenticated = false;
		window.location = "#/login";
	};

	// templates setting
	DataService.populateData($scope);	

	$scope.navClass = function (page) {
		var currentRoute = $location.path().substring(1) || 'overview';

		$.each($scope.templates, function(index, obj){
			if(obj.name == currentRoute) {
				$scope.template = obj;
			}
		});

		return page === currentRoute ? 'active' : '';
	}

  // table content setting
  $scope.showCustomers = function(sheet) {
  	var selected = $filter('filter')($scope.customers, {id: sheet.customerId});
  	return (sheet.customer && selected.length) ? selected[0].name : 'Not set';
  };

  $scope.showProjects = function(sheet) {
  	//var selected = $filter('filter')($scope.projects, {id: sheet.projectId});
  	//return (sheet.project && selected.length) ? selected[0].name : 'Not set';
  };

  $scope.removeSheet = function(index) {

  };

  // add a new sheet
  $scope.addSheet = function () {
  	var newsheet = {
  		timesheetId: Math.floor((Math.random() * 100) + 1), 
  		user: '', 
  		day: $('#addsheetDay option:selected').text(),
  		id: Math.floor((Math.random() * 100) + 1),
  		customer: $('#addsheetCustomer option:selected').text(),
  		customerId: 1,
  		project: $('#addsheetProject option:selected').text(),
  		projectId: 3,
  		hour: $('#addsheetHour').val()
  	};

  	$scope.mondays.push(newsheet);
  };
};

// Register controllers
timesheetsControllers.controller(
	'LoginController', 
	['$scope', '$location', '$modal', 'UserService', LoginController]);

timesheetsControllers.controller(
	'MainController', 
	['$scope', '$filter', '$http', '$location', 'UserService', 'DataService', MainController]);

