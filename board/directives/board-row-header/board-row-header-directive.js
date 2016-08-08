(function() {
	'use strict';

	var module = angular.module('platform-board');

	module.directive('boardRowHeader', /*@ngInject*/ function($compile) {
		return {
			restrict: 'E',
			scope: true,
			link: function(scope, element, attr) {
				var rowDirectiveName = attr['rowDirective'];
				var rowDirective;
				if (!angular.isDefined(rowDirectiveName) || rowDirectiveName === '') {
					rowDirectiveName = 'defaultRow';
					rowDirective = '<div>{{row.label}}</div>';
				} else {
					rowDirective = '<' + rowDirectiveName + ' data-aid="board-row-header-directive" row-entity="row" class="width--100 height--100"></' + rowDirectiveName + '>';
				}
				if (scope.compileDirectives[rowDirectiveName] === undefined) {
					scope.compileDirectives[rowDirectiveName] = $compile(rowDirective);
				}
				var linkFunction = scope.compileDirectives[rowDirectiveName];
				linkFunction(scope, function cloneAttach(clonedElement) {
					element.replaceWith(clonedElement);
				});
			}
		};
	});
})();
