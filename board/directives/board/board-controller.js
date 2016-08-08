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
