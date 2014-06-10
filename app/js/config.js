'use strict';

var configData = {
	'GENERAL_CONFIG': {
		'APP_NAME': 'Time Sheets',
		'APP_VERSION': '0.1',
	}
}

var timesheetsConfig = angular.module('timesheetsApp.config', []);

angular.forEach(configData, function(key, value){
	timesheetsConfig.constant(key, value);
});