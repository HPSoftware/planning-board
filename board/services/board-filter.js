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
