'use strict';

/* Controllers */
var timesheetsControllers = angular.module('timesheetsApp.controllers', []);

/************************* Login Controller *************************/
 var LoginController = function($scope, $state, $location, $modal, UserService) {
 	function onSuccessfulLogin() {
 		$state.go('main.overview');
 	}

 	function onFailedLogin() {
 		$scope.loginEmailError = "Account not exist or wrong password";
		return;
 	}

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

		UserService.authenticate(email, password, onSuccessfulLogin, onFailedLogin);
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

/************************* Main Controller *************************/
var MainController = function ($scope, $state, $cookieStore, $location, DataService) {
	// populate data for application
	DataService.populateData($scope);	

	// user authentication
	var user = $cookieStore.get('userData');
	if(!user || !user.isAuthenticated) {
		$state.go('login');
	} else {
		$scope.user = user;
	}

	// user log out
	$scope.logout = function () {
		$cookieStore.remove('userData');
		$state.go('login');
	};

  // side bar navigation
	$scope.navClass = function (page) {
		var currentRoute = $location.path().substring(1) || 'main/overview';
		return page === currentRoute ? 'active' : '';
	}

	// add a new sheet
  $scope.addSheet = function () {
  	var newsheet = {
  		day: $('#addsheetDay option:selected').text(),
  		customerName: $('#addsheetCustomer option:selected').text(),
  		customerId: findCustomerByName($('#addsheetCustomer option:selected').text()).customerId,
  		projectName: $('#addsheetProject option:selected').text(),
  		projectId: '',
  		hour: $('#addsheetHour').val()
  	};

  	$scope.timesheets[$('#addsheetDay').val()].push(newsheet);
  	/* T.B.D: Add to database */
  };

  // delete a sheet
  $scope.removeSheet = function(day, index) {
  	/* T.B.D: remove frome database */
  	$scope.timesheets[day].splice(index, 1);
  };

	// toggle between edit and display model
	var elements = ['Buttons', 'Customer', 'Project', 'Hour'];
	$scope.editModel = function(sheet, index) {
		$scope.lastModifiedSheet = {
			customerName: sheet.customerName,
			customerId: sheet.customerId,
			projectName: sheet.projectName,
			projectId: sheet.projectId,
			hour: sheet.hour
		};

		$.each(elements, function(i, obj){
			$('#display' + sheet.day + obj + index).hide();
			$('#edit' + sheet.day + obj + index).show();
		});
	};

	$scope.displayModel = function(sheet, customer, project, hour, index, saveChange) {
		if(!saveChange) {
			// cacel edit and restore the sheet
			sheet.customerName = $scope.lastModifiedSheet.customerName;
			sheet.customerId = $scope.lastModifiedSheet.customerId;
			sheet.projectName = $scope.lastModifiedSheet.projectName;
			sheet.projectId = $scope.lastModifiedSheet.projectId;
			sheet.hour = $scope.lastModifiedSheet.hour;
		} else {
			sheet.customerName = customer.customerName;
			sheet.customerId = customer.customerId;
			sheet.projectName = project.projectName;
			sheet.projectId = project.projectId;
			sheet.hour = hour;
			/* T.B.D: save to database */
		}

		$.each(elements, function(i, obj){
			$('#display' + sheet.day + obj + index).show();
			$('#edit' + sheet.day + obj + index).hide();
		});
	};

  // setting dropdown while change to edit model.
  $scope.findCustomer = function(customerId) {
  	for(var i=0; i<$scope.customers.length; i++) {
  		if($scope.customers[i].customerId == customerId){
  			return $scope.customers[i];
  		}
  	}
  };

  function findCustomerByName(customerName) {
  	for(var i=0; i<$scope.customers.length; i++) {
  		if($scope.customers[i].customerName == customerName){
  			return $scope.customers[i];
  		}
  	}
  }

  $scope.findProject = function(customerId, projectId) {
  	var projects = $scope.findCustomer(customerId).projects;

  	for(var i=0; i<projects.length; i++) {
  		if(projects[i].projectId == projectId) {
  			return projects[i];
  		}
  	}

  	return projects[0];
  }

  // change projects content while changing customer
  $scope.onChangeCustomer = function(sheet, customer) {
  	sheet.customerId = customer.customerId;
  	sheet.customerName = customer.customerName;
  };
};

/************************* Admin controllers *************************/
var AdminController = function($scope, DataService) {

};

/************************* Register controllers *************************/
timesheetsControllers.controller('LoginController', 
	['$scope', '$state', '$location', '$modal', 'UserService', LoginController]);

timesheetsControllers.controller('MainController', 
	['$scope', '$state', '$cookieStore', '$location', 'DataService', MainController]);

timesheetsControllers.controller('AdminController', 
	['$scope', 'DataService', AdminController]);