/*!
 *  (c) Copyright 2016 Hewlett Packard Enterprise Development LP
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 * 
 *  http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 * 
 * 
 *  
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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


	'use strict';
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);




/***/ },
/* 1 */
/***/ function(module, exports) {

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


	/**
	 * @ngdoc overview
	 * @name platform-board
	 * @description
	 *
	 * module for board and related states and services
	 */
	(function() {
		'use strict';

		angular.module('platform-board', []);
		angular.module('platform-board-setup', ['platform-board']);
	})();



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

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

					// Function
					canMove: '&',
					itemMoved: '&',
					rowCollapsed: '&',
					columnCollapsed: '&'
				},
				template: __webpack_require__(3),
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = "<!--\r\n\t\t(c) Copyright 2016 Hewlett Packard Enterprise Development LP\r\n\r\n\t\tLicensed under the Apache License, Version 2.0 (the \"License\");\r\n\t\tyou may not use this file except in compliance with the License.\r\n\t\tYou may obtain a copy of the License at\r\n\r\n\t\thttp://www.apache.org/licenses/LICENSE-2.0\r\n\r\n\t\tUnless required by applicable law or agreed to in writing, software\r\n\t\tdistributed under the License is distributed on an \"AS IS\" BASIS,\r\n\t\tWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\r\n\t\tSee the License for the specific language governing permissions and\r\n\t\tlimitations under the License.\r\n-->\r\n\r\n\r\n<div class=\"gen-board\" data-aid=\"gen-board\">\r\n\t<div data-aid=\"board-layout\" class=\"select-none column-holder\" ui-event=\"{scroll: 'scrollColumnHolder($event)'}\">\r\n\t\t<div class=\"column-container\">\r\n\t\t\t<div class=\"board-row header\" ng-style=\"{'transform' : 'translateY(' + scrollTop + ')'}\">\r\n\t\t\t\t<div class=\"board-column col_{{column.value}}\"\r\n\t\t\t\t\t\t ng-class=\"{'collapsed-column': column.isCollapsed,'fixed-column':column.width!=='auto'}\"\r\n\t\t\t\t\t\t ng-style=\"!column.isCollapsed && {'flex-grow' : 1 , '-ms-flex-positive' : '1'}\"\r\n\t\t\t\t\t\t ng-repeat=\"column in columns\" title=\"{{::column.label}}\">\r\n\r\n\r\n\t\t\t\t\t<div ng-switch on=\"column.isCollapsed\" class=\"height--100\">\r\n\t\t\t\t\t\t<div class=\"collapsed-header-column height--100\" ng-switch-when=\"true\">\r\n\t\t\t\t\t\t\t<board-collapsed-header></board-collapsed-header>\r\n\t\t\t\t\t\t</div>\r\n\r\n\t\t\t\t\t\t<div class=\"header-widget\" ng-switch-when=\"false\">\r\n\t\t\t\t\t\t\t<board-header expand-header-directive=\"{{::configuration.expandHeaderDirectiveName}}\"></board-header>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\r\n\t\t\t<div class=\"board-content \">\r\n\r\n\t\t\t\t<div ng-if=\"dataSvc.getTotalCount() === 0\" class=\"no-items\"></div>\r\n\r\n\t\t\t\t<div ng-if=\"showSwimLanes\">\r\n\r\n\t\t\t\t\t<div class=\"board-row header-row-separator\" ng-repeat-start=\"row in rows\" ng-click=\"collapseRow(row)\">\r\n\t\t\t\t\t\t<board-row-header data-aid=\"board-row-header\" row-directive=\"{{::configuration.rowDirectiveName}}\">\r\n\t\t\t\t\t\t</board-row-header>\r\n\t\t\t\t\t</div>\r\n\r\n\t\t\t\t\t<div ng-switch on=\"row.isCollapsed\" ng-repeat-end>\r\n\r\n\t\t\t\t\t\t<div class=\"board-row\" ng-switch-when=\"true\">\r\n\r\n\t\t\t\t\t\t\t<div class=\"collapsed\"></div>\r\n\t\t\t\t\t\t</div>\r\n\r\n\t\t\t\t\t\t<div class=\"board-row\" ng-switch-when=\"false\">\r\n\r\n\t\t\t\t\t\t\t<div class=\"board-column holder col_{{::column.value}}\" ui-event=\"{scroll: 'scrollCellHolder($event)'}\"\r\n\t\t\t\t\t\t\t\t\t ng-class=\"{'collapsed-column': column.isCollapsed,'fixed-column':column.width!=='auto' }\"\r\n\t\t\t\t\t\t\t\t\t ng-repeat=\"column in columns\">\r\n\t\t\t\t\t\t\t\t<div class=\"column_cell\" ng-if=\"!column.isCollapsed\">\r\n\t\t\t\t\t\t\t\t\t<board-cell data-aid=\"board-cell-{{::row.value}}-{{::column.value}}\" class=\"gen-board-cell-style\" resize-element=\"resizeEvent($event)\" sortable-component\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdrag-directive-mode=\"drop-area\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdrag-directive-container-style=\"drag-container\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdrag-directive-dummy-style=\"dummy-style\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdrag-directive-dummy-area-style=\"dummy-area-style\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdrag-directive-container-over-style=\"drag-over\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tdrag-toggled-mode-active=\"true\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcard-directive=\"{{::configuration.cardDirectiveName}}\">\r\n\t\t\t\t\t\t\t\t\t</board-cell>\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</div>\r\n\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<div ng-if=\"!showSwimLanes\">\r\n\t\t\t\t\t<div ng-if=\"!row.isCollapsed\" class=\"board-row\" ng-style=\"row.style\">\r\n\t\t\t\t\t\t<div class=\"board-column holder col_{{::column.value}}\" ui-event=\"{scroll: 'scrollCellHolder($event)'}\"\r\n\t\t\t\t\t\t\t\t ng-class=\"{'collapsed-column': column.isCollapsed,'fixed-column':column.width!=='auto' }\"\r\n\t\t\t\t\t\t\t\t ng-style=\"!column.isCollapsed && column.style\" ng-repeat=\"column in columns\">\r\n\t\t\t\t\t\t\t<div class=\"column_cell\" ng-if=\"!column.isCollapsed\">\r\n\t\t\t\t\t\t\t\t<board-cell data-aid=\"board-cell\" class=\"gen-board-cell-style\" resize-element=\"resizeEvent($event)\" sortable-component\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tdrag-directive-mode=\"drop-area\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tdrag-directive-container-style=\"drag-container\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tdrag-directive-dummy-style=\"dummy-style\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tdrag-directive-dummy-area-style=\"dummy-area-style\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tdrag-directive-container-over-style=\"drag-over\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tdrag-toggled-mode-active=\"true\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tcard-directive=\"{{::configuration.cardDirectiveName}}\">\r\n\t\t\t\t\t\t\t\t</board-cell>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n";

