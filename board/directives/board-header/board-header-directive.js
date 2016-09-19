/*
 (c) Copyright 2016 Hewlett Packard Enterprise Development LP

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */


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
						'<span class="collapse-circle-left-icon"></span></div></div></div>';
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
