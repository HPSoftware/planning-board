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
