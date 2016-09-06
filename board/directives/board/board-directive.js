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

	module.directive('board', /*@ngInject*/ function($rootScope, $timeout, $injector, $parse, $window, $filter) {
		return {
			restrict: 'E',
			controller: 'genBoardCtrl',
			scope: {
				api: '=?name',
				layout: '=',
				data: '=',

				// Function
				canMove: '&',
				itemMoved: '&',
				rowCollapsed: '&',
				columnCollapsed: '&'
			},
			templateUrl: 'board/views/board-layout-tmpl/board-layout-tmpl.html',
			link: function(scope) {
				var columnHolder = null;
				var fireAutoFit = function() {
					$rootScope.$broadcast('autofitChangeEvent');
				};

				angular.element($window).bind('resize', fireAutoFit);

				scope.scrollColumnHolder = function(e) {
					scope.scrollTop = e.target.scrollTop + 'px';
					scope.scrollLeft = e.target.scrollLeft + 'px';
				};
				scope.resetColumn = function() {
					if (columnHolder) {
						columnHolder[0].scrollTop = 0;
						columnHolder[0].scrollLeft = 0;
					}
				};

				scope.$on('collapseColumn', function(event, data) {
					angular.forEach(scope.columns, function(c) {
						if (c.value === data.id) {
							c.isCollapsed = data.isCollapsed;
							scope.collapseColumn(c);
						}
					});
				});

				scope.isCollapseActionIsAllowed = function(column) {
					//icon display:
					var unCollapsedColumns = _.filter(scope.columns, function(c) {
						return !c.isCollapsed;
					});

					if (unCollapsedColumns.length === 1) {
						// prevent the last column from being collapsed
						angular.forEach(scope.columns, function(c) {
							if (!c.isCollapsed) {
								c.isCollapseActionIsAllowedNow = false;
							}
						});
					} else {
						angular.forEach(scope.columns, function(c) {
							c.isCollapseActionIsAllowedNow = true;
						});
					}
					return column.isCollapseActionIsAllowedNow;
				};

				scope.collapseColumn = function(column) {
					if (!column.isCollapsed) {
						if (!_.isUndefined(column.isCollapseActionIsAllowedNow) && !column.isCollapseActionIsAllowedNow) {
							return;
						}
					}

					column.isCollapsed = !column.isCollapsed;
					if (scope.columnCollapsed) {
						scope.columnCollapsed({column: column});
					}
					scope.isCollapseActionIsAllowed(column);
					scope.$broadcast('autofitChangeEvent');
				};

				scope.collapseRow = function(row) {
					if (!row.isCollapsed) {
						// collapsing row
						var collapsedRows = _.filter(scope.rows, function(r) {
							return r.isCollapsed;
						});
						if (collapsedRows.length >= scope.rows.length) {
							// prevent the last row from being collapsed
							return;
						}
					}
					row.isCollapsed = !row.isCollapsed;
					if (scope.rowCollapsed) {
						scope.rowCollapsed({row: row});
					}
					isAllSwimlanesExpandChanged();
				};

				function collapseAllSwimlanes() {
					_.forEach(scope.rows, function(row) {
						if (!row.isCollapsed) {
							scope.collapseRow(row);
						}
					});
				}

				function expandAllSwimlanes() {
					_.forEach(scope.rows, function(row) {
						if (row.isCollapsed && !_.isUndefined(row.customData) && row.customData.tasks_number > 0) {
							scope.collapseRow(row);
						}
					});
				}

				scope.initTemplates();

				scope.getCellData = function(column, row) {
					var cellData = $filter('boardFilter')(scope.data, column, row);
					if (scope.sortCell) {
						cellData = scope.sortCell(cellData);
					}
					return cellData;
				};

				scope.sortCell = scope.configuration && scope.configuration.externalFunctions && scope.configuration.externalFunctions.sortCell;
				scope.addCard = scope.configuration && scope.configuration.externalFunctions && scope.configuration.externalFunctions.addCard;
				scope.isAllSwimlanesExpandChanged = scope.configuration && scope.configuration.externalFunctions && scope.configuration.externalFunctions.isAllSwimlanesExpandChanged;
				scope.scrollCellHolder = function(e) {
					scope.scrollData = {
						rect: e.target.getBoundingClientRect(),
						scrollTop: e.target.scrollTop,
						scrollLeft: e.target.scrollLeft
					};
				};

				var selectedCards = [];

				scope.setSelectedCards = function(cards) {
					selectedCards = cards;
				};

				function getSelectedCards() {
					return selectedCards;
				}

				scope.$on('$destroy', function() {
					angular.element($window).unbind('resize', fireAutoFit);
				});


				scope.$watch('layout', parseLayout);

				scope.$watchCollection('data', function() {
					if (!_.isUndefined(scope.data)) {
						refreshCards();
					}
				});

				function parseLayout() {
					var boardLayout = scope.layout;

					if (!boardLayout.columnDefinition) {
						return;
					}

					scope.showSwimLanes = boardLayout.laneDefinition && boardLayout.laneDefinition.values.length > 0;

					scope.columns = boardLayout.columnDefinition.values;
					scope.rows = boardLayout.laneDefinition && boardLayout.laneDefinition.values;

					// fill axis member to row and column
					angular.forEach(scope.columns, function(column) {
						column.axis = boardLayout.columnDefinition;

						if (_.isUndefined(column.isCollapsed)) {
							column.isCollapsed = false;
						}
					});

					if (!scope.rows || scope.rows.length === 0 || !scope.showSwimLanes) {
						var emptyRowDefinition = createEmptyCell();
						scope.rows = [];
						scope.rows.push(emptyRowDefinition);
						scope.row = emptyRowDefinition;
						scope.showSwimLanes = false;
					} else {
						angular.forEach(scope.rows, function(row) {
							row.axis = boardLayout.laneDefinition;
						});
					}

					scope.columnFieldName = boardLayout.columnDefinition.field;
					scope.laneFieldName = boardLayout.laneDefinition ? boardLayout.laneDefinition.field : null;
				}

				function createEmptyCell() {
					return {
						value: '-1',
						label: '',
						isCollapsed: false,
						customData: null,
						axis: createEmptyAxis()
					};

				}

				function createEmptyAxis() {
					var emptyAxis = {
						value: '-1',
						label: '',
						field: '',
						values: []
					};

					return emptyAxis;
				}

				function refreshCards() {
					scope.$broadcast('board-refresh-cards');
				}

				function isAllSwimlanesExpandChanged() {
					var collapsedRows = _.filter(scope.rows, function(row) {
						return row.isCollapsed;
					});
					if (scope.isAllSwimlanesExpandChanged) {
						scope.isAllSwimlanesExpandChanged(collapsedRows.length === 0);
					}
				}

				function initApiFunctions() {
					scope.api = {};
					scope.api.refresh = refreshCards;
					scope.api.getSelectedCards = getSelectedCards;
					scope.api.collapseRow = scope.collapseRow;
					scope.api.collapseAllSwimlanes = collapseAllSwimlanes;
					scope.api.expandAllSwimlanes = expandAllSwimlanes;
				}

				function init() {
					initApiFunctions();
					isAllSwimlanesExpandChanged();
				}

				init();
			}
		};
	});
})();
