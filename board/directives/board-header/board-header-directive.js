(function() {
	'use strict';

	var module = angular.module('platform-board');

	module.directive('boardHeader', function($compile) {
		return {
			restrict: 'E',
			scope: true,
			link: function(scope, element, attr) {
				var expandHeaderDirectiveName = attr['expandHeaderDirective'];
				var expandHeaderDirective;
				if (!angular.isDefined(expandHeaderDirectiveName) || expandHeaderDirectiveName === '') {
					expandHeaderDirectiveName = 'defaultExpandHeader';
					expandHeaderDirective = '<div data-aid="board-header" class="height--100 bg--gray6 text--white"><div class="padding-l--md padding-t--micro--lg cols">' +
						'<div class="inline-block absolute">{{column.label}}</div>' +
						'<div ng-click="collapseColumn(column)" class="inline-block collapse-column-icon margin-h--auto padding-t--micro--md" ng-class="{\'display--none\' : !column.isCollapseActionIsAllowedNow}">' +
						'<svg alm-icon name="s-panel-to-left-circle" class="svg--s"></svg></div></div></div>';
				} else {
					expandHeaderDirective = '<' + expandHeaderDirectiveName + ' data-aid="board-open-header" column-entity="column" collapse-function="collapseColumn"></' + expandHeaderDirectiveName + '>';
				}
				if (scope.compileDirectives[expandHeaderDirectiveName] === undefined) {
					scope.compileDirectives[expandHeaderDirectiveName] = $compile(expandHeaderDirective);
				}
				var linkFunction = scope.compileDirectives[expandHeaderDirectiveName];
				linkFunction(scope, function cloneAttach(clonedElement) {
					element.replaceWith(clonedElement);
				});
			}
		};
	});
})();
