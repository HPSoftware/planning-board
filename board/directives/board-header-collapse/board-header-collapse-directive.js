(function() {
	'use strict';

	var module = angular.module('platform-board');

	module.directive('boardCollapsedHeader', function($compile) {
		return {
			restrict: 'E',
			scope: true,
			link: function(scope, element, attr) {
				var collapsedHeaderDirectiveName = attr['collapsedHeaderDirective'];
				var collapsedHeaderDirective;
				if (!angular.isDefined(collapsedHeaderDirectiveName) || collapsedHeaderDirectiveName === '') {
					collapsedHeaderDirectiveName = 'defaultCollapsedHeader';
					collapsedHeaderDirective = '<div data-aid="board-column-collapsed-header" class="height--100 bg--gray6 text--white">' +
						' <div class="padding-t--micro--lg"><div ng-click="collapseColumn(column)" class="vertical-align--top collapse-column-icon text-align--center">' +
						'<svg alm-icon name="s-panel-to-right-circle" class="svg--s vertical-align--middle"></svg></div></div></div>';
				} else {
					collapsedHeaderDirective = '<' + collapsedHeaderDirectiveName + ' data-aid="board-open-header" column-entity="column"></' + collapsedHeaderDirectiveName + '>';
				}
				if (scope.compileDirectives[collapsedHeaderDirectiveName] === undefined) {
					scope.compileDirectives[collapsedHeaderDirectiveName] = $compile(collapsedHeaderDirective);
				}
				var linkFunction = scope.compileDirectives[collapsedHeaderDirectiveName];
				linkFunction(scope, function cloneAttach(clonedElement) {
					element.replaceWith(clonedElement);
				});
			}
		};
	});
})();
