(function () {
	'use strict';

	var module = angular.module('planningBoardDemo');
	module.directive('demoCard', function () {
		return {
			restrict: 'E',
			scope: {
				cardEntity: '=cardData',
				getCardOrder: '&'
			},
			templateUrl: 'directives/demo-card/demo-card.html',
			link: function (scope) {

				function init() {

					var id = scope.cardEntity.id;
					var name = scope.cardEntity.name;
					var status = scope.cardEntity.status;

				}

				init();
			}
		};
	});
})();
