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
				configuration: '=',
				initBoardResolution: '@',

				// Function
				canMove: '&',
				itemMoved: '&',
				rowCollapsed: '&',
				columnCollapsed: '&',
				dragStart: '&',
				dragProcess: '&'
			},
			template: require('html!./board.html'),
			link: function(scope, element) {
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

				function expandAllSwimlanes(needToCollapsePredicate) {
					var counter = 0;
					var maxNumberOfExpandedSwimlane = scope.configuration.maxNumberOfExpandedSwimlane ? scope.configuration.maxNumberOfExpandedSwimlane : Number.MAX_SAFE_INTEGER;
					_.forEach(scope.rows, function(row) {
						if (counter < maxNumberOfExpandedSwimlane && row.isCollapsed && (!needToCollapsePredicate || (needToCollapsePredicate && needToCollapsePredicate(row)))) {
							scope.collapseRow(row);
							counter++;
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
				scope.getCardOrderInLane = function(card, row) {
					var emptyColumn = createEmptyCell();
					var rowData = scope.getCellData(emptyColumn, row);
					var cardIndex = _.findIndex(rowData, { id: card.id });
					return cardIndex + 1;
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
						var expandedRowsCount = 0;
						if (scope.rows) {
							expandedRowsCount = scope.rows.length - collapsedRows.length;
						}
						scope.isAllSwimlanesExpandChanged(collapsedRows, expandedRowsCount);
					}
				}

				function changeCardResolution(cardResolution) {
					if (parseInt(cardResolution) === 2) {
						element.removeClass('small-board-card');
						element.removeClass('tiny-board-card');
					} else if (parseInt(cardResolution) === 1) {
						element.addClass('small-board-card');
						element.removeClass('tiny-board-card');
						scope.boardZoomLevel = 'small-board-card';
					} else if (parseInt(cardResolution) === 0) {
						element.removeClass('small-board-card');
						element.addClass('tiny-board-card');

						scope.boardZoomLevel = 'tiny-board-card';
					}
				}
				function initApiFunctions() {
					scope.api = {};
					scope.api.refresh = refreshCards;
					scope.api.getSelectedCards = getSelectedCards;
					scope.api.collapseRow = scope.collapseRow;
					scope.api.collapseAllSwimlanes = collapseAllSwimlanes;
					scope.api.expandAllSwimlanes = expandAllSwimlanes;
					scope.api.changeCardResolution = changeCardResolution;
					scope.api.isAllSwimlanesExpand = isAllSwimlanesExpandChanged;
				}

				function initZoomLevel() {
					if (scope.initBoardResolution) {
						scope.configuration.genBoardApi.changeCardResolution(scope.initBoardResolution);
					}
				}
				function subscribeDragEvents() {
					scope.$on('cardDragStarted', function(event, data) {
						if (scope.dragStart) {
							scope.dragStart(data);
						}
					});
					scope.$on('cardDragProcess', function(event, data) {
						if (scope.dragProcess) {
							if (scope.currentCell && !_.isEqual(scope.currentCell, scope.oldCell)) {
								var dummyElem = element.find('.drag-over .drag-dummy-inside');

								if (scope.dragProcess) {
									scope.dragProcess({data: data.dragElement, delta: scope.currentCell}).then(function () {
										element.children().removeClass('drag-error');
										if (dummyElem.length > 0) {
											var template = scope.getDummyTemplate();
											dummyElem[0].outerHTML = template;
										}
									}, function () {
										element.children().addClass('drag-error');
										if (dummyElem.length > 0) {
											var errorTemplate = scope.getDummyErrorTemplate();
											dummyElem[0].outerHTML = errorTemplate;
										}
									});
								}
							}
						}
					});
					scope.currentCell = null;
					scope.oldCell = null;
					scope.setDragOverCell = function(delta) {
						scope.oldCell = scope.currentCell;
						scope.currentCell = delta;
					};
				}
				function init() {
					parseLayout(scope.layout);

					initApiFunctions();
					initZoomLevel();
					subscribeDragEvents();
				}

				init();
			}
		};
	});
})();
