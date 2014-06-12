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
		console.log(user);
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
var CreateAccountModalController = function ($scope, $modalInstance, User) {
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
		User.register(formData, $modalInstance);
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
var MainController = function ($scope, $filter, $http, $location, User) {
	var user = User.getUserData();
	//if(!user.isAuthenticated) {
	//	window.location = "#/login";
	//} else {
		$scope.user = user;
	//}

	$scope.logout = function () {
		user.isAuthenticated = false;
		window.location = "#/login";
	};

	$scope.templates = [ 
		{ name: 'overview', url: 'partials/overview.html'},
    { name: 'reports', url: 'partials/reports.html'},
    { name: 'analytics', url: 'partials/analytics.html'},
    { name: 'export', url: 'partials/export.html'} 
  ];

  $scope.template = $scope.templates[0];

  $scope.navClass = function (section) {
  	var currentRoute = $location.path().substring(1) || 'overview';

  	$.each($scope.templates, function(index, obj){
  		if(obj.name == currentRoute) {
  			$scope.template = obj;
  		}
  	});

  	return section === currentRoute ? 'active' : '';
  }

	$scope.users = [
    {id: 1, name: 'Monday', status: 2, group: 4, groupName: 'admin'},
    {id: 2, name: 'Tuesday', status: undefined, group: 3, groupName: 'vip'},
    {id: 3, name: 'Wensday', status: 2, group: null},
    {id: 4, name: 'Thursday', status: 3, group: null},
    {id: 5, name: 'Friday', status: 4, group: null}
  ]; 

  $scope.statuses = [
    {value: 1, text: 'Customer1'},
    {value: 2, text: 'Customer2'},
    {value: 3, text: 'Customer3'},
    {value: 4, text: 'Customer4'}
  ]; 

  $scope.groups = [];
  $scope.loadGroups = function() {
    return $scope.groups.length ? null : $http.get('/groups').success(function(data) {
      $scope.groups = data;
    });
  };

  $scope.showGroup = function(user) {
    if(user.group && $scope.groups.length) {
      var selected = $filter('filter')($scope.groups, {id: user.group});
      return selected.length ? selected[0].text : 'Not set';
    } else {
      return user.groupName || 'Not set';
    }
  };

  $scope.showStatus = function(user) {
    var selected = [];
    if(user.status) {
      selected = $filter('filter')($scope.statuses, {value: user.status});
    }
    return selected.length ? selected[0].text : 'Not set';
  };

  $scope.checkName = function(data, id) {
    if (id === 2 && data !== 'awesome') {
      return "Username 2 should be `awesome`";
    }
  };

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
	['$scope', '$location', '$modal', 'User', LoginController]);

timesheetsControllers.controller(
	'MainController', 
	['$scope', '$filter', '$http', '$location', 'User', MainController]);

