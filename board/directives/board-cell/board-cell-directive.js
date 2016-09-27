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
	module.directive('boardCell', /*@ngInject*/ function($rootScope, boardDragService, $compile, $q) {
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
				var cardDirective, isDragInsideCell = false;
				if (!angular.isDefined(cardDirectiveName) || cardDirectiveName === '') {
					cardDirectiveName = 'defaultCard';
				}

				if (scope.compileDirectives[cardDirectiveName] === undefined) {
					if (cardDirectiveName === 'defaultCard') {
						cardDirective = '<div data-aid="default-card" class="item-card"   ng-class="{\'selected\': checkedCards.indexOf($index) != -1 }">' +
							'<svg class="svg-fold" width="16px" height="16px" viewBox="0 0 16 16"><polygon class="us" points="0,0 16,16 0,16" />' +
							'</svg>	<div><div>{{card.id}}</div><div>{{card.name}} </div></div>';
					} else {
						cardDirective = '<' + cardDirectiveName + ' card-data="card" class="board-card" board-card-id="" get-card-order="getCardOrder(card)"></' + cardDirectiveName + '>';
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
				var genBoardElement = element.closest('.gen-board');
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

				scope.getCardOrder = function(card) {
					return scope.getCardOrderInLane(card, scope.row);
				};

				scope.$on('board-refresh-cards', function() {
					if (!isDragInsideCell) {
						scope.items = scope.getCellData(scope.column, scope.row);
					}
				});

				scope.$on('cardDragStarted', function() {
					var dummyElem = element.find('.drag-dummy-inside');
					var genBoardElem = angular.element('.gen-board');
					if (dummyElem.length > 0) {
						genBoardElem.removeClass('drag-error');
						var template = scope.getDummyTemplate();
						dummyElem[0].outerHTML = template;
					}
				});

				scope.$on('cardDragEnded', function() {
					scope.checkedCards = [];
					scope.getSelectedCards();
				});

				scope.$on('cardDragProcess', function(event, data) {
					if (element[0].contains(data.event.target)) {
						var delta = scope.getCellFilter();
						scope.setDragOverCell(delta);
					}
				});

				function isCellVisible() {
					var cellVisible = element.is(':visible');
					return cellVisible;
				}

				/**
				 * sets the card move position when it is moved whithin a cell
				 * @param data holds the card data
				 * @param movePosition holds the position to move in case of reorder. will be empty in case we are moving cells
				 * @returns {boolean} whether or not the card was moved. true if moved, false if stayed in the same place
				 */
				function setCardMovePosition(data, movePosition) {
					var cardToMoveNextTo;
					var otherCardToMoveNextTo;
					var position;
					var isMovingToDifferentLocation = false;
					if ('after' in data.movePosition && data.movePosition.after >= 0) {
						cardToMoveNextTo = scope.cardGetter(data.movePosition.after);
						position = 'after';
						if (cardToMoveNextTo && data.movePosition.after < scope.items.length) {
							otherCardToMoveNextTo = scope.cardGetter(data.movePosition.after + 1);
						}
					} else if ('before' in data.movePosition) {
						cardToMoveNextTo = scope.cardGetter(data.movePosition.before);
						position = 'before';
						if (data.movePosition.before > 0) {
							otherCardToMoveNextTo = scope.cardGetter(data.movePosition.before - 1);
						}
					} else {
						isMovingToDifferentLocation = true;
					}
					//check that the item was not dropped to the same location
					if (cardToMoveNextTo && cardToMoveNextTo.id !== data.data.items[0].id &&
						(!otherCardToMoveNextTo || otherCardToMoveNextTo.id !== data.data.items[0].id)) {
						movePosition.idToMove = cardToMoveNextTo.id;
						movePosition.position = position;
						isMovingToDifferentLocation = true;
					}
					return isMovingToDifferentLocation;
				}

				function moveCardToNewPosition(data) {
					var indexToRemove = _.findIndex(scope.items, function(cellItem) {
						return cellItem.id === data.data.items[0].id;
					});
					if (indexToRemove > -1) {
						scope.items.splice(indexToRemove, 1);
					}
					var indexToInsert;
					if (data.movePosition.before >= 0) {
						indexToInsert = data.movePosition.before - (indexToRemove > data.movePosition.before ? 0 : 1);
						indexToInsert = indexToInsert >= 0 ? indexToInsert : 0;
					} else if (data.movePosition.after >= 0) {
						indexToInsert = data.movePosition.after + 1;
						indexToInsert = indexToInsert < scope.items.length ? indexToInsert : scope.items.length;
					}
					scope.items.splice(indexToInsert, 0, data.data.items[0]);
				}

				scope.$on('cardDrop', function(e, data) {
					if (data && isCellVisible()) {
						// if there is any reason that the board will try to drag null item
						// it occurs because drag drop defect that in rare case allowing dragging null item
						// causing the user to see only the drop area without the card.
						// until we will find the root cause -> this will prevent exception.
						if (!data.data.items[0]) {
							return;
						}

						var movePosition = {};

						if (data.data.columnId === (scope.subcolumn || scope.column).value && data.data.rowId === scope.row.value) {
							var delta = scope.getCellFilter();
							var isCardPositionChanged = setCardMovePosition(data, movePosition);
							if (isCardPositionChanged) {

								$q.when(scope.canMove({
									items: data.data.items,
									delta: delta,
									movePosition: movePosition
								})).then(function (result) {

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

									// dragged to same cell
									if (!_.isEmpty(data.movePosition)) {
										isDragInsideCell = true;
										moveCardToNewPosition(data);
									}

									// Client refresh
									scope.api.refresh();

									// External logic
									if (scope.itemMoved) {
										return scope.itemMoved({item: data.data.items[0], movePosition: movePosition});
									}
								}).finally(function() {
									isDragInsideCell = false;
								});
							}
						}
					}
				});
			}
		};
	});
})();
