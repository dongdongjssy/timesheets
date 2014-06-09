'use strict';

/* Filters */

var timesheetsFilters = angular.module('timesheetsApp.filters', []);

timesheetsFilters.filter('interpolate', ['version', function(version) {
	return function(text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	};
}]);

timesheetsFilters.filter('isEmpty', function () {
	var bar;
	return function (obj) {
		for (bar in obj) {
			if (obj.hasOwnProperty(bar)) {
				return false;
			}
		}
		return true;
	};
});