/***/ },
/* 4 */
/***/ function(module, exports) {

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


/***/ },
/* 5 */
/***/ function(module, exports) {

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
		module.directive('boardCell', /*@ngInject*/ function($rootScope, $q, boardDragService, $compile) {
			return {
				restrict: 'E',
				controller: ['$scope', function($scope) {
					$scope.checkedCards = [];
					var maxLimitOfCards;
					maxLimitOfCards = 1;
					$scope.toggleCheck = function(index) {
						if (maxLimitOfCards === 1) {
							$scope.checkedCards = [index];
						} else {
							if ($scope.checkedCards.indexOf(index) === -1) {
								$scope.checkedCards.push(index);
							} else {
								$scope.checkedCards.splice($scope.checkedCards.indexOf(index), 1);
							}
						}
						$scope.pushToDragService();
					};

					$scope.getSelectedCards = function() {
						var selectedCards = $scope.checkedCards.map($scope.cardGetter);

						// Setting the selected cards on the boards
						$scope.setSelectedCards(selectedCards);

						return selectedCards;
					};

					$scope.cardGetter = function(i) {
						if (!$scope.items) {
							return null;
						}
						return $scope.items[i];
					};
					$scope.pushToDragService = function() {
						$scope.$broadcast('draggableComponentMarkCardDisabled', {items: $scope.checkedCards});
						boardDragService.pushCardArray({
							filter: $scope.getCellFilter(),
							array: $scope.getSelectedCards(),
							elements: $scope.checkedCards.map($scope.cardElementGetter)
						}, maxLimitOfCards);
					};

					function getIdParam(cellData) {
						return isNaN(cellData.value) || cellData.value >= 0 ? cellData.value : '';
					}

					$scope.getCellFilter = function() {
						var filter = {};
						var columnFieldName = $scope.columnFieldName;
						var rowFieldName = $scope.laneFieldName;
						if (columnFieldName) {
							filter[columnFieldName] = getIdParam($scope.subcolumn || $scope.column) || null;
						}
						if (rowFieldName) {
							filter[rowFieldName] = getIdParam($scope.row) || null;
						} else {
							filter[$scope.row.axis.field] = $scope.row.value;
						}
						return filter;
					};

					$scope.items = $scope.getCellData($scope.column, $scope.row);

					//var removeListener = $scope.addDataChangeListener($scope.getCellFilter(), function() {
					//
					//  $scope.items = $scope.getCellData($scope.column, $scope.row);
					//});

					//$scope.$on('$destroy', function() {
					//  removeListener();
					//});
				}],
				scope: true,
				link: function(scope, element, attr) {
					var cardDirectiveName = attr['cardDirective'];
					var cardDirective;
					if (!angular.isDefined(cardDirectiveName) || cardDirectiveName === '') {
						cardDirectiveName = 'defaultCard';
					}

					if (scope.compileDirectives[cardDirectiveName] === undefined) {
						if (cardDirectiveName === 'defaultCard') {
							cardDirective = '<div data-aid="default-card" class="item-card"   ng-class="{\'selected\': checkedCards.indexOf($index) != -1 }">' +
								'<svg class="svg-fold" width="16px" height="16px" viewBox="0 0 16 16"><polygon class="us" points="0,0 16,16 0,16" />' +
								'</svg>	<div><div>{{card.id}}</div><div>{{card.name}} </div></div>';
						} else {
							cardDirective = '<' + cardDirectiveName + ' card-data="card" class="board-card" board-card-id="" get-card-rank="getCardRank(card)"></' + cardDirectiveName + '>';
						}
						var addItemTemplate = '<div ng-if="::configuration.addCardCellButton" class="add-card-line"><div class="add-card"' +
							'title="{{::configuration.addCardCellButton.tooltipLabel}}" ng-click="addCard(column, row)">' +
							'<span class="plus-sign">+</span></div></div>';
						var template = '<div ng-repeat="card in items"  class="draggable-element card-container" index="{{$index}}">' + cardDirective + '</div>' + addItemTemplate;
						scope.compileDirectives[cardDirectiveName] = $compile(template);
					}

					var linkFunction = scope.compileDirectives[cardDirectiveName];
					linkFunction(scope, function cloneAttach(clonedElement) {
						element.append(clonedElement);
					});

					scope.movePosition = null;
					var genBoardElement = angular.element('.gen-board');
					scope.dragElementContainerParent = [genBoardElement.find('.column-holder')[0], genBoardElement.find('.board-row.header')[0]];

					scope.resizeEvent = function() {
						scope.$broadcast('draggableComponentRefresh');
					};

					scope.getDragPayloadData = function() {
						return {
							rowId: scope.row.value,
							columnId: (scope.subcolumn || scope.column).value
						};
					};

					scope.getCardRank = function(card) {
						var cardIndex = _.findIndex(scope.items, { id: card.id });
						return cardIndex + 1;
					};

					scope.$on('board-refresh-cards', function() {
						scope.items = scope.getCellData(scope.column, scope.row);
					});

					scope.$on('cardDragEnded', function() {
						scope.checkedCards = [];
						scope.getSelectedCards();
					});

					scope.$on('cardDrop', function(e, data) {
						if (data) {
							// if there is any reason that the board will try to drag null item
							// it occurs because drag drop defect that in rare case allowing dragging null item
							// causing the user to see only the drop area without the card.
							// until we will find the root cause -> this will prevent exception.
							if (!data.data.items[0]) {
								return;
							}

							if (data.data.columnId === (scope.subcolumn || scope.column).value && data.data.rowId === scope.row.value) {
								var delta = scope.getCellFilter();
								var movePosition = {};
								if ('after' in data.movePosition && data.movePosition.after >= 0) {
									movePosition.idToMoveAfter = scope.cardGetter(data.movePosition.after).id;
								} else if ('before' in data.movePosition) {
									movePosition.idToMoveBefore = scope.cardGetter(data.movePosition.before).id;
								}

								$q.when(scope.canMove({items: data.data.items, delta: delta, movePosition: movePosition})).then(function(result) {

									// in case can move is function that return boolean
									if (result === false) {
										return;
									}

									$rootScope.$broadcast('cardDropped', delta);
									var columnFieldName = scope.column.axis.field;
									var rowFieldName = scope.row.axis.field;

									var updatedColumn = _.cloneDeep(data.data.items[0][columnFieldName]);
									var updatedRow = _.cloneDeep(data.data.items[0][rowFieldName]);
									if (!updatedRow) {
										updatedRow = {id: '-1'};
									}
									//if (updatedColumn.id === delta[columnFieldName] && updatedRow.id === delta[rowFieldName]) {
									//	return;
									//} else {
									if (_.isObject(updatedColumn)) {
										updatedColumn.id = delta[columnFieldName];
									} else {
										updatedColumn = delta[columnFieldName];
									}
									data.data.items[0][columnFieldName] = updatedColumn;
									if (delta[rowFieldName]) {
										if (_.isObject(updatedRow)) {
											updatedRow.id = delta[rowFieldName];
										} else {
											updatedRow = delta[rowFieldName];
										}
										data.data.items[0][rowFieldName] = updatedRow;
									}

									if (scope.itemMoved) {
										return scope.itemMoved({item: data.data.items[0]});
									}

								}).then(function () {
									scope.api.refresh();
								});
							}
						}
					});
				}
			};
		});
	})();


