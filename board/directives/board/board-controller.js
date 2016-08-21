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

		//todo: find a better way to contain all the views, too many folders, too much overhead
		var baseUrl = 'board/views/';

		$scope.initTemplates = function() {
			$scope.getCardTemplate = $scope.configuration && $scope.configuration.templates && $scope.configuration.templates.cardTemplate || function() {
					return 'board/views/default-card-tmpl/default-card-tmpl.html';
				};

			$scope.boardColumnCollapsedHeaderTemplate = $scope.configuration && $scope.configuration.templates && $scope.configuration.templates.columnCollapsedHeaderTemplate || function(column) {
					return baseUrl + 'board-header-tmpl/board-header-tmpl.html?column=' + column;
				};

			$scope.boardColumnHeaderTemplate = $scope.configuration && $scope.configuration.templates && $scope.configuration.templates.columnHeaderTemplate || function(column) {
					return baseUrl + 'board-header-tmpl/board-header-tmpl.html?column=' + column;
				};

			$scope.boardRowHeaderTemplate = $scope.configuration && $scope.configuration.templates && $scope.configuration.templates.rowHeaderTemplate || function(row) {
					return baseUrl + 'board-row-header-tmpl/board-row-header-tmpl.html?row=' + row;
				};

			$scope.getDummyTemplate = function() {
				var dropAreaText = ($scope.configuration && $scope.configuration.dragAndDropElement && $scope.configuration.dragAndDropElement.label) || '';
				return '<div class="drag-dummy-inside"><div>' + dropAreaText + '</div></div>';
			};
		};
	});
})();
