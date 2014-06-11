'use strict';

/* Controllers */
var timesheetsControllers = angular.module('timesheetsApp.controllers', []);

/* Login Controller */
var LoginController = function($scope, $location, $modal, User) {
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

		var user = User.authenticate(email, password);
		if(!user.isAuthenticated) {
			$scope.loginEmailError = "Account not exist or wrong password";
			return;
		}

		window.location = '#/main';
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
};

/* Create Account Modal Controller */
var CreateAccountModalController = function ($scope, $modalInstance) {
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
var MainController = function ($scope, User) {
	var user = User.getUserData();
	if(!user.isAuthenticated) {
		window.location = "#/login";
	} else {
		$scope.user = user;
	}

	$scope.logout = function () {
		user = null;
		window.location = "#/login";
	};
};

// Register controllers
timesheetsControllers.controller('LoginController', ['$scope', '$location', '$modal', 'User', LoginController]);
timesheetsControllers.controller('MainController', ['$scope', 'User', MainController]);