/***/ },
/* 6 */
/***/ function(module, exports) {

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


/***/ },
/* 7 */
/***/ function(module, exports) {

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


/***/ },
/* 8 */
/***/ function(module, exports) {

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


/***/ },
/* 9 */
/***/ function(module, exports) {

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


	(function () {
		'use strict';
		var module = angular.module('platform-board');

		module.directive('sortableComponent', /*@ngInject*/ function ($rootScope, $timeout, $document, $window, dragContainerDomUtils, dragContainerCalculationUtils) {
			return {
				restrict: 'AE',
				link: function (scope, element, attr) {
					var DraggableElementSelector = 'draggable-element', debug = false;

					// Hard coded values: those values should be overriden by the user.
					var _hardCodedTemplate = '<div>WARING: drop dummy template missing</div>',
						_hardCodedDummyStyle = 'drag-directive-element-dummy',
						_hardCodedDummyAreaStyle = 'drag-directive-element-dummy-area',
						_hardCodedContainterStyle = 'drag-directive-element-container',
						_hardCodedContainterOverStyle = 'over';
					var EPSILON = 1;

					// Get user params or use hard-coded value
					var _codeTemplate = angular.isFunction(scope.getDummyTemplate) ? scope.getDummyTemplate() : _hardCodedTemplate,
						_dummyStyle = attr.dragDirectiveDummyStyle || _hardCodedDummyStyle,
						_dummyAreaStyle = attr.dragDirectiveDummyAreaStyle || _hardCodedDummyAreaStyle,
						_containterStyle = attr.dragDirectiveContainerStyle || _hardCodedContainterStyle,
						_containterOverStyle = attr.dragDirectiveContainerOverStyle || _hardCodedContainterOverStyle,
						_dragDirectiveModeArea = attr.dragDirectiveMode === 'drop-area',
						_dragToggledModeActive = attr.dragToggledModeActive;
					//$window.console.log('_dragDirectiveMode', _dragDirectiveModeArea);

					// Additional parameters
					var cardRectArray = [], isInsideContainer, moveToPosition, dummyRect, dummy, dragStarted, mainSelectedCardElement, initialMouseDownPageX,
						markedDisabledItems, initialMouseDownPageY, dummYComputedStyle, contRect, contRectWithDummy, containerParentRect, cardRectFirst,
						cardRectLast, cardRectFirstWithDummy, cardRectFirstCurrent, marginYoffset, marginYcollapsedSize, limitsRectangle, dummyPosition = -1, prevPos = -1, scrollTop;

					element.addClass(_containterStyle);

					function setDragDirectiveModeArea(mode) {
						//$window.console.log('setDragDirectiveModeArea', mode);
						_dragDirectiveModeArea = mode;
						dummy.setAttribute('class', _dummyAreaStyle);

						//if (mode) {
						//  dummy.setAttribute('class', _dummyAreaStyle);
						//}else {
						//  dummy.setAttribute('class', _dummyStyle);
						//}
						dummYComputedStyle = $window.getComputedStyle(dummy);
						actualVirtualDragDataCreate();
					}

					scope.$on('$destroy', function () {
						watchDragElementContainerParent();
					});
					function actualVirtualDragDataCreate() {
						//$window.console.log('initiateVirtualDragData', scope.column.id);

						//$window.console.log('initiateVirtualDragData', isInsideContainer);
						moveToPosition = {};

						//$window.console.log('rebuildCache');
						cardRectArray = [];
						if (scope.dragElementContainerParent) {
							var elem = scope.dragElementContainerParent;
							var elementToRemove;
							if (Array.isArray(scope.dragElementContainerParent) && scope.dragElementContainerParent.length > 0) {
								elem = scope.dragElementContainerParent[0];
								containerParentRect = dragContainerDomUtils.getfixedRectHeight(elem, true, false);
								if (scope.dragElementContainerParent.length > 1) {
									elementToRemove = dragContainerDomUtils.getfixedRectHeight(scope.dragElementContainerParent[1], true, false);
									containerParentRect.top = elementToRemove.top + elementToRemove.height;
									containerParentRect.height -= elementToRemove.height;
								}
							} else {
								containerParentRect = dragContainerDomUtils.getfixedRectHeight(elem, true, false);
							}
						}
						if (_dragDirectiveModeArea) {
							if (!isInsideContainer) {
								dummy.style.display = 'none';
							}
							contRect = dragContainerDomUtils.getfixedRectHeight(element[0]);
							contRectWithDummy = contRect;
							dummyPosition = -1;
							prevPos = -dummyPosition;
							limitsRectangle = contRect;
							adjustDummySize();
							markCardItemsAsDisabled();
							return;
						}
						var cards = element[0].getElementsByClassName(DraggableElementSelector);
						dummy.style.display = 'block';
						dummy.style.top = '0px';
						dummyRect = dragContainerDomUtils.getfixedRectHeight(dummy);
						if (cards.length > 0) {
							cardRectLast = dragContainerDomUtils.getfixedRectHeight(cards[cards.length - 1], false, true);

							//not attached
							if (!cardRectLast) {
								return;
							}

							//dummy needs to be at the end of list
							//in order to create correct offset for firstRect
							if (!isInsideContainer && dummyRect.top < cardRectLast.top) {
								element[0].appendChild(dummy);
							}
							cardRectFirstWithDummy = dragContainerDomUtils.getfixedRectHeight(cards[0], false, true);
						}

						contRectWithDummy = dragContainerDomUtils.getfixedRectHeight(element[0]);

						dummy.style.display = 'none';
						contRect = dragContainerDomUtils.getfixedRectHeight(element[0]);

						if (cards.length > 0) {
							cardRectFirst = dragContainerDomUtils.getfixedRectHeight(cards[0], false, true);

							//cardRectLast.top position used to check card cosistancy
							//cardRectLast.height used for card height calculation
							cardRectLast = dragContainerDomUtils.getfixedRectHeight(cards[cards.length - 1], false, true);
							cardRectFirstCurrent = cardRectFirst;
							createRects(cards);
							if (isInsideContainer) {
								dummy.style.display = 'block';
							}
						}
						dummyPosition = -1;
						prevPos = -dummyPosition;
						limitsRectangle = contRect;
						markCardItemsAsDisabled();
					}

					if (debug) {
						dragContainerDomUtils.initDebug();
					}

					function isCacheChanged() {
						var cards = element[0].getElementsByClassName(DraggableElementSelector);
						var containerRect = dragContainerDomUtils.getfixedRectHeight(element[0]);
						var compareRect = (dummYComputedStyle.display === 'none' ? contRect : contRectWithDummy);
						return !cardRectArray || cards.length !== cardRectArray.length || !dragContainerCalculationUtils.compareRectangles(containerRect, compareRect);
					}

					function initiateVirtualDragData() {
						scrollTop = ($window.pageYOffset || $document[0].documentElement.scrollTop);
						if (isCacheChanged()) {
							//initializingVirtualDragData = true;
							actualVirtualDragDataCreate();
						}
					}

					function createRects(cards) {
						marginYoffset = Math.min(cardRectFirst.marginBottom, cardRectLast.marginTop);
						marginYcollapsedSize = Math.max(cardRectFirst.marginBottom, cardRectLast.marginTop) / 2;
						var isRepeatable = true;//Math.abs(cardRectFirst.height - cardRectLast.height) < EPSILON && Math.abs(cardRectLast.top - ((cardRectLast.height - marginYoffset) * (cards.length - 1) + cardRectFirst.top)) < EPSILON;

						//$window.console.log(cardRectFirst, cardRectLast, cardRectLast.top, cardRectLast.height - marginYoffset, (cards.length - 1), (cardRectLast.height - marginYoffset) * (cards.length - 1) + cardRectFirst.top, scope.column.id);
						if (isRepeatable) {
							for (var i = 0; i < cards.length; i++) {
								var r = Object.create(cardRectFirst);
								r.card = cards[i];
								r.disabled = cards[i].classList.contains('disabled');
								cardRectArray.push(r);
							}
							resetCards(cardRectArray);
						} else {
							//
							var testArr = [];
							cards = element[0].getElementsByClassName(DraggableElementSelector);
							for (var j = 0; j < cards.length; j++) {
								var fixedRectHeight = dragContainerDomUtils.getfixedRectHeight(cards[j]);
								fixedRectHeight.offsetHeight = cards[j].offsetHeight;
								fixedRectHeight.clientHeight = cards[j].clientHeight;
								testArr.push(fixedRectHeight);
							}
							//$window.console.log(testArr);
							throw new Error('not same size cards!');
						}
						dummyRect.topStart = dummyRect.top;
						dummyRect.topEnd = dummyRect.topStart + dummyRect.height;
					}

					function resetCards(cards) {
						var marginYcollapsedSize = Math.max(cardRectFirst.marginBottom, cardRectLast.marginTop) / 2;
						for (var i = 0; i < cards.length; i++) {
							var r = cards[i];

							//actoual start according to margin collapse
							r.top = i * (cardRectLast.height - marginYoffset) + cardRectFirst.top;

							//visual middle poin between cards
							r.topStart = r.top - (i === 0 ? 0 : (-marginYoffset + marginYcollapsedSize));
							var topHeight = r.height - r.marginTop - r.marginBottom + marginYcollapsedSize * 2;
							if (i === 0 && cards.length === 1) {
								topHeight = r.height;
							} else if (i === 0) {
								topHeight = r.height - r.marginBottom + marginYcollapsedSize;
							} else if (i === cards.length - 1) {
								topHeight = r.height - r.marginTop + marginYcollapsedSize;
							}
							r.topEnd = r.topStart + topHeight;
						}
					}

					scope.$on('ngRepeatFinished', function (e) {
						e.stopPropagation();
						initiateVirtualDragDataDebounce();
					});
					var initiateVirtualDragDataDebounce = dragContainerDomUtils.debounce(initiateVirtualDragData, 200);
					scope.$on('draggableComponentRefresh', initiateVirtualDragDataDebounce);

					//TODO: fire event when no ng repeat
					initiateVirtualDragDataDebounce();
					var watchDragElementContainerParent = scope.$watch('dragElementContainerParent', initiateVirtualDragDataDebounce);
					scope.$on('draggableComponentMarkCardDisabled', function (e, data) {

						markedDisabledItems = data.items;
						markCardItemsAsDisabled();

						//dragContainerCalculationUtils.printArrayUtil(cardRectArray,dummyRect);
					});
					function markCardItemsAsDisabled() {
						if (!markedDisabledItems) {
							return;
						}
						for (var i = 0; i < cardRectArray.length; i++) {
							cardRectArray[i].disabled = false;
						}
						for (i = 0; i < markedDisabledItems.length; i++) {
							if (markedDisabledItems[i] >= 0 && markedDisabledItems[i] < cardRectArray.length) {
								cardRectArray[markedDisabledItems[i]].disabled = true;
							}
						}
					}

					$document[0].addEventListener('scroll', initiateVirtualDragData, true);

					var getPayloadData = function () {
						return scope.getDragPayloadData();
					};
					scope.cardElementGetter = function (i) {
						var el = element.find('.' + DraggableElementSelector + '[index=' + i + ']')[0];
						return el;
					};

					function handleMoveAction(pageX, pageY) {
						//TODO: protect from empty cell containers (no card elements elements)
						if (!limitsRectangle) {
							return;
						}
						if (dragContainerCalculationUtils.isInsideCurrentElementLimits(pageX, pageY, limitsRectangle, containerParentRect)) {
							if (!isInsideContainer) {
								dummyPosition = cardRectArray.length * 2 + 2;
								prevPos = -dummyPosition;
								fireEnterContainerEvent();
							}
							var deepSearch = false;
							if (!_dragDirectiveModeArea && dragContainerCalculationUtils.isInsideDummyLimits(pageY, _dragDirectiveModeArea ? 0 : dummyRect.topEnd)) {
								//$window.console.log('isInsideDummyLimits');
								//prevPos; //=dummyPosition;
								var temp = 1 + 2;
							} else if (dragContainerCalculationUtils.isInsideCurrentElementUpperLimits(pageY, cardRectArray, _dragDirectiveModeArea ? 0 : dummyRect.topEnd)) {
								//$window.console.log('isInsideCurrentElementUpperLimits ' + prevPos + ' : ' + dummyPosition);
								prevPos = 0;

								// $window.console.log('isInsideCurrentElementUpperLimits ' + prevPos + ' : ' + dummyPosition);
							} else if (dragContainerCalculationUtils.isInsideCurrentElementLowerLimits(pageY, cardRectArray, _dragDirectiveModeArea ? 0 : dummyRect.topEnd)) {

								prevPos = cardRectArray.length;

								// $window.console.log('isInsideCurrentElementLowerLimits ' + prevPos + ' : ' + dummyPosition);
							} else if (!_dragDirectiveModeArea) {
								for (var i = 0; i < cardRectArray.length; i++) {
									if (dragContainerCalculationUtils.isInsideCurrentCardUpperLimits(pageY, cardRectArray[i])) {
										prevPos = i;

										//$window.console.log('isInsideCurrentCardUpperLimits');
										if (dragContainerCalculationUtils.isElementAndSiblingDisabled(cardRectArray, i, true)) {
											deepSearch = true;
										}
									} else if (dragContainerCalculationUtils.isInsideCurrentCardLowerLimits(pageY, cardRectArray[i])) {
										prevPos = i + 1;
										if (dragContainerCalculationUtils.isElementAndSiblingDisabled(cardRectArray, i, false)) {
											prevPos = i;
											deepSearch = true;
										}
										//$window.console.log('isInsideCurrentCardLowerLimits');
									}
								}
							}
							isInsideContainer = true;
							if (deepSearch) {
								//$window.console.log('deepSearch', prevPos);
								prevPos = dragContainerCalculationUtils.findBestPosition(cardRectArray, prevPos, dummyPosition);

								//$window.console.log('deepSearch', prevPos);
							}
							if (prevPos !== dummyPosition && prevPos >= 0) {
								dummyPosition = prevPos;

								//$window.console.log(prevPos);
								if (!_dragDirectiveModeArea) {
									recalculateCardsDimensionsAccordingToDummy(dummyPosition);
									checkToRepositionDummy(dummyPosition);
									createDropMoveData(dummyPosition);
								}
							}
						} else {
							if (isInsideContainer) {
								isInsideContainer = false;
								dummyPosition = cardRectArray.length;
								prevPos = -dummyPosition;
								if (!_dragDirectiveModeArea) {
									recalculateCardsDimensionsAccordingToDummy(dummyPosition);
									checkToRepositionDummy(dummyPosition);
								}
								fireLeaveContainerEvent();
							}
						}
						if (debug) {
							dragContainerDomUtils.drawCanvasVisualisation(pageX, pageY, limitsRectangle, cardRectArray, dummyRect, isInsideContainer);
						}
					}

					function recalculateCardsDimensionsAccordingToDummy(dummyPosition) {
						var toStart = dummyPosition - 1;
						var toEnd = dummyPosition;
						if (!isInsideContainer) {
							hideDummy();
							if (cardRectArray.length > 0) {
								resetCards(cardRectArray);
							}
							return;
						}
						while (toStart >= 0) {
							//$window.console.log('toStart', toStart);
							resetDimensionsToBase(toStart, dummyPosition);
							toStart--;
						}
						offsetDimensionsOfDummy(dummyPosition, cardRectArray.length);
						while (toEnd < cardRectArray.length) {
							if (toEnd >= 0) {
								//$window.console.log('toEnd', toEnd);
								offsetDimensionsAccordingToDummy(toEnd, dummyPosition, cardRectArray.length);
							}
							toEnd++;
						}
					}

					function offsetDimensionsOfDummy(index, length) {
						var r = dummyRect;
						if (length === 0) {
							r.topStart = r.top = r.orginalTop;
							r.topEnd = r.topStart + r.height;
							return;
						}
						//$window.console.log('offsetDimensionsOfDummy', index, limitsRectangle.top, cardRectFirstCurrent.top);
						var marginYoffsetForDummy = Math.min(cardRectFirst.marginBottom, dummyRect.marginTop);
						var marginBottomCollapsedWithDummyMarginTop = Math.max(cardRectFirst.marginBottom, dummyRect.marginTop) / 2;
						var marginBottomCollapsedWithDummyMarginBottom = Math.max(cardRectFirst.marginTop, dummyRect.marginBottom) / 2;

						//actual start according to margin collapse
						r.top = index * (cardRectLast.height - marginYoffset) + (index > 0 ? marginYoffset - marginYoffsetForDummy : 0) + cardRectFirstCurrent.top;

						//visual middle poin between cards
						r.topStart = r.top - (index === 0 ? 0 : (-r.marginTop + marginBottomCollapsedWithDummyMarginTop));
						var topHeight = r.height - r.marginTop - r.marginBottom + marginBottomCollapsedWithDummyMarginTop + marginBottomCollapsedWithDummyMarginBottom;
						if (index === 0) {
							topHeight = r.height - r.marginBottom + marginBottomCollapsedWithDummyMarginBottom;
						} else if (index === length) {
							topHeight = r.height - r.marginTop + marginBottomCollapsedWithDummyMarginTop;
						}
						r.topEnd = r.topStart + topHeight;
					}

					function offsetDimensionsAccordingToDummy(index, dummyPosition, length) {
						var marginYbottomOffsetForDummy = Math.min(cardRectFirst.marginTop, dummyRect.marginBottom);
						var marginTopCollapsedWithDummyMarginBottom = Math.max(cardRectFirst.marginTop, dummyRect.marginBottom) / 2;
						var r = cardRectArray[index];
						r.top = dummyRect.top + dummyRect.height - marginYbottomOffsetForDummy + (index - dummyPosition) * (cardRectLast.height - marginYoffset);
						r.topStart = r.top + ((index - dummyPosition) === 0 ? (-marginTopCollapsedWithDummyMarginBottom + r.marginTop) : (r.marginTop - marginYcollapsedSize));
						var topHeight = r.height - r.marginTop - r.marginBottom + marginYcollapsedSize * 2;
						if (index === dummyPosition && index === length - 1) {
							topHeight = r.height - r.marginTop + marginTopCollapsedWithDummyMarginBottom;
						} else if (index === dummyPosition) {
							topHeight = r.height - r.marginTop - r.marginBottom + marginYcollapsedSize + marginTopCollapsedWithDummyMarginBottom;
						} else if (index === length - 1) {
							topHeight = r.height - r.marginTop + marginYcollapsedSize;
						}
						r.topEnd = r.topStart + topHeight;
					}

					function resetDimensionsToBase(index, dummyPosition) {
						var marginBottomCollapsedWithDummyMarginTop = Math.max(cardRectFirst.marginBottom, dummyRect.marginTop) / 2;
						var r = cardRectArray[index];

						//actual start according to margin collapse
						r.top = index * (cardRectLast.height - marginYoffset) + cardRectFirstCurrent.top;

						//visual middle poin between cards
						r.topStart = r.top - (index === 0 ? 0 : (-marginYoffset + marginYcollapsedSize));
						var topHeight = r.height - r.marginTop - r.marginBottom + marginYcollapsedSize * 2;
						if (index === 0 && index === dummyPosition - 1) {
							topHeight = r.height - r.marginBottom + marginBottomCollapsedWithDummyMarginTop;
						} else if (index === 0) {
							topHeight = r.height - r.marginBottom + marginYcollapsedSize;
						} else if (index === dummyPosition - 1) {
							//need to calc dummy margin
							topHeight = r.height - r.marginTop - r.marginBottom + marginYcollapsedSize + marginBottomCollapsedWithDummyMarginTop;

						}
						r.topEnd = r.topStart + topHeight;
					}

					function hideDummy() {
						var r = dummyRect;
						r.top = r.topStart = -r.height;
						r.topEnd = r.topStart + r.height;
					}

					scope.$on('cardDragStarted', function () {

						var cardDragProcess = scope.$on('cardDragProcess', function (e, data) {
							//TODO: add support for page scroll offset
							handleMoveAction(data.event.pageX, data.event.pageY - scrollTop);
						});
						var cardDragEnded = scope.$on('cardDragEnded', function (e, dragedElemData) {
							//$window.console.log('cardDragEnded');
							cardDragProcess();
							cardDragEnded();

							element.unbind('mouseup', bindMouseUpListener);

							//if in my square
							if (isInsideContainer) {
								isInsideContainer = false;
								var pay = getPayloadData();

								$rootScope.$broadcast('cardDrop', {
									event: e,
									data: angular.extend(dragedElemData, pay),
									element: mainSelectedCardElement,
									movePosition: moveToPosition
								});
								if (!_dragDirectiveModeArea) {
									dragContainerCalculationUtils.repositionItemsBasedOnHoverPosition(cardRectArray, cardRectArray.length, dummyRect);
								}
								fireLeaveContainerEvent();

							}
							markedDisabledItems = [];
							markCardItemsAsDisabled();
							dragContainerCalculationUtils.printArrayUtil(cardRectArray, dummyRect);
						});
					});
					element.bind('mousedown', function (e) {
						if (e.button === 2 || e.button === 1) {
							return;
						}
						scope.$apply(function () {
							var elementTarget = e.target;
							if (elementTarget.tagName.toLowerCase() === 'input') {
								return;
							}
							e.preventDefault();

							//check if mouse down event is originated on card
							if (angular.element(elementTarget).parents('.' + DraggableElementSelector).length || angular.element(elementTarget).hasClass(DraggableElementSelector)) {
								mainSelectedCardElement = angular.element(elementTarget).hasClass(DraggableElementSelector) ? elementTarget : angular.element(elementTarget).parents('.' + DraggableElementSelector)[0];
								var pos = parseInt(mainSelectedCardElement.getAttribute('index'));
								scope.toggleCheck(pos, true);

								initialMouseDownPageX = e.pageX;
								initialMouseDownPageY = e.pageY;
								dragStarted = false;

								//initiating move listener only on current cell element
								element.bind('mousemove', elementMoveListener);
								element.bind('mouseup', bindMouseUpListener);
							}
						});
						if (_dragToggledModeActive) {
							setDragDirectiveModeArea(false);
							var mouseUp = function () {
								$document.unbind('mouseup', mouseUp);
								setDragDirectiveModeArea(true);
							};
							$document.bind('mouseup', mouseUp);
						}
					});

					function initDrag(e, cardElem) {
						dragStarted = true;
						element.unbind('mousemove', elementMoveListener);

						//TODO: start this element mouseenter indication
						//$window.console.log('init my square');

						//initiateVirtualDragData();
						//$window.console.log('initDrag');

						//remove local mousemove listener and broadcast drag started event
						$rootScope.$broadcast('cardDragStarted', {
							event: e,
							data: getPayloadData(),
							element: cardElem
						});
					}

					function bindMouseUpListener() {
						//$window.console.log('bindMouseUpListener' + dragStarted);

						//check with move calculation
						if (!dragStarted) {
							element.unbind('mousemove', elementMoveListener);
						}
						element.unbind('mouseup', bindMouseUpListener);
						dragStarted = false;
					}

					function elementMoveListener(e) {
						if (!dragStarted) {
							var dx = e.pageX - initialMouseDownPageX;
							var dy = e.pageY - initialMouseDownPageY;
							var d = Math.sqrt(dx * dx + dy * dy);
							if (d >= 1) {
								initDrag(e, mainSelectedCardElement);
							}
						}
					}

					function createDraggableDummyElement(template, dummyParentContainer, dummyElementClass) {
						var dummyProxy = $document[0].createElement('DIV');
						dummyProxy.setAttribute('class', dummyElementClass);
						dummyProxy.innerHTML = template;
						dummyProxy.style.display = 'none';
						dummyParentContainer.appendChild(dummyProxy);
						dummYComputedStyle = $window.getComputedStyle(dummyProxy);
						return dummyProxy;
					}

					dummy = createDraggableDummyElement(_codeTemplate, element[0], _dragDirectiveModeArea ? _dummyAreaStyle : _dummyStyle);

					function fireLeaveContainerEvent() {
						cardRectFirstCurrent = cardRectFirst;
						limitsRectangle = contRect;
						dummy.style.display = 'none';
						//$window.console.log('fire leave');

						//
						element.removeClass(_containterOverStyle);
						if (!_dragDirectiveModeArea) {
							potentialOtherCellExpandNotification();
						}

					}

					function adjustDummySize() {
						if (containerParentRect && containerParentRect.height > 0) {
							//console.log('rect',limitsRectangle);
							var top = Math.max(containerParentRect.top - limitsRectangle.top, 0);
							var dragRectStartPositionRelativeToPageTop = limitsRectangle.top + top;
							var boundryRectBottomContainer = containerParentRect.top + containerParentRect.height;
							var boundryRectBottomCell = limitsRectangle.top + limitsRectangle.height;
							var height = (Math.min(boundryRectBottomContainer, boundryRectBottomCell) - dragRectStartPositionRelativeToPageTop);
							dummy.style.height = height + 'px';
							dummy.style.top = top + 'px';
						}
					}

					function fireEnterContainerEvent() {
						//$window.console.log('fire enter');
						cardRectFirstCurrent = cardRectFirstWithDummy;
						limitsRectangle = contRectWithDummy;
						if (_dragDirectiveModeArea) {
							contRect = dragContainerDomUtils.getfixedRectHeight(element[0]);
							limitsRectangle = contRect;
							adjustDummySize();
						} else {
							potentialOtherCellExpandNotification();
						}
						dummy.style.display = 'block';

						element.addClass(_containterOverStyle);
					}

					function potentialOtherCellExpandNotification() {
						$timeout(function () {
							//TODO: better solution fo resize notifications for other cells
							$rootScope.$broadcast('draggableComponentRefresh');
						});
					}

					function createDropMoveData(pos) {
						moveToPosition = {};
						if (pos < cardRectArray.length) {
							moveToPosition.before = pos;
						} else {
							moveToPosition.after = cardRectArray.length - 1;
						}
					}

					function checkToRepositionDummy(pos) {
						if (pos < cardRectArray.length) {
							element[0].insertBefore(dummy, cardRectArray[pos].card);
						} else {
							element[0].appendChild(dummy);
						}
					}

				}
			};
		});

		angular.module('platform-board').factory('dragContainerDomUtils', /*@ngInject*/ function ($document, $timeout) {
			var ctx;

			function getfixedRectHeight(elem, noPadding, checkChildren) {
				var elemRect = getfixedRectHeightInner(elem, noPadding);

				//$window.console.log('childElem', elem, elemRect);
				if (!checkChildren) {
					return elemRect;
				}
				var r = elem;
				var loopCounter = 0;
				while (r.firstElementChild) {
					r = r.firstElementChild;
					var r1 = getfixedRectHeightInner(r, noPadding);

					//$window.console.log('childElem', r, r1, loopCounter);
					if (r1.height > elemRect.height) {
						//if the child element is taller then the origin
						if (r1.marginTop === 0 && r1.marginBottom === 0 && r.firstElementChild) {
							return getfixedRectHeightInner(r.firstElementChild, noPadding);
						}
						return r1;
					} else if (r1.height < elemRect.height) {
						return elemRect;
					}
					loopCounter++;
					if (loopCounter > 5) {
						throw new Error('Loop too deep!');
					}
				}
			}

			function getfixedRectHeightInner(elem, noPadding) {
				var boundingRect = elem.getBoundingClientRect();
				var rect = {
					top: boundingRect.top,
					height: boundingRect.height,
					left: boundingRect.left,
					width: boundingRect.width,
					marginTop: 0,
					marginBottom: 0,
					marginLeft: 0,
					marginRight: 0
				};
				if (!noPadding) {
					var computedStyle = window.getComputedStyle(elem);
					rect.marginTop = parseInt(computedStyle.marginTop, 10);
					rect.marginLeft = parseInt(computedStyle.marginLeft, 10);
					rect.marginBottom = parseInt(computedStyle.marginBottom, 10);
					rect.marginRight = parseInt(computedStyle.marginRight, 10);
					rect.orginalTop = rect.top = rect.top - rect.marginTop;
					rect.orginalLeft = rect.left = rect.left - rect.marginLeft;
					rect.height = rect.height + rect.marginBottom + rect.marginTop;
					rect.width = rect.width + rect.marginRight + rect.marginLeft;
				}

				return rect;
			}

			function initDebug() {
				if (!ctx) {
					var c = $document[0].createElement('CANVAS');
					c.setAttribute('width', '2000');
					c.setAttribute('height', '1000');
					c.setAttribute('style', 'position:absolute;top:-3px;left:450px;border:3px solid #c3c3c3;z-index:10;pointer-events:none;opacity:.5');
					(angular.element('body')[0]).appendChild(c);
					ctx = c.getContext('2d');
					(angular.element('body')[0]).style.overflow = 'hidden';
				}
			}

			function drawCanvasVisualisation(x, y, limitsRectangle, cardsArray, dm, isInsideContainer) {
				if (!ctx || !isInsideContainer) {
					return;
				}
				ctx.fillStyle = '#fff';
				ctx.fillRect(0, 0, 2000, 1000);
				ctx.fillStyle = isInsideContainer ? '#ccc' : '#eee';
				ctx.fillRect(limitsRectangle.left, limitsRectangle.top, limitsRectangle.width, limitsRectangle.height);

				//draw cards
				var d = 1;
				for (var i = 0; i < cardsArray.length; i++) {
					var r = cardsArray[i];
					if (!r.color) {
						r.color = 'rgba(' + (d > 0 ? '0, 255' : ' 255, 0') + ', 0, ' + (r.disabled ? '.2' : '.9') + ')';
					}
					d *= -1;
					ctx.fillStyle = r.color;
					ctx.fillRect(r.left, r.topStart, r.width, r.topEnd - r.topStart);
				}

				//draw dummy
				if (dm) {
					ctx.fillStyle = 'rgba(0,0,0,.5)';
					ctx.fillRect(dm.left, dm.topStart, dm.width, dm.topEnd - dm.topStart);
				}

				//draw cursor
				ctx.fillStyle = '#FF0000';
				ctx.fillRect(x, y + 2, 1, 10);
				ctx.fillRect(x, y - 11, 1, 10);
				ctx.fillRect(x + 2, y, 10, 1);
				ctx.fillRect(x - 11, y, 10, 1);
			}

			function debounce(func, wait, immediate) {
				var timeout;
				return function () {
					var context = this,
						args = arguments;
					var later = function () {
						timeout = null;
						if (!immediate) {
							func.apply(context, args);
						}
					};
					var callNow = immediate && !timeout;
					clearTimeout(timeout);
					timeout = $timeout(later, wait);
					if (callNow) {
						func.apply(context, args);
					}
				};
			}

			return {
				getfixedRectHeight: getfixedRectHeight,
				initDebug: initDebug,
				drawCanvasVisualisation: drawCanvasVisualisation,
				debounce: debounce
			};
		});

		angular.module('platform-board').factory('dragContainerCalculationUtils', /*@ngInject*/ function ($window) {
			function repositionItemsBasedOnHoverPosition(cardArray, markPosition, dummyRect) {
				//adjust proxy rectangles positions
				var toStart = markPosition - 1;
				var toEnd = markPosition;
				if (markPosition > -1 && markPosition < cardArray.length) {
					dummyRect.top = cardArray[markPosition].orginalTop;
				} else if (markPosition >= cardArray.length) {
					dummyRect.top = 0;
					if (cardArray.length > 0) {
						dummyRect.top = cardArray[cardArray.length - 1].orginalTop + cardArray[cardArray.length - 1].height;
					}
				}
				while (toStart >= 0) {
					cardArray[toStart].top = cardArray[toStart].orginalTop;
					toStart--;
				}
				while (toEnd < cardArray.length) {
					cardArray[toEnd].top = cardArray[toEnd].orginalTop + dummyRect.height;
					toEnd++;
				}
			}

			function findBestPosition(cardArray, hoverPosition, previouslyMarkedPosition) {
				var foundPosition = -1;
				var toStart = hoverPosition;
				var toEnd = hoverPosition + 1;
				while (toStart >= 0) {
					if (!cardArray[toStart].disabled) {
						toStart++;
						break;
					}
					toStart--;
				}
				if (foundPosition >= 0) {
					return foundPosition;
				}
				while (toEnd < cardArray.length) {
					if (!cardArray[toEnd].disabled) {
						break;
					}
					toEnd++;
				}
				if (previouslyMarkedPosition !== -1 && previouslyMarkedPosition === toStart) {
					return toStart;
				}
				if (previouslyMarkedPosition !== -1 && previouslyMarkedPosition === toEnd) {
					return toEnd;
				}
				if (toStart >= 0) {
					return toStart;
				}
				if (toEnd < cardArray.length) {
					return toEnd;
				}
				return foundPosition;
			}

			function isInsideCurrentElementLimits(pageX, pageY, currentContainer, parentContainerRect) {
				//TODO: if not provided parent element, check against page borders
				if (parentContainerRect && parentContainerRect.height > 0 && parentContainerRect.width > 0) {
					return pageY > Math.max(currentContainer.top, parentContainerRect.top) &&
						pageY < Math.min(currentContainer.top + currentContainer.height, parentContainerRect.top + parentContainerRect.height) &&
						pageX > Math.max(currentContainer.left, parentContainerRect.left) &&
						pageX < Math.min(currentContainer.left + currentContainer.width, parentContainerRect.left + parentContainerRect.width);
				}
				return pageY > currentContainer.top && pageY < currentContainer.top + currentContainer.height &&
					pageX > currentContainer.left && pageX < currentContainer.left + currentContainer.width;
			}

			function compareRectangles(c1, c2) {
				if (!c1 || !c2) {
					return false;
				}
				return c1.top === c2.top && c1.left === c2.left && c1.width === c2.width && c1.height === c2.height;
			}

			function isElementAndSiblingDisabled(cardArray, index, isUpperHalfCheck) {
				if (isUpperHalfCheck) {
					return (cardArray[index].disabled && index > 0 && cardArray[index - 1].disabled) || (index === 0 && cardArray[index].disabled);
				}
				return (cardArray[index].disabled && index < cardArray.length - 1 && cardArray[index + 1].disabled) || (cardArray[index].disabled && index === cardArray.length - 1);
			}

			function isInsideCurrentCardUpperLimits(pageY, card) {
				var hgt = card.topEnd - card.topStart;
				return pageY >= card.topStart && pageY < card.topStart + hgt / 2;
			}

			function isInsideCurrentCardLowerLimits(pageY, card) {
				var hgt = card.topEnd - card.topStart;
				return pageY >= card.topStart + hgt / 2 && pageY < card.topStart + hgt;
			}

			function isInsideDummyLimits(pageY, dm) {
				return pageY >= dm.topStart && pageY < dm.topEnd;
			}

			function isInsideCurrentElementUpperLimits(pageY, cards, dm) {
				//0 length case
				if (cards.length === 0) {
					return true;
				} else if (dm.topStart < 0) {
					return pageY < cards[0].topStart;
				}

				//$window.console.log(pageY, dm.topStart, cards[0].topStart);
				return pageY < Math.min(cards[0].topStart, dm.topStart);
			}

			function isInsideCurrentElementLowerLimits(pageY, cards, dummyRectTopEnd) {
				return pageY > Math.max(cards[cards.length - 1].topEnd, dummyRectTopEnd);
			}

			function printArrayUtil(cardRectArray, dummyRect) {
				var arr = [];
				for (var i = 0; i < cardRectArray.length; i++) {
					arr.push({
						i: i,
						t: cardRectArray[i].top,
						h: cardRectArray[i].height,
						o: cardRectArray[i].orginalTop,
						d: cardRectArray[i].disabled
					});
				}
				arr.push(dummyRect);
				//$window.console.log(JSON.stringify(arr));
			}

			return {
				repositionItemsBasedOnHoverPosition: repositionItemsBasedOnHoverPosition,
				findBestPosition: findBestPosition,
				isInsideCurrentElementLimits: isInsideCurrentElementLimits,
				compareRectangles: compareRectangles,
				isElementAndSiblingDisabled: isElementAndSiblingDisabled,
				isInsideCurrentCardUpperLimits: isInsideCurrentCardUpperLimits,
				isInsideCurrentCardLowerLimits: isInsideCurrentCardLowerLimits,
				isInsideDummyLimits: isInsideDummyLimits,
				isInsideCurrentElementUpperLimits: isInsideCurrentElementUpperLimits,
				isInsideCurrentElementLowerLimits: isInsideCurrentElementLowerLimits,
				printArrayUtil: printArrayUtil
			};
		});
	})();
	/* jshint ignore:end */
	/*eslint-enable */

	// jscs:enable


/***/ },
/* 10 */
/***/ function(module, exports) {

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

		module.factory('boardDragService', /*@ngInject*/  function($rootScope, $document, $timeout, $window) {
			var startX, startY, wid, selectedElements, dragedElemContainer, dragedElemData, dataElem, initialElement, maxLimitOfCards, columnHolder,
				columnHolderRect, moveEvent = null, globalID, scrollX = 0, scrollY = 0, SCROLL_PADDING = 50, dragEnabled = true,
				dragItems = {},
				dragIndicatorLimit = 10,
				inDrag = false;

			function cardDragStarted(e, data) {
				if (dragEnabled && !inDrag) {
					dragedElemData = data.data;
					dataElem = angular.element(data.element);
					startX = (data.event.clientX - data.element.getBoundingClientRect().left) + parseInt((dataElem).css('marginLeft'), 10);
					startY = (data.event.clientY - data.element.getBoundingClientRect().top) + parseInt((dataElem).css('marginTop'), 10);
					initialElement = data.element;
					wid = dataElem.outerWidth(true);
					$document.bind('mouseup', mouseup);
					$document.bind('mousemove', mousemove);
					$document.bind('contextmenu', contextmenu);
					initDrag(data.event);

					inDrag = true;
				}
			}

			// todo - please review this, can this be done without involving the scope?
			var dragEventCancel = $rootScope.$on('cardDragStarted', cardDragStarted);

			function mouseup(e) {
				$document.unbind('mouseup', mouseup);
				$document.unbind('mousemove', mousemove);
				$document.unbind('contextmenu', contextmenu);
				cancelScrollAnimation();
				angular.forEach(selectedElements, function(elem) {
					elem.classList.remove('dragged-card-indicator');
				});
				if (dragedElemContainer && dragedElemContainer.parentNode) {
					dragedElemContainer.parentNode.removeChild(dragedElemContainer);
				}
				dragedElemData.originalEvent = e;
				$rootScope.$broadcast('cardDragEnded', dragedElemData);
				dragItems = {};
				$rootScope.$digest();

				inDrag = false;
			}

			function contextmenu(e) {
				e.preventDefault();
				mouseup(e);
			}

			function mousemove(e) {
				e.preventDefault();
				updatePosition(e);
				$rootScope.$broadcast('cardDragProcess', {event: e});
				$rootScope.$digest();
			}

			function initDragSingleElement(originalElement) {
				var draggedElement = originalElement.cloneNode(true);
				draggedElement.removeAttribute('ng-repeat');
				draggedElement.removeAttribute('ng-include');
				draggedElement.classList.add('story-board');
				draggedElement.classList.add('feature-board');
				draggedElement.setAttribute('style', 'padding:0;margin:0;position:static;height:auto;width:auto;background:none');
				return draggedElement;
			}

			function initDrag(event) {
				selectedElements = [];
				dragedElemData.items = [];
				angular.forEach(dragItems, function(value) {
					selectedElements.push.apply(selectedElements, value.elements);
					dragedElemData.items.push.apply(dragedElemData.items, value.array);
				});

				var dragedElem = null;

				//TODO: no need to create each time
				// todo-lilo: leaking dom elements?
				dragedElemContainer = $document[0].createElement('DIV');
				var len = selectedElements.length;
				if (len === 0) {
					return;
				}
				var initialElemPos = selectedElements.indexOf(initialElement);
				selectedElements.splice(initialElemPos, 1);
				selectedElements.push(initialElement);
				if (len > maxLimitOfCards) {
					selectedElements.splice(0, selectedElements.length - maxLimitOfCards);
					dragedElemData.items.splice(0, dragedElemData.items.length - maxLimitOfCards);
					len = selectedElements.length;
				}
				if (len === 1) {
					dragedElem = initDragSingleElement(selectedElements[0]);
					dragedElemContainer.style.width = wid + 'px';
					dragedElemContainer.appendChild(dragedElem);
				} else {
					if (selectedElements.length > dragIndicatorLimit) {
						selectedElements.splice(0, selectedElements.length - dragIndicatorLimit);
						len = dragIndicatorLimit;
					}
					angular.forEach(selectedElements, function(dragedElem, key) {
						// todo-lilo: leaking dom elements?
						var dragedElemInnerContainer = $document[0].createElement('DIV');
						var rect = dragedElem.getBoundingClientRect();
						var cloneNode = dragedElem.cloneNode(true);
						dragedElemInnerContainer.appendChild(cloneNode);
						dragedElemContainer.appendChild(dragedElemInnerContainer);
						cloneNode.removeAttribute('ng-repeat');
						cloneNode.removeAttribute('ng-include');

						dragedElemInnerContainer.setAttribute('style', 'padding:0;margin:0;height:auto;background:none');
						dragedElemInnerContainer.style.width = wid + 'px';
						dragedElemInnerContainer.style.top = (rect.top + startY - event.pageY) + 'px';
						dragedElemInnerContainer.style.left = (rect.left + startX - event.pageX) + 'px';
						dragedElemInnerContainer.style.position = 'absolute';
						dragedElemInnerContainer.setAttribute('class', 'dragged-item story-board feature-board');
						$timeout((function(pos) {
							return function() {
								dragedElemInnerContainer.style.top = (len - pos - 1) * 4 + 'px';
								dragedElemInnerContainer.style.left = (len - pos - 1) * 4 + 'px';
								dragedElemInnerContainer.style.opacity = 0.8 * (pos + 1) / (len);
							};
						})(key), 10);
					});
					var counter = $document[0].createElement('SPAN');
					counter.appendChild($document[0].createTextNode(dragedElemData.items.length));
					counter.setAttribute('class', 'dragged-item-counter');
					$timeout(function() {
						counter.style.opacity = 1;
					});
					dragedElemContainer.appendChild(counter);
				}
				angular.forEach(selectedElements, function(elem) {
					elem.classList.add('dragged-card-indicator');
				});
				var fullScreenPanel = $document[0].getElementById('full-screen-panel');
				if (!fullScreenPanel) {
					fullScreenPanel = angular.element('body')[0];
				}
				fullScreenPanel.appendChild(dragedElemContainer);
				dragedElemContainer.setAttribute('class', 'dragged-container enable-stylebox enable-bootstrap');
				updatePosition(event);
			}

			function updatePosition(e) {
				var left = e.pageX - startX;
				var top = e.pageY - startY;
				dragedElemContainer.style.left = left + 'px';
				dragedElemContainer.style.top = top + 'px';
				scrollContainer(e);
			}

			function scrollContainer(e) {
				moveEvent = e;
				if (columnHolderRect) {
					scrollX = 0;
					scrollY = 0;
					if (e.pageX < columnHolderRect.left + SCROLL_PADDING) {
						scrollX = -1;
					} else if (e.pageY < columnHolderRect.top + SCROLL_PADDING) {
						scrollY = -1;
					} else if (e.pageY > columnHolderRect.height + columnHolderRect.top - SCROLL_PADDING) {
						scrollY = 1;
					} else if (e.pageX > columnHolderRect.width + columnHolderRect.left - SCROLL_PADDING) {
						scrollX = 1;
					} else {
						cancelScrollAnimation();
					}
					if (Math.abs(scrollX) > 0 || Math.abs(scrollY) > 0) {
						globalID = $window.requestAnimationFrame(repeatScrollAnimation);
					}
				}
			}

			function cancelScrollAnimation() {
				scrollX = 0;
				scrollY = 0;
				$window.cancelAnimationFrame(globalID);
			}

			function repeatScrollAnimation() {
				if (scrollX === 0 && scrollY === 0) {
					return;
				}
				var oldPosX = columnHolder[0].scrollLeft;
				var oldPosY = columnHolder[0].scrollTop;
				columnHolder[0].scrollLeft += scrollX;
				columnHolder[0].scrollTop += scrollY;
				if (oldPosX !== columnHolder[0].scrollLeft || oldPosY !== columnHolder[0].scrollTop) {
					$rootScope.$broadcast('cardDragProcess', {event: moveEvent});
					globalID = $window.requestAnimationFrame(repeatScrollAnimation);
				}
			}

			function pushCardArrayService(elementList, maxLimitOfCards) {
				if (maxLimitOfCards === 1) {
					dragItems = {};
				}
				dragItems[JSON.stringify(elementList.filter)] = {array: elementList.array, elements: elementList.elements};
			}

			function setMaxLimitOfCards(cardLimit) {
				maxLimitOfCards = cardLimit;
			}

			function enable(enabled) {
				dragEnabled = enabled;
			}

			// todo - please review this, can this be done without involving the scope?
			var autoFitEventCancel = $rootScope.$on('autofitChangeEvent', function() {
				if (columnHolder) {
					columnHolderRect = columnHolder[0].getBoundingClientRect();
				}
			});

			$rootScope.$on('$destroy', function() {
				dragEventCancel();
				autoFitEventCancel();
			});

			return {
				pushCardArray: pushCardArrayService,
				setMaxLimitOfCards: setMaxLimitOfCards,
				enable: enable
			};
		});
	})();

	/* jshint ignore:end */


/***/ },
/* 11 */
/***/ function(module, exports) {

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

		var boardModule = angular.module('platform-board');

		boardModule.filter('boardFilter', function() {
			return function(data, column, row) {
				var filterData = _.filter(data, function(item) {
					var itemColumnId = getIdFromItem(item, column.axis.field);
					var itemRowId = getIdFromItem(item, row.axis.field);

					if (inColumn(itemColumnId, column) && inRow(itemRowId, row)) {
						return item;
					}
				});

				return filterData;
			};

			function getIdFromItem(item, prop) {
				if (_.isObject(item[prop])) {
					return item[prop].id;
				}

				return item[prop];
			}

			function inColumn(itemColumnId, column) {
				return itemColumnId === column.value;
			}

			function inRow(itemRowId, row) {
				// If row.value === -1 -> empty row -> no swimlanes in board
				return itemRowId === row.value || row.value === '-1';
			}
		});
	})();


/***/ }
/******/ ]);