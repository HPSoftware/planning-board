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
				initDrag(data);

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
			dragedElemData.originalEvent = e;
			$rootScope.$broadcast('cardDragProcess', {event: e, dragElement: dragedElemData});
			$rootScope.$digest();
		}

		function initDragSingleElement(originalElement, boardZoomLevel) {
			var draggedElement = originalElement.cloneNode(true);
			draggedElement.removeAttribute('ng-repeat');
			draggedElement.removeAttribute('ng-include');
			draggedElement.setAttribute('style', 'padding:0;margin:0;position:static;height:auto;width:auto;background:none');
			if (boardZoomLevel) {
				draggedElement.classList.add(boardZoomLevel);
			}
			return draggedElement;
		}

		function initDrag(data) {
			var event = data.event;
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
				dragedElem = initDragSingleElement(selectedElements[0], data.data.boardZoomLevel);
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
