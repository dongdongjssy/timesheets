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

	// user log out
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

	// table content setting
	var elements = ['Buttons', 'Customer', 'Project', 'Hour'];
	$scope.editModel = function(day, index) {
		$.each(elements, function(i, obj){
			$('#display' + day + obj + index).hide();
			$('#edit' + day + obj + index).show();
		});
	};

	$scope.displayModel = function(day, index) {
		$.each(elements, function(i, obj){
			$('#display' + day + obj + index).show();
			$('#edit' + day + obj + index).hide();
		});
	};

  $scope.removeSheet = function(index) {
  };

  // setting dropdown while change to edit model.
  $scope.findCustomer = function(customerId) {
  	for(var i=0; i<$scope.customers.length; i++) {
  		if($scope.customers[i].id == customerId){
  			return $scope.customers[i];
  		}
  	}
  };

  $scope.findProject = function(customerId, projectId) {
  	var projects = $scope.findCustomer(customerId).projects;

  	for(var i=0; i<projects.length; i++) {
  		if(projects[i].Id == projectId) {
  			return projects[i];
  		}
  	}

  	return projects[0];
  }

  $scope.onChangeCustomer = function(sheet, customer) {
  	sheet.customerId = customer.id;
  	sheet.customerName = customer.name;
  };

  //x-editable test
  $scope.showProject = function(sheet) {
    var selected = $filter('filter')($scope.projects, {Id: sheet.projectId});
    return selected.length ? selected[0].Name : 'Not set';
  };

  $scope.showCustomer = function(sheet) {
    var selected = $filter('filter')($scope.customers, {id: sheet.customerId});
    $scope.projects = selected[0].projects;
    return selected.length ? selected[0].name : 'Not set';
  };

  $scope.onCustomerChange = function(index) {
  	console.log($('#customer'+index + ' option: selected').text());
  }

  $scope.saveUser = function(data, id) {
    //$scope.user not updated yet
    angular.extend(data, {id: id});
    return $http.post('/saveUser', data);
  };

  // remove user
  $scope.removeUser = function(index) {
    $scope.users.splice(index, 1);
  };

  // add user
  $scope.addUser = function() {
    $scope.inserted = {
      id: $scope.users.length+1,
      name: '',
      status: null,
      group: null 
    };
    $scope.users.push($scope.inserted);
  };

};

// Register controllers
timesheetsControllers.controller(
	'LoginController', 
	['$scope', '$location', '$modal', 'UserService', LoginController]);

timesheetsControllers.controller(
	'MainController', 
	['$scope', '$filter', '$http', '$location', 'UserService', 'DataService', MainController]);

