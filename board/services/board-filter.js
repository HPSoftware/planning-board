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
