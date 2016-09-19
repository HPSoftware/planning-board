(function() {
	'use strict';

	var module = angular.module('platform-board');

	module.directive('emptyBoard', function($compile) {
		return {
			restrict: 'E',
			scope: true,
			link: function(scope, element, attr) {
				var emptyBoardDirectiveName = attr['emptyBoardDirective'];
				var emptyBoardDirective;
				if (!angular.isDefined(emptyBoardDirectiveName) || emptyBoardDirectiveName === '') {
					emptyBoardDirectiveName = 'defaultEmptyBoard';
					emptyBoardDirective = '<div data-aid="empty-board"></div>';
				} else {
					emptyBoardDirective = '<' + emptyBoardDirectiveName + '></' + emptyBoardDirectiveName + '>';
				}
				if (scope.compileDirectives[emptyBoardDirectiveName] === undefined) {
					scope.compileDirectives[emptyBoardDirectiveName] = $compile(emptyBoardDirective);
				}
				var linkFunction = scope.compileDirectives[emptyBoardDirectiveName];
				linkFunction(scope, function cloneAttach(clonedElement) {
					element.replaceWith(clonedElement);
				});
			}
		};
	});
})();
