'use strict';

/* Directives */

var timesheetsDirectives = angular.module('timesheetsApp.directives', []);

timesheetsDirectives.directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]);

timesheetsDirectives.directive('pwCheck',[function() {
	return {
		require: 'ngModel',
		link: function (scope, elem, attrs, ctrl) {
			var firstPassword = '#' + attrs.pwCheck;
			elem.add(firstPassword).on('keyup', function () {
				scope.$apply(function () {
          // console.info(elem.val() === $(firstPassword).val());
          ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
         });
			});
		}
	};
}]);
