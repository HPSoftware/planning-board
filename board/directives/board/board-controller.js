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

	module.controller('genBoardCtrl', /*@ngInject*/  function($scope) {
		$scope.items = {};
		$scope.queries = {};
		$scope.compileDirectives = {};

		$scope.initTemplates = function() {
			$scope.getDummyTemplate = function() {
				var dropAreaText = ($scope.configuration && $scope.configuration.dragAndDropElement && $scope.configuration.dragAndDropElement.label) || '';
				return '<div class="drag-dummy-inside"><div class="inner-dummy"><div class="dummy-image"></div><div class="dummy-text">' + dropAreaText + '</div></div></div>';
			};

			$scope.getDummyErrorTemplate = function() {
				var dropAreaErrorText = ($scope.configuration && $scope.configuration.dragAndDropElement && $scope.configuration.dragAndDropElement.errorLabel) || '';
				return '<div class="drag-dummy-inside"><div class="inner-dummy"><div class="dummy-error-image"></div><div class="dummy-text">' + dropAreaErrorText + '</div></div></div>';
			};
		};
	});
})();
