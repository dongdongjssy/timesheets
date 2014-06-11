'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
var timesheetsServices = angular.module('timesheetsApp.services', []);

timesheetsServices.value('version', '0.1');

timesheetsServices.service('User', function(){
	var users = [
		{ "Email": "user1@timesheets.com",
			"FirstName": "User1",
			"LastName": "Test",
			"Password": "pwd123PWD!"},
		{ "Email": "user2@timesheets.com",
			"FirstName": "User2",
			"LastName": "Test",
			"Password": "pwd123PWD!"},
		{ "Email": "user3@timesheets.com",
			"FirstName": "User3",
			"LastName": "Test",
			"Password": "pwd123PWD!"},
		{ "Email": "user4@timesheets.com",
			"FirstName": "User4",
			"LastName": "Test",
			"Password": "pwd123PWD!"},
		{ "Email": "user5@timesheets.com",
			"FirstName": "User5",
			"LastName": "Test",
			"Password": "pwd123PWD!"}
	];

	var userData = {
		isAuthenticated: false,
		username: '',
		id: '',
		vearerToken: '',
		expirationDate: null
	};

	this.authenticate = function(email, password) {
		$.each(users, function(index, obj){
			if(obj.Email == email && obj.Password == password) {
				console.log("Login success as [" + obj.Email + ", " + obj.Password + "]");
				userData.isAuthenticated = true;
				userData.username = obj.FirstName + " " + obj.LastName;
			}
		});

		return userData;
	};

	this.getUserData = function() {
		return userData;
	}

	// function checkUser(data){
	// 	console.log(data);
	// 	$.each(data, function(index, obj){
	// 		if(obj.email == email && obj.password == password){
	// 			console.log("login success! [" + obj.email + ", " + obj.password + "]");
	// 			userData.isAuthenticated = true;
	// 			userData.username = obj.FirstName + " " + obj.LastName;
	// 		}
	// 	});
	// }
});
